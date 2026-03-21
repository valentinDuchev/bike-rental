import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { UpdateDefaultPriceDto } from './dto/update-default-price.dto.js';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('default-price')
  async getDefaultPrice() {
    const price = await this.settingsService.getDefaultPrice();
    return { default_price_per_day: price };
  }

  @UseGuards(JwtAuthGuard)
  @Put('default-price')
  async updateDefaultPrice(@Body() dto: UpdateDefaultPriceDto) {
    await this.settingsService.setDefaultPrice(dto.price);
    return { default_price_per_day: dto.price };
  }
}
