import { Injectable } from '@nestjs/common';
import { DatabaseProviderService } from '../../database-provider.service';
import { Movie } from '../../entities/movies.entity';
import { CreateMovieData, IMovieRepository } from './movies.contract';

@Injectable()
export class MoviesRepository implements IMovieRepository {
  constructor(private readonly dataSource: DatabaseProviderService) {}

  async count(): Promise<number> {
    const repository = await this.dataSource.getRepository(Movie);
    return repository.count();
  }

  async createMovie(data: CreateMovieData): Promise<Movie> {
    const repository = await this.dataSource.getRepository(Movie);

    const movie = repository.create({
      year: data.year,
      title: data.title,
      studios: data.studios,
      winner: data.winner,
      producers: data.producers,
    });

    return repository.save(movie);
  }

  async findWinningMoviesWithProducers(): Promise<Movie[]> {
    const repository = await this.dataSource.getRepository(Movie);

    return repository.find({
      where: { winner: true },
      relations: { producers: true },
      order: { year: 'ASC', id: 'ASC' },
    });
  }
}
