import { CustomLogger } from '@common/loggers/custom.logger';
import { Injectable } from '@nestjs/common';
import { Producer } from '../../infra/database/entities/producers.entity';
import { ProducersRepository } from '../../infra/database/repositories/producers/producers.repository';
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
    private readonly producersRepository: ProducersRepository,
    private readonly moviesService: MoviesService,
    private readonly logger: CustomLogger,
  ) {}

  async findOrCreateByNames(names: string[]): Promise<Producer[]> {
    return this.producersRepository.findOrCreateByNames(names);
  }

  async getAwardsInterval(): Promise<ProducerAwardsIntervalResponse> {
    const winningMovies =
      await this.moviesService.findWinningMoviesWithProducers();

    const lastWinByProducer = new Map<string, number>();
    let minInterval = Number.POSITIVE_INFINITY;
    let maxInterval = Number.NEGATIVE_INFINITY;
    let min: ProducerAwardInterval[] = [];
    let max: ProducerAwardInterval[] = [];

    for (const movie of winningMovies) {
      for (const producer of movie.producers) {
        const producerName = producer.name;
        const year = movie.year;
        const previousWin = lastWinByProducer.get(producerName);

        if (previousWin !== undefined) {
          const intervalItem: ProducerAwardInterval = {
            producer: producerName,
            interval: year - previousWin,
            previousWin,
            followingWin: year,
          };

          if (intervalItem.interval < minInterval) {
            minInterval = intervalItem.interval;
            min = [intervalItem];
          } else if (intervalItem.interval === minInterval) {
            min.push(intervalItem);
          }

          if (intervalItem.interval > maxInterval) {
            maxInterval = intervalItem.interval;
            max = [intervalItem];
          } else if (intervalItem.interval === maxInterval) {
            max.push(intervalItem);
          }
        }

        lastWinByProducer.set(producerName, year);
      }
    }

    if (minInterval === Number.POSITIVE_INFINITY) {
      return { min: [], max: [] };
    }

    this.logger.debug(
      `Intervals calculated. min=${minInterval}, max=${maxInterval}`,
    );

    return {
      min,
      max,
    };
  }
}
