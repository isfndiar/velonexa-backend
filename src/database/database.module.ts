import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDatabaseClient } from './database.service';
import { DATABASE_CLIENT } from './database';

@Module({
  providers: [
    {
      provide: DATABASE_CLIENT,
      useFactory: createDatabaseClient,
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CLIENT],
})
export class DatabaseModule {}
