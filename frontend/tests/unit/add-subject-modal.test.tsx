import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddSubjectModal } from '@/components/features/academics/add-subject-modal';

vi.mock('@/hooks/use-academics', () => ({
  useSubjectMutations: vi.fn(),
}));

vi.mock('@/hooks/use-user', () => ({
  useFaculties: vi.fn(),
  useMajors: vi.fn(),
}));

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

import { useSubjectMutations } from '@/hooks/use-academics';
import { useFaculties, useMajors } from '@/hooks/use-user';
import { toast } from 'sonner';

const mockCreateMutation = { mutate: vi.fn(), isPending: false };

const mockFieldsOfStudy = [
  { _id: 'fos-1', name: 'Engineering' },
  { _id: 'fos-2', name: 'Arts' },
];

const mockMajors = [
  { _id: 'major-1', name: 'Computer Science', facultyId: 'fos-1' },
  { _id: 'major-2', name: 'Electrical Engineering', facultyId: 'fos-1' },
];

describe('AddSubjectModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSubjectMutations as ReturnType<typeof vi.fn>).mockReturnValue({
      createMutation: mockCreateMutation,
    });
    (useFaculties as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockFieldsOfStudy,
    });
    (useMajors as ReturnType<typeof vi.fn>).mockReturnValue({ data: mockMajors });
  });

  const openModal = () => {
    render(<AddSubjectModal />);
    fireEvent.click(screen.getByRole('button', { name: /add subject/i }));
  };

  it('renders the trigger button', () => {
    render(<AddSubjectModal />);
    expect(screen.getByRole('button', { name: /add subject/i })).toBeInTheDocument();
  });

  it('opens the dialog when trigger is clicked', () => {
    openModal();
    expect(screen.getByText('Add Subject to Catalog')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    openModal();
    expect(screen.getByLabelText('Subject Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Credits')).toBeInTheDocument();
    expect(screen.getByText('Faculty')).toBeInTheDocument();
    expect(screen.getByText('Major')).toBeInTheDocument();
    expect(screen.getByText('Study Year')).toBeInTheDocument();
    expect(screen.getByText('Semester')).toBeInTheDocument();
    expect(screen.getByText('Type of Study')).toBeInTheDocument();
  });

  it('shows error toast when required fields are empty', () => {
    openModal();
    fireEvent.click(screen.getByRole('button', { name: /^save$/i }));
    expect(toast.error).toHaveBeenCalledWith('Please fill in all fields correctly');
    expect(mockCreateMutation.mutate).not.toHaveBeenCalled();
  });

  it('calls createMutation.mutate with correct payload when form is valid', () => {
    openModal();
    fireEvent.change(screen.getByLabelText('Subject Name'), {
      target: { value: 'Algorithms' },
    });
    fireEvent.change(screen.getByLabelText('Subject Code'), {
      target: { value: 'CS101' },
    });
    fireEvent.change(screen.getByLabelText('Credits'), {
      target: { value: '4' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^save$/i }));
    expect(mockCreateMutation.mutate).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Algorithms', code: 'CS101', credits: 4 }),
      expect.any(Object)
    );
  });

  it('shows pending state on save button when mutation is pending', () => {
    (useSubjectMutations as ReturnType<typeof vi.fn>).mockReturnValue({
      createMutation: { ...mockCreateMutation, isPending: true },
    });
    openModal();
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });
});
