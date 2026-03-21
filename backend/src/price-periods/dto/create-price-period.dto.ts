import { IsNumber, IsDateString, Min } from 'class-validator';

export class CreatePricePeriodDto {
  @IsNumber()
  @Min(0)
  price_per_day: number;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;
}
