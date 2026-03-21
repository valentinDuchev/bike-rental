import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PricePeriod } from './price-period.entity.js';
import { SettingsService } from '../settings/settings.service.js';
import { CreatePricePeriodDto } from './dto/create-price-period.dto.js';
import { UpdatePricePeriodDto } from './dto/update-price-period.dto.js';

@Injectable()
export class PricePeriodsService {
  constructor(
    @InjectRepository(PricePeriod)
    private periodsRepo: Repository<PricePeriod>,
    private settingsService: SettingsService,
  ) {}

  async findAll(): Promise<PricePeriod[]> {
    return this.periodsRepo.find({ order: { created_at: 'ASC' } });
  }

  async findOne(id: number): Promise<PricePeriod> {
    const period = await this.periodsRepo.findOne({ where: { id } });
    if (!period) {
      throw new NotFoundException(`Price period #${id} not found`);
    }
    return period;
  }

  async create(dto: CreatePricePeriodDto): Promise<PricePeriod> {
    if (dto.start_date > dto.end_date) {
      throw new BadRequestException('start_date must be before or equal to end_date');
    }
    const period = this.periodsRepo.create(dto);
    return this.periodsRepo.save(period);
  }

  async update(id: number, dto: UpdatePricePeriodDto): Promise<PricePeriod> {
    const period = await this.findOne(id);
    Object.assign(period, dto);

    if (period.start_date > period.end_date) {
      throw new BadRequestException('start_date must be before or equal to end_date');
    }

    return this.periodsRepo.save(period);
  }

  async remove(id: number): Promise<void> {
    const period = await this.findOne(id);
    await this.periodsRepo.remove(period);
  }

  async calculatePrice(startDate: string, endDate: string) {
    if (startDate > endDate) {
      throw new BadRequestException('start_date must be before or equal to end_date');
    }

    const defaultPrice = await this.settingsService.getDefaultPrice();
    const allPeriods = await this.periodsRepo.find({ order: { created_at: 'ASC' } });

    const breakdown: { date: string; price: number }[] = [];
    let totalPrice = 0;

    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      let priceForDay = defaultPrice;

      for (const period of allPeriods) {
        if (dateStr >= period.start_date && dateStr <= period.end_date) {
          priceForDay = Number(period.price_per_day);
        }
      }

      breakdown.push({ date: dateStr, price: priceForDay });
      totalPrice += priceForDay;
      current.setDate(current.getDate() + 1);
    }

    return {
      rental_days: breakdown.length,
      total_price: totalPrice,
      breakdown,
    };
  }
}
