import { IsDateString } from 'class-validator';

export class CalculatePriceDto {
  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;
}
