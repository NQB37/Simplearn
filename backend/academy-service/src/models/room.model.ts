import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    capacity: { type: Number, required: true, default: 30 },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IRoom>('Room', RoomSchema);
