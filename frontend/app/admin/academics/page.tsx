'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import axiosInstance from '@/api/axios.api';

import { AcademicYear, Room, Subject, ClassModel } from '@/types/academics.type';
import { AddYearModal } from '@/components/features/academics/add-year-modal';
import { EditYearModal } from '@/components/features/academics/edit-year-modal';
import { DeleteYearModal } from '@/components/features/academics/delete-year-modal';
import { AddRoomModal } from '@/components/features/academics/add-room-modal';
import { EditRoomModal } from '@/components/features/academics/edit-room-modal';
import { DeleteRoomModal } from '@/components/features/academics/delete-room-modal';
import { AddSubjectModal } from '@/components/features/academics/add-subject-modal';
import { EditSubjectModal } from '@/components/features/academics/edit-subject-modal';
import { DeleteSubjectModal } from '@/components/features/academics/delete-subject-modal';
import { AddClassModal } from '@/components/features/academics/add-class-modal';
import { EditClassModal } from '@/components/features/academics/edit-class-modal';
import { DeleteClassModal } from '@/components/features/academics/delete-class-modal';

export default function AcademicsAdminPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAcademicYears = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_ACADEMY_SERVICE_URL}/api/academy/academic-years`,
      );
      setAcademicYears(data);
    } catch {
      toast.error('Failed to load academic years');
    }
  };

  const fetchRooms = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_ACADEMY_SERVICE_URL}/api/academy/rooms`,
      );
      setRooms(data);
    } catch {
      toast.error('Failed to load rooms');
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_ACADEMY_SERVICE_URL}/api/academy/subjects`,
      );
      setSubjects(data);
    } catch {
      toast.error('Failed to load subjects');
    }
  };

  const fetchClasses = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_ACADEMY_SERVICE_URL}/api/academy/classes`,
      );
      setClasses(data);
    } catch {
      toast.error('Failed to load classes');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAcademicYears(),
        fetchRooms(),
        fetchSubjects(),
        fetchClasses(),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

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

        <TabsContent value='academic-years' className='space-y-4'>
          <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
            <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between'>
              <CardTitle className='text-lg font-bold'>
                Academic Years
              </CardTitle>
              <AddYearModal onSuccess={fetchAcademicYears} />
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
                    {loading ? (
                      <tr>
                        <td colSpan={5} className='p-4 text-center'>
                          Loading...
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
                            <EditYearModal
                              year={yr}
                              onSuccess={fetchAcademicYears}
                            />
                            <DeleteYearModal
                              year={yr}
                              onSuccess={fetchAcademicYears}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='rooms' className='space-y-4'>
          <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
            <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between'>
              <CardTitle className='text-lg font-bold'>Class Rooms</CardTitle>
              <AddRoomModal onSuccess={fetchRooms} />
            </CardHeader>
            <CardContent className='p-0'>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm text-left align-middle'>
                  <thead className='text-xs font-bold uppercase text-slate-500 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800'>
                    <tr>
                      <th className='px-4 py-3'>Name</th>
                      <th className='px-4 py-3'>Capacity</th>
                      <th className='px-4 py-3'>Status</th>
                      <th className='px-4 py-3 text-right'>Actions</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-100 dark:divide-slate-800/80'>
                    {rooms.map((room) => (
                      <tr
                        key={room._id}
                        className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group text-slate-900 dark:text-slate-100'
                      >
                        <td className='px-4 py-3 font-semibold'>{room.name}</td>
                        <td className='px-4 py-3 font-medium text-slate-500'>
                          {room.capacity} seats
                        </td>
                        <td className='px-4 py-3'>
                          <Badge
                            variant={
                              room.status === 'active' ? 'default' : 'outline'
                            }
                            className={
                              room.status === 'active'
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                : 'text-amber-600'
                            }
                          >
                            {room.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className='px-4 py-3 text-right space-x-2'>
                          <EditRoomModal room={room} onSuccess={fetchRooms} />
                          <DeleteRoomModal room={room} onSuccess={fetchRooms} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='subjects' className='space-y-4'>
          <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
            <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between'>
              <CardTitle className='text-lg font-bold'>
                Subjects Catalog
              </CardTitle>
              <AddSubjectModal onSuccess={fetchSubjects} />
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
                    {subjects.map((s) => (
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
                          <EditSubjectModal
                            subject={s}
                            onSuccess={fetchSubjects}
                          />
                          <DeleteSubjectModal
                            subject={s}
                            onSuccess={fetchSubjects}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='classes' className='space-y-4'>
          <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
            <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between'>
              <CardTitle className='text-lg font-bold'>
                Active Classes
              </CardTitle>
              <AddClassModal
                onSuccess={fetchClasses}
                rooms={rooms}
                subjects={subjects}
                academicYears={academicYears}
              />
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
                    {classes.map((c) => (
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
                          <EditClassModal
                            classData={c}
                            onSuccess={fetchClasses}
                            rooms={rooms}
                            subjects={subjects}
                            academicYears={academicYears}
                          />
                          <DeleteClassModal
                            classData={c}
                            onSuccess={fetchClasses}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
