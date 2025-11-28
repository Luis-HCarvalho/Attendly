export interface IUser {
  uid?: string;
  name: string;
  email: string;
  role?: string;
  photoURL?: string;
  createdAt?: Date | string;
}
