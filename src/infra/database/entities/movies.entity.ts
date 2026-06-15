import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Producer } from './producer.entity';

@Entity({ name: 'movies' })
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  studios: string;

  @Column({ type: 'boolean', default: false })
  winner: boolean;

  @ManyToMany(() => Producer, (producer) => producer.movies, {
    cascade: false,
  })
  @JoinTable({ name: 'movie_producers' })
  producers: Producer[];
}
