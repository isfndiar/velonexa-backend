export class PostCreateEntity {
  id: string;
  userId: string;
  description?: string;
  images: Images[];
  tags?: string[];
  location?: string;
}

class Images {
  url: string;
  type: 'video' | 'image';
}
