import { CustomLogger } from '@common/loggers/custom.logger';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import csv from 'csv-parser';
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { MoviesService } from '../movies/movies.service';
import { ProducersService } from '../producers/producers.service';

type CsvMovieRow = {
  year: string;
  title: string;
  studios: string;
  producers: string;
  winner: string;
};

@Injectable()
export class DataLoaderService implements OnApplicationBootstrap {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly producersService: ProducersService,
    private readonly logger: CustomLogger,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.debug(
      'Iniciando processo de carregamento dos dados dos filmes a partir do CSV.',
      DataLoaderService.name,
    );
    const loadedMovies = await this.moviesService.count();

    if (loadedMovies > 0) {
      return;
    }

    const csvPath = this.resolveCsvPath();
    const rows = await this.readCsv(csvPath);

    for (const row of rows) {
      const producers = this.parseProducers(row.producers);
      const producerEntities =
        await this.producersService.findOrCreateByNames(producers);

      await this.moviesService.createMovie({
        year: Number(row.year),
        title: row.title,
        studios: row.studios,
        winner: this.isWinner(row.winner),
        producers: producerEntities,
      });
    }

    this.logger.debug(
      `Processo de carregamento dos dados dos filmes concluído. Total de filmes carregados: ${rows.length}.`,
      DataLoaderService.name,
    );
  }

  private resolveCsvPath(): string {
    // Lista de caminhos possiveis do arquivo CSV, considerando diferentes ambientes de execução, ex: local, cloud, docker
    const candidates = [
      path.resolve(process.cwd(), 'src/shared/assets/Movielist.csv'),
      path.resolve(process.cwd(), 'shared/assets/Movielist.csv'),
      path.resolve(process.cwd(), 'Movielist.csv'),
      path.resolve(process.cwd(), 'dist/shared/assets/Movielist.csv'),
    ];

    const existingPath = candidates.find((candidate) => existsSync(candidate));

    if (!existingPath) {
      this.logger.error(
        'Arquivo Movielist.csv não encontrado em nenhum dos caminhos esperados.',
        DataLoaderService.name,
      );
      throw new Error('Arquivo Movielist.csv não encontrado.');
    }
    this.logger.debug(
      `Arquivo CSV encontrado no caminho: ${existingPath}`,
      DataLoaderService.name,
    );
    return existingPath;
  }

  private readCsv(filePath: string): Promise<CsvMovieRow[]> {
    this.logger.debug(
      `Iniciando leitura do arquivo CSV: ${filePath}`,
      DataLoaderService.name,
    );
    return new Promise((resolve, reject) => {
      const rows: CsvMovieRow[] = [];

      createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row: CsvMovieRow) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', (error: unknown) => {
          if (error instanceof Error) {
            reject(error);
            return;
          }

          reject(new Error('Erro ao processar CSV.'));
        });
    });
  }

  private parseProducers(producers: string): string[] {
    return producers
      .split(/,|\sand\s/gi)
      .map((producer) => producer.trim())
      .filter(Boolean);
  }

  private isWinner(value?: string | null): boolean {
    return (value ?? '').trim().toLowerCase() === 'yes';
  }
}
