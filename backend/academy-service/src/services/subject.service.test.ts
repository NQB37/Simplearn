import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';

const subjectSaveMock = vi.fn();
const majorSubjectSaveMock = vi.fn();

vi.mock('../models/subject.model.js', () => {
  function SubjectMock(data: any) {
    Object.assign(this as any, data);
    (this as any)._id = data._id ?? new mongoose.Types.ObjectId();
    (this as any).save = subjectSaveMock;
  }
  SubjectMock.find = vi.fn();
  SubjectMock.findById = vi.fn();
  SubjectMock.findByIdAndUpdate = vi.fn();
  SubjectMock.findByIdAndDelete = vi.fn();
  return { default: SubjectMock };
});

vi.mock('../models/major-subject.model.js', () => {
  function MajorSubjectMock(data: any) {
    Object.assign(this as any, data);
    (this as any)._id = new mongoose.Types.ObjectId();
    (this as any).save = majorSubjectSaveMock;
  }
  MajorSubjectMock.find = vi.fn();
  MajorSubjectMock.findOneAndUpdate = vi.fn();
  MajorSubjectMock.deleteMany = vi.fn();
  return { default: MajorSubjectMock };
});

import Subject from '../models/subject.model.js';
import MajorSubject from '../models/major-subject.model.js';
import * as subjectService from './subject.service.js';

const subjectId = new mongoose.Types.ObjectId();
const majorId = new mongoose.Types.ObjectId();

const makeSubjectDoc = (overrides: any = {}) => ({
  _id: subjectId,
  name: 'Math',
  code: 'MATH101',
  credits: 3,
  toObject: function () {
    return { _id: this._id, name: this.name, code: this.code, credits: this.credits };
  },
  ...overrides,
});

describe('subjectService.getSubjects', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns subjects with empty curriculum arrays when no MajorSubject entries exist', async () => {
    const subjectDoc = makeSubjectDoc();
    (Subject.find as any).mockReturnValue({ populate: vi.fn().mockResolvedValue([subjectDoc]) });
    (MajorSubject.find as any).mockResolvedValue([]);

    const result = await subjectService.getSubjects();

    expect(result).toHaveLength(1);
    expect(result[0].curriculum).toEqual([]);
  });

  it('attaches curriculum entries to matching subjects', async () => {
    const subjectDoc = makeSubjectDoc();
    const curriculumEntry = {
      _id: new mongoose.Types.ObjectId(),
      subjectId: subjectId,
      majorId,
      studyYear: 1,
      semester: 'first',
      isMandatory: true,
    };

    (Subject.find as any).mockReturnValue({ populate: vi.fn().mockResolvedValue([subjectDoc]) });
    (MajorSubject.find as any).mockResolvedValue([curriculumEntry]);

    const result = await subjectService.getSubjects();

    expect(result[0].curriculum).toHaveLength(1);
    expect(result[0].curriculum[0].majorId).toEqual(majorId);
  });

  it('does not attach curriculum entries from other subjects', async () => {
    const subjectDoc = makeSubjectDoc();
    const otherId = new mongoose.Types.ObjectId();
    const curriculumEntry = {
      _id: new mongoose.Types.ObjectId(),
      subjectId: otherId,
      majorId,
      studyYear: 1,
      semester: 'first',
      isMandatory: true,
    };

    (Subject.find as any).mockReturnValue({ populate: vi.fn().mockResolvedValue([subjectDoc]) });
    (MajorSubject.find as any).mockResolvedValue([curriculumEntry]);

    const result = await subjectService.getSubjects();

    expect(result[0].curriculum).toEqual([]);
  });

  it('queries MajorSubject with typeOfStudy filter and restricts subjects to matching ids', async () => {
    const subjectDoc = makeSubjectDoc();
    const matchingEntry = { subjectId: subjectId };

    // First call: .find(query).select('subjectId') for the filter pre-query
    // Second call: .find({ subjectId: { $in: ... } }) for curriculum attachment
    (MajorSubject.find as any)
      .mockReturnValueOnce({ select: vi.fn().mockResolvedValue([matchingEntry]) })
      .mockResolvedValueOnce([]);

    (Subject.find as any).mockReturnValue({ populate: vi.fn().mockResolvedValue([subjectDoc]) });

    const result = await subjectService.getSubjects({ typeOfStudy: 'bachelor' });

    expect(result).toHaveLength(1);
    const firstFindCall = (MajorSubject.find as any).mock.calls[0][0];
    expect(firstFindCall.typeOfStudy).toBe('bachelor');
    const subjectFindCall = (Subject.find as any).mock.calls[0][0];
    expect(subjectFindCall._id.$in[0].toString()).toBe(subjectId.toString());
  });

  it('queries MajorSubject with majorId filter and restricts subjects to matching ids', async () => {
    const subjectDoc = makeSubjectDoc();
    const matchingEntry = { subjectId: subjectId };

    (MajorSubject.find as any)
      .mockReturnValueOnce({ select: vi.fn().mockResolvedValue([matchingEntry]) })
      .mockResolvedValueOnce([]);

    (Subject.find as any).mockReturnValue({ populate: vi.fn().mockResolvedValue([subjectDoc]) });

    await subjectService.getSubjects({ majorId: majorId.toString() });

    const firstFindCall = (MajorSubject.find as any).mock.calls[0][0];
    expect(firstFindCall.majorId.toString()).toBe(majorId.toString());
  });

  it('applies both typeOfStudy and majorId filters together', async () => {
    (MajorSubject.find as any)
      .mockReturnValueOnce({ select: vi.fn().mockResolvedValue([]) })
      .mockResolvedValueOnce([]);

    (Subject.find as any).mockReturnValue({ populate: vi.fn().mockResolvedValue([]) });

    await subjectService.getSubjects({ typeOfStudy: 'master', majorId: majorId.toString() });

    const firstFindCall = (MajorSubject.find as any).mock.calls[0][0];
    expect(firstFindCall.typeOfStudy).toBe('master');
    expect(firstFindCall.majorId.toString()).toBe(majorId.toString());
  });

  it('returns empty array when no subjects match the filter', async () => {
    (MajorSubject.find as any)
      .mockReturnValueOnce({ select: vi.fn().mockResolvedValue([]) })
      .mockResolvedValueOnce([]);

    (Subject.find as any).mockReturnValue({ populate: vi.fn().mockResolvedValue([]) });

    const result = await subjectService.getSubjects({ typeOfStudy: 'phd' });

    expect(result).toHaveLength(0);
    const subjectFindCall = (Subject.find as any).mock.calls[0][0];
    expect(subjectFindCall._id.$in).toHaveLength(0);
  });

  it('skips MajorSubject pre-query and fetches all subjects when no filters provided', async () => {
    const subjectDoc = makeSubjectDoc();
    (Subject.find as any).mockReturnValue({ populate: vi.fn().mockResolvedValue([subjectDoc]) });
    (MajorSubject.find as any).mockResolvedValue([]);

    await subjectService.getSubjects({});

    // MajorSubject.find called exactly once (for curriculum attachment, not for pre-filtering)
    expect((MajorSubject.find as any).mock.calls).toHaveLength(1);
    // Subject.find called with empty query (all subjects)
    const subjectFindCall = (Subject.find as any).mock.calls[0][0];
    expect(subjectFindCall).toEqual({});
  });
});

describe('subjectService.createSubject', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates subject without MajorSubject when no majorId provided', async () => {
    const savedSubject = makeSubjectDoc();
    subjectSaveMock.mockResolvedValue(savedSubject);

    await subjectService.createSubject({ name: 'Math', code: 'MATH101', credits: 3 });

    expect(subjectSaveMock).toHaveBeenCalledOnce();
    expect(majorSubjectSaveMock).not.toHaveBeenCalled();
  });

  it('creates subject and MajorSubject when majorId provided', async () => {
    const savedSubject = { _id: subjectId, name: 'Math' };
    subjectSaveMock.mockResolvedValue(savedSubject);
    majorSubjectSaveMock.mockResolvedValue({});

    await subjectService.createSubject(
      { name: 'Math', code: 'MATH101', credits: 3 },
      { majorId: majorId.toString(), studyYear: 1, semester: 'first', isMandatory: true },
    );

    expect(subjectSaveMock).toHaveBeenCalledOnce();
    expect(majorSubjectSaveMock).toHaveBeenCalledOnce();
  });

  it('defaults isMandatory to true when not specified', async () => {
    const savedSubject = { _id: subjectId, name: 'Math' };
    subjectSaveMock.mockResolvedValue(savedSubject);
    majorSubjectSaveMock.mockResolvedValue({});

    await subjectService.createSubject(
      { name: 'Math', code: 'MATH101', credits: 3 },
      { majorId: majorId.toString(), studyYear: 1, semester: 'second' },
    );

    // Verify MajorSubject was constructed with isMandatory: true (default)
    expect(majorSubjectSaveMock).toHaveBeenCalledOnce();
  });
});

describe('subjectService.updateSubject', () => {
  beforeEach(() => vi.clearAllMocks());

  it('updates subject without touching MajorSubject when no majorId provided', async () => {
    const updatedDoc = makeSubjectDoc({ name: 'Updated Math' });
    (Subject.findByIdAndUpdate as any).mockReturnValue({
      populate: vi.fn().mockResolvedValue(updatedDoc),
    });

    await subjectService.updateSubject(subjectId.toString(), { name: 'Updated Math' });

    expect(MajorSubject.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('upserts MajorSubject when curriculum fields provided', async () => {
    const updatedDoc = makeSubjectDoc();
    (Subject.findByIdAndUpdate as any).mockReturnValue({
      populate: vi.fn().mockResolvedValue(updatedDoc),
    });
    (MajorSubject.findOneAndUpdate as any).mockResolvedValue({});

    await subjectService.updateSubject(
      subjectId.toString(),
      { name: 'Math' },
      { majorId: majorId.toString(), studyYear: 2, semester: 'second', isMandatory: false },
    );

    expect(MajorSubject.findOneAndUpdate).toHaveBeenCalledOnce();
    const [filter, update, options] = (MajorSubject.findOneAndUpdate as any).mock.calls[0];
    expect(filter.subjectId.toString()).toBe(subjectId.toString());
    expect(filter.majorId.toString()).toBe(majorId.toString());
    expect(update.studyYear).toBe(2);
    expect(update.semester).toBe('second');
    expect(update.isMandatory).toBe(false);
    expect(options.upsert).toBe(true);
  });

  it('returns null when subject not found and does not call MajorSubject.findOneAndUpdate', async () => {
    (Subject.findByIdAndUpdate as any).mockReturnValue({
      populate: vi.fn().mockResolvedValue(null),
    });

    const result = await subjectService.updateSubject(subjectId.toString(), { name: 'X' });

    expect(result).toBeNull();
    expect(MajorSubject.findOneAndUpdate).not.toHaveBeenCalled();
  });
});

describe('subjectService.deleteSubject', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deletes subject and all associated MajorSubject entries', async () => {
    const deletedDoc = makeSubjectDoc();
    (Subject.findByIdAndDelete as any).mockResolvedValue(deletedDoc);
    (MajorSubject.deleteMany as any).mockResolvedValue({ deletedCount: 2 });

    const result = await subjectService.deleteSubject(subjectId.toString());

    expect(result).toEqual(deletedDoc);
    expect(MajorSubject.deleteMany).toHaveBeenCalledWith({ subjectId: deletedDoc._id });
  });

  it('does not call MajorSubject.deleteMany when subject not found', async () => {
    (Subject.findByIdAndDelete as any).mockResolvedValue(null);

    const result = await subjectService.deleteSubject(subjectId.toString());

    expect(result).toBeNull();
    expect(MajorSubject.deleteMany).not.toHaveBeenCalled();
  });
});
