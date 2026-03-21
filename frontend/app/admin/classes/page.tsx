import { ClassesManager } from '@/components/features/academics/classes-manager';
import { CreateClassModal } from '@/components/features/academics/create-class-modal';

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
        <CreateClassModal />
      </div>
      <ClassesManager />
    </div>
  );
}
