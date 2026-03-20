'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFaculties, useMajors } from '@/hooks/use-user';
import {
  useCurriculum,
  useCurriculumMutations,
  useSubjects,
} from '@/hooks/use-academics';
import {
  Semester,
  MajorSubject,
  Subject,
  TypeOfStudy,
  STUDY_YEAR_LIMITS,
} from '@/types/academics.type';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Trash2, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';

const TYPE_OF_STUDY_OPTIONS: { value: TypeOfStudy; label: string }[] = [
  { value: 'bachelor', label: 'Bachelor' },
  { value: 'master', label: 'Master' },
  { value: 'phd', label: 'PhD' },
  { value: 'associate', label: 'Associate' },
  { value: 'certificate', label: 'Certificate' },
];

const DEFAULT_YEAR_COUNT = 4;

const SEMESTERS: { key: Semester; label: string }[] = [
  { key: 'first', label: 'First Semester' },
  { key: 'second', label: 'Second Semester' },
  { key: 'summer', label: 'Summer Semester' },
];

interface AddSubjectDialogProps {
  majorId: string;
  studyYear: number;
  semester: Semester;
  open: boolean;
  onClose: () => void;
}

function AddSubjectDialog({
  majorId,
  studyYear,
  semester,
  open,
  onClose,
}: AddSubjectDialogProps) {
  const { data: subjects = [] } = useSubjects();
  const { addMutation } = useCurriculumMutations();
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [isMandatory, setIsMandatory] = useState(true);

  const handleAdd = () => {
    if (!selectedSubjectId) return;
    addMutation.mutate(
      {
        majorId,
        subjectId: selectedSubjectId,
        studyYear,
        semester,
        isMandatory,
      },
      {
        onSuccess: () => {
          setSelectedSubjectId('');
          setIsMandatory(true);
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle>Add Subject</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <Label>Subject</Label>
            <Select
              value={selectedSubjectId}
              onValueChange={setSelectedSubjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a subject' />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s: Subject) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name} ({s.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='is-mandatory'
              checked={isMandatory}
              onChange={(e) => setIsMandatory(e.target.checked)}
              className='w-4 h-4'
            />
            <Label htmlFor='is-mandatory' className='cursor-pointer'>
              Mandatory
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedSubjectId || addMutation.isPending}
          >
            {addMutation.isPending ? 'Adding...' : 'Add Subject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface SemesterBlockProps {
  majorId: string;
  studyYear: number;
  semester: Semester;
  semesterLabel: string;
  entries: MajorSubject[];
}

function SemesterBlock({
  majorId,
  studyYear,
  semester,
  semesterLabel,
  entries,
}: SemesterBlockProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { deleteMutation } = useCurriculumMutations();

  return (
    <div className='border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex flex-col gap-3 bg-white dark:bg-slate-900'>
      <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
        {semesterLabel}
      </h3>

      {entries.length === 0 ? (
        <p className='text-xs text-slate-400 italic'>No Subjects Assigned</p>
      ) : (
        <ul className='flex flex-col gap-1'>
          {entries.map((entry) => (
            <li
              key={entry._id}
              className='flex items-center justify-between text-sm text-slate-800 dark:text-slate-200'
            >
              <span>
                {(entry.subjectId as Subject).name}
                {!entry.isMandatory && (
                  <span className='ml-1 text-xs text-slate-400'>
                    (Optional)
                  </span>
                )}
              </span>
              <button
                onClick={() =>
                  deleteMutation.mutate({ id: entry._id, majorId })
                }
                className='text-red-400 hover:text-red-600 ml-2 shrink-0'
                title='Remove subject'
              >
                <Trash2 className='h-3.5 w-3.5' />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Button
        size='sm'
        variant='outline'
        className='mt-auto text-xs h-7'
        onClick={() => setDialogOpen(true)}
      >
        <Plus className='h-3 w-3 mr-1' /> Add Subject
      </Button>

      <AddSubjectDialog
        majorId={majorId}
        studyYear={studyYear}
        semester={semester}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}

export default function CurriculumPage() {
  const { data: faculties = [], isLoading: facultiesLoading } = useFaculties();
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(
    null,
  );
  const [selectedTypeOfStudy, setSelectedTypeOfStudy] =
    useState<TypeOfStudy | null>(null);
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(null);

  const { data: majors = [], isLoading: majorsLoading } = useMajors(
    selectedFacultyId ?? undefined,
  );
  const { data: curriculum = [], isLoading: curriculumLoading } = useCurriculum(
    selectedMajorId,
    selectedTypeOfStudy,
  );

  const yearCount = selectedTypeOfStudy
    ? STUDY_YEAR_LIMITS[selectedTypeOfStudy]
    : DEFAULT_YEAR_COUNT;
  const studyYears = Array.from({ length: yearCount }, (_, i) => i + 1);

  function getEntries(studyYear: number, semester: Semester): MajorSubject[] {
    return curriculum.filter(
      (e) => e.studyYear === studyYear && e.semester === semester,
    );
  }

  const handleFacultyChange = (val: string) => {
    setSelectedFacultyId(val || null);
    setSelectedMajorId(null);
  };

  const handleTypeOfStudyChange = (val: string) => {
    setSelectedTypeOfStudy((val as TypeOfStudy) || null);
  };

  return (
    <div className='max-w-full mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50'>
          Curriculum
        </h1>
        <p className='text-slate-500 dark:text-slate-400 mt-1'>
          Build the subject curriculum for each major.
        </p>
      </div>

      <div className='flex flex-wrap items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Label className='shrink-0 font-semibold'>Type of Study</Label>
          <Select
            value={selectedTypeOfStudy ?? ''}
            onValueChange={handleTypeOfStudyChange}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='All types' />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OF_STUDY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2'>
          <Label className='shrink-0 font-semibold'>Faculty</Label>
          <Select
            value={selectedFacultyId ?? ''}
            onValueChange={handleFacultyChange}
            disabled={facultiesLoading}
          >
            <SelectTrigger className='w-[220px]'>
              <SelectValue
                placeholder={facultiesLoading ? 'Loading...' : 'All faculties'}
              />
            </SelectTrigger>
            <SelectContent>
              {faculties.map((f) => (
                <SelectItem key={f._id} value={f._id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2'>
          <Label className='shrink-0 font-semibold'>Major</Label>
          <Select
            value={selectedMajorId ?? ''}
            onValueChange={(val) => setSelectedMajorId(val || null)}
            disabled={majorsLoading}
          >
            <SelectTrigger className='w-[280px]'>
              <SelectValue
                placeholder={majorsLoading ? 'Loading...' : 'Select a major'}
              />
            </SelectTrigger>
            <SelectContent>
              {majors.map((m) => (
                <SelectItem key={m._id} value={m._id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedMajorId && (
        <div className='space-y-8'>
          {curriculumLoading ? (
            <p className='text-slate-500'>Loading curriculum...</p>
          ) : (
            studyYears.map((year) => (
              <div key={year}>
                <h2 className='text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4'>
                  Year {year}
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {SEMESTERS.map(({ key, label }) => (
                    <SemesterBlock
                      key={key}
                      majorId={selectedMajorId}
                      studyYear={year}
                      semester={key}
                      semesterLabel={label}
                      entries={getEntries(year, key)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!selectedMajorId && !majorsLoading && (
        <p className='text-slate-400'>
          Select a major above to view and edit its curriculum.
        </p>
      )}
    </div>
  );
}
