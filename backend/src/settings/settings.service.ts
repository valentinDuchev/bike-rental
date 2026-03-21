import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity.js';

const DEFAULT_PRICE_KEY = 'default_price_per_day';
const DEFAULT_PRICE_VALUE = '5';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(Setting)
    private settingsRepo: Repository<Setting>,
  ) {}

  async onModuleInit() {
    const existing = await this.settingsRepo.findOne({
      where: { key: DEFAULT_PRICE_KEY },
    });
    if (!existing) {
      await this.settingsRepo.save({
        key: DEFAULT_PRICE_KEY,
        value: DEFAULT_PRICE_VALUE,
      });
    }
  }

  async getDefaultPrice(): Promise<number> {
    const setting = await this.settingsRepo.findOne({
      where: { key: DEFAULT_PRICE_KEY },
    });
    return setting ? parseFloat(setting.value) : parseFloat(DEFAULT_PRICE_VALUE);
  }

  async setDefaultPrice(price: number): Promise<void> {
    await this.settingsRepo.upsert(
      { key: DEFAULT_PRICE_KEY, value: String(price) },
      ['key'],
    );
  }
}
