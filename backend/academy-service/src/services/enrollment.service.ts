import AcademicYear from '../models/academy-year.model.js';
import MajorSubject from '../models/major-subject.model.js';
import Enrollment from '../models/enrollment.model.js';
import Class from '../models/class.model.js';
import { checkStudentConflicts } from './conflict-detection.service.js';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8001';

async function fetchStudentProfile(token: string) {
  const res = await fetch(`${USER_SERVICE_URL}/profile/extended`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch student profile');
  }
  return res.json() as Promise<any>;
}

export const getEligibleSubjects = async (token: string) => {
  const activeYear = await AcademicYear.findOne({ isActive: true });
  if (!activeYear) {
    const err: any = new Error('No active academic year found');
    err.statusCode = 404;
    throw err;
  }

  const profile = await fetchStudentProfile(token);
  const studentData = profile?.studentData;
  const majorId = studentData?.majorId;
  const startYear = studentData?.startYear;

  if (!majorId || !startYear) {
    const err: any = new Error('Student profile missing majorId or startYear');
    err.statusCode = 422;
    throw err;
  }

  const currentYear = activeYear.startDate.getFullYear() - startYear + 1;

  const entries = await MajorSubject.find({
    majorId,
    studyYear: { $lte: currentYear },
    semester: activeYear.semester,
  }).populate('subjectId');

  return {
    enrollmentDeadline: activeYear.enrollmentDeadline ?? null,
    academicYearId: activeYear._id,
    subjects: entries,
  };
};

export const getMyEnrollments = async (userId: string) => {
  const enrollments = await Enrollment.find({ userId })
    .populate({ path: 'classId', populate: [{ path: 'roomId' }, { path: 'subjectId' }] })
    .populate('academicYearId');
  return enrollments;
};

export const enrollStudent = async (userId: string, classId: string) => {
  // Fetch the class to get subjectId, academicYearId, and capacity
  const cls = await Class.findById(classId);
  if (!cls) {
    const err: any = new Error('Class not found');
    err.statusCode = 404;
    throw err;
  }

  // Check for shift conflicts
  const conflictResult = await checkStudentConflicts(userId, classId);
  if (conflictResult.hasConflict) {
    const err: any = new Error('Schedule conflict: student is already enrolled in a class at the same time');
    err.statusCode = 409;
    err.conflicts = conflictResult.conflicts;
    throw err;
  }

  // Atomic capacity check: increment currentEnrollments only if under maxCapacity
  const updated = await Class.findOneAndUpdate(
    { _id: classId, currentEnrollments: { $lt: cls.maxCapacity } },
    { $inc: { currentEnrollments: 1 } },
    { new: true },
  );

  if (!updated) {
    const err: any = new Error('Class is full');
    err.statusCode = 409;
    throw err;
  }

  try {
    const enrollment = await Enrollment.create({
      classId,
      subjectId: cls.subjectId,
      academicYearId: cls.academicYearId,
      userId,
    });
    return enrollment;
  } catch (err: any) {
    // Roll back capacity increment if enrollment creation fails (e.g. duplicate)
    await Class.findByIdAndUpdate(classId, { $inc: { currentEnrollments: -1 } });
    if (err.code === 11000) {
      const conflict: any = new Error('Already enrolled in this subject for the current academic year');
      conflict.statusCode = 409;
      throw conflict;
    }
    throw err;
  }
};

export const bulkEnroll = async (
  userId: string,
  subjectIds: string[],
  academicYearId: string,
) => {
  const activeYear = await AcademicYear.findById(academicYearId);
  if (!activeYear) {
    const err: any = new Error('Academic year not found');
    err.statusCode = 404;
    throw err;
  }

  if (activeYear.enrollmentDeadline && new Date() > activeYear.enrollmentDeadline) {
    const err: any = new Error('Enrollment period has ended');
    err.statusCode = 400;
    throw err;
  }

  await Enrollment.deleteMany({ userId, academicYearId });

  const docs = subjectIds.map((subjectId) => ({ userId, subjectId, academicYearId }));
  const inserted = await Enrollment.insertMany(docs);

  return inserted;
};
