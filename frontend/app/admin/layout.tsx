import Link from 'next/link';
import { AdminSidebarFooter } from '@/components/shared/admin-sidebar-footer';
import {
  LayoutDashboard,
  Users,
  LibraryBig,
  BookOpen,
  Settings,
  GraduationCap,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen'>
      <aside className='w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hidden md:flex md:flex-col'>
        <div className='py-6 px-4 space-y-4'>
          <h2 className='text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2'>
            Admin Console
          </h2>
          <nav className='space-y-1'>
            <Link
              href='/admin'
              className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800 transition-colors'
            >
              <LayoutDashboard className='h-4 w-4' />
              Platform Analytics
            </Link>
            <Link
              href='/admin/users'
              className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800 transition-colors'
            >
              <Users className='h-4 w-4' />
              User Management
            </Link>
            <Link
              href='/admin/academics'
              className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800 transition-colors'
            >
              <LibraryBig className='h-4 w-4' />
              Academics
            </Link>
            <Link
              href='/admin/curriculum'
              className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800 transition-colors'
            >
              <GraduationCap className='h-4 w-4' />
              Curriculum
            </Link>
            <Link
              href='/admin/vocabulary'
              className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800 transition-colors'
            >
              <Settings className='h-4 w-4' />
              Vocabulary
            </Link>
            <Link
              href='/admin/catalog'
              className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800 transition-colors'
            >
              <BookOpen className='h-4 w-4' />
              Courses
            </Link>
          </nav>
        </div>
        <AdminSidebarFooter />
      </aside>
      <div className='flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 p-6 sm:p-8'>
        {children}
      </div>
    </div>
  );
}
