export enum Role {
  USER = "user",
  ADMIN = "admin",
  AGENT = "agent",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  age: number;
  is_active?: boolean;
  id?: string;
  role?: Role;
}
