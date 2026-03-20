import mongoose from 'mongoose';
import Subject, { ISubject } from '../models/subject.model.js';
import MajorSubject from '../models/major-subject.model.js';

export interface CurriculumFields {
  majorId?: string;
  studyYear?: number;
  semester?: 'first' | 'second' | 'summer';
  isMandatory?: boolean;
  typeOfStudy?: 'bachelor' | 'master' | 'phd' | 'associate' | 'certificate';
}

export interface SubjectFilters {
  typeOfStudy?: string;
  majorId?: string;
}

export const getSubjects = async (filters: SubjectFilters = {}) => {
  let subjectIdFilter: mongoose.Types.ObjectId[] | undefined;

  if (filters.typeOfStudy || filters.majorId) {
    const query: Record<string, unknown> = {};
    if (filters.typeOfStudy) query.typeOfStudy = filters.typeOfStudy;
    if (filters.majorId) query.majorId = new mongoose.Types.ObjectId(filters.majorId);
    const matchingEntries = await MajorSubject.find(query).select('subjectId');
    subjectIdFilter = matchingEntries.map((e) => e.subjectId as mongoose.Types.ObjectId);
  }

  const subjectQuery = subjectIdFilter ? { _id: { $in: subjectIdFilter } } : {};
  const subjects = await Subject.find(subjectQuery).populate('classIds');
  const subjectIds = subjects.map((s) => s._id);
  const curriculumEntries = await MajorSubject.find({ subjectId: { $in: subjectIds } });

  const curriculumBySubject = new Map<string, typeof curriculumEntries>();
  for (const entry of curriculumEntries) {
    const key = entry.subjectId.toString();
    if (!curriculumBySubject.has(key)) curriculumBySubject.set(key, []);
    curriculumBySubject.get(key)!.push(entry);
  }

  return subjects.map((subject) => {
    const obj = subject.toObject() as any;
    obj.curriculum = curriculumBySubject.get(subject._id.toString()) ?? [];
    return obj;
  });
};

export const createSubject = async (
  data: Partial<ISubject>,
  curriculum?: CurriculumFields,
) => {
  const newSubject = await new Subject(data).save();

  if (curriculum?.majorId) {
    await new MajorSubject({
      majorId: new mongoose.Types.ObjectId(curriculum.majorId),
      subjectId: newSubject._id,
      studyYear: curriculum.studyYear,
      semester: curriculum.semester,
      isMandatory: curriculum.isMandatory ?? true,
      typeOfStudy: curriculum.typeOfStudy,
    }).save();
  }

  return newSubject;
};

export const getSubjectById = async (id: string) => {
  return Subject.findById(id).populate('classIds');
};

export const updateSubject = async (
  id: string,
  data: Partial<ISubject>,
  curriculum?: CurriculumFields,
) => {
  const updatedSubject = await Subject.findByIdAndUpdate(id, data, { new: true }).populate('classIds');

  if (updatedSubject && curriculum?.majorId) {
    await MajorSubject.findOneAndUpdate(
      { subjectId: updatedSubject._id, majorId: new mongoose.Types.ObjectId(curriculum.majorId) },
      {
        studyYear: curriculum.studyYear,
        semester: curriculum.semester,
        isMandatory: curriculum.isMandatory ?? true,
        typeOfStudy: curriculum.typeOfStudy,
      },
      { upsert: true, new: true },
    );
  }

  return updatedSubject;
};

export interface BulkSubjectRow {
  name: string;
  code: string;
  credits: number;
  optional?: boolean;
  majorId?: string;
  typeOfStudy?: 'bachelor' | 'master' | 'phd' | 'associate' | 'certificate';
  studyYear?: number;
  semester?: 'first' | 'second' | 'summer';
}

export interface BulkImportResult {
  created: number;
  skipped: number;
  errors: { row: number; code: string; reason: string }[];
}

export const bulkCreateSubjects = async (rows: BulkSubjectRow[]): Promise<BulkImportResult> => {
  const existingSubjects = await Subject.find({}, { code: 1 }).lean();
  const existingCodes = new Set(existingSubjects.map((s) => s.code));

  let created = 0;
  let skipped = 0;
  const errors: BulkImportResult['errors'] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowIndex = i + 1;

    if (!row.name || !row.code || row.credits == null) {
      const missing = [!row.name && 'name', !row.code && 'code', row.credits == null && 'credits'].filter(Boolean).join(', ');
      errors.push({ row: rowIndex, code: row.code || '', reason: `Missing required field: ${missing}` });
      continue;
    }

    if (existingCodes.has(row.code)) {
      skipped++;
      errors.push({ row: rowIndex, code: row.code, reason: 'Duplicate subject code' });
      continue;
    }

    try {
      const curriculum: CurriculumFields | undefined = row.majorId
        ? { majorId: row.majorId, studyYear: row.studyYear, semester: row.semester, typeOfStudy: row.typeOfStudy }
        : undefined;

      await createSubject({ name: row.name, code: row.code, credits: row.credits, optional: row.optional ?? false }, curriculum);
      existingCodes.add(row.code);
      created++;
    } catch (err: any) {
      errors.push({ row: rowIndex, code: row.code, reason: err.message });
    }
  }

  return { created, skipped, errors };
};

export const deleteSubject = async (id: string) => {
  const deleted = await Subject.findByIdAndDelete(id);
  if (deleted) {
    await MajorSubject.deleteMany({ subjectId: deleted._id });
  }
  return deleted;
};
