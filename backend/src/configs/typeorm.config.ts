import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

dotenv.config();

const stringToBoolean = (value: string): boolean => {
  return value.toLowerCase() === 'true';
};

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: stringToBoolean(process.env.DB_SYNCHRONIZE),
};
