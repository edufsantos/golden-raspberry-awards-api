import { Movie } from '../../entities/movies.entity';
import { Producer } from '../../entities/producers.entity';

export type FindMoviesQuery = {
  title?: string;
  skip?: number;
  take?: number;
};

export type CreateMovieData = {
  year: number;
  title: string;
  studios: string;
  winner: boolean;
  producers: Producer[];
};

export abstract class IMovieRepository {
  abstract count(): Promise<number>;

  abstract createMovie(data: CreateMovieData): Promise<Movie>;

  abstract findWinningMoviesWithProducers(): Promise<Movie[]>;
}
