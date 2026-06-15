import { Module } from '@nestjs/common';
import { MoviesModule } from '../movies/movies.module';
import { ProducersModule } from '../producers/producers.module';
import { DataLoaderService } from './data-loader.service';

@Module({
  imports: [MoviesModule, ProducersModule],
  providers: [DataLoaderService],
})
export class DataLoaderModule {}
