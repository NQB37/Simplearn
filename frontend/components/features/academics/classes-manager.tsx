'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClasses } from '@/hooks/use-academics';
import { AddClassModal } from './add-class-modal';
import { EditClassModal } from './edit-class-modal';
import { DeleteClassModal } from './delete-class-modal';
import { Subject, Room, AcademicYear } from '@/types/academics.type';

export function ClassesManager() {
  const { data: classes = [], isLoading } = useClasses();

  return (
    <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
      <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between'>
        <CardTitle className='text-lg font-bold'>Active Classes</CardTitle>
        <AddClassModal />
      </CardHeader>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left align-middle'>
            <thead className='text-xs font-bold uppercase text-slate-500 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800'>
              <tr>
                <th className='px-4 py-3'>Class Code</th>
                <th className='px-4 py-3'>Subject</th>
                <th className='px-4 py-3'>Room</th>
                <th className='px-4 py-3'>Year</th>
                <th className='px-4 py-3'>Max Cap</th>
                <th className='px-4 py-3 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800/80'>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className='p-4 text-center'>
                    Loading...
                  </td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td colSpan={6} className='p-4 text-center'>
                    No classes found.
                  </td>
                </tr>
              ) : (
                classes.map((c) => (
                  <tr
                    key={c._id}
                    className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group text-slate-900 dark:text-slate-100'
                  >
                    <td className='px-4 py-3 font-bold text-slate-700 dark:text-slate-300'>
                      {c.code}
                    </td>
                    <td className='px-4 py-3 font-semibold'>
                      {typeof c.subjectId === 'string'
                        ? c.subjectId
                        : (c.subjectId as Subject).name}
                    </td>
                    <td className='px-4 py-3 font-medium text-slate-500'>
                      {typeof c.roomId === 'string'
                        ? c.roomId
                        : (c.roomId as Room).name}
                    </td>
                    <td className='px-4 py-3 text-slate-500'>
                      {typeof c.academicYearId === 'string'
                        ? c.academicYearId
                        : (c.academicYearId as AcademicYear).name}
                    </td>
                    <td className='px-4 py-3'>{c.maxCapacity}</td>
                    <td className='px-4 py-3 text-right space-x-2'>
                      <EditClassModal classData={c} />
                      <DeleteClassModal classData={c} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
