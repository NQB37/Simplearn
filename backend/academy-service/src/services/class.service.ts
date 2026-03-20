import mongoose from 'mongoose';
import Class, { IClass } from '../models/class.model.js';
import Room from '../models/room.model.js';
import { DAYS_OF_WEEK, SHIFT_IDS, SHIFTS } from '../constants/shifts.js';

export const getClasses = async () => {
  return Class.find().populate('subjectId academicYearId roomId');
};

export const createClass = async (data: Partial<IClass>) => {
  const newClass = new Class(data);
  return newClass.save();
};

export const getClassById = async (id: string) => {
  return Class.findById(id).populate('subjectId academicYearId roomId');
};

export const updateClass = async (id: string, data: Partial<IClass>) => {
  return Class.findByIdAndUpdate(id, data, { new: true }).populate(
    'subjectId academicYearId roomId',
  );
};

export const deleteClass = async (id: string) => {
  return Class.findByIdAndDelete(id);
};

export interface GridCell {
  free: boolean;
  classId?: string;
  classCode?: string;
  subjectName?: string;
}

export interface RoomGrid {
  roomId: string;
  roomName: string;
  capacity: number;
  // grid[dayOfWeek][shiftId] -> cell
  grid: Record<number, Record<number, GridCell>>;
  shifts: typeof SHIFTS;
  days: number[];
}

// Returns the full 5x7 schedule grid for a room in a given academic year
export const getClassGrid = async (
  roomId: string,
  academicYearId: string,
): Promise<RoomGrid> => {
  const room = await Room.findById(roomId).lean();
  if (!room) throw new Error('Room not found');

  const classes = await Class.find({
    roomId: new mongoose.Types.ObjectId(roomId),
    academicYearId: new mongoose.Types.ObjectId(academicYearId),
  })
    .populate('subjectId', 'name')
    .lean();

  // Initialize empty grid
  const grid: Record<number, Record<number, GridCell>> = {};
  for (const day of DAYS_OF_WEEK) {
    grid[day] = {};
    for (const shift of SHIFT_IDS) {
      grid[day][shift] = { free: true };
    }
  }

  // Fill in occupied slots
  for (const cls of classes) {
    for (const slot of cls.schedules) {
      if (grid[slot.dayOfWeek] && grid[slot.dayOfWeek][slot.shiftId] !== undefined) {
        const subject = cls.subjectId as any;
        grid[slot.dayOfWeek][slot.shiftId] = {
          free: false,
          classId: cls._id.toString(),
          classCode: cls.code,
          subjectName: subject?.name,
        };
      }
    }
  }

  return {
    roomId,
    roomName: room.name,
    capacity: room.capacity,
    grid,
    shifts: SHIFTS,
    days: DAYS_OF_WEEK,
  };
};
