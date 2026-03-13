import { notFound } from 'next/navigation';
import { MOCK_COURSES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = MOCK_COURSES.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 pb-20'>
      {/* Course Header Hero */}
      <div className='bg-slate-900 border-b border-slate-800 py-16 md:py-24 px-6 relative overflow-hidden'>
        {/* Background Effects */}
        <div className='absolute inset-0 z-0 pointer-events-none opacity-40'>
          <div className='absolute top-0 right-1/4 w-96 h-96 bg-teal-600/30 rounded-full blur-[100px]'></div>
          <div className='absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px]'></div>
        </div>

        <div className='container relative z-10 mx-auto max-w-7xl'>
          <div className='flex items-center gap-3 mb-6'>
            <Badge className='bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 border-teal-500/20 font-bold px-3 py-1 text-sm'>
              {course.lessonsCount} Lessons
            </Badge>
            <Badge className='bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700 font-bold px-3 py-1 text-sm'>
              Beginner Friendly
            </Badge>
          </div>

          <h1 className='text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl'>
            {course.title}
          </h1>

          <p className='text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed font-medium mb-10'>
            {course.description}
          </p>

          <div className='flex flex-wrap items-center gap-6 text-sm text-slate-400 font-medium'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold'>
                {course.author[0]}
              </div>
              Created by <span className='text-slate-200'>{course.author}</span>
            </div>
            <div className='hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-700'></div>
            <div className='flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-teal-500'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                  clipRule='evenodd'
                />
              </svg>
              Last updated <span className='text-slate-200'>Feb 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='container mx-auto px-6 max-w-7xl mt-12 grid gap-12 lg:grid-cols-3 relative'>
        <div className='lg:col-span-2 space-y-12'>
          <div className='bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm'>
            <h2 className='text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6'>
              What you&apos;ll learn
            </h2>
            <ul className='grid sm:grid-cols-2 gap-4 text-slate-700 dark:text-slate-300 font-medium'>
              <li className='flex items-start gap-3'>
                <svg
                  className='w-6 h-6 text-teal-500 shrink-0'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M4.5 12.75l6 6 9-13.5'
                  />
                </svg>
                Comprehensive understanding of the core concepts
              </li>
              <li className='flex items-start gap-3'>
                <svg
                  className='w-6 h-6 text-teal-500 shrink-0'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M4.5 12.75l6 6 9-13.5'
                  />
                </svg>
                Hands-on experience with real-world projects
              </li>
              <li className='flex items-start gap-3'>
                <svg
                  className='w-6 h-6 text-teal-500 shrink-0'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M4.5 12.75l6 6 9-13.5'
                  />
                </svg>
                Best practices and industry standards
              </li>
              <li className='flex items-start gap-3'>
                <svg
                  className='w-6 h-6 text-teal-500 shrink-0'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M4.5 12.75l6 6 9-13.5'
                  />
                </svg>
                How to build scalable applications
              </li>
            </ul>
          </div>

          <div className='prose prose-lg prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300'>
            <h3 className='text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4'>
              Requirements
            </h3>
            <ul className='mb-10 space-y-2'>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-teal-500 before:rounded-full">
                Basic knowledge of programming concepts
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-teal-500 before:rounded-full">
                A computer with internet access
              </li>
              <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-teal-500 before:rounded-full">
                Passion for learning new technologies
              </li>
            </ul>

            <h3 className='text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4'>
              Description
            </h3>
            <div className='space-y-4 leading-relaxed bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm'>
              <p>
                Welcome to <strong>{course.title}</strong>! This course is
                designed to take you from beginner to advanced level. We will
                cover everything you need to know to master the subject.
              </p>
              <p>
                Whether you are looking to start a new career or enhance your
                current skills, this course offers valuable insights and
                practical knowledge that you can apply immediately in the real
                world.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Sidebar Card */}
        <div className='lg:col-span-1 relative'>
          <div className='sticky top-8'>
            <Card className='shadow-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden'>
              <div className='aspect-video bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center'>
                <div className='absolute inset-0 bg-linear-to-b from-transparent to-slate-900/50'></div>
                <button className='w-16 h-16 bg-white/90 text-slate-900 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-transform cursor-pointer z-10 pl-1'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-8 h-8'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
                <span className='absolute bottom-4 left-4 text-white font-bold text-sm shadow-sm backdrop-blur-md bg-black/30 px-3 py-1 rounded-full'>
                  Preview Course
                </span>
              </div>

              <CardHeader className='pt-6 pb-2 px-6'>
                <CardTitle className='text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-50'>
                  {course.price ? `$${course.price.toFixed(2)}` : 'Free'}
                </CardTitle>
                <CardDescription className='font-medium text-teal-600 dark:text-teal-400'>
                  Full lifetime access
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6 px-6'>
                <Button
                  className='w-full text-lg py-7 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-500/20 active:scale-95 transition-all text-center flex items-center justify-center'
                  size='lg'
                >
                  Enroll Now
                </Button>
                <p className='text-sm text-center font-medium text-slate-500 dark:text-slate-400 pb-2'>
                  30-Day Money-Back Guarantee
                </p>
              </CardContent>
              <CardFooter className='bg-slate-50 dark:bg-slate-800/50 px-6 py-6 flex flex-col items-start gap-4'>
                <p className='font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs'>
                  This course includes:
                </p>
                <ul className='text-sm space-y-3 text-slate-600 dark:text-slate-400 font-medium w-full'>
                  <li className='flex items-center gap-3'>
                    <svg
                      className='w-5 h-5 text-slate-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                      />
                    </svg>
                    {course.lessonsCount} In-depth Lessons
                  </li>
                  <li className='flex items-center gap-3'>
                    <svg
                      className='w-5 h-5 text-slate-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                      />
                    </svg>
                    Downloadable resources
                  </li>
                  <li className='flex items-center gap-3'>
                    <svg
                      className='w-5 h-5 text-slate-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
                      />
                    </svg>
                    Access on mobile and TV
                  </li>
                  <li className='flex items-center gap-3'>
                    <svg
                      className='w-5 h-5 text-slate-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    Certificate of completion
                  </li>
                </ul>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
