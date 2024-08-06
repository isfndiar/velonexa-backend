import { HttpException, Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import {
  UserCreateEntity,
  UserEntity,
  UserUpdateEntity,
} from './entities/user.entity';
import { columnMapUpdate, mapUserToModel } from 'src/common/utils/transform';

@Injectable()
export class UserRepository {
  constructor() {}

  async create(client: PoolClient, user: UserCreateEntity): Promise<void> {
    const query = {
      text: `INSERT INTO users(id, username, email, password) VALUES ($1, $2, $3, $4)`,
      values: [user.id, user.username, user.email, user.password],
    };

    await client.query(query);
  }

  async getCountByUsername(
    client: PoolClient,
    username: string,
  ): Promise<number> {
    const query = {
      text: `SELECT username FROM users WHERE username = $1`,
      values: [username],
    };

    const result = await client.query(query);
    return result.rowCount;
  }

  async getByUsername(
    client: PoolClient,
    username: string,
  ): Promise<UserEntity> {
    const query = {
      text: `SELECT id, username, password FROM users WHERE username = $1`,
      values: [username],
    };

    const result = await client.query(query);

    if (!result.rowCount) {
      throw new HttpException('Password or Username is wrong', 404);
    }

    return new UserEntity(result.rows[0]);
  }

  async getCountByEmail(client: PoolClient, email: string) {
    const query = {
      text: `SELECT email FROM users WHERE email = $1`,
      values: [email],
    };

    const result = await client.query(query);
    return result.rowCount;
  }

  async getCurrentByUsername(client: PoolClient, username: string) {
    const query = {
      text: `SELECT id, username, name, verify, profile_image FROM users WHERE username = $1`,
      values: [username],
    };

    const result = await client.query(query);

    if (!result.rowCount) {
      throw new HttpException('user not found', 404);
    }
    const user = mapUserToModel(result.rows[0]);

    return new UserEntity(user);
  }

  async updateById(client: PoolClient, users: UserUpdateEntity) {
    const { id, ...data } = users;
    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [key, value] of Object.entries(data)) {
      const column = columnMapUpdate[key] || key;
      setClauses.push(`${column} = $${i}`);
      values.push(value);
      i++;
    }
    if (setClauses.length == 0) {
      throw new HttpException('No fields to update', 400);
    }
    values.push(id);
    const query = {
      text: `UPDATE USERS SET ${setClauses.join(', ')} WHERE id = $${i}`,
      values: values,
    };

    await client.query(query);
  }
  async getDetailUser(client: PoolClient, username: string) {
    const query = {
      text: `SELECT id, username, name, verify, profile_image, bio, email, gender FROM users WHERE username = $1`,
      values: [username],
    };

    const result = await client.query(query);

    if (!result.rowCount) {
      throw new HttpException('user not found', 404);
    }
    const user = mapUserToModel(result.rows[0]);

    return new UserEntity(user);
  }

  async getDetailbyUsername(client: PoolClient, username: string): Promise<UserEntity> {
    const query = {
      text: `SELECT * FROM users WHERE username = $1`,
      values: [username],
    };
  
    const result = await client.query(query);
  
    if (!result.rowCount) {
      throw new HttpException('user not found', 404);
    }
    const user = mapUserToModel(result.rows[0]);
  
    return new UserEntity(user);
  }
  
}
