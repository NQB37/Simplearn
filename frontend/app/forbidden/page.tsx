import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className='flex min-h-dvh w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 text-center selection:bg-orange-500/30'>
      <div className='relative mb-12 flex w-full max-w-3xl flex-col items-center justify-center group'>
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden'>
          <h1 className='text-[12rem] sm:text-[18rem] md:text-[22rem] font-black tracking-tighter text-slate-900/5 dark:text-white/3 transition-all duration-300'>
            403
          </h1>
        </div>

        <div className='relative z-10 flex flex-col items-center w-full'>
          <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-700 shadow-sm dark:border-orange-900/50 dark:bg-orange-900/20 dark:text-orange-400 transition-transform duration-300 hover:-translate-y-1 hover:shadow-orange-500/20 motion-reduce:hover:transform-none motion-reduce:transition-none cursor-default'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              className='h-4 w-4'
            >
              <path
                fillRule='evenodd'
                d='M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z'
                clipRule='evenodd'
              />
            </svg>
            Access Denied
          </div>

          <h2 className='mb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl md:text-6xl'>
            Restricted{' '}
            <span className='text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-orange-400 dark:from-orange-500 dark:to-orange-300'>
              Area
            </span>
          </h2>

          <p className='mb-10 w-full max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg'>
            You don&apos;t have the required permissions to view this content.
            If you believe this is a mistake, please contact your administrator.
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
              Return to Safety
            </Link>

            <a
              href='mailto:support@simplearn.com'
              className='inline-flex w-full sm:w-auto items-center justify-center rounded-full border-2 border-slate-200 bg-transparent px-8 py-3.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 cursor-pointer'
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
