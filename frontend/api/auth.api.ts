import { User } from '@/types/index.type';
import axiosInstance from './axios.api';

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/me`,
    );

    const data = res.data;
    return data.user as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
};
