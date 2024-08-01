import { HttpException, Inject, Injectable } from '@nestjs/common';
import { DATABASE_CLIENT } from 'src/database/database';
import { UserRepository } from './user.repository';
import { UserCreateEntity } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseClientPostgre } from 'src/database/postgre/postgre.service';
import { UserCreateDto, UserLoginDto } from './dto/user';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserCurrentResponse } from './dto/user-current';

@Injectable()
export class UserService {
  private bycryptSalt: number;
  constructor(
    @Inject(DATABASE_CLIENT) private dbClient: DatabaseClientPostgre,
    private userRepository: UserRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.bycryptSalt = parseInt(this.configService.get('BCRYPT_SALT'));
  }

  async createUser(user: UserCreateDto) {
    if (user.password !== user.confirmPassword) {
      throw new HttpException('password and confirm password not same', 400);
    }
    const client = await this.dbClient.startTransaction();

    try {
      const [countUsername, countEmail] = await Promise.all([
        this.userRepository.getCountUserByUsername(client, user.username),
        this.userRepository.getCountUserByEmail(client, user.email),
      ]);

      if (countUsername) {
        throw new HttpException('username already exists', 409);
      }

      if (countEmail) {
        throw new HttpException('email already exists', 409);
      }

      const id: string = uuidv4();

      const hashPassword = await bcrypt.hash(user.password, this.bycryptSalt);
      const userEntity = new UserCreateEntity(
        id,
        user.username,
        user.email,
        hashPassword,
      );

      await this.userRepository.createUser(client, userEntity);
      await this.dbClient.commitTransaction(client);
    } catch (error) {
      await this.dbClient.rollbackTransaction(client);
      throw error;
    }
  }

  async loginUser(user: UserLoginDto) {
    const client = await this.dbClient.startTransaction();

    try {
      const userCurrent = await this.userRepository.getUserByUsername(
        client,
        user.username,
      );

      const passwordConfirm = await bcrypt.compare(
        user.password,
        userCurrent.password,
      );

      if (!passwordConfirm) {
        throw new HttpException('Password or Username is wrong', 404);
      }

      const payload = {
        username: userCurrent.username,
      };

      const token = await this.jwtService.signAsync(payload);

      await this.dbClient.commitTransaction(client);
      return {
        username: userCurrent.username,
        accessToken: token,
      };
    } catch (error) {
      await this.dbClient.rollbackTransaction(client);
      throw error;
    }
  }

  async getCurrentUser(username: string): Promise<UserCurrentResponse> {
    const client = await this.dbClient.startTransaction();
    try {
      const user = await this.userRepository.getCurrentUserByUsername(
        client,
        username,
      );

      await this.dbClient.commitTransaction(client);
      return {
        username: user.username,
        name: user.name ?? '',
        profileImage: user.profileImage ?? '',
        verify: user.verify,
      };
    } catch (error) {
      await this.dbClient.rollbackTransaction(client);
      throw error;
    }
  }
}
