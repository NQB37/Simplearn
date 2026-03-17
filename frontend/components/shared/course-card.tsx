import Link from 'next/link';
import { MockCourse } from '@/lib/mock-data';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function CourseCard({ course }: { course: MockCourse }) {
  return (
    <Card className='flex flex-col h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-teal-500/10 dark:hover:shadow-teal-400/10 hover:-translate-y-1 transition-all duration-300 group overflow-hidden rounded-2xl cursor-pointer'>
      <Link
        href={`/courses/${course.slug}`}
        className='flex flex-col h-full outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-2xl'
      >
        <div className='relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800'>
          {/* If we had real images, use next/image. For now, a polished gradient placeholder div */}
          <div className='absolute inset-0 bg-linear-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 group-hover:scale-105 transition-transform duration-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-10 h-10 mb-2 opacity-50'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25'
              />
            </svg>
            <span className='font-medium text-sm'>Course Preview</span>
          </div>

          {/* Badges hovering on image */}
          <div className='absolute top-4 left-4 flex gap-2'>
            <span className='px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-bold text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50'>
              {course.lessonsCount} Modules
            </span>
          </div>
        </div>

        <div className='flex flex-col flex-1 p-6'>
          <div className='mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider'>
            {course.author}
          </div>
          <h3 className='text-xl font-bold text-slate-900 dark:text-slate-50 line-clamp-2 leading-tight mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors'>
            {course.title}
          </h3>
          <p className='text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1'>
            {course.description}
          </p>

          <div className='mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
            <span className='text-sm font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform'>
              Start Learning
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z'
                  clipRule='evenodd'
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
