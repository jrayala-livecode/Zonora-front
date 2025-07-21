// types.ts o donde definas interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  joinedAt?: string;
}

export type LoginResponse =
  | { user: User; token?: string }
  | User;
