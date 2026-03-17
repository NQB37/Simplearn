export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  subjectId: string;
  instructorId: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoursePayload {
  title: string;
  slug: string;
  description: string;
  subjectId: string;
}

export interface Module {
  _id: string;
  courseId: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
