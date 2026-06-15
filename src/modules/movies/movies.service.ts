import { Injectable } from '@nestjs/common';
import { Movie } from '../../infra/database/entities/movies.entity';
import { Producer } from '../../infra/database/entities/producer.entity';
import { MoviesRepository } from '../../infra/database/repositories/movies/movies.respository';

export type CreateMovieInput = {
  year: number;
  title: string;
  studios: string;
  winner: boolean;
  producers: Producer[];
};

@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async count(): Promise<number> {
    return this.moviesRepository.count();
  }

  async createMovie(input: CreateMovieInput): Promise<Movie> {
    return this.moviesRepository.createMovie({
      year: input.year,
      title: input.title,
      studios: input.studios,
      winner: input.winner,
      producers: input.producers,
    });
  }

  async findWinningMoviesWithProducers(): Promise<Movie[]> {
    return this.moviesRepository.findWinningMoviesWithProducers();
  }
}
