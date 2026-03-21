import { IsNumber, IsDateString, Min, IsOptional } from 'class-validator';

export class UpdatePricePeriodDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  price_per_day?: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}
