export type UserRole = 'student' | 'teacher' | 'mentor';

export interface User {
  username: string;
  role: UserRole;
}