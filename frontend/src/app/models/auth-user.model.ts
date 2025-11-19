import { UserRole } from './enums';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
