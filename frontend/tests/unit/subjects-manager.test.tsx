import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SubjectsManager } from '@/components/features/academics/subjects-manager';
import { SubjectWithCurriculum } from '@/types/academics.type';

// Mock Shadcn Select with native <select> so fireEvent.change works in jsdom
vi.mock('@/components/ui/select', () => ({
  Select: ({ value, onValueChange, children }: any) => (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      data-testid='select'
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: any) => <>{children}</>,
  SelectValue: () => null,
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ value, children }: any) => <option value={value}>{children}</option>,
}));

vi.mock('@/hooks/use-academics', () => ({
  useSubjects: vi.fn(),
}));

vi.mock('@/hooks/use-user', () => ({
  useMajors: vi.fn(),
  useFaculties: vi.fn(),
}));

vi.mock('@/components/features/academics/add-subject-modal', () => ({
  AddSubjectModal: () => <button>Add Subject</button>,
}));

vi.mock('@/components/features/academics/edit-subject-modal', () => ({
  EditSubjectModal: () => <button>Edit</button>,
}));

vi.mock('@/components/features/academics/delete-subject-modal', () => ({
  DeleteSubjectModal: () => <button>Delete</button>,
}));

import { useSubjects } from '@/hooks/use-academics';
import { useMajors, useFaculties } from '@/hooks/use-user';

const mockFieldsOfStudy = [
  { _id: 'fos-1', name: 'Science & Technology' },
  { _id: 'fos-2', name: 'Business' },
];

const mockMajors = [
  { _id: 'major-1', name: 'Computer Science', facultyId: 'fos-1' },
  { _id: 'major-2', name: 'Mathematics', facultyId: 'fos-1' },
  { _id: 'major-3', name: 'Finance', facultyId: 'fos-2' },
];

const mockSubjects: SubjectWithCurriculum[] = [
  {
    _id: 'sub-1',
    name: 'Algorithms',
    code: 'CS101',
    credits: 4,
    curriculum: [
      {
        _id: 'cur-1',
        majorId: 'major-1',
        studyYear: 2,
        semester: 'first',
        isMandatory: true,
        typeOfStudy: 'bachelor',
      },
    ],
  },
  {
    _id: 'sub-2',
    name: 'Advanced Math',
    code: 'MATH201',
    credits: 3,
    curriculum: [
      {
        _id: 'cur-2',
        majorId: 'major-2',
        studyYear: 1,
        semester: 'second',
        isMandatory: false,
        typeOfStudy: 'master',
      },
    ],
  },
  {
    _id: 'sub-3',
    name: 'Corporate Finance',
    code: 'FIN101',
    credits: 3,
    curriculum: [
      {
        _id: 'cur-3',
        majorId: 'major-3',
        studyYear: 1,
        semester: 'summer',
        isMandatory: true,
        typeOfStudy: 'bachelor',
      },
    ],
  },
  {
    _id: 'sub-4',
    name: 'No Curriculum',
    code: 'NC001',
    credits: 2,
    curriculum: [],
  },
];

function setupMocks(subjects = mockSubjects, isLoading = false) {
  (useSubjects as ReturnType<typeof vi.fn>).mockReturnValue({ data: subjects, isLoading });
  (useMajors as ReturnType<typeof vi.fn>).mockReturnValue({ data: mockMajors });
  (useFaculties as ReturnType<typeof vi.fn>).mockReturnValue({ data: mockFieldsOfStudy });
}

/** Get the two filter <select> elements: [typeOfStudy, faculty] */
function getFilterSelects() {
  return screen.getAllByTestId('select');
}

describe('SubjectsManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state', () => {
    setupMocks([], true);
    render(<SubjectsManager />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows empty state when no subjects', () => {
    setupMocks([]);
    render(<SubjectsManager />);
    expect(screen.getByText('No subjects found.')).toBeInTheDocument();
  });

  it('renders all expected column headers', () => {
    setupMocks();
    render(<SubjectsManager />);
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('Course Name')).toBeInTheDocument();
    expect(screen.getByText('Credits')).toBeInTheDocument();
    expect(screen.getByText('Major')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Semester')).toBeInTheDocument();
    expect(screen.getByText('Type of Study')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('displays subject data with resolved major name and curriculum info', () => {
    setupMocks();
    render(<SubjectsManager />);
    expect(screen.getByText('CS101')).toBeInTheDocument();
    expect(screen.getByText('Algorithms')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
    expect(screen.getByText('First')).toBeInTheDocument();
    // Two bachelor subjects exist — use getAllByText
    const bachelorCells = screen.getAllByText('bachelor');
    expect(bachelorCells.length).toBe(2);
  });

  it('shows dashes for subjects without curriculum entries', () => {
    setupMocks();
    render(<SubjectsManager />);
    const dashCells = screen.getAllByText('-');
    expect(dashCells.length).toBeGreaterThanOrEqual(4);
  });

  it('renders two filter select dropdowns', () => {
    setupMocks();
    render(<SubjectsManager />);
    expect(getFilterSelects().length).toBe(2);
  });

  it('filters by type of study: bachelor shows only bachelor subjects', () => {
    setupMocks();
    render(<SubjectsManager />);

    const [typeSelect] = getFilterSelects();
    fireEvent.change(typeSelect, { target: { value: 'bachelor' } });

    expect(screen.getByText('Algorithms')).toBeInTheDocument();
    expect(screen.getByText('Corporate Finance')).toBeInTheDocument();
    expect(screen.queryByText('Advanced Math')).not.toBeInTheDocument();
    // NC001 has no curriculum so typeOfStudy is undefined — filtered out
    expect(screen.queryByText('No Curriculum')).not.toBeInTheDocument();
  });

  it('filters by type of study: master shows only master subjects', () => {
    setupMocks();
    render(<SubjectsManager />);

    const [typeSelect] = getFilterSelects();
    fireEvent.change(typeSelect, { target: { value: 'master' } });

    expect(screen.getByText('Advanced Math')).toBeInTheDocument();
    expect(screen.queryByText('Algorithms')).not.toBeInTheDocument();
    expect(screen.queryByText('Corporate Finance')).not.toBeInTheDocument();
  });

  it('filters by faculty: Science & Technology shows CS and Math subjects', () => {
    setupMocks();
    render(<SubjectsManager />);

    const [, facultySelect] = getFilterSelects();
    fireEvent.change(facultySelect, { target: { value: 'fos-1' } });

    expect(screen.getByText('Algorithms')).toBeInTheDocument();
    expect(screen.getByText('Advanced Math')).toBeInTheDocument();
    expect(screen.queryByText('Corporate Finance')).not.toBeInTheDocument();
  });

  it('filters by faculty: Business shows only Finance subject', () => {
    setupMocks();
    render(<SubjectsManager />);

    const [, facultySelect] = getFilterSelects();
    fireEvent.change(facultySelect, { target: { value: 'fos-2' } });

    expect(screen.getByText('Corporate Finance')).toBeInTheDocument();
    expect(screen.queryByText('Algorithms')).not.toBeInTheDocument();
    expect(screen.queryByText('Advanced Math')).not.toBeInTheDocument();
  });

  it('applies AND logic when both filters are active', () => {
    setupMocks();
    render(<SubjectsManager />);

    const [typeSelect, facultySelect] = getFilterSelects();

    // Filter by bachelor
    fireEvent.change(typeSelect, { target: { value: 'bachelor' } });
    // Filter by Science & Technology (fos-1)
    fireEvent.change(facultySelect, { target: { value: 'fos-1' } });

    // Only Algorithms is bachelor AND belongs to fos-1
    expect(screen.getByText('Algorithms')).toBeInTheDocument();
    // Corporate Finance is bachelor but fos-2
    expect(screen.queryByText('Corporate Finance')).not.toBeInTheDocument();
    // Advanced Math is master + fos-1
    expect(screen.queryByText('Advanced Math')).not.toBeInTheDocument();
  });

  it('resetting type filter to All shows all subjects again', () => {
    setupMocks();
    render(<SubjectsManager />);

    const [typeSelect] = getFilterSelects();

    // Apply bachelor filter
    fireEvent.change(typeSelect, { target: { value: 'bachelor' } });
    expect(screen.queryByText('Advanced Math')).not.toBeInTheDocument();

    // Reset to All sentinel value
    fireEvent.change(typeSelect, { target: { value: '__all__' } });
    expect(screen.getByText('Advanced Math')).toBeInTheDocument();
  });

  it('shows empty state when filters produce no results', () => {
    const bachelorOnly: SubjectWithCurriculum[] = [
      {
        _id: 'sub-1',
        name: 'Algorithms',
        code: 'CS101',
        credits: 4,
        curriculum: [
          {
            _id: 'cur-1',
            majorId: 'major-1',
            studyYear: 2,
            semester: 'first',
            isMandatory: true,
            typeOfStudy: 'bachelor',
          },
        ],
      },
    ];
    setupMocks(bachelorOnly);
    render(<SubjectsManager />);

    const [typeSelect] = getFilterSelects();
    fireEvent.change(typeSelect, { target: { value: 'master' } });

    expect(screen.getByText('No subjects found.')).toBeInTheDocument();
  });
});
