import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Settings,
  Users,
} from 'lucide-react';

import { SiteHeader } from '@/components/shared/site-header';

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <SiteHeader />
      <div className='flex flex-1'>
        <aside className='w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hidden md:block'>
          <div className='py-6 px-4 space-y-4'>
            <h2 className='text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2'>
              Instructor Portal
            </h2>
            <nav className='space-y-1'>
              <Link
                href='/instructor'
                className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800 transition-colors'
              >
                <LayoutDashboard className='h-4 w-4' />
                Overview
              </Link>
              <Link
                href='/instructor/courses'
                className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800 transition-colors'
              >
                <BookOpen className='h-4 w-4' />
                My Courses
              </Link>
              <Link
                href='/instructor/courses/create'
                className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-teal-700 bg-teal-100 hover:bg-teal-200 dark:text-teal-400 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 transition-colors mt-4'
              >
                <PlusCircle className='h-4 w-4' />
                Create Course
              </Link>
            </nav>

            <div className='pt-8'>
              <h2 className='text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2'>
                Engagement
              </h2>
              <nav className='space-y-1'>
                <Link
                  href='#'
                  className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-slate-500 cursor-not-allowed'
                >
                  <Users className='h-4 w-4' />
                  Students (Soon)
                </Link>
              </nav>
            </div>
          </div>
        </aside>
        <div className='flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 p-6 sm:p-8'>
          {children}
        </div>
      </div>
    </div>
  );
}
