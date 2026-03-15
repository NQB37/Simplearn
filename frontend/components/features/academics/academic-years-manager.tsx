'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAcademicYears } from '@/hooks/use-academics';
import { AddYearModal } from './add-year-modal';
import { EditYearModal } from './edit-year-modal';
import { DeleteYearModal } from './delete-year-modal';

export function AcademicYearsManager() {
  const { data: academicYears = [], isLoading } = useAcademicYears();

  return (
    <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
      <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between'>
        <CardTitle className='text-lg font-bold'>Academic Years</CardTitle>
        <AddYearModal />
      </CardHeader>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left align-middle'>
            <thead className='text-xs font-bold uppercase text-slate-500 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800'>
              <tr>
                <th className='px-4 py-3'>Name</th>
                <th className='px-4 py-3'>Start Date</th>
                <th className='px-4 py-3'>End Date</th>
                <th className='px-4 py-3'>Status</th>
                <th className='px-4 py-3 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800/80'>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className='p-4 text-center'>
                    Loading...
                  </td>
                </tr>
              ) : academicYears.length === 0 ? (
                <tr>
                  <td colSpan={5} className='p-4 text-center'>
                    No academic years found.
                  </td>
                </tr>
              ) : (
                academicYears.map((yr) => (
                  <tr
                    key={yr._id}
                    className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group text-slate-900 dark:text-slate-100'
                  >
                    <td className='px-4 py-3 font-semibold'>{yr.name}</td>
                    <td className='px-4 py-3 font-medium text-slate-500'>
                      {yr.startDate}
                    </td>
                    <td className='px-4 py-3 font-medium text-slate-500'>
                      {yr.endDate}
                    </td>
                    <td className='px-4 py-3'>
                      {yr.isActive ? (
                        <Badge className='bg-emerald-100 text-emerald-800 border-none font-bold'>
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant='outline'
                          className='text-slate-500 font-bold'
                        >
                          Inactive
                        </Badge>
                      )}
                    </td>
                    <td className='px-4 py-3 text-right space-x-2'>
                      <EditYearModal year={yr} />
                      <DeleteYearModal year={yr} />
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
