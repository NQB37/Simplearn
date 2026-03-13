'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import axiosInstance from '@/api/axios.api';
import { useUserStore } from '@/store/user.store';

const AuthCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google Login failed');
      router.push('/login');
      return;
    }

    if (code) {
      const handleGoogleLogin = async () => {
        try {
          // 1. Exchange 'code' for tokens from Backend
          // It accurately sends the refresh token cookie
          const backendRes = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/google`,
            { code },
          );
          const data = backendRes.data;

          if (!data.accessToken) {
            throw new Error('Google Login failed at backend');
          }

          useUserStore.getState().setUser(data.user);
          useUserStore.getState().setAccessToken(data.accessToken);

          toast.success('Logged in with Google!');
          // Force a full refresh when hitting dashboard to render the avatar properly on the Server!
          if (data.user.role === 'ADMIN') {
            window.location.href = '/admin';
          } else if (data.user.role === 'INSTRUCTOR') {
            window.location.href = '/instructor';
          } else {
            window.location.href = '/student/dashboard';
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          console.error(err);
          toast.error(err.message || 'Failed to verify Google login');
          router.push('/login');
        }
      };

      handleGoogleLogin();
    }
  }, [searchParams, router]);

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='text-center'>
        <h2 className='text-2xl font-semibold'>Verifying Login...</h2>
        <p className='text-muted-foreground'>
          Please wait while we redirect you.
        </p>
      </div>
    </div>
  );
};

const AuthCallbackPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
};

export default AuthCallbackPage;
