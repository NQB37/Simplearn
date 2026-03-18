'use client';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminUsers } from '@/hooks/use-user';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const { data = [], isLoading: loading } = useAdminUsers();

  const handleRoleChange = (_id: string, newRole: string) => {
    toast.success(`Role updated to ${newRole}`);
  };

  const handleStatusChange = (_id: string, newStatus: string) => {
    toast.success(`Status updated to ${newStatus}`);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className='font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2'>
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className='text-slate-500 font-medium'>
          {row.getValue('email')}
        </span>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge
            variant={
              role === 'ADMIN'
                ? 'default'
                : role === 'INSTRUCTOR'
                  ? 'secondary'
                  : 'outline'
            }
            className='font-bold rounded-lg cursor-default'
          >
            {role.substring(0, 3)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <div className='flex items-center gap-1.5'>
            {status === 'ACTIVE' ? (
              <CheckCircle2 className='h-4 w-4 text-emerald-500' />
            ) : status === 'SUSPENDED' ? (
              <AlertCircle className='h-4 w-4 text-amber-500' />
            ) : (
              <ShieldAlert className='h-4 w-4 text-red-500' />
            )}
            <span
              className={`text-xs font-bold uppercase ${
                status === 'ACTIVE'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : status === 'SUSPENDED'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-red-600 dark:text-red-400'
              }`}
            >
              {status}
            </span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='h-8 w-8 p-0 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer'
              >
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='rounded-xl border-slate-200 shadow-xl dark:border-slate-800 dark:bg-slate-900'
            >
              <DropdownMenuItem
                className='font-medium cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800'
                onClick={() => router.push(`/admin/users/${user.id}/profile`)}
              >
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className='font-medium cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800'
                onClick={() =>
                  handleRoleChange(
                    user.id,
                    user.role === 'INSTRUCTOR' ? 'STUDENT' : 'INSTRUCTOR',
                  )
                }
              >
                Toggle Role ({user.role === 'INSTRUCTOR' ? 'Demote' : 'Promote'}
                )
              </DropdownMenuItem>
              <DropdownMenuItem
                className='font-medium text-amber-600 focus:text-amber-700 cursor-pointer focus:bg-amber-50 dark:focus:bg-amber-900/20'
                onClick={() =>
                  handleStatusChange(
                    user.id,
                    user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
                  )
                }
              >
                {user.status === 'ACTIVE' ? 'Suspend User' : 'Reactivate User'}
              </DropdownMenuItem>
              <DropdownMenuItem
                className='font-bold text-red-600 focus:text-red-700 cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/20'
                onClick={() => handleStatusChange(user.id, 'BANNED')}
              >
                Ban User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div className="flex items-center justify-between">
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
            User Management
          </h1>
          <p className='text-slate-500 dark:text-slate-400 font-medium'>
            Overview of all members and access controls.
          </p>
        </div>
        <Link href="/admin/users/new">
          <Button>Create Student</Button>
        </Link>
      </div>

      <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
        <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800'>
          <CardTitle className='text-lg font-bold'>Directory Listing</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {loading ? (
            <div className='p-8 flex justify-center text-slate-400'>
              Loading users...
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm text-left align-middle'>
                <thead className='text-xs font-bold uppercase text-slate-500 bg-slate-50/50 dark:bg-slate-900/50 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800'>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className='px-6 py-4 font-bold tracking-wider'
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className='divide-y divide-slate-100 dark:divide-slate-800/80'>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className='px-6 py-4 whitespace-nowrap'
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
                <span className='text-sm font-medium text-slate-500'>
                  Showing {table.getRowModel().rows.length} records.
                </span>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className='font-bold rounded-lg'
                  >
                    Previous
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className='font-bold rounded-lg'
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
