import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CoursesPage from '@/app/instructor/courses/page';
import { Course } from '@/types/course.type';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({}),
}));

// Mock sonner toast
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

// Mock hooks
vi.mock('@/hooks/use-courses', () => ({
  useCourses: vi.fn(),
  useCourseMutations: vi.fn(),
}));

vi.mock('@/store/user.store', () => ({
  useUserStore: vi.fn(),
}));

import { useCourses, useCourseMutations } from '@/hooks/use-courses';
import { useUserStore } from '@/store/user.store';

const mockCourses: Course[] = [
  {
    _id: '1',
    title: 'My Course',
    slug: 'my-course',
    description: 'desc',
    subjectId: 'sub-1',
    instructorId: 'instructor-1',
    status: 'draft',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: '2',
    title: 'Other Course',
    slug: 'other-course',
    description: 'desc',
    subjectId: 'sub-2',
    instructorId: 'other-instructor',
    status: 'published',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

const mockDeleteMutation = { mutate: vi.fn(), isPending: false };

describe('CoursesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCourseMutations as ReturnType<typeof vi.fn>).mockReturnValue({
      deleteMutation: mockDeleteMutation,
    });
  });

  it('shows loading state when isLoading is true', () => {
    (useCourses as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    (useUserStore as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'instructor-1' });

    render(<CoursesPage />);
    expect(screen.getByText('Loading courses...')).toBeInTheDocument();
  });

  it('shows empty state when instructor has no courses', () => {
    (useCourses as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (useUserStore as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'instructor-1' });

    render(<CoursesPage />);
    expect(screen.getByText(/No courses yet/)).toBeInTheDocument();
  });

  it('only shows courses belonging to the current instructor', () => {
    (useCourses as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockCourses,
      isLoading: false,
    });
    (useUserStore as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'instructor-1' });

    render(<CoursesPage />);
    expect(screen.getByText('My Course')).toBeInTheDocument();
    expect(screen.queryByText('Other Course')).not.toBeInTheDocument();
  });

  it('shows table with correct column headers', () => {
    (useCourses as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockCourses,
      isLoading: false,
    });
    (useUserStore as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'instructor-1' });

    render(<CoursesPage />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Subject')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('shows draft badge for draft courses', () => {
    (useCourses as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockCourses,
      isLoading: false,
    });
    (useUserStore as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'instructor-1' });

    render(<CoursesPage />);
    expect(screen.getByText('draft')).toBeInTheDocument();
  });
});
