import mongoose from 'mongoose';
import Class from '../models/class.model.js';
import { DAYS_OF_WEEK, SHIFT_IDS } from '../constants/shifts.js';

export interface ScheduleSlot {
  dayOfWeek: number;
  shiftId: number;
}

export interface ConflictResult {
  hasConflict: boolean;
  conflicts: Array<{
    type: 'room' | 'instructor';
    dayOfWeek: number;
    shiftId: number;
    classCode: string;
  }>;
}

export const checkRoomConflicts = async (
  roomId: string,
  academicYearId: string,
  schedules: ScheduleSlot[],
  excludeClassId?: string,
): Promise<ConflictResult> => {
  const query: any = {
    roomId: new mongoose.Types.ObjectId(roomId),
    academicYearId: new mongoose.Types.ObjectId(academicYearId),
    'schedules.dayOfWeek': { $in: schedules.map((s) => s.dayOfWeek) },
    'schedules.shiftId': { $in: schedules.map((s) => s.shiftId) },
  };
  if (excludeClassId) {
    query._id = { $ne: new mongoose.Types.ObjectId(excludeClassId) };
  }

  const existing = await Class.find(query).select('code schedules').lean();
  const conflicts: ConflictResult['conflicts'] = [];

  for (const cls of existing) {
    for (const slot of cls.schedules) {
      const isConflict = schedules.some(
        (s) => s.dayOfWeek === slot.dayOfWeek && s.shiftId === slot.shiftId,
      );
      if (isConflict) {
        conflicts.push({
          type: 'room',
          dayOfWeek: slot.dayOfWeek,
          shiftId: slot.shiftId,
          classCode: cls.code,
        });
      }
    }
  }

  return { hasConflict: conflicts.length > 0, conflicts };
};

export const checkInstructorConflicts = async (
  instructorId: string,
  academicYearId: string,
  schedules: ScheduleSlot[],
  excludeClassId?: string,
): Promise<ConflictResult> => {
  const query: any = {
    instructorId: new mongoose.Types.ObjectId(instructorId),
    academicYearId: new mongoose.Types.ObjectId(academicYearId),
    'schedules.dayOfWeek': { $in: schedules.map((s) => s.dayOfWeek) },
    'schedules.shiftId': { $in: schedules.map((s) => s.shiftId) },
  };
  if (excludeClassId) {
    query._id = { $ne: new mongoose.Types.ObjectId(excludeClassId) };
  }

  const existing = await Class.find(query).select('code schedules').lean();
  const conflicts: ConflictResult['conflicts'] = [];

  for (const cls of existing) {
    for (const slot of cls.schedules) {
      const isConflict = schedules.some(
        (s) => s.dayOfWeek === slot.dayOfWeek && s.shiftId === slot.shiftId,
      );
      if (isConflict) {
        conflicts.push({
          type: 'instructor',
          dayOfWeek: slot.dayOfWeek,
          shiftId: slot.shiftId,
          classCode: cls.code,
        });
      }
    }
  }

  return { hasConflict: conflicts.length > 0, conflicts };
};

// Returns slots (dayOfWeek x shiftId) occupied by any class in the given room for the given academic year
export const getRoomOccupancy = async (
  roomId: string,
  academicYearId: string,
): Promise<ScheduleSlot[]> => {
  const classes = await Class.find({
    roomId: new mongoose.Types.ObjectId(roomId),
    academicYearId: new mongoose.Types.ObjectId(academicYearId),
  })
    .select('schedules')
    .lean();

  const occupied: ScheduleSlot[] = [];
  for (const cls of classes) {
    for (const slot of cls.schedules) {
      occupied.push({ dayOfWeek: slot.dayOfWeek, shiftId: slot.shiftId });
    }
  }
  return occupied;
};

// Returns slots occupied by an instructor in the given academic year
export const getInstructorOccupancy = async (
  instructorId: string,
  academicYearId: string,
): Promise<ScheduleSlot[]> => {
  const classes = await Class.find({
    instructorId: new mongoose.Types.ObjectId(instructorId),
    academicYearId: new mongoose.Types.ObjectId(academicYearId),
  })
    .select('schedules')
    .lean();

  const occupied: ScheduleSlot[] = [];
  for (const cls of classes) {
    for (const slot of cls.schedules) {
      occupied.push({ dayOfWeek: slot.dayOfWeek, shiftId: slot.shiftId });
    }
  }
  return occupied;
};

// Returns a 5x7 boolean grid: grid[day][shift] = true if slot is free
export const buildAvailabilityGrid = (
  occupied: ScheduleSlot[],
): Record<number, Record<number, boolean>> => {
  const grid: Record<number, Record<number, boolean>> = {};
  for (const day of DAYS_OF_WEEK) {
    grid[day] = {};
    for (const shift of SHIFT_IDS) {
      grid[day][shift] = true; // free by default
    }
  }
  for (const slot of occupied) {
    if (grid[slot.dayOfWeek] && grid[slot.dayOfWeek][slot.shiftId] !== undefined) {
      grid[slot.dayOfWeek][slot.shiftId] = false;
    }
  }
  return grid;
};
