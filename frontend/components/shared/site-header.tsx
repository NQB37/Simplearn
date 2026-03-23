'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '@/components/shared/mode-toggle';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user.store';
import { UserNav } from '@/components/shared/user-nav';

const studentNavLinks = [
  { label: 'Class Schedule', href: '/student/schedule' },
  { label: 'Enrollment', href: '/student/enrollment' },
];

export function SiteHeader() {
  const { user } = useUserStore();
  const pathname = usePathname();
  return (
    <header className='sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md'>
      <div className='container mx-auto px-4 flex h-14 items-center'>
        <div className='mr-4 hidden md:flex'>
          <Link href='/' className='mr-6 flex items-center space-x-2'>
            <span className='hidden sm:inline-block font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-emerald-400 dark:from-teal-400 dark:to-emerald-300'>
              Simplearn
            </span>
          </Link>
          {user?.role === 'STUDENT' && (
            <nav className='flex items-center space-x-6 text-sm font-medium'>
              {studentNavLinks.map(({ label, href }) => {
                const isActive =
                  pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`transition-colors font-semibold ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400'}`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Mobile Nav Placeholder */}
        <div className='md:hidden flex items-center'>
          <span className='font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-emerald-400 dark:from-teal-400 dark:to-emerald-300'>
            Simplearn
          </span>
        </div>

        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <div className='w-full flex-1 md:w-auto md:flex-none'>
            {/* Search Input Placeholder */}
          </div>
          <nav className='flex items-center space-x-2'>
            {user ? (
              <UserNav user={user} />
            ) : (
              <Button
                variant='ghost'
                size='sm'
                asChild
                className='font-semibold text-slate-600 hover:text-teal-600 hover:bg-teal-50 dark:text-slate-300 dark:hover:text-teal-400 dark:hover:bg-slate-800 cursor-pointer'
              >
                <Link href='/login'>Log In</Link>
              </Button>
            )}
            {!user && (
              <Button
                size='sm'
                asChild
                className='rounded-full bg-teal-600 text-white hover:bg-teal-700 font-bold cursor-pointer'
              >
                <Link href='/register'>Get Started</Link>
              </Button>
            )}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
