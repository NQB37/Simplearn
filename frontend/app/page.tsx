import Link from 'next/link';
import { CourseCard } from '@/components/shared/course-card';
import { MOCK_COURSES } from '@/lib/mock-data';
import { SiteHeader } from '@/components/shared/site-header';

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-teal-500/30'>
      <SiteHeader />
      {/* Hero Section */}
      <section className='relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32'>
        {/* Abstract Background Elements */}
        <div className='absolute inset-0 z-0 pointer-events-none'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[100px] opacity-70'></div>
          <div className='absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[80px] opacity-70'></div>
        </div>

        <div className='container relative z-10 mx-auto px-6 flex max-w-6xl flex-col items-center gap-8 text-center'>
          <div className='inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white/50 backdrop-blur-md px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300'>
            <span className='flex h-2 w-2 rounded-full bg-teal-500 animate-pulse'></span>
            Join 50,000+ students learning today
          </div>

          <h1 className='font-extrabold text-5xl tracking-tighter sm:text-7xl md:text-8xl text-slate-950 dark:text-slate-50'>
            Master New Skills with{' '}
            <span className='text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-emerald-400 dark:from-teal-400 dark:to-emerald-300'>
              Simplearn
            </span>
          </h1>

          <p className='max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 sm:text-2xl mt-2 font-medium'>
            The most modern platform to level up your career. From coding to
            design, access expertly crafted courses with interactive learning.
          </p>

          <div className='flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto'>
            <Link
              href='/student/courses'
              className='inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-teal-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-teal-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-600/25 active:scale-95 cursor-pointer'
            >
              Explore Courses
            </Link>
            <Link
              href='/instructor/register'
              className='inline-flex w-full sm:w-auto items-center justify-center rounded-full border-2 border-slate-200 bg-transparent px-8 py-4 text-base font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/50 active:scale-95 cursor-pointer'
            >
              Become an Instructor
            </Link>
          </div>

          {/* Platform Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-12 md:pt-20 mt-12 border-t border-slate-200 dark:border-slate-800 w-full max-w-5xl'>
            <div className='flex flex-col items-center gap-2'>
              <span className='text-4xl font-black text-slate-900 dark:text-slate-50'>
                150+
              </span>
              <span className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                Expert Courses
              </span>
            </div>
            <div className='flex flex-col items-center gap-2'>
              <span className='text-4xl font-black text-slate-900 dark:text-slate-50'>
                50k+
              </span>
              <span className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                Active Students
              </span>
            </div>
            <div className='flex flex-col items-center gap-2'>
              <span className='text-4xl font-black text-slate-900 dark:text-slate-50'>
                4.9/5
              </span>
              <span className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                Average Rating
              </span>
            </div>
            <div className='flex flex-col items-center gap-2'>
              <span className='text-4xl font-black text-slate-900 dark:text-slate-50'>
                #1
              </span>
              <span className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                Learning Platform
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className='bg-white dark:bg-slate-900 py-20 lg:py-32 border-t border-slate-200 dark:border-slate-800 z-10'>
        <div className='container mx-auto px-6'>
          <div className='mx-auto flex max-w-3xl flex-col items-center space-y-4 text-center mb-16'>
            <h2 className='font-extrabold text-4xl leading-[1.1] sm:text-5xl md:text-6xl text-slate-900 dark:text-slate-50'>
              Trending{' '}
              <span className='text-teal-600 dark:text-teal-400'>Courses</span>
            </h2>
            <p className='max-w-[85%] leading-relaxed text-slate-600 dark:text-slate-400 sm:text-xl font-medium'>
              Jumpstart your journey with our most highly-rated comprehensive
              courses.
            </p>
          </div>
          <div className='mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3 md:max-w-6xl'>
            {MOCK_COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className='mt-16 text-center'>
            <Link
              href='/student/courses'
              className='inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-bold text-lg transition-colors group cursor-pointer'
            >
              View entire catalog
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 transition-transform group-hover:translate-x-1'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z'
                  clipRule='evenodd'
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
