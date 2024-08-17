import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { PostCreateEntity } from './entities/post-create';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostRepository {
  constructor() {}

  async Create(client: PoolClient, post: PostCreateEntity) {
    const queryPost = {
      text: `INSERT INTO posts (id, user_id, description, location) VALUES ($1, $2, $3, $4)`,
      values: [post.id, post.userId, post.description, post.location],
    };
    await client.query(queryPost);

    const valueMedia = [];
    const placeHolders = post.images
      .map((image, index) => {
        const idMediaPost = uuidv4();
        const i = index * 4;
        valueMedia.push(idMediaPost, post.id, image.url, image.type);
        return `($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4})`;
      })
      .join(', ');

    const queryMedia = {
      text: `INSERT INTO media_posts (id, post_id, url, type) VALUES ${placeHolders}`,
      values: valueMedia,
    };

    await client.query(queryMedia);

    if (post.tags && post.tags.length > 0) {
      const valueTag = [post.id, ...post.tags];
      const placeHolderTag = post.tags
        .map((_, index) => `($1, $${index + 2})`)
        .join(' ,');
      const queryTagged = {
        text: `INSERT INTO tagged_posts (post_id, user_id) VALUES ${placeHolderTag}`,
        values: valueTag,
      };

      await client.query(queryTagged);
    }
  }
}
