import { ConfigService } from '@nestjs/config';
import { DatabaseClientPostgre } from './postgre/postgre.service';
import { DatabaseClient } from './database';

export function createDatabaseClient(
  configService: ConfigService,
): DatabaseClient<any> {
  if (configService.get('DATABASE') == 'postgre') {
    return new DatabaseClientPostgre(configService);
  }
  return new DatabaseClient<any>();
}
