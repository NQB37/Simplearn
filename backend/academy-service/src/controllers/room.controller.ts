import { Request, Response } from 'express';
import * as roomService from '../services/room.service.js';

export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.json(rooms);
  } catch (err) {
    console.error('Error fetching rooms', err);
    res.status(500).json({ error: 'Server error retrieving rooms' });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  try {
    const room = await roomService.getRoomById(req.params.id as string);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    console.error('Error fetching room', err);
    res.status(500).json({ error: 'Server error retrieving room' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const newRoom = await roomService.createRoom(req.body);
    res.status(201).json(newRoom);
  } catch (err: any) {
    console.error('Error creating room', err);
    res.status(400).json({ error: err.message });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const updatedRoom = await roomService.updateRoom(
      req.params.id as string,
      req.body,
    );
    if (!updatedRoom) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(updatedRoom);
  } catch (err: any) {
    console.error('Error updating room', err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const deletedRoom = await roomService.deleteRoom(req.params.id as string);
    if (!deletedRoom) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting room', err);
    res.status(400).json({ error: 'Server error deleting room' });
  }
};
