import { ClassForm } from '@/components/features/academics/class-form';

export default function CreateClassPage() {
  return (
    <div className='max-w-4xl space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-slate-900 dark:text-slate-50'>Create Class</h1>
        <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
          Schedule a new class by selecting a room, time slots, and an available instructor.
        </p>
      </div>
      <ClassForm />
    </div>
  );
}
