import { Global, Module } from '@nestjs/common';
import { MoviesRepository } from './movies/movies.respository';

@Global()
@Module({
  providers: [MoviesRepository],
  exports: [MoviesRepository],
})
export class RepositoryModule {}
