import { useState, useRef, useMemo } from 'react';
import Papa from 'papaparse';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { useBulkImportSubjects } from '@/hooks/use-academics';
import { useFaculties, useMajors } from '@/hooks/use-user';
import { BulkSubjectRow, BulkImportResult, TypeOfStudy, Semester } from '@/types/academics.type';

const VALID_TYPE_OF_STUDY: TypeOfStudy[] = ['bachelor', 'master', 'phd', 'associate', 'certificate'];
const VALID_SEMESTERS: Semester[] = ['first', 'second', 'summer'];

type RowStatus = 'valid' | 'invalid' | 'warning';

interface ParsedRow {
  raw: Record<string, string>;
  status: RowStatus;
  errors: string[];
  resolved: BulkSubjectRow | null;
}

function validateAndResolve(
  raw: Record<string, string>,
  majorMap: Map<string, string>,
  facultyMajorMap: Map<string, Set<string>>,
): ParsedRow {
  const errors: string[] = [];
  const name = (raw.name ?? '').trim();
  const code = (raw.code ?? '').trim();
  const creditsStr = (raw.credits ?? '').trim();
  const facultyName = (raw.facultyName ?? '').trim();
  const majorName = (raw.majorName ?? '').trim();
  const typeOfStudy = (raw.typeOfStudy ?? '').trim().toLowerCase();
  const studyYearStr = (raw.studyYear ?? '').trim();
  const semester = (raw.semester ?? '').trim().toLowerCase();

  if (!name) errors.push('name is required');
  if (!code) errors.push('code is required');

  const credits = parseInt(creditsStr, 10);
  if (!creditsStr || isNaN(credits) || credits < 1) errors.push('credits must be a positive integer');

  if (typeOfStudy && !VALID_TYPE_OF_STUDY.includes(typeOfStudy as TypeOfStudy))
    errors.push(`invalid typeOfStudy: ${typeOfStudy}`);

  if (semester && !VALID_SEMESTERS.includes(semester as Semester))
    errors.push(`invalid semester: ${semester}`);

  const studyYear = studyYearStr ? parseInt(studyYearStr, 10) : undefined;
  if (studyYearStr && (isNaN(studyYear!) || studyYear! < 1))
    errors.push('studyYear must be a positive integer');

  if (errors.length > 0) {
    return { raw, status: 'invalid', errors, resolved: null };
  }

  let majorId: string | undefined;
  let hasWarning = false;
  const warnings: string[] = [];

  if (facultyName) {
    const facultyMajors = facultyMajorMap.get(facultyName.toLowerCase());
    if (!facultyMajors) {
      hasWarning = true;
      warnings.push(`faculty "${facultyName}" not found`);
    } else if (majorName && !facultyMajors.has(majorName.toLowerCase())) {
      hasWarning = true;
      warnings.push(`major "${majorName}" not found in faculty "${facultyName}"`);
    }
  }

  if (majorName) {
    majorId = majorMap.get(majorName.toLowerCase());
    if (!majorId) {
      hasWarning = true;
      if (!warnings.some((w) => w.includes('major'))) {
        warnings.push(`major "${majorName}" not found`);
      }
    }
  }

  const resolved: BulkSubjectRow = {
    name,
    code,
    credits,
    ...(majorId && { majorId }),
    ...(typeOfStudy && { typeOfStudy: typeOfStudy as TypeOfStudy }),
    ...(studyYear && { studyYear }),
    ...(semester && { semester: semester as Semester }),
  };

  return {
    raw,
    status: hasWarning ? 'warning' : 'valid',
    errors: warnings,
    resolved,
  };
}

export function ImportSubjectsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: allFaculties = [] } = useFaculties();
  const { data: allMajors = [] } = useMajors();
  const bulkImport = useBulkImportSubjects();

  const majorMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of allMajors) {
      map.set(m.name.toLowerCase(), m._id);
    }
    return map;
  }, [allMajors]);

  const facultyMajorMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const f of allFaculties) {
      const majorsInFaculty = allMajors
        .filter((m) => m.facultyId === f._id)
        .map((m) => m.name.toLowerCase());
      map.set(f.name.toLowerCase(), new Set(majorsInFaculty));
    }
    return map;
  }, [allFaculties, allMajors]);

  const counts = useMemo(() => {
    const valid = rows.filter((r) => r.status === 'valid').length;
    const warning = rows.filter((r) => r.status === 'warning').length;
    const invalid = rows.filter((r) => r.status === 'invalid').length;
    return { valid, warning, invalid, importable: valid + warning };
  }, [rows]);

  const reset = () => {
    setStep(1);
    setRows([]);
    setResult(null);
    setFileName('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleClose = (open: boolean) => {
    if (!open) reset();
    setIsOpen(open);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = (results.data as Record<string, string>[]).map((raw) =>
          validateAndResolve(raw, majorMap, facultyMajorMap),
        );
        setRows(parsed);
        setStep(2);
      },
    });
  };

  const handleConfirm = () => {
    const importable = rows
      .filter((r) => r.status === 'valid' || r.status === 'warning')
      .map((r) => r.resolved!);

    bulkImport.mutate(importable, {
      onSuccess: (data) => {
        setResult(data);
        setStep(3);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button
          size='sm'
          variant='outline'
          className='h-8 text-xs rounded-lg'
        >
          <Upload className='h-4 w-4 mr-1' /> Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[720px] bg-zinc-900 border-zinc-700/50 text-zinc-100 p-0 gap-0 [&>button]:hidden'>
        {/* Header */}
        <div className='flex items-start justify-between px-6 pt-6 pb-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700/50'>
              <FileText className='h-5 w-5 text-zinc-400' />
            </div>
            <div>
              <h2 className='text-base font-semibold text-zinc-100'>
                Import Subjects from CSV
              </h2>
              <p className='text-xs text-zinc-500'>
                {step === 1 && 'Upload a CSV file with subject data'}
                {step === 2 && 'Review parsed rows before importing'}
                {step === 3 && 'Import complete'}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleClose(false)}
            className='text-zinc-500 hover:text-zinc-300 transition-colors'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <div className='px-6 pb-6'>
          {/* Step 1: Upload */}
          {step === 1 && (
            <div className='space-y-4'>
              <div className='border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center'>
                <Upload className='h-8 w-8 text-zinc-500 mx-auto mb-3' />
                <p className='text-sm text-zinc-400 mb-3'>
                  Select a CSV file with columns: name, code, credits, facultyName, majorName, typeOfStudy, studyYear, semester
                </p>
                <input
                  ref={fileRef}
                  type='file'
                  accept='.csv'
                  onChange={handleFileChange}
                  className='hidden'
                />
                <Button
                  variant='outline'
                  onClick={() => fileRef.current?.click()}
                  className='bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100'
                >
                  Choose File
                </Button>
                {fileName && (
                  <p className='text-xs text-zinc-500 mt-2'>{fileName}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 2 && (
            <div className='space-y-4'>
              {/* Summary */}
              <div className='flex gap-4 text-xs'>
                <span className='text-green-400'>{counts.valid} valid</span>
                <span className='text-yellow-400'>{counts.warning} warnings</span>
                <span className='text-red-400'>{counts.invalid} invalid</span>
              </div>

              {/* Table */}
              <div className='overflow-auto max-h-[360px] border border-zinc-700/50 rounded-lg'>
                <table className='w-full text-xs'>
                  <thead className='bg-zinc-800 sticky top-0'>
                    <tr>
                      <th className='px-3 py-2 text-left text-zinc-400 font-medium'>#</th>
                      <th className='px-3 py-2 text-left text-zinc-400 font-medium'>Status</th>
                      <th className='px-3 py-2 text-left text-zinc-400 font-medium'>Name</th>
                      <th className='px-3 py-2 text-left text-zinc-400 font-medium'>Code</th>
                      <th className='px-3 py-2 text-left text-zinc-400 font-medium'>Credits</th>
                      <th className='px-3 py-2 text-left text-zinc-400 font-medium'>Faculty</th>
                      <th className='px-3 py-2 text-left text-zinc-400 font-medium'>Major</th>
                      <th className='px-3 py-2 text-left text-zinc-400 font-medium'>Issues</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-zinc-800'>
                    {rows.map((row, i) => (
                      <tr
                        key={i}
                        className={
                          row.status === 'invalid'
                            ? 'bg-red-950/20'
                            : row.status === 'warning'
                              ? 'bg-yellow-950/20'
                              : ''
                        }
                      >
                        <td className='px-3 py-2 text-zinc-500'>{i + 1}</td>
                        <td className='px-3 py-2'>
                          {row.status === 'valid' && (
                            <CheckCircle className='h-3.5 w-3.5 text-green-400' />
                          )}
                          {row.status === 'warning' && (
                            <AlertTriangle className='h-3.5 w-3.5 text-yellow-400' />
                          )}
                          {row.status === 'invalid' && (
                            <AlertCircle className='h-3.5 w-3.5 text-red-400' />
                          )}
                        </td>
                        <td className='px-3 py-2 text-zinc-200'>{row.raw.name}</td>
                        <td className='px-3 py-2 text-zinc-200'>{row.raw.code}</td>
                        <td className='px-3 py-2 text-zinc-200'>{row.raw.credits}</td>
                        <td className='px-3 py-2 text-zinc-200'>{row.raw.facultyName}</td>
                        <td className='px-3 py-2 text-zinc-200'>{row.raw.majorName}</td>
                        <td className='px-3 py-2 text-zinc-400'>
                          {row.errors.join('; ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {counts.importable === 0 && (
                <p className='text-xs text-red-400'>No valid rows to import.</p>
              )}
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && result && (
            <div className='space-y-4'>
              <div className='flex gap-6 text-sm'>
                <div>
                  <span className='text-zinc-500'>Created: </span>
                  <span className='text-green-400 font-medium'>{result.created}</span>
                </div>
                <div>
                  <span className='text-zinc-500'>Skipped: </span>
                  <span className='text-yellow-400 font-medium'>{result.skipped}</span>
                </div>
                {result.errors.length > 0 && (
                  <div>
                    <span className='text-zinc-500'>Errors: </span>
                    <span className='text-red-400 font-medium'>{result.errors.length}</span>
                  </div>
                )}
              </div>

              {result.errors.length > 0 && (
                <div className='overflow-auto max-h-[240px] border border-zinc-700/50 rounded-lg'>
                  <table className='w-full text-xs'>
                    <thead className='bg-zinc-800 sticky top-0'>
                      <tr>
                        <th className='px-3 py-2 text-left text-zinc-400 font-medium'>Row</th>
                        <th className='px-3 py-2 text-left text-zinc-400 font-medium'>Code</th>
                        <th className='px-3 py-2 text-left text-zinc-400 font-medium'>Reason</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-zinc-800'>
                      {result.errors.map((err, i) => (
                        <tr key={i}>
                          <td className='px-3 py-2 text-zinc-500'>{err.row}</td>
                          <td className='px-3 py-2 text-zinc-200'>{err.code}</td>
                          <td className='px-3 py-2 text-zinc-400'>{err.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-2 px-6 py-4 border-t border-zinc-800'>
          {step === 2 && (
            <>
              <Button
                variant='outline'
                onClick={reset}
                className='bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 h-9 text-sm'
              >
                Back
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={counts.importable === 0 || bulkImport.isPending}
                className='bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm'
              >
                {bulkImport.isPending
                  ? 'Importing...'
                  : `Import ${counts.importable} subject(s)`}
              </Button>
            </>
          )}
          {step === 3 && (
            <Button
              onClick={() => handleClose(false)}
              className='bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm'
            >
              Done
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
