import { Injectable } from '@nestjs/common';
import { DatabaseProviderService } from '../../database-provider.service';
import { Producer } from '../../entities/producers.entity';
import { IProducerRepository } from './producers.contract';

@Injectable()
export class ProducersRepository implements IProducerRepository {
  constructor(private readonly dataSource: DatabaseProviderService) {}

  async findOrCreateByNames(names: string[]): Promise<Producer[]> {
    const repository = await this.dataSource.getRepository(Producer);

    const uniqueNames = [
      ...new Set(names.map((name) => name.trim()).filter(Boolean)),
    ];

    if (uniqueNames.length === 0) {
      return [];
    }

    const existingProducers = await repository.find({
      where: uniqueNames.map((name) => ({ name })),
    });

    const existingMap = new Map(
      existingProducers.map((producer) => [producer.name, producer]),
    );

    const toCreate = uniqueNames
      .filter((name) => !existingMap.has(name))
      .map((name) => repository.create({ name }));

    const created =
      toCreate.length > 0
        ? await repository.save(toCreate)
        : ([] as Producer[]);

    return [...existingProducers, ...created];
  }
}
