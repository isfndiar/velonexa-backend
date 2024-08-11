import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto, UserLoginDto } from './dto/user';
import { WebResponse } from 'src/model/web.model';
import { UserLoginResponse } from './dto/user-login';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AuthSkip } from 'src/common/decorator/metadata';
import { UserCurrentResponse } from './dto/user-current';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerProfileOptions } from 'src/common/utils/multer';
import { UserUpdateDto } from './dto/user-update';
import { UserAuth } from 'src/model/user.model';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @AuthSkip()
  get(): string {
    return 'hallo';
  }

  @Post('/register')
  @AuthSkip()
  async register(@Body() user: UserCreateDto): Promise<WebResponse<object>> {
    try {
      await this.userService.createUser(user);
      return {
        success: true,
        message: 'Register success',
        data: {},
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/login')
  @AuthSkip()
  async login(
    @Body() userLogin: UserLoginDto,
  ): Promise<WebResponse<UserLoginResponse>> {
    try {
      const data = await this.userService.loginUser(userLogin);
      return {
        success: true,
        data,
        message: 'Login success',
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/me')
  async userCurrent(
    @Auth() user: UserAuth,
  ): Promise<WebResponse<UserCurrentResponse>> {
    const data = await this.userService.getCurrentUser(user.username);
    return {
      success: true,
      data: data,
      message: 'succes get current user',
    };
  }

  @Patch('/me/settings')
  @UseInterceptors(FileInterceptor('profileImage', multerProfileOptions))
  async updateProfile(
    @Auth() user: UserAuth,
    @UploadedFile() file: Express.Multer.File,
    @Body() userData: UserUpdateDto,
  ): Promise<WebResponse<object>> {
    try {
      await this.userService.updateCurrent(user, userData, file);
      return {
        success: true,
        message: 'Update success',
        data: {},
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/:username/follows')
  async follows(
    @Auth() user: UserAuth,
    @Param('username') username: string,
  ): Promise<WebResponse<object>> {
    try {
      const message = await this.userService.followsByUsername(user, username);
      return {
        success: true,
        data: {},
        message: message,
      };
    } catch (error) {
      throw error;
    }
  }
}
