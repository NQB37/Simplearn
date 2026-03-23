'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/types/index.type';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/api/axios.api';
import {
  LayoutDashboard,
  User as UserIcon,
  BookPlus,
  LogOut,
} from 'lucide-react';
import { useUserStore } from '@/store/user.store';

interface UserNavProps {
  user: User;
}

export const UserNav = ({ user }: UserNavProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/logout`,
      );
      useUserStore.getState().clearUser();
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='relative h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none'
        >
          <Avatar className='h-8 w-8 hover:opacity-80 transition-opacity'>
            <AvatarImage
              src={user.picture || `https://avatar.vercel.sh/${user.email}`}
              alt={user.name || user.email}
              className='object-cover'
            />
            <AvatarFallback className='bg-primary/10 text-primary font-medium'>
              {(user.name?.[0] || user.email[0]).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal p-3'>
          <div className='flex flex-col space-y-1.5'>
            <p className='text-sm font-semibold leading-none'>
              {user.name || 'User'}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              if (user.role === 'ADMIN') router.push('/admin');
              else if (user.role === 'INSTRUCTOR') router.push('/instructor');
              else router.push('');
            }}
            className='cursor-pointer group'
          >
            <LayoutDashboard className='mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors' />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push('/student/profile')}
            className='cursor-pointer group'
          >
            <UserIcon className='mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors' />
            <span>Profile</span>
          </DropdownMenuItem>
          {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
            <DropdownMenuItem
              onClick={() => router.push('/instructor/courses/create')}
              className='cursor-pointer group'
            >
              <BookPlus className='mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors' />
              <span>Create Course</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className='cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/50'
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
