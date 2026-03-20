import { Request, Response } from 'express';
import Room from '../models/room.model.js';
import Class from '../models/class.model.js';
import {
  getRoomOccupancy,
  getInstructorOccupancy,
  buildAvailabilityGrid,
} from '../services/conflict-detection.service.js';
import { getClassGrid } from '../services/class.service.js';

// GET /api/academy/availability/rooms?academicYearId=&day=&shift=
// Returns rooms that are free at the given day/shift
export const getAvailableRooms = async (req: Request, res: Response) => {
  const { academicYearId, day, shift } = req.query as Record<string, string>;

  if (!academicYearId) {
    res.status(400).json({ error: 'academicYearId is required' });
    return;
  }

  const allRooms = await Room.find({ status: 'active' }).lean();

  if (!day || !shift) {
    res.json(allRooms);
    return;
  }

  const dayNum = parseInt(day, 10);
  const shiftNum = parseInt(shift, 10);

  // Find classes occupying this slot
  const busyClasses = await Class.find({
    academicYearId,
    'schedules.dayOfWeek': dayNum,
    'schedules.shiftId': shiftNum,
  })
    .select('roomId')
    .lean();

  const busyRoomIds = new Set(busyClasses.map((c) => c.roomId.toString()));
  const freeRooms = allRooms.filter((r) => !busyRoomIds.has(r._id.toString()));

  res.json(freeRooms);
};

// GET /api/academy/availability/instructors?academicYearId=&day=&shift=
// Returns instructors (by ID list) that are free at the given day/shift
export const getAvailableInstructors = async (req: Request, res: Response) => {
  const { academicYearId, day, shift } = req.query as Record<string, string>;

  if (!academicYearId || !day || !shift) {
    res.status(400).json({ error: 'academicYearId, day, and shift are required' });
    return;
  }

  const dayNum = parseInt(day, 10);
  const shiftNum = parseInt(shift, 10);

  // Find busy instructor IDs for this slot
  const busyClasses = await Class.find({
    academicYearId,
    'schedules.dayOfWeek': dayNum,
    'schedules.shiftId': shiftNum,
  })
    .select('instructorId')
    .lean();

  const busyInstructorIds = busyClasses.map((c) => c.instructorId.toString());

  res.json({ busyInstructorIds });
};

// GET /api/academy/availability/grid/:roomId?academicYearId=
// Returns full 5x7 schedule grid for a room
export const getRoomGrid = async (req: Request, res: Response) => {
  const roomId = req.params.roomId as string;
  const academicYearId = req.query.academicYearId as string | undefined;

  if (!academicYearId) {
    res.status(400).json({ error: 'academicYearId is required' });
    return;
  }

  const grid = await getClassGrid(roomId, academicYearId);
  res.json(grid);
};

// GET /api/academy/availability/room-slots/:roomId?academicYearId=
// Returns a simple availability grid (free/busy booleans) for a room
export const getRoomAvailabilityGrid = async (req: Request, res: Response) => {
  const roomId = req.params.roomId as string;
  const academicYearId = req.query.academicYearId as string | undefined;

  if (!academicYearId) {
    res.status(400).json({ error: 'academicYearId is required' });
    return;
  }

  const occupied = await getRoomOccupancy(roomId, academicYearId);
  const grid = buildAvailabilityGrid(occupied);
  res.json({ roomId, academicYearId, grid });
};

// GET /api/academy/availability/instructor-slots/:instructorId?academicYearId=
// Returns a simple availability grid (free/busy booleans) for an instructor
export const getInstructorAvailabilityGrid = async (req: Request, res: Response) => {
  const instructorId = req.params.instructorId as string;
  const academicYearId = req.query.academicYearId as string | undefined;

  if (!academicYearId) {
    res.status(400).json({ error: 'academicYearId is required' });
    return;
  }

  const occupied = await getInstructorOccupancy(instructorId, academicYearId);
  const grid = buildAvailabilityGrid(occupied);
  res.json({ instructorId, academicYearId, grid });
};
