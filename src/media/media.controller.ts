import {
  Body,
  Controller,
  HttpException,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post/post.service';
import { multerMediaOptions } from 'src/common/utils/multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserAuth } from 'src/model/user.model';
import { PostCreateDto } from './post/dto/post-create';
import { WebResponse } from 'src/model/web.model';
import { validateTags } from 'src/common/utils/validator';

@Controller('media')
export class MediaController {
  constructor(private postService: PostService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', undefined, multerMediaOptions))
  async create(
    @Auth() user: UserAuth,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() postData: PostCreateDto,
    @Query('type') type: string,
  ): Promise<WebResponse<object>> {
    if (files.length < 1) {
      throw new HttpException('Media required', 400);
    }
    validateTags(postData.tags);
    try {
      if (type == 'posts') {
        const post: PostCreateDto = {
          description: postData.description,
          location: postData.location,
          tags: postData.tags,
          images: files,
        };
        await this.postService.create(user, post);
        return {
          success: true,
          data: {},
          message: 'Succes create media',
        };
      } else {
        throw new HttpException('method not implementation', 404);
      }
    } catch (error) {
      throw error;
    }
  }
}
