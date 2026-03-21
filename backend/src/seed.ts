import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/user.entity.js';
import { Setting } from './settings/setting.entity.js';
import { PricePeriod } from './price-periods/price-period.entity.js';
import 'dotenv/config';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'bike_rental',
  entities: [User, Setting, PricePeriod],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);
  const existing = await userRepo.findOne({ where: { username: 'admin' } });

  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    await userRepo.save({ username: 'admin', password: hashed });
    console.log('Admin user created (admin / admin123)');
  } else {
    console.log('Admin user already exists');
  }

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
