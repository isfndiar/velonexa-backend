import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient } from 'pg';
import { DatabaseClient } from '../database';

@Injectable()
export class DatabaseClientPostgre
  extends DatabaseClient<Pool>
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;
  private maxPool: number;
  private minPool: number;
  constructor(private configService: ConfigService) {
    super();
  }

  private async initializedPool() {
    const tempPool = new Pool({
      host: this.configService.get('DB_HOST'),
      port: parseInt(this.configService.get('DB_PORT')),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      user: this.configService.get('DB_USER'),
    });

    try {
      const client = await tempPool.connect();
      const result = await client.query(
        `SELECT setting FROM pg_settings WHERE name = 'max_connections'`,
      );
      client.release();
      const maxConnections = Math.floor(result.rows[0].setting);

      this.maxPool = Math.floor(maxConnections - 0.2 * maxConnections);
      this.minPool = Math.floor(0.2 * this.maxPool);

      this.pool = new Pool({
        host: this.configService.get('DB_HOST'),
        port: parseInt(this.configService.get('DB_PORT')),
        password: this.configService.get('DB_PASSWORD'),
        database: this.configService.get('DB_NAME'),
        user: this.configService.get('DB_USER'),
        max: this.maxPool,
        min: this.minPool,
        connectionTimeoutMillis: 5000,
      });

      console.log(
        `Max pool size set to: ${this.maxPool}, Min pool size set to: ${this.minPool}`,
      );
    } catch (error) {
      console.warn(`Failed to initialize pool: ${error}`);
      throw error;
    } finally {
      await tempPool.end();
    }
  }

  getPool(): Pool {
    return this.pool;
  }

  async startTransaction(): Promise<PoolClient> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
    } catch (error) {
      client.release();
      throw error;
    }
    return client;
  }

  async commitTransaction(client: PoolClient) {
    try {
      await client.query('COMMIT');
    } finally {
      client.release();
    }
  }

  async rollbackTransaction(client: PoolClient) {
    try {
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  }

  async onModuleInit() {
    try {
      await this.initializedPool();
      await this.pool.connect();
      console.log('Connected to the PostgreSQL database');
    } catch (error) {
      console.warn(`database error: ${error}`);
      throw error;
    }
  }

  onModuleDestroy() {
    try {
      this.pool.end();
      console.log('database disconnect');
    } catch (error) {
      console.log(`Error disconnect: ${error}`);
    }
  }
}
