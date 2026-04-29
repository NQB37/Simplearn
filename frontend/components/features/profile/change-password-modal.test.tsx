import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChangePasswordModal } from './change-password-modal';

// Mock PasswordForm so we can control onSuccess invocation
vi.mock('./password-form', () => ({
  PasswordForm: ({ onSuccess }: { onSuccess?: () => void }) => (
    <button data-testid='mock-submit' onClick={onSuccess}>
      Submit
    </button>
  ),
}));

describe('ChangePasswordModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the trigger button', () => {
    render(<ChangePasswordModal />);
    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
  });

  it('dialog is closed by default', () => {
    render(<ChangePasswordModal />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the dialog when trigger button is clicked', async () => {
    render(<ChangePasswordModal />);
    fireEvent.click(screen.getByRole('button', { name: /change password/i }));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.getByRole('dialog')).toHaveTextContent('Change Password');
    expect(screen.getByText(/enter your current password/i)).toBeInTheDocument();
  });

  it('closes the dialog when PasswordForm calls onSuccess', async () => {
    render(<ChangePasswordModal />);

    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: /change password/i }));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Trigger the mock submit which calls onSuccess
    fireEvent.click(screen.getByTestId('mock-submit'));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
