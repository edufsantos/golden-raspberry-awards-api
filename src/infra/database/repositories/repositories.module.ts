import { Global, Module } from '@nestjs/common';
import { MoviesRepository } from './movies/movies.respository';
import { ProducersRepository } from './producers/producers.repository';

@Global()
@Module({
  providers: [MoviesRepository, ProducersRepository],
  exports: [MoviesRepository, ProducersRepository],
})
export class RepositoryModule {}
