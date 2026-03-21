import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricePeriod } from './price-period.entity.js';
import { PricePeriodsService } from './price-periods.service.js';
import { PricePeriodsController } from './price-periods.controller.js';
import { SettingsModule } from '../settings/settings.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([PricePeriod]), SettingsModule],
  controllers: [PricePeriodsController],
  providers: [PricePeriodsService],
})
export class PricePeriodsModule {}
