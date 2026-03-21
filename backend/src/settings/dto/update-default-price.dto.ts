import { IsNumber, Min } from 'class-validator';

export class UpdateDefaultPriceDto {
  @IsNumber()
  @Min(0)
  price: number;
}
