import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Hello } from './hello/entity/Hello';

import { User } from './user/entity/User';

//dotenv.config();
// Pour peter
dotenv.config({ path: __dirname+'/.env' });

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock', //for MAC with MAMP
  logging: true,
  entities: [Hello, User],
  synchronize: true,
});
