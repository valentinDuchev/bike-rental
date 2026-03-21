import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PricePeriodsService } from './price-periods.service.js';
import { CreatePricePeriodDto } from './dto/create-price-period.dto.js';
import { UpdatePricePeriodDto } from './dto/update-price-period.dto.js';
import { CalculatePriceDto } from './dto/calculate-price.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('price-periods')
export class PricePeriodsController {
  constructor(private pricePeriodsService: PricePeriodsService) {}

  @Post('calculate')
  calculate(@Body() dto: CalculatePriceDto) {
    return this.pricePeriodsService.calculatePrice(dto.start_date, dto.end_date);
  }

  @Get()
  findAll() {
    return this.pricePeriodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pricePeriodsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePricePeriodDto) {
    return this.pricePeriodsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePricePeriodDto,
  ) {
    return this.pricePeriodsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pricePeriodsService.remove(id);
  }
}
