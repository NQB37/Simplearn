import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ClassesManager } from '@/components/features/academics/classes-manager';
import { Plus } from 'lucide-react';

export default function ClassesAdminPage() {
  return (
    <div className='max-w-full mx-auto space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
            Class Management
          </h1>
          <p className='text-slate-500 dark:text-slate-400 font-medium'>
            Create and manage class schedules for the semester.
          </p>
        </div>
        <Link href='/admin/classes/create'>
          <Button className='bg-blue-600 hover:bg-blue-700 text-white font-bold'>
            <Plus className='h-4 w-4 mr-2' />
            Create Class
          </Button>
        </Link>
      </div>
      <ClassesManager />
    </div>
  );
}
