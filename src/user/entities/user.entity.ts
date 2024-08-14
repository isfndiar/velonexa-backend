export class UserEntity {
  id?: string;
  username?: string;
  name?: string;
  bio?: string;
  email?: string;
  password?: string;
  type?: string;
  verify?: string;
  gender?: string;
  profileImage?: string;
  phoneNumber?: string;
  isPrivate?: boolean;
  isNewUser?: boolean;
  countPost?: number;
  countFollowers?: number;
  countFollowing?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: Partial<UserEntity>) {
    Object.assign(this, props);
  }
}

export class UserUpdateEntity {
  id?: string;
  username?: string;
  name?: string;
  bio?: string;
  email?: string;
  password?: string;
  gender?: string;
  profileImage?: string;
  phoneNumber?: string;
  isPrivate?: boolean;

  constructor(props: Partial<UserEntity>) {
    Object.assign(this, props);
  }
}

export class UserFollowsEntity {
  followerId: string;
  followingId: string;
}

export class UserCreateEntity {
  id: string;
  username: string;
  email: string;
  password: string;
  constructor(id: string, username: string, email: string, password: string) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
