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

export type ContentBlock =
  | { _id: string; type: 'text'; body: string }
  | { _id: string; type: 'image'; url: string; altText?: string }
  | { _id: string; type: 'document'; path: string; fullPath: string; originalName: string; size: number; mimeType: string };

export interface Lesson {
  _id: string;
  moduleId: string;
  title: string;
  order: number;
  contents: ContentBlock[];
  createdAt: string;
  updatedAt: string;
}
