import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { PlusCircle, BookOpen, Users, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950'>
      <div className='container mx-auto px-6 py-10 max-w-7xl space-y-10'>
        {/* Dashboard Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm'>
          <div>
            <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight'>
              Dashboard Overview
            </h1>
            <p className='text-slate-500 dark:text-slate-400 mt-2 font-medium'>
              Welcome back! Here&apos;s what&apos;s happening with your courses
              today.
            </p>
          </div>
          <Button
            asChild
            size='lg'
            className='rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-500/20 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-500'
          >
            <Link href='/instructor/courses/create'>
              <PlusCircle className='mr-2 h-5 w-5' />
              Create Course
            </Link>
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <Card className='rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 uppercase'>
                Total Courses
              </CardTitle>
              <div className='p-2.5 bg-teal-50 dark:bg-teal-500/10 rounded-xl text-teal-600 dark:text-teal-400'>
                <BookOpen className='h-5 w-5' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-4xl font-black text-slate-900 dark:text-slate-50'>
                12
              </div>
              <p className='flex items-center text-sm font-semibold text-teal-600 dark:text-teal-400 mt-2'>
                <TrendingUp className='h-4 w-4 mr-1' />
                +2 this month
              </p>
            </CardContent>
          </Card>

          <Card className='rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 uppercase'>
                Active Students
              </CardTitle>
              <div className='p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400'>
                <Users className='h-5 w-5' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-4xl font-black text-slate-900 dark:text-slate-50'>
                2,350
              </div>
              <p className='flex items-center text-sm font-semibold text-teal-600 dark:text-teal-400 mt-2'>
                <TrendingUp className='h-4 w-4 mr-1' />
                +18% from last month
              </p>
            </CardContent>
          </Card>

          <Card className='rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 uppercase'>
                Total Revenue
              </CardTitle>
              <div className='p-2.5 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  className='h-5 w-5'
                >
                  <rect width='20' height='14' x='2' y='5' rx='2' />
                  <path d='M2 10h20' />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-4xl font-black text-slate-900 dark:text-slate-50'>
                $12,234
              </div>
              <p className='flex items-center text-sm font-semibold text-teal-600 dark:text-teal-400 mt-2'>
                <TrendingUp className='h-4 w-4 mr-1' />
                +9% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Sections */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-7'>
          <Card className='col-span-4 rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900'>
            <CardHeader className='pb-8'>
              <CardTitle className='text-xl font-bold'>
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div className='flex items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
                  <div className='w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-sm'>
                    OM
                  </div>
                  <div className='ml-4 space-y-1'>
                    <p className='text-sm font-bold leading-none text-slate-900 dark:text-slate-100'>
                      Olivia Martin
                    </p>
                    <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                      olivia.martin@email.com
                    </p>
                  </div>
                  <div className='ml-auto font-bold text-slate-900 dark:text-slate-50'>
                    +$1,999.00
                  </div>
                </div>

                <div className='flex items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
                  <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm'>
                    JL
                  </div>
                  <div className='ml-4 space-y-1'>
                    <p className='text-sm font-bold leading-none text-slate-900 dark:text-slate-100'>
                      Jackson Lee
                    </p>
                    <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                      jackson.lee@email.com
                    </p>
                  </div>
                  <div className='ml-auto font-bold text-slate-900 dark:text-slate-50'>
                    +$39.00
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='col-span-3 rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900'>
            <CardHeader className='pb-8'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-xl font-bold'>My Courses</CardTitle>
                <Link
                  href='/instructor/courses'
                  className='text-sm font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 transition-colors'
                >
                  View All
                </Link>
              </div>
              <CardDescription className='font-medium text-slate-500'>
                Manage your authored content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-900/50 bg-slate-50 dark:bg-slate-800/30 transition-all cursor-pointer group'>
                  <div className='font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors'>
                    Mastering Next.js 14
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='rounded-full text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30'
                  >
                    Edit
                  </Button>
                </div>

                <div className='flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-900/50 bg-slate-50 dark:bg-slate-800/30 transition-all cursor-pointer group'>
                  <div className='font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors'>
                    React Design Patterns
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='rounded-full text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30'
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
