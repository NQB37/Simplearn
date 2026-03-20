import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  BookOpen,
  Hash,
  GraduationCap,
  CalendarDays,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSubjectMutations } from '@/hooks/use-academics';
import { useFaculties, useMajors } from '@/hooks/use-user';
import {
  Semester,
  TypeOfStudy,
  STUDY_YEAR_LIMITS,
} from '@/types/academics.type';

const TYPE_OF_STUDY_LABELS: Record<TypeOfStudy, string> = {
  bachelor: 'Bachelor',
  master: 'Master',
  phd: 'PhD',
  associate: 'Associate',
  certificate: 'Certificate',
};

export function AddSubjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    credits: 3,
    facultyId: '',
    majorId: '',
    typeOfStudy: '' as TypeOfStudy | '',
    studyYear: '' as number | '',
    semester: '' as Semester | '',
  });

  const { createMutation } = useSubjectMutations();
  const { data: faculties = [] } = useFaculties();
  const { data: majors = [] } = useMajors(
    subjectForm.facultyId || undefined,
  );

  const maxYears = subjectForm.typeOfStudy
    ? STUDY_YEAR_LIMITS[subjectForm.typeOfStudy]
    : 0;

  const handleFacultyChange = (value: string) => {
    setSubjectForm({ ...subjectForm, facultyId: value, majorId: '' });
  };

  const handleTypeOfStudyChange = (value: string) => {
    const newMax = STUDY_YEAR_LIMITS[value as TypeOfStudy] ?? 0;
    setSubjectForm({
      ...subjectForm,
      typeOfStudy: value as TypeOfStudy,
      studyYear:
        subjectForm.studyYear && (subjectForm.studyYear as number) > newMax
          ? ''
          : subjectForm.studyYear,
    });
  };

  const handleSave = async () => {
    if (!subjectForm.name || !subjectForm.code || subjectForm.credits < 0) {
      toast.error('Please fill in all fields correctly');
      return;
    }

    const payload: Parameters<typeof createMutation.mutate>[0] = {
      name: subjectForm.name,
      code: subjectForm.code,
      credits: subjectForm.credits,
      ...(subjectForm.majorId && { majorId: subjectForm.majorId }),
      ...(subjectForm.studyYear !== '' && {
        studyYear: subjectForm.studyYear as number,
      }),
      ...(subjectForm.semester && { semester: subjectForm.semester }),
      ...(subjectForm.typeOfStudy && { typeOfStudy: subjectForm.typeOfStudy }),
      isMandatory: true,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        setSubjectForm({
          name: '',
          code: '',
          credits: 3,
          facultyId: '',
          majorId: '',
          typeOfStudy: '',
          studyYear: '',
          semester: '',
        });
        setIsOpen(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size='sm'
          className='bg-blue-600 hover:bg-blue-700 text-white font-bold h-8 text-xs rounded-lg'
        >
          <Plus className='h-4 w-4 mr-1' /> Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[560px] bg-zinc-900 border-zinc-700/50 text-zinc-100 p-0 gap-0 [&>button]:hidden'>
        {/* Header */}
        <div className='flex items-start justify-between px-6 pt-6 pb-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700/50'>
              <BookOpen className='h-5 w-5 text-zinc-400' />
            </div>
            <div>
              <h2 className='text-base font-semibold text-zinc-100'>
                Add Subject to Catalog
              </h2>
              <p className='text-xs text-zinc-500'>
                Add a subject to the course catalog
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className='text-zinc-500 hover:text-zinc-300 transition-colors'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <div className='px-6 pb-6 space-y-5'>
          {/* Basic Information */}
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <Hash className='h-3.5 w-3.5 text-zinc-500' />
              <span className='text-xs font-medium text-zinc-400 uppercase tracking-wide'>
                Basic Information
              </span>
            </div>
            <div className='grid grid-cols-6 gap-3'>
              <div className='col-span-3 flex flex-col gap-1.5'>
                <Label htmlFor='subject-name' className='text-xs text-zinc-400'>
                  Subject Name <span className='text-red-400'>*</span>
                </Label>
                <Input
                  id='subject-name'
                  placeholder='e.g., Mathematics I'
                  value={subjectForm.name}
                  onChange={(e) =>
                    setSubjectForm({ ...subjectForm, name: e.target.value })
                  }
                  className='bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 h-9 text-sm focus-visible:ring-zinc-600'
                />
              </div>
              <div className='col-span-2 flex flex-col gap-1.5'>
                <Label htmlFor='subject-code' className='text-xs text-zinc-400'>
                  Subject Code <span className='text-red-400'>*</span>
                </Label>
                <Input
                  id='subject-code'
                  placeholder='e.g., MATH101'
                  value={subjectForm.code}
                  onChange={(e) =>
                    setSubjectForm({ ...subjectForm, code: e.target.value })
                  }
                  className='bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 h-9 text-sm focus-visible:ring-zinc-600'
                />
              </div>
              <div className='col-span-1 flex flex-col gap-1.5'>
                <Label htmlFor='subject-credits' className='text-xs text-zinc-400'>Credits</Label>
                <Input
                  id='subject-credits'
                  type='number'
                  placeholder='3'
                  value={subjectForm.credits}
                  onChange={(e) =>
                    setSubjectForm({
                      ...subjectForm,
                      credits: parseInt(e.target.value) || 0,
                    })
                  }
                  className='bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 h-9 text-sm focus-visible:ring-zinc-600'
                />
              </div>
            </div>
          </div>

          {/* Academic Association */}
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <GraduationCap className='h-3.5 w-3.5 text-zinc-500' />
              <span className='text-xs font-medium text-zinc-400 uppercase tracking-wide'>
                Academic Association
              </span>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='flex flex-col gap-1.5'>
                <Label className='text-xs text-zinc-400'>Faculty</Label>
                <Select
                  value={subjectForm.facultyId}
                  onValueChange={handleFacultyChange}
                >
                  <SelectTrigger className='bg-zinc-800 border-zinc-700 text-zinc-100 h-9 w-full text-sm [&>span]:text-zinc-500 focus:ring-zinc-600'>
                    <SelectValue placeholder='Select faculty' />
                  </SelectTrigger>
                  <SelectContent className='bg-zinc-800 border-zinc-700'>
                    {faculties.map((f) => (
                      <SelectItem
                        key={f._id}
                        value={f._id}
                        className='text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100'
                      >
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-1.5'>
                <Label className='text-xs text-zinc-400'>Major</Label>
                <Select
                  value={subjectForm.majorId}
                  onValueChange={(value) =>
                    setSubjectForm({ ...subjectForm, majorId: value })
                  }
                  disabled={!subjectForm.facultyId}
                >
                  <SelectTrigger className='bg-zinc-800 border-zinc-700 text-zinc-100 h-9 w-full text-sm [&>span]:text-zinc-500 focus:ring-zinc-600 disabled:opacity-40'>
                    <SelectValue placeholder='Select major' />
                  </SelectTrigger>
                  <SelectContent className='bg-zinc-800 border-zinc-700'>
                    {majors.map((m) => (
                      <SelectItem
                        key={m._id}
                        value={m._id}
                        className='text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100'
                      >
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Schedule Details */}
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <CalendarDays className='h-3.5 w-3.5 text-zinc-500' />
              <span className='text-xs font-medium text-zinc-400 uppercase tracking-wide'>
                Schedule Details
              </span>
            </div>
            <div className='grid grid-cols-3 gap-3'>
              <div className='flex flex-col gap-1.5'>
                <Label className='text-xs text-zinc-400'>Type of Study</Label>
                <Select
                  value={subjectForm.typeOfStudy}
                  onValueChange={handleTypeOfStudyChange}
                >
                  <SelectTrigger className='bg-zinc-800 border-zinc-700 text-zinc-100 h-9 w-full text-sm [&>span]:text-zinc-500 focus:ring-zinc-600'>
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent className='bg-zinc-800 border-zinc-700'>
                    {Object.entries(TYPE_OF_STUDY_LABELS).map(
                      ([value, label]) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className='text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100'
                        >
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-1.5'>
                <Label className='text-xs text-zinc-400'>Study Year</Label>
                <Select
                  value={
                    subjectForm.studyYear === ''
                      ? ''
                      : String(subjectForm.studyYear)
                  }
                  onValueChange={(value) =>
                    setSubjectForm({
                      ...subjectForm,
                      studyYear: parseInt(value),
                    })
                  }
                  disabled={!subjectForm.typeOfStudy}
                >
                  <SelectTrigger className='bg-zinc-800 border-zinc-700 text-zinc-100 h-9 w-full text-sm [&>span]:text-zinc-500 focus:ring-zinc-600 disabled:opacity-40'>
                    <SelectValue placeholder='Select year' />
                  </SelectTrigger>
                  <SelectContent className='bg-zinc-800 border-zinc-700'>
                    {Array.from({ length: maxYears }, (_, i) => i + 1).map(
                      (year) => (
                        <SelectItem
                          key={year}
                          value={String(year)}
                          className='text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100'
                        >
                          Year {year}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-1.5'>
                <Label className='text-xs text-zinc-400'>Semester</Label>
                <Select
                  value={subjectForm.semester}
                  onValueChange={(value) =>
                    setSubjectForm({
                      ...subjectForm,
                      semester: value as Semester,
                    })
                  }
                >
                  <SelectTrigger className='bg-zinc-800 border-zinc-700 text-zinc-100 h-9 w-full text-sm [&>span]:text-zinc-500 focus:ring-zinc-600'>
                    <SelectValue placeholder='Select semester' />
                  </SelectTrigger>
                  <SelectContent className='bg-zinc-800 border-zinc-700'>
                    <SelectItem
                      value='first'
                      className='text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100'
                    >
                      First
                    </SelectItem>
                    <SelectItem
                      value='second'
                      className='text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100'
                    >
                      Second
                    </SelectItem>
                    <SelectItem
                      value='summer'
                      className='text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100'
                    >
                      Summer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-2 px-6 py-4 border-t border-zinc-800'>
          <Button
            variant='outline'
            onClick={() => setIsOpen(false)}
            className='bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 h-9 text-sm'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className='bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm'
          >
            {createMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
