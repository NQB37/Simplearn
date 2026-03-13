export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  picture?: string;
  avatarUrl?: string;
}
