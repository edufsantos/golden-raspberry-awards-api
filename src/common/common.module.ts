import { Module } from '@nestjs/common';
import { LoggerModule } from './loggers/custom-logger.module';

@Module({
  imports: [LoggerModule],
  providers: [],
  exports: [LoggerModule],
})
export class CommonModule {}
