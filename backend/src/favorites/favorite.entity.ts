import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('favorites')
@Unique(['userId', 'businessId'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  businessId: number;

  @CreateDateColumn()
  createdAt: Date;
}
