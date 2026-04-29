import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PasswordForm } from './password-form';

// Mock axios instance
vi.mock('@/api/axios.api', () => ({
  default: {
    patch: vi.fn(),
  },
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import axiosInstance from '@/api/axios.api';
import { toast } from 'sonner';

describe('PasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all password fields', () => {
    render(<PasswordForm />);
    expect(screen.getByPlaceholderText('Enter current password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
  });

  it('calls onSuccess after successful password change', async () => {
    const mockAxios = vi.mocked(axiosInstance);
    (mockAxios.patch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: {} });

    const onSuccess = vi.fn();
    render(<PasswordForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByPlaceholderText('Enter current password'), {
      target: { value: 'oldpassword' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter new password'), {
      target: { value: 'newpassword123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm new password'), {
      target: { value: 'newpassword123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });
    expect(toast.success).toHaveBeenCalledWith('Password changed successfully.');
  });

  it('does not call onSuccess when passwords do not match', async () => {
    const onSuccess = vi.fn();
    render(<PasswordForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByPlaceholderText('Enter current password'), {
      target: { value: 'oldpassword' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter new password'), {
      target: { value: 'newpassword123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm new password'), {
      target: { value: 'differentpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('does not call onSuccess on API error', async () => {
    const mockAxios = vi.mocked(axiosInstance);
    (mockAxios.patch as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
      response: { data: { message: 'Wrong password' } },
    });

    const onSuccess = vi.fn();
    render(<PasswordForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByPlaceholderText('Enter current password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter new password'), {
      target: { value: 'newpassword123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm new password'), {
      target: { value: 'newpassword123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Wrong password');
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('works without onSuccess prop (no crash)', async () => {
    const mockAxios = vi.mocked(axiosInstance);
    (mockAxios.patch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: {} });

    render(<PasswordForm />);

    fireEvent.change(screen.getByPlaceholderText('Enter current password'), {
      target: { value: 'oldpassword' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter new password'), {
      target: { value: 'newpassword123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm new password'), {
      target: { value: 'newpassword123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Password changed successfully.');
    });
  });
});
