import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account Disabled - Simplearn',
};

export default function AccountDisabledPage() {
  return (
    <div className='flex min-h-dvh w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 text-center selection:bg-amber-500/30'>
      <div className='relative mb-12 flex w-full max-w-3xl flex-col items-center justify-center'>
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden'>
          <h1 className='text-[12rem] sm:text-[18rem] md:text-[22rem] font-black tracking-tighter text-slate-900/5 dark:text-white/3'>
            403
          </h1>
        </div>

        <div className='relative z-10 flex flex-col items-center w-full'>
          <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700 shadow-sm dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400 cursor-default'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              className='h-4 w-4'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'
                clipRule='evenodd'
              />
            </svg>
            Account Disabled
          </div>

          <h2 className='mb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl md:text-6xl'>
            Account{' '}
            <span className='text-transparent bg-clip-text bg-linear-to-r from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300'>
              Suspended
            </span>
          </h2>

          <p className='mb-10 w-full max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg'>
            This account has been disabled. Your account expired or was disabled
            by an administrator.
          </p>

          <Link
            href='/login'
            className='inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 motion-reduce:transition-none motion-reduce:hover:transform-none cursor-pointer group'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transition-none'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2.5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
