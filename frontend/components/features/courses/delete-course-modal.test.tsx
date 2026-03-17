import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteCourseModal } from './delete-course-modal';

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  slug: 'my-test-course',
  isPending: false,
  onConfirm: vi.fn(),
};

describe('DeleteCourseModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the warning message and slug', () => {
    render(<DeleteCourseModal {...defaultProps} />);
    expect(
      screen.getByText(/This action is irreversible/i),
    ).toBeInTheDocument();
    expect(screen.getByText('my-test-course')).toBeInTheDocument();
  });

  it('renders the confirm button as disabled when input is empty', () => {
    render(<DeleteCourseModal {...defaultProps} />);
    const button = screen.getByRole('button', { name: /delete course/i });
    expect(button).toBeDisabled();
  });

  it('keeps the confirm button disabled when input does not match slug', () => {
    render(<DeleteCourseModal {...defaultProps} />);
    const input = screen.getByLabelText(/course slug/i);
    fireEvent.change(input, { target: { value: 'wrong-slug' } });
    const button = screen.getByRole('button', { name: /delete course/i });
    expect(button).toBeDisabled();
  });

  it('enables the confirm button when input matches slug exactly', () => {
    render(<DeleteCourseModal {...defaultProps} />);
    const input = screen.getByLabelText(/course slug/i);
    fireEvent.change(input, { target: { value: 'my-test-course' } });
    const button = screen.getByRole('button', { name: /delete course/i });
    expect(button).not.toBeDisabled();
  });

  it('calls onConfirm when confirm button is clicked with matching slug', () => {
    render(<DeleteCourseModal {...defaultProps} />);
    const input = screen.getByLabelText(/course slug/i);
    fireEvent.change(input, { target: { value: 'my-test-course' } });
    const button = screen.getByRole('button', { name: /delete course/i });
    fireEvent.click(button);
    expect(defaultProps.onConfirm).toHaveBeenCalledOnce();
  });

  it('disables the confirm button and shows loading text when isPending', () => {
    render(<DeleteCourseModal {...defaultProps} isPending={true} />);
    const input = screen.getByLabelText(/course slug/i);
    fireEvent.change(input, { target: { value: 'my-test-course' } });
    const button = screen.getByRole('button', { name: /deleting/i });
    expect(button).toBeDisabled();
  });

  it('clears the input when modal is closed and reopened', () => {
    const { rerender } = render(<DeleteCourseModal {...defaultProps} />);
    const input = screen.getByLabelText(/course slug/i);
    fireEvent.change(input, { target: { value: 'my-test-course' } });
    expect((input as HTMLInputElement).value).toBe('my-test-course');

    rerender(<DeleteCourseModal {...defaultProps} open={false} />);
    rerender(<DeleteCourseModal {...defaultProps} open={true} />);
    const freshInput = screen.getByLabelText(/course slug/i);
    expect((freshInput as HTMLInputElement).value).toBe('');
  });
});
