import AcademicYear from '../models/academy-year.model.js';
import MajorSubject from '../models/major-subject.model.js';
import Enrollment from '../models/enrollment.model.js';

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
  const enrollments = await Enrollment.find({ userId }).populate('subjectId').populate('academicYearId');
  return enrollments;
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
