'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubjects } from '@/hooks/use-academics';
import { AddSubjectModal } from './add-subject-modal';
import { EditSubjectModal } from './edit-subject-modal';
import { DeleteSubjectModal } from './delete-subject-modal';

export function SubjectsManager() {
  const { data: subjects = [], isLoading } = useSubjects();

  return (
    <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
      <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between'>
        <CardTitle className='text-lg font-bold'>Subjects Catalog</CardTitle>
        <AddSubjectModal />
      </CardHeader>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left align-middle'>
            <thead className='text-xs font-bold uppercase text-slate-500 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800'>
              <tr>
                <th className='px-4 py-3'>Code</th>
                <th className='px-4 py-3'>Name</th>
                <th className='px-4 py-3'>Credits</th>
                <th className='px-4 py-3 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800/80'>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className='p-4 text-center'>
                    Loading...
                  </td>
                </tr>
              ) : subjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className='p-4 text-center'>
                    No subjects found.
                  </td>
                </tr>
              ) : (
                subjects.map((s) => (
                  <tr
                    key={s._id}
                    className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group text-slate-900 dark:text-slate-100'
                  >
                    <td className='px-4 py-3 font-bold text-slate-700 dark:text-slate-300'>
                      {s.code}
                    </td>
                    <td className='px-4 py-3 font-semibold'>{s.name}</td>
                    <td className='px-4 py-3'>{s.credits}</td>
                    <td className='px-4 py-3 text-right space-x-2'>
                      <EditSubjectModal subject={s} />
                      <DeleteSubjectModal subject={s} />
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
