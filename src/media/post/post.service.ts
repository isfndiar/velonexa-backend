import { HttpException, Inject, Injectable } from '@nestjs/common';
import { DATABASE_CLIENT } from 'src/database/database';
import { DatabaseClientPostgre } from 'src/database/postgre/postgre.service';
import { UserAuth } from 'src/model/user.model';
import { PostCreateDto } from './dto/post-create';
import { UserRepository } from 'src/user/user.repository';
import { SupabaseService } from 'src/supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { PostRepository } from './post.repository';
import { PostCreateEntity } from './entities/post-create';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostService {
  private readonly baseImageUrl: string;
  constructor(
    @Inject(DATABASE_CLIENT) private dbClient: DatabaseClientPostgre,
    private configService: ConfigService,
    private userRepository: UserRepository,
    private supabaseService: SupabaseService,
    private postRepository: PostRepository,
  ) {
    this.baseImageUrl = this.configService.get('BASE_IMAGE_URL');
  }

  async create(user: UserAuth, post: PostCreateDto) {
    const client = await this.dbClient.startTransaction();
    const users: string[] = [];
    const mediaUrl = [];
    try {
      if (post.tags && post.tags.length > 0) {
        for (const username of post.tags) {
          const result = await this.userRepository.getByUsername(
            client,
            username,
          );
          if (!result) {
            throw new HttpException('User to be tagged not found', 404);
          }
          users.push(result.id);
        }
      }

      for (const image of post.images) {
        const fileName = `${uuidv4()}${extname(image.originalname)}`;
        let typeImage: string;
        if (image.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          typeImage = 'image';
        } else if (image.mimetype.match(/\/(mp4)$/)) {
          typeImage = 'video';
        }
        const imageUrl = await this.supabaseService.uploudMedia(
          fileName,
          image.buffer,
          image.mimetype,
        );
        mediaUrl.push({
          url: `${this.baseImageUrl}${imageUrl.fullPath}`,
          type: typeImage,
        });
      }

      const id = uuidv4();
      const data: PostCreateEntity = {
        id,
        userId: user.id,
        description: post.description,
        location: post.location,
        images: mediaUrl,
        tags: users,
      };

      await this.postRepository.Create(client, data);
      await this.dbClient.commitTransaction(client);
    } catch (error) {
      await this.dbClient.rollbackTransaction(client);
      if (mediaUrl) {
        for (const image of mediaUrl) {
          const path = image.url.split('/');
          const fileName = path[path.length - 1];
          await this.supabaseService.deleteMedia(fileName);
        }
      }
      throw error;
    }
  }
}
