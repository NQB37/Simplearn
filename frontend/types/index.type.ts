export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  picture?: string;
  avatarUrl?: string;
}
