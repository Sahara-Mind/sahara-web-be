import { join } from 'path';
import { registerAs } from '@nestjs/config';

export const DatabaseConfig = registerAs('database', () => {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    migrationsRun: process.env.DATABASE_MIGRATIONS_RUN,
    entities: [join(__dirname, '../**', '*.Entity.{ts,js}')],
    migrationsTableName: 'migrations',
    synchronize: process.env.DATABASE_SYNC,
  };
});
