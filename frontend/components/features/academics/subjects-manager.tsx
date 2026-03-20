'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSubjects } from '@/hooks/use-academics';
import { useFaculties, useMajors } from '@/hooks/use-user';
import { TypeOfStudy } from '@/types/academics.type';
import { AddSubjectModal } from './add-subject-modal';
import { ImportSubjectsModal } from './import-subjects-modal';
import { EditSubjectModal } from './edit-subject-modal';
import { DeleteSubjectModal } from './delete-subject-modal';

const TYPE_OF_STUDY_LABELS: Record<TypeOfStudy, string> = {
  bachelor: 'Bachelor',
  master: 'Master',
  phd: 'PhD',
  associate: 'Associate',
  certificate: 'Certificate',
};

const ALL = '__all__';

export function SubjectsManager() {
  const [filterTypeOfStudy, setFilterTypeOfStudy] = useState(ALL);
  const [filterFacultyId, setFilterFacultyId] = useState(ALL);
  const [filterMajorId, setFilterMajorId] = useState(ALL);

  const { data: subjects = [], isLoading } = useSubjects();
  const { data: allMajors = [] } = useMajors();
  const { data: faculties = [] } = useFaculties();

  const getMajorName = (majorId: string) =>
    allMajors.find((m) => m._id === majorId)?.name ?? majorId;

  const getFacultyName = (majorId: string) => {
    const major = allMajors.find((m) => m._id === majorId);
    if (!major?.facultyId) return '-';
    return faculties.find((f) => f._id === major.facultyId)?.name ?? '-';
  };

  const formatSemester = (semester: string) =>
    semester.charAt(0).toUpperCase() + semester.slice(1);

  const availableMajors = filterFacultyId === ALL
    ? allMajors
    : allMajors.filter((m) => m.facultyId === filterFacultyId);

  const filteredSubjects = subjects.filter((s) => {
    if (filterTypeOfStudy !== ALL && s.curriculum?.[0]?.typeOfStudy !== filterTypeOfStudy)
      return false;
    if (filterFacultyId !== ALL) {
      const facultyMajorIds = allMajors
        .filter((m) => m.facultyId === filterFacultyId)
        .map((m) => m._id);
      if (!facultyMajorIds.includes(s.curriculum?.[0]?.majorId ?? '')) return false;
    }
    if (filterMajorId !== ALL && s.curriculum?.[0]?.majorId !== filterMajorId)
      return false;
    return true;
  });

  return (
    <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
      <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between'>
        <CardTitle className='text-lg font-bold'>Subjects Catalog</CardTitle>
        <div className='flex items-center gap-2'>
          <ImportSubjectsModal />
          <AddSubjectModal />
        </div>
      </CardHeader>

      <div className='px-4 py-3 bg-slate-50 border-b border-slate-100 dark:bg-slate-900/60 dark:border-slate-800 flex flex-wrap gap-4 items-end'>
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Type of Study</label>
          <Select value={filterTypeOfStudy} onValueChange={setFilterTypeOfStudy}>
            <SelectTrigger className='w-48 h-8 text-xs'>
              <SelectValue placeholder='Type of Study' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All</SelectItem>
              {Object.entries(TYPE_OF_STUDY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Faculty</label>
          <Select value={filterFacultyId} onValueChange={(v) => { setFilterFacultyId(v); setFilterMajorId(ALL); }}>
            <SelectTrigger className='w-48 h-8 text-xs'>
              <SelectValue placeholder='Faculty' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All</SelectItem>
              {faculties.map((f) => (
                <SelectItem key={f._id} value={f._id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Major</label>
          <Select value={filterMajorId} onValueChange={setFilterMajorId}>
            <SelectTrigger className='w-48 h-8 text-xs'>
              <SelectValue placeholder='Major' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All</SelectItem>
              {availableMajors.map((m) => (
                <SelectItem key={m._id} value={m._id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left align-middle'>
            <thead className='text-xs font-bold uppercase text-slate-500 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800'>
              <tr>
                <th className='px-4 py-3'>Code</th>
                <th className='px-4 py-3'>Course Name</th>
                <th className='px-4 py-3'>Credits</th>
                <th className='px-4 py-3'>Faculty</th>
                <th className='px-4 py-3'>Major</th>
                <th className='px-4 py-3'>Year</th>
                <th className='px-4 py-3'>Semester</th>
                <th className='px-4 py-3'>Type of Study</th>
                <th className='px-4 py-3 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800/80'>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className='p-4 text-center'>
                    Loading...
                  </td>
                </tr>
              ) : filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan={9} className='p-4 text-center'>
                    No subjects found.
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((s) => {
                  const entry = s.curriculum?.[0];
                  return (
                    <tr
                      key={s._id}
                      className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group text-slate-900 dark:text-slate-100'
                    >
                      <td className='px-4 py-3 font-bold text-slate-700 dark:text-slate-300'>
                        {s.code}
                      </td>
                      <td className='px-4 py-3 font-semibold'>{s.name}</td>
                      <td className='px-4 py-3'>{s.credits}</td>
                      <td className='px-4 py-3'>
                        {entry?.majorId ? getFacultyName(entry.majorId) : '-'}
                      </td>
                      <td className='px-4 py-3'>
                        {entry?.majorId ? getMajorName(entry.majorId) : '-'}
                      </td>
                      <td className='px-4 py-3'>{entry?.studyYear ?? '-'}</td>
                      <td className='px-4 py-3'>
                        {entry?.semester ? formatSemester(entry.semester) : '-'}
                      </td>
                      <td className='px-4 py-3 capitalize'>
                        {entry?.typeOfStudy ?? '-'}
                      </td>
                      <td className='px-4 py-3 text-right space-x-2'>
                        <EditSubjectModal subject={s} />
                        <DeleteSubjectModal subject={s} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
