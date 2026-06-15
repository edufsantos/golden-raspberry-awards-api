import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Module({
  imports: [],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
