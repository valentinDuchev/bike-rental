import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('price_periods')
export class PricePeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price_per_day: number;

  @Column('date')
  start_date: string;

  @Column('date')
  end_date: string;

  @CreateDateColumn()
  created_at: Date;
}
