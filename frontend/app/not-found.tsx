import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className='flex min-h-dvh w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 text-center selection:bg-blue-500/30'>
      <div className='relative mb-12 flex w-full max-w-3xl flex-col items-center justify-center group'>
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden'>
          <h1 className='text-[12rem] sm:text-[18rem] md:text-[22rem] font-black tracking-tighter text-slate-900/5 dark:text-white/3 transition-all duration-300'>
            404
          </h1>
        </div>

        <div className='relative z-10 flex flex-col items-center w-full'>
          <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400 transition-transform duration-300 hover:-translate-y-1 hover:shadow-blue-500/20 motion-reduce:hover:transform-none motion-reduce:transition-none cursor-default'>
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
            Page Not Found
          </div>

          <h2 className='mb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl md:text-6xl'>
            Lost in the{' '}
            <span className='text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300'>
              Clouds
            </span>
          </h2>

          <p className='mb-10 w-full max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg'>
            The course or page you&apos;re looking for doesn&apos;t exist or has
            been moved to another directory. Let&apos;s get you back on track.
          </p>

          <div className='flex flex-col sm:flex-row w-full sm:w-auto items-center gap-4'>
            <Link
              href='/'
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
              Return to Dashboard
            </Link>

            <Link
              href='/student/courses'
              className='inline-flex w-full sm:w-auto items-center justify-center rounded-full border-2 border-slate-200 bg-transparent px-8 py-3.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 cursor-pointer'
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
