'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AcademicYearsManager } from '@/components/features/academics/academic-years-manager';
import { RoomsManager } from '@/components/features/academics/rooms-manager';
import { SubjectsManager } from '@/components/features/academics/subjects-manager';
import { ClassesManager } from '@/components/features/academics/classes-manager';

export default function AcademicsAdminPage() {
  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
            Academics Management
          </h1>
          <p className='text-slate-500 dark:text-slate-400 font-medium'>
            Manage Academic Years, Rooms, Classes, and Subjects.
          </p>
        </div>
      </div>

      <Tabs defaultValue='academic-years' className='w-full'>
        <TabsList className='grid grid-cols-4 w-full md:w-[600px] bg-slate-100 dark:bg-slate-900 mb-6'>
          <TabsTrigger value='academic-years'>Academic Years</TabsTrigger>
          <TabsTrigger value='rooms'>Rooms</TabsTrigger>
          <TabsTrigger value='subjects'>Subjects</TabsTrigger>
          <TabsTrigger value='classes'>Classes</TabsTrigger>
        </TabsList>

        <TabsContent value='academic-years'>
          <AcademicYearsManager />
        </TabsContent>

        <TabsContent value='rooms'>
          <RoomsManager />
        </TabsContent>

        <TabsContent value='subjects'>
          <SubjectsManager />
        </TabsContent>

        <TabsContent value='classes'>
          <ClassesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
