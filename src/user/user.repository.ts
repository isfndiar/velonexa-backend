import { HttpException, Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { UserCreateEntity, UserEntity } from './entities/user.entity';
import { mapUserToModel } from 'src/common/utils/transform';

@Injectable()
export class UserRepository {
  constructor() {}

  async createUser(client: PoolClient, user: UserCreateEntity): Promise<void> {
    const query = {
      text: `INSERT INTO users(id, username, email, password) VALUES ($1, $2, $3, $4)`,
      values: [user.id, user.username, user.email, user.password],
    };

    await client.query(query);
  }

  async getCountUserByUsername(
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

  async getUserByUsername(
    client: PoolClient,
    username: string,
  ): Promise<UserEntity> {
    const query = {
      text: `SELECT username, password FROM users WHERE username = $1`,
      values: [username],
    };

    const result = await client.query(query);

    if (!result.rowCount) {
      throw new HttpException('Password or Username is wrong', 404);
    }

    return new UserEntity(result.rows[0]);
  }

  async getCountUserByEmail(client: PoolClient, email: string) {
    const query = {
      text: `SELECT email FROM users WHERE email = $1`,
      values: [email],
    };

    const result = await client.query(query);
    return result.rowCount;
  }

  async getCurrentUserByUsername(client: PoolClient, username: string) {
    const query = {
      text: `SELECT username, name, verify, profile_image FROM users WHERE username = $1`,
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
