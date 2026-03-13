export interface Course {
  id: string;
  title: string;
  description: string;
  author: string;
  thumbnailUrl: string;
  lessonsCount: number;
  price?: number;
  slug: string;
}
