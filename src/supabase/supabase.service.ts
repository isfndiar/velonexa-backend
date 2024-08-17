import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  private readonly supabaseUrl: string;
  private readonly supabaseKey: string;

  constructor(private configService: ConfigService) {
    this.supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    this.supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  async uploudProfile(
    filename: string,
    fileBuffer: Buffer,
    contentType: string,
  ) {
    const { data, error } = await this.supabase.storage
      .from('Velonexa')
      .upload(`profiles/${filename}`, fileBuffer, {
        contentType,
      });

    if (error) {
      throw new HttpException('upload failed', 400);
    }
    return data;
  }

  async deleteProfile(fileName: string) {
    const { error } = await this.supabase.storage
      .from('Velonexa')
      .remove([`profiles/${fileName}`]);

    if (error) {
      throw new HttpException('delete failed', 400);
    }
    return true;
  }

  async uploudMedia(filename: string, fileBuffer: Buffer, contentType: string) {
    const { data, error } = await this.supabase.storage
      .from('Velonexa')
      .upload(`media-posts/${filename}`, fileBuffer, {
        contentType,
      });

    if (error) {
      throw new HttpException('upload failed', 400);
    }
    return data;
  }

  async deleteMedia(fileName: string) {
    const { error } = await this.supabase.storage
      .from('Velonexa')
      .remove([`media-posts/${fileName}`]);

    if (error) {
      throw new HttpException('delete failed', 400);
    }
    return true;
  }
}
