'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  Search,
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useAdminUsers,
  useFieldsOfStudy,
  useMajors,
  useUpdateUserStatus,
} from '@/hooks/use-user';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  picture?: string;
  studentData?: {
    formOfStudy?: string;
    fieldOfStudyId?: { _id: string; name: string };
    majorId?: { _id: string; name: string };
    typeOfStudy?: string;
    startYear?: number;
  };
  instructorData?: {
    fieldOfStudyId?: { _id: string; name: string };
    majorId?: { _id: string; name: string };
  };
};

export function filterUsers(
  users: User[],
  filters: {
    search?: string;
    status?: string;
    fieldOfStudyId?: string;
    majorId?: string;
    typeOfStudy?: string;
    startYear?: string;
  },
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT',
): User[] {
  return users
    .filter((u) => u.role === role)
    .filter((u) => {
      if (!filters.status) return true;
      return u.status === filters.status;
    })
    .filter((u) => {
      if (!filters.search) return true;
      const q = filters.search.toLowerCase();
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      return fullName.includes(q) || u.email.toLowerCase().includes(q);
    })
    .filter((u) => {
      if (!filters.fieldOfStudyId) return true;
      if (role === 'INSTRUCTOR') {
        return u.instructorData?.fieldOfStudyId?._id === filters.fieldOfStudyId;
      }
      if (role === 'STUDENT') {
        return u.studentData?.fieldOfStudyId?._id === filters.fieldOfStudyId;
      }
      return true;
    })
    .filter((u) => {
      if (!filters.majorId) return true;
      if (role === 'INSTRUCTOR') {
        return u.instructorData?.majorId?._id === filters.majorId;
      }
      if (role === 'STUDENT') {
        return u.studentData?.majorId?._id === filters.majorId;
      }
      return true;
    })
    .filter((u) => {
      if (!filters.typeOfStudy) return true;
      if (role === 'STUDENT') {
        return u.studentData?.typeOfStudy === filters.typeOfStudy;
      }
      return true;
    })
    .filter((u) => {
      if (!filters.startYear) return true;
      if (role === 'STUDENT') {
        return String(u.studentData?.startYear) === filters.startYear;
      }
      return true;
    });
}

function StatusCell({ status }: { status: string }) {
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
}

function ActionsCell({
  user,
  onStatusChange,
}: {
  user: User;
  onStatusChange: (id: string, status: string) => void;
}) {
  const router = useRouter();
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
          className='font-medium text-amber-600 focus:text-amber-700 cursor-pointer focus:bg-amber-50 dark:focus:bg-amber-900/20'
          onClick={() =>
            onStatusChange(
              user.id,
              user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
            )
          }
        >
          {user.status === 'ACTIVE' ? 'Suspend User' : 'Reactivate User'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserTable({
  data,
  columns,
  isLoading,
  emptyMessage,
}: {
  data: User[];
  columns: ColumnDef<User>[];
  isLoading: boolean;
  emptyMessage: string;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const colCount = columns.length;

  return (
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
          {isLoading ? (
            <tr>
              <td
                colSpan={colCount}
                className='px-6 py-12 text-center text-slate-400'
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={colCount}
                className='px-6 py-12 text-center text-slate-400'
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='px-6 py-4 whitespace-nowrap'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {!isLoading && data.length > 0 && (
        <div className='px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
          <span className='text-sm font-medium text-slate-500'>
            Showing {table.getRowModel().rows.length} of {data.length} records.
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
      )}
    </div>
  );
}

const ALL_VALUE = '__all__';

function FilterSelect({
  placeholder,
  value,
  onChange,
  options,
  disabled,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <Select
      value={value || ALL_VALUE}
      onValueChange={(v) => onChange(v === ALL_VALUE ? '' : v)}
      disabled={disabled}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>{placeholder}</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function AdminUsersPage() {
  const { data = [], isLoading: loading } = useAdminUsers();
  const { data: fields = [] } = useFieldsOfStudy();

  // Admin tab filters
  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatus, setAdminStatus] = useState('');

  // Instructor tab filters
  const [instructorSearch, setInstructorSearch] = useState('');
  const [instructorStatus, setInstructorStatus] = useState('');
  const [instructorField, setInstructorField] = useState('');
  const [instructorMajor, setInstructorMajor] = useState('');
  const { data: instructorMajors = [] } = useMajors(
    instructorField || undefined,
  );

  // Student tab filters
  const [studentSearch, setStudentSearch] = useState('');
  const [studentStatus, setStudentStatus] = useState('');
  const [studentField, setStudentField] = useState('');
  const [studentMajor, setStudentMajor] = useState('');
  const [studentTypeOfStudy, setStudentTypeOfStudy] = useState('');
  const [studentStartYear, setStudentStartYear] = useState('');
  const { data: studentMajors = [] } = useMajors(studentField || undefined);

  const statusMutation = useUpdateUserStatus();

  const handleStatusChange = (id: string, newStatus: string) => {
    statusMutation.mutate({ userId: id, status: newStatus });
  };

  const allAdmins = useMemo(
    () =>
      filterUsers(data, { search: adminSearch, status: adminStatus }, 'ADMIN'),
    [data, adminSearch, adminStatus],
  );

  const allInstructors = useMemo(
    () =>
      filterUsers(
        data,
        {
          search: instructorSearch,
          status: instructorStatus,
          fieldOfStudyId: instructorField,
          majorId: instructorMajor,
        },
        'INSTRUCTOR',
      ),
    [
      data,
      instructorSearch,
      instructorStatus,
      instructorField,
      instructorMajor,
    ],
  );

  const allStudents = useMemo(
    () =>
      filterUsers(
        data,
        {
          search: studentSearch,
          status: studentStatus,
          fieldOfStudyId: studentField,
          majorId: studentMajor,
          typeOfStudy: studentTypeOfStudy,
          startYear: studentStartYear,
        },
        'STUDENT',
      ),
    [
      data,
      studentSearch,
      studentStatus,
      studentField,
      studentMajor,
      studentTypeOfStudy,
      studentStartYear,
    ],
  );

  const rawAdminCount = useMemo(
    () => data.filter((u: User) => u.role === 'ADMIN').length,
    [data],
  );
  const rawInstructorCount = useMemo(
    () => data.filter((u: User) => u.role === 'INSTRUCTOR').length,
    [data],
  );
  const rawStudentCount = useMemo(
    () => data.filter((u: User) => u.role === 'STUDENT').length,
    [data],
  );

  const fieldOptions = fields.map((f) => ({ value: f._id, label: f.name }));

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'SUSPENDED', label: 'Suspended' },
  ];

  const typeOfStudyOptions = [
    { value: 'bachelor', label: 'Bachelor' },
    { value: 'master', label: 'Master' },
    { value: 'phd', label: 'PhD' },
    { value: 'associate', label: 'Associate' },
    { value: 'certificate', label: 'Certificate' },
  ];

  const currentYear = new Date().getFullYear();
  const startYearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i;
    return { value: String(year), label: String(year) };
  });

  const baseNameEmailColumns: ColumnDef<User>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className='font-semibold text-slate-900 dark:text-slate-100'>
          {row.original.firstName} {row.original.lastName}
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
  ];

  const statusColumn: ColumnDef<User> = {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusCell status={row.getValue('status') as string} />,
  };

  const actionsColumn: ColumnDef<User> = {
    id: 'actions',
    cell: ({ row }) => (
      <ActionsCell user={row.original} onStatusChange={handleStatusChange} />
    ),
  };

  const adminColumns: ColumnDef<User>[] = [
    ...baseNameEmailColumns,
    statusColumn,
    actionsColumn,
  ];

  const instructorColumns: ColumnDef<User>[] = [
    ...baseNameEmailColumns,
    {
      id: 'fieldOfStudy',
      header: 'Field of Study',
      cell: ({ row }) => (
        <span className='text-slate-600 dark:text-slate-400'>
          {row.original.instructorData?.fieldOfStudyId?.name ?? '—'}
        </span>
      ),
    },
    {
      id: 'major',
      header: 'Major',
      cell: ({ row }) => (
        <span className='text-slate-600 dark:text-slate-400'>
          {row.original.instructorData?.majorId?.name ?? '—'}
        </span>
      ),
    },
    statusColumn,
    actionsColumn,
  ];

  const studentColumns: ColumnDef<User>[] = [
    ...baseNameEmailColumns,
    {
      id: 'fieldOfStudy',
      header: 'Field of Study',
      cell: ({ row }) => (
        <span className='text-slate-600 dark:text-slate-400'>
          {row.original.studentData?.fieldOfStudyId?.name ?? '—'}
        </span>
      ),
    },
    {
      id: 'major',
      header: 'Major',
      cell: ({ row }) => (
        <span className='text-slate-600 dark:text-slate-400'>
          {row.original.studentData?.majorId?.name ?? '—'}
        </span>
      ),
    },
    {
      id: 'typeOfStudy',
      header: 'Type of Study',
      cell: ({ row }) => {
        const t = row.original.studentData?.typeOfStudy;
        return (
          <span className='text-slate-600 dark:text-slate-400 capitalize'>
            {t ?? '—'}
          </span>
        );
      },
    },
    {
      id: 'startYear',
      header: 'Start Year',
      cell: ({ row }) => (
        <span className='text-slate-600 dark:text-slate-400'>
          {row.original.studentData?.startYear ?? '—'}
        </span>
      ),
    },
    statusColumn,
    actionsColumn,
  ];

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
            User Management
          </h1>
          <p className='text-slate-500 dark:text-slate-400 font-medium'>
            Overview of all members and access controls.
          </p>
        </div>
        <Link href='/admin/users/new'>
          <Button>Create Student</Button>
        </Link>
      </div>

      <Tabs defaultValue='admin'>
        <TabsList className='w-full justify-start mb-2 bg-muted p-1 rounded-lg h-auto'>
          <TabsTrigger value='admin' className='px-5 py-2'>
            Admin{!loading && ` (${rawAdminCount})`}
          </TabsTrigger>
          <TabsTrigger value='instructor' className='px-5 py-2'>
            Instructor{!loading && ` (${rawInstructorCount})`}
          </TabsTrigger>
          <TabsTrigger value='student' className='px-5 py-2'>
            Student{!loading && ` (${rawStudentCount})`}
          </TabsTrigger>
        </TabsList>

        {/* Admin Tab */}
        <TabsContent value='admin'>
          <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
            <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800 space-y-3'>
              <CardTitle className='text-lg font-bold'>
                Administrators
              </CardTitle>
              <div className='flex flex-wrap items-center gap-3'>
                <FilterSelect
                  placeholder='All Status'
                  value={adminStatus}
                  onChange={setAdminStatus}
                  options={statusOptions}
                />
                <div className='relative flex-1 min-w-[200px] max-w-xs'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                  <Input
                    placeholder='Search name or email…'
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className='pl-9'
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className='p-0'>
              <UserTable
                data={allAdmins}
                columns={adminColumns}
                isLoading={loading}
                emptyMessage='No administrators found.'
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instructor Tab */}
        <TabsContent value='instructor'>
          <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
            <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800 space-y-3'>
              <CardTitle className='text-lg font-bold'>Instructors</CardTitle>
              <div className='flex flex-wrap items-center gap-3'>
                <FilterSelect
                  placeholder='All Status'
                  value={instructorStatus}
                  onChange={setInstructorStatus}
                  options={statusOptions}
                />
                <FilterSelect
                  placeholder='All Fields'
                  value={instructorField}
                  onChange={(v) => {
                    setInstructorField(v);
                    setInstructorMajor('');
                  }}
                  options={fieldOptions}
                />
                <FilterSelect
                  placeholder='All Majors'
                  value={instructorMajor}
                  onChange={setInstructorMajor}
                  options={instructorMajors.map((m) => ({
                    value: m._id,
                    label: m.name,
                  }))}
                  disabled={!instructorField}
                />
                <div className='relative flex-1 min-w-[200px] max-w-xs'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                  <Input
                    placeholder='Search name or email…'
                    value={instructorSearch}
                    onChange={(e) => setInstructorSearch(e.target.value)}
                    className='pl-9'
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className='p-0'>
              <UserTable
                data={allInstructors}
                columns={instructorColumns}
                isLoading={loading}
                emptyMessage='No instructors found.'
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Tab */}
        <TabsContent value='student'>
          <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
            <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800 space-y-3'>
              <CardTitle className='text-lg font-bold'>Students</CardTitle>
              <div className='flex flex-wrap items-center gap-3'>
                <FilterSelect
                  placeholder='All Status'
                  value={studentStatus}
                  onChange={setStudentStatus}
                  options={statusOptions}
                />
                <FilterSelect
                  placeholder='All Fields'
                  value={studentField}
                  onChange={(v) => {
                    setStudentField(v);
                    setStudentMajor('');
                  }}
                  options={fieldOptions}
                />
                <FilterSelect
                  placeholder='All Majors'
                  value={studentMajor}
                  onChange={setStudentMajor}
                  options={studentMajors.map((m) => ({
                    value: m._id,
                    label: m.name,
                  }))}
                  disabled={!studentField}
                />
                <FilterSelect
                  placeholder='All Types'
                  value={studentTypeOfStudy}
                  onChange={setStudentTypeOfStudy}
                  options={typeOfStudyOptions}
                />
                <FilterSelect
                  placeholder='All Years'
                  value={studentStartYear}
                  onChange={setStudentStartYear}
                  options={startYearOptions}
                />
                <div className='relative flex-1 min-w-[200px] max-w-xs'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                  <Input
                    placeholder='Search name or email…'
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className='pl-9'
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className='p-0'>
              <UserTable
                data={allStudents}
                columns={studentColumns}
                isLoading={loading}
                emptyMessage='No students found.'
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
