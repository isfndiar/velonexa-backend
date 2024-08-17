import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { PostModule } from './post/post.module';

@Module({
  controllers: [MediaController],
  imports: [PostModule],
})
export class MediaModule {}
