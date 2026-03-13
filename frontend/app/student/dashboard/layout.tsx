import Link from 'next/link';
import { LayoutDashboard, Compass, Archive, Bookmark } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-[calc(100vh-3.5rem)]'>
      <aside className='w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hidden md:block'>
        <div className='py-6 px-4 space-y-4'>
          <h2 className='text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2'>
            Learning Menu
          </h2>
          <nav className='space-y-1'>
            <Link
              href='/student/dashboard'
              className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-900 transition-colors'
            >
              <LayoutDashboard className='h-4 w-4' />
              My Learning
            </Link>
            <Link
              href='/student/dashboard/catalog'
              className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-900 transition-colors'
            >
              <Compass className='h-4 w-4' />
              Course Catalog
            </Link>
          </nav>
        </div>
      </aside>
      <div className='flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 p-6 sm:p-8'>
        {children}
      </div>
    </div>
  );
}
