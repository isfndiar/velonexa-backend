import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  providers: [UserService, UserRepository],
  imports: [DatabaseModule, SupabaseModule],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}
