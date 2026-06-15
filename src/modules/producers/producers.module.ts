import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infra/database/database.module';
import { MoviesModule } from '../movies/movies.module';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';

@Module({
  imports: [DatabaseModule, MoviesModule],
  controllers: [ProducersController],
  providers: [ProducersService],
  exports: [ProducersService],
})
export class ProducersModule {}
