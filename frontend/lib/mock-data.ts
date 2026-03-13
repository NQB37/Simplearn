import { Course } from '@/types/course.type';
import { User } from '@/types/index.type';

export const MOCK_USER: User = {
  id: "user-1",
  name: "Demo Instructor",
  email: "demo@example.com",
  role: "INSTRUCTOR",
  avatarUrl: "https://github.com/shadcn.png",
}

export const MOCK_COURSES: Course[] = [
  {
    id: "c1",
    title: "Mastering Next.js 14",
    description: "Learn to build full-stack applications with Next.js App Router, Server Actions and Postgres.",
    author: "Jane Doe",
    thumbnailUrl: "https://placehold.co/600x400?text=Next.js+14",
    lessonsCount: 12,
    price: 49.99,
    slug: "mastering-nextjs-14",
  },
  {
    id: "c2",
    title: "React Design Patterns",
    description: "Advanced patterns for building scalable React components and applications.",
    author: "John Smith",
    thumbnailUrl: "https://placehold.co/600x400?text=React+Patterns",
    lessonsCount: 8,
    price: 39.99,
    slug: "react-design-patterns",
  },
  {
    id: "c3",
    title: "UI/UX Fundamentals",
    description: "Principles of great design for developers.",
    author: "Alice Johnson",
    thumbnailUrl: "https://placehold.co/600x400?text=UI/UX+Design",
    lessonsCount: 15,
    slug: "ui-ux-fundamentals",
  },
]
