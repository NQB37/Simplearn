export interface ShiftDefinition {
  shiftId: number;
  startTime: string;
  endTime: string;
}

export const SHIFTS: ShiftDefinition[] = [
  { shiftId: 1, startTime: '07:15', endTime: '08:45' },
  { shiftId: 2, startTime: '09:00', endTime: '10:30' },
  { shiftId: 3, startTime: '10:45', endTime: '12:15' },
  { shiftId: 4, startTime: '12:30', endTime: '14:00' },
  { shiftId: 5, startTime: '14:15', endTime: '15:45' },
  { shiftId: 6, startTime: '16:00', endTime: '17:30' },
  { shiftId: 7, startTime: '17:45', endTime: '19:15' },
];

export const SHIFT_IDS = SHIFTS.map((s) => s.shiftId);
export const DAYS_OF_WEEK = [1, 2, 3, 4, 5]; // Monday=1 through Friday=5
