import { Module } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [PostRepository, PostService],
  exports: [PostRepository, PostService],
  imports: [SupabaseModule, DatabaseModule, UserModule],
})
export class PostModule {}
