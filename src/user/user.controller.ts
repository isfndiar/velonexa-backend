import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto, UserLoginDto } from './dto/user';
import { WebResponse } from 'src/model/web.model';
import { UserLoginResponse } from './dto/user-login';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AuthSkip } from 'src/common/decorator/metadata';
import { UserCurrentResponse, UserRequest } from './dto/user-current';

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
    @Auth() user: UserRequest,
  ): Promise<WebResponse<UserCurrentResponse>> {
    const data = await this.userService.getCurrentUser(user.username);
    return {
      success: true,
      data: data,
      message: 'succes get current user',
    };
  }
}
