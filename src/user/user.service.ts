import { HttpException, Inject, Injectable } from '@nestjs/common';
import { DATABASE_CLIENT } from 'src/database/database';
import { UserRepository } from './user.repository';
import { UserCreateEntity, UserUpdateEntity } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseClientPostgre } from 'src/database/postgre/postgre.service';
import { UserCreateDto, UserLoginDto } from './dto/user';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserCurrentResponse } from './dto/user-current';
import { UserUpdateDto } from './dto/user-update';
import { extname } from 'path';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UserAuth } from 'src/model/user.model';
import { UserDetailResponse, UserDetailbyUsernameResponse } from './dto/user-detail';

@Injectable()
export class UserService {
  private bycryptSalt: number;
  constructor(
    @Inject(DATABASE_CLIENT) private dbClient: DatabaseClientPostgre,
    private userRepository: UserRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
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
        this.userRepository.getCountByUsername(client, user.username),
        this.userRepository.getCountByEmail(client, user.email),
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

      await this.userRepository.create(client, userEntity);
      await this.dbClient.commitTransaction(client);
    } catch (error) {
      await this.dbClient.rollbackTransaction(client);
      throw error;
    }
  }

  async loginUser(user: UserLoginDto) {
    const client = await this.dbClient.startTransaction();

    try {
      const userCurrent = await this.userRepository.getByUsername(
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
        id: userCurrent.id,
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
      const user = await this.userRepository.getCurrentByUsername(
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

  async updateCurrent(
    userAuth: UserAuth,
    userData: UserUpdateDto,
    file?: Express.Multer.File,
  ) {
    const client = await this.dbClient.startTransaction();

    try {
      const user = await this.userRepository.getCurrentByUsername(
        client,
        userAuth.username,
      );
      let image: string = '';
      if (file) {
        const uniqFileName = `${uuidv4()}${extname(file.originalname)}`;
        if (!user.profileImage) {
          const data = await this.supabaseService.uploudProfile(
            uniqFileName,
            file.buffer,
            file.mimetype,
          );
          image = `https://zsacttrcsuuowlofqbnp.supabase.co/storage/v1/object/public/${data.fullPath}`;
        }
        if (user.profileImage) {
          const path = user.profileImage.split('/');
          const fileName = path[path.length - 1];
          await this.supabaseService.deleteProfile(fileName);

          const data = await this.supabaseService.uploudProfile(
            uniqFileName,
            file.buffer,
            file.mimetype,
          );
          image = `https://zsacttrcsuuowlofqbnp.supabase.co/storage/v1/object/public/${data.fullPath}`;
        }
      }

      const data: UserUpdateEntity = {
        id: user.id,
      };
      if (userData.bio) {
        data.bio = userData.bio;
      }
      if (userData.email) {
        data.email = userData.email;
      }
      if (userData.gender) {
        data.gender = userData.gender;
      }
      if (userData.password) {
        data.password = userData.password;
      }
      if (userData.name) {
        data.name = userData.name;
      }
      if (userData.username) {
        data.username = userData.username;
      }
      if (userData.phoneNumber) {
        data.phoneNumber = userData.phoneNumber;
      }
      if (image) {
        data.profileImage = image;
      }

      await this.userRepository.updateById(client, data);
      await this.dbClient.commitTransaction(client);
    } catch (error) {
      await this.dbClient.rollbackTransaction(client);
      throw error;
    }
    
  }
  async getDetailUser(username: string): Promise<UserDetailResponse> {
    const client = await this.dbClient.startTransaction();
    try {
      const user = await this.userRepository.getDetailUser(
        client,
        username,
      );

      await this.dbClient.commitTransaction(client);
      return {
        username: user.username,
        name: user.name ?? '',
        profileImage: user.profileImage ?? '',
        verify: user.verify,
        bio: user.bio ?? '',
        email: user.email ?? '',
        gender: user.gender ?? '',
      };
    } catch (error) {
      await this.dbClient.rollbackTransaction(client);
      throw error;
    }
  }

  async getDetailbyUsername(username: string, userQuery: string): Promise<UserDetailbyUsernameResponse> {
    const client = await this.dbClient.startTransaction();
    try {
      const user = await this.userRepository.getDetailbyUsername(client, userQuery);
  
      await this.dbClient.commitTransaction(client);
      return { 
        username: user.username,
        name: user.name ?? '',
        isVerify: user.verify,
        isFollow: userQuery === user.username ? 'true' : 'false',
        profileImage:  user.profileImage ?? '',
        countPost : user.countPost ?? 0,
        countFollowers: user.countFollowers ?? 0,
        countFollowing:  user.countFollowing ?? 0,
        bio:  user.bio ?? '',
      };
    } catch (error) {
      await this.dbClient.rollbackTransaction(client);
      throw error;
    }
  }
  
}
