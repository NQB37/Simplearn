import Link from 'next/link';
import { Metadata } from 'next';

import { LoginForm } from '@/components/features/auth/login-form';

export const metadata: Metadata = {
  title: 'Welcome Back - Simplearn',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <div className='mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px] px-4'>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
          Welcome back
        </h1>
        <p className='text-base text-slate-500 dark:text-slate-400 font-medium'>
          Enter your email and password to sign in
        </p>
      </div>

      <div className='bg-white dark:bg-slate-900 px-6 sm:px-8 py-8 shadow-sm border border-slate-200 dark:border-slate-800 rounded-3xl'>
        <LoginForm />
      </div>

      <p className='px-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400'>
        Don&apos;t have an account?{' '}
        <Link
          href='/register'
          className='text-teal-600 dark:text-teal-400 hover:text-teal-700 font-bold transition-colors'
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
