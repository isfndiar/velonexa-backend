import { Module } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  providers: [PostRepository, PostService],
  exports: [PostRepository, PostService],
})
export class PostModule {}
