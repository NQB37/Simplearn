import Link from 'next/link';
import { Metadata } from 'next';

import { RegisterForm } from '@/components/features/auth/register-form';

export const metadata: Metadata = {
  title: 'Create an account - Simplearn',
  description: 'Create an account to get started.',
};

export default function RegisterPage() {
  return (
    <div className='mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px] px-4'>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
          Create an account
        </h1>
        <p className='text-base text-slate-500 dark:text-slate-400 font-medium'>
          Enter your details below to get started
        </p>
      </div>

      <div className='bg-white dark:bg-slate-900 px-6 sm:px-8 py-8 shadow-sm border border-slate-200 dark:border-slate-800 rounded-3xl'>
        <RegisterForm />
      </div>

      <p className='px-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400'>
        Already have an account?{' '}
        <Link
          href='/login'
          className='text-teal-600 dark:text-teal-400 hover:text-teal-700 font-bold transition-colors'
        >
          Sign In
        </Link>
      </p>

      <p className='px-8 text-center text-xs text-slate-500 dark:text-slate-400 font-medium'>
        By clicking continue, you agree to our{' '}
        <Link
          href='/terms'
          className='underline underline-offset-4 hover:text-teal-600 dark:hover:text-teal-400 transition-colors'
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href='/privacy'
          className='underline underline-offset-4 hover:text-teal-600 dark:hover:text-teal-400 transition-colors'
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
