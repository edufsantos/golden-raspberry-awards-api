import { env_configuration } from '@common/config/env';

import { CommonModule } from '@common/common.module';
import { RepositoryModule } from '@infra/database/repositories/repositories.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/database/database.module';
import { DataLoaderModule } from './modules/movies-data-loader/data-loader.module';
import { MoviesModule } from './modules/movies/movies.module';
import { ProducersModule } from './modules/producers/producers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [env_configuration] }),
    DatabaseModule,
    MoviesModule,
    ProducersModule,
    DataLoaderModule,
    RepositoryModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  exports: [RepositoryModule, CommonModule],
})
export class AppModule {}
