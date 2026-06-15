import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Producer } from './producers.entity';

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

  @ManyToMany(() => Producer, (producers) => producers.movies, {
    cascade: false,
  })
  @JoinTable({ name: 'movie_producers' })
  producers: Producer[];
}
