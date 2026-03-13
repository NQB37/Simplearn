import Room, { IRoom } from '../models/room.model.js';

export const getAllRooms = async (): Promise<IRoom[]> => {
  return Room.find();
};

export const getRoomById = async (id: string): Promise<IRoom | null> => {
  return Room.findById(id);
};

export const createRoom = async (data: Partial<IRoom>): Promise<IRoom> => {
  const newRoom = new Room(data);
  return newRoom.save();
};

export const updateRoom = async (
  id: string,
  data: Partial<IRoom>,
): Promise<IRoom | null> => {
  return Room.findByIdAndUpdate(id, data, { new: true });
};

export const deleteRoom = async (id: string): Promise<IRoom | null> => {
  return Room.findByIdAndDelete(id);
};
