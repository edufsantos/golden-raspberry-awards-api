import { CustomLogger } from '@common/loggers/custom.logger';
import { Injectable } from '@nestjs/common';
import { DatabaseProviderService } from '../../infra/database/database-provider.service';
import { Producer } from '../../infra/database/entities/producers.entity';
import { MoviesService } from '../movies/movies.service';

export type ProducerAwardInterval = {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
};

export type ProducerAwardsIntervalResponse = {
  min: ProducerAwardInterval[];
  max: ProducerAwardInterval[];
};

@Injectable()
export class ProducersService {
  constructor(
    private readonly databaseProvider: DatabaseProviderService,
    private readonly moviesService: MoviesService,
    private readonly logger: CustomLogger,
  ) {}

  async findOrCreateByNames(names: string[]): Promise<Producer[]> {
    const repository = await this.databaseProvider.getRepository(Producer);

    const uniqueNames = [
      ...new Set(names.map((name) => name.trim()).filter(Boolean)),
    ];

    if (uniqueNames.length === 0) {
      return [];
    }

    const existingProducers = await repository.find({
      where: uniqueNames.map((name) => ({ name })),
    });

    const existingMap = new Map(
      existingProducers.map((producer) => [producer.name, producer]),
    );

    const toCreate = uniqueNames
      .filter((name) => !existingMap.has(name))
      .map((name) => repository.create({ name }));

    const created =
      toCreate.length > 0
        ? await repository.save(toCreate)
        : ([] as Producer[]);

    return [...existingProducers, ...created];
  }

  async getAwardsInterval(): Promise<ProducerAwardsIntervalResponse> {
    // Busca a lista dos filmes vencedores
    const winerMovies =
      await this.moviesService.findWinningMoviesWithProducers();

    const producerWins = new Map<string, number[]>();

    // Para cada filme que ganhou, intera os nomes dos produtores e armazena o ano de cada vitoria
    for (const movie of winerMovies) {
      for (const producer of movie.producers) {
        const wins = producerWins.get(producer.name) ?? [];
        wins.push(movie.year);
        producerWins.set(producer.name, wins);
      }
    }

    this.logger.debug(
      `Producer wins: ${JSON.stringify(Array.from(producerWins.entries()))}`,
    );

    const intervals: ProducerAwardInterval[] = [];

    for (const [producer, years] of producerWins.entries()) {
      if (years.length < 2) {
        continue;
      }

      years.sort((a, b) => a - b);

      for (let index = 1; index < years.length; index += 1) {
        const previousWin = years[index - 1];
        const followingWin = years[index];

        intervals.push({
          producer,
          interval: followingWin - previousWin,
          previousWin,
          followingWin,
        });
      }
    }

    if (intervals.length === 0) {
      return { min: [], max: [] };
    }

    const minInterval = Math.min(...intervals.map((item) => item.interval));
    const maxInterval = Math.max(...intervals.map((item) => item.interval));

    return {
      min: intervals.filter((item) => item.interval === minInterval),
      max: intervals.filter((item) => item.interval === maxInterval),
    };
  }
}
