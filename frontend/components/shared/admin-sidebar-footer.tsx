'use client';

import { useUserStore } from '@/store/user.store';
import { UserNav } from '@/components/shared/user-nav';
import { ModeToggle } from '@/components/shared/mode-toggle';

export function AdminSidebarFooter() {
  const { user } = useUserStore();

  return (
    <div className='mt-auto p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between'>
      {user ? (
        <UserNav user={user} />
      ) : (
        <div className='h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800' />
      )}
      <ModeToggle />
    </div>
  );
}
