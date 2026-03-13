import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='container relative flex flex-col items-center justify-center min-h-dvh md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-slate-50 dark:bg-slate-950 selection:bg-teal-500/30'>
      {/* Sidebar Section */}
      <div className='relative hidden h-full flex-col p-10 text-slate-900 dark:text-white lg:flex overflow-hidden'>
        {/* Abstract Background */}
        <div className='absolute inset-0 bg-teal-50 dark:bg-slate-950'>
          <div className='absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-teal-200 via-teal-50 to-teal-50 dark:from-teal-900 dark:via-slate-950 dark:to-slate-950'></div>
          <div className='absolute top-0 -left-1/4 w-[800px] h-[800px] bg-teal-300/40 dark:bg-teal-600/20 rounded-full blur-[120px]'></div>
          <div className='absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-emerald-300/40 dark:bg-emerald-600/20 rounded-full blur-[100px]'></div>
        </div>

        <div className='relative z-20 flex items-center font-bold tracking-tight text-2xl'>
          <Link
            href='/'
            className='flex items-center gap-2 hover:opacity-80 transition-opacity'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='h-8 w-8 text-teal-600 dark:text-teal-400'
            >
              <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
            </svg>
            Simplearn
          </Link>
        </div>

        <div className='relative z-20 mt-auto pb-8'>
          <blockquote className='space-y-6'>
            <p className='text-2xl font-medium leading-relaxed tracking-tight text-slate-800 dark:text-slate-100 max-w-lg'>
              &ldquo;This platform has completely transformed how I learn new
              technologies. The structured courses and hands-on projects are
              exactly what I needed to accelerate my career.&rdquo;
            </p>
            <footer className='flex items-center gap-4'>
              <div className='h-10 w-10 bg-teal-500 rounded-full flex items-center justify-center font-bold text-slate-950'>
                SD
              </div>
              <div className='flex flex-col'>
                <span className='font-semibold text-slate-900 dark:text-white'>
                  Sofia Davis
                </span>
                <span className='text-sm text-slate-600 dark:text-slate-400'>
                  Senior Frontend Developer
                </span>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Main Authentication Section */}
      <div className='lg:p-8 relative h-full flex flex-col justify-center w-full'>
        <div className='absolute top-4 right-4 md:top-8 md:right-8 z-10'>
          <Link
            href='/'
            className='inline-flex items-center justify-center text-sm font-semibold hover:text-teal-600 dark:hover:text-teal-400 text-slate-600 dark:text-slate-400 transition-colors group'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z'
                clipRule='evenodd'
              />
            </svg>
            Back to Home
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
