import { Global, Module } from '@nestjs/common';
import { DatabaseProviderService } from './database-provider.service';

@Global()
@Module({
  imports: [],
  providers: [DatabaseProviderService],
  exports: [DatabaseProviderService],
})
export class DatabaseModule {}
