import {
  BadRequestException,
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  DataSource,
  DataSourceOptions,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { CustomLogger } from '../../common/loggers/custom.logger';
import { Movie } from './entities/movies.entity';
import { Producer } from './entities/producer.entity';

@Injectable()
export class DatabaseProviderService implements OnModuleDestroy {
  private dataSource: DataSource | null = null;

  constructor(private readonly logger: CustomLogger) {
    this.logger.setContext('DatabaseProviderService');
  }

  private async createDataSource(): Promise<DataSource | null> {
    const entities = [Movie, Producer];

    const config: DataSourceOptions = {
      type: 'better-sqlite3',
      database: ':memory:',
      logging: false,
      synchronize: true,
      entities,
    };

    const dataSource = new DataSource(config);

    try {
      this.logger.debug('Inicializando conexão com o banco de dados...');
      await dataSource.initialize();
      this.logger.debug(
        'Conexão com o banco de dados inicializada com sucesso.',
      );
      return dataSource;
    } catch {
      this.logger.error('Falha ao inicializar a conexão com o banco de dados.');
      return null;
    }
  }

  async getDataSource(): Promise<DataSource> {
    if (!this.dataSource) {
      this.dataSource = await this.createDataSource();
    }

    if (!this.dataSource) {
      throw new BadRequestException('Banco de dados ainda indisponivel.');
    }

    return this.dataSource;
  }

  async getRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
  ): Promise<Repository<T>> {
    const ds = await this.getDataSource();
    return ds.getRepository(entity);
  }

  async onModuleDestroy() {
    if (this.dataSource) {
      this.logger.log('Encerrando conexão com o banco de dados...');
      await this.dataSource.destroy();
      this.logger.log('Conexão com o banco de dados encerrada.');
    }
  }
}
