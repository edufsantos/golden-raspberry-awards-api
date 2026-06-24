import { Producer } from '../../entities/producers.entity';

export abstract class IProducerRepository {
  abstract findOrCreateByNames(names: string[]): Promise<Producer[]>;
}
