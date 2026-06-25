export interface RegisterUserPayLoad {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  bio?: string;
}

export interface IUser {
  userId: string;
  email: string;
}
