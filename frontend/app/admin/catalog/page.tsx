'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type Course = {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
};

export default function AdminCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Advanced Docker',
      author: 'Sarah K.',
      category: 'DevOps',
      status: 'PUBLISHED',
      createdAt: '2026-02-12',
    },
    {
      id: '2',
      title: 'Kubernetes Crash Course',
      author: 'Sarah K.',
      category: 'DevOps',
      status: 'DRAFT',
      createdAt: '2026-02-21',
    },
    {
      id: '3',
      title: 'Figma Mastery',
      author: 'Leo M.',
      category: 'Design',
      status: 'PUBLISHED',
      createdAt: '2026-01-05',
    },
  ]);

  const handleDelete = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    toast.success('Course deleted manually by Admin.');
  };

  const handleUnpublish = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'DRAFT' } : c)),
    );
    toast.success('Course unpublished. Needs author review.');
  };

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
            Master Course Catalog
          </h1>
          <p className='text-slate-500 dark:text-slate-400 font-medium'>
            Global view of all created content on Simplearn.
          </p>
        </div>
      </div>

      <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
        <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between'>
          <CardTitle className='text-lg font-bold'>All Modules</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left align-middle'>
              <thead className='text-xs font-bold uppercase text-slate-500 bg-slate-50/50 dark:bg-slate-900/50 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800'>
                <tr>
                  <th className='px-6 py-4'>Title</th>
                  <th className='px-6 py-4'>Author</th>
                  <th className='px-6 py-4'>Category</th>
                  <th className='px-6 py-4'>Status</th>
                  <th className='px-6 py-4 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 dark:divide-slate-800/80'>
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group'
                  >
                    <td className='px-6 py-4 font-semibold text-slate-900 dark:text-slate-100'>
                      {course.title}
                    </td>
                    <td className='px-6 py-4 font-medium text-slate-500'>
                      {course.author}
                    </td>
                    <td className='px-6 py-4'>
                      <Badge
                        variant='outline'
                        className='font-bold rounded-lg text-slate-500 dark:text-slate-400'
                      >
                        {course.category}
                      </Badge>
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`text-xs font-bold flex items-center gap-1 ${course.status === 'PUBLISHED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}
                      >
                        {course.status === 'PUBLISHED' ? (
                          <Eye className='h-3 w-3' />
                        ) : (
                          <Lock className='h-3 w-3' />
                        )}
                        {course.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                      {course.status === 'PUBLISHED' && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleUnpublish(course.id)}
                          className='h-8 text-xs font-bold rounded-lg border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-400 dark:hover:bg-amber-900/30'
                        >
                          Unpublish
                        </Button>
                      )}
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDelete(course.id)}
                        className='h-8 w-8 p-0 rounded-lg border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-500 dark:hover:bg-red-900/30'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
