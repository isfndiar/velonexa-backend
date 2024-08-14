export class UserDetailResponse {
  username: string;
  profileImage: string;
  verify: string;
  name: string;
  bio: string;
  email: string;
  gender: string;
}

export class UserDetailbyUsernameResponse {
  username: string;
  name: string;
  isVerify: string;
  isFollow: string;
  profileImage: string;
  countPost: number;
  countFollowers: number;
  countFollowing: number;
  bio: string;
}
