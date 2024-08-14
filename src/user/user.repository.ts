import { HttpException, Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import {
  UserCreateEntity,
  UserEntity,
  UserFollowsEntity,
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
      return undefined;
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

  async isFollow(
    client: PoolClient,
    follows: UserFollowsEntity,
  ): Promise<boolean> {
    const query = {
      text: `SELECT follower_id, following_id FROM follows WHERE follower_id = $1 AND following_id = $2`,
      values: [follows.followerId, follows.followingId],
    };
    const result = await client.query(query);
    if (result.rowCount) {
      return true;
    }
    return false;
  }

  async follow(client: PoolClient, follows: UserFollowsEntity) {
    const query = {
      text: `INSERT INTO follows (follower_id, following_id) VALUES ( $1, $2) ON CONFLICT DO NOTHING`,
      values: [follows.followerId, follows.followingId],
    };

    await client.query(query);
  }
  async unFollow(client: PoolClient, follows: UserFollowsEntity) {
    const query = {
      text: `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
      values: [follows.followerId, follows.followingId],
    };

    await client.query(query);
  }

  async getFollowingByUsername(
    client: PoolClient,
    username: string,
  ): Promise<UserEntity[]> {
    const query = {
      text: `SELECT u.username, u.profile_image, u.name 
             FROM follows f 
             JOIN users u ON f.following_id = u.id
             JOIN users followers ON f.follower_id = followers.id
             WHERE followers.username = $1`,
      values: [username],
    };
    const result = await client.query(query);

    return result.rows.map((user) => mapUserToModel(user));
  }

  async getFollowerByUsername(
    client: PoolClient,
    username: string,
  ): Promise<UserEntity[]> {
    const query = {
      text: `SELECT u.username, u.profile_image, u.name 
             FROM follows f 
             JOIN users u ON f.follower_id = u.id
             JOIN users following ON f.following_id = following.id
             where following.username = $1`,
      values: [username],
    };

    const result = await client.query(query);

    return result.rows.map((user) => mapUserToModel(user));
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

  async getDetailbyUsername(
    client: PoolClient,
    username: string,
  ): Promise<UserEntity> {
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
