export class PostEntity {
  id?: string;
  userId?: string;
  desciption?: string;
  location?: string;
  commentDisable?: string;
  archive?: boolean;
  createdAt?: string;
  updateAt?: string;

  constructor(props: Partial<PostEntity>) {
    Object.assign(this, props);
  }
}
