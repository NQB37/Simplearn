import mongoose, { Document, Schema } from 'mongoose';

export interface IAddress {
  street?: string;
  city?: string;
  country?: string;
}

export interface IStudentData {
  formOfStudy?: 'full-time' | 'part-time' | 'online' | 'hybrid';
  fieldOfStudyId?: mongoose.Types.ObjectId;
  majorId?: mongoose.Types.ObjectId;
  typeOfStudy?: 'bachelor' | 'master' | 'phd' | 'associate' | 'certificate';
  startYear?: number;
}

export interface IInstructorData {
  fieldOfStudyId?: mongoose.Types.ObjectId;
  majorId?: mongoose.Types.ObjectId;
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  dateOfBirth?: Date;
  sex?: 'male' | 'female' | 'other';
  phone?: string;
  address?: IAddress;
  studentData?: IStudentData;
  instructorData?: IInstructorData;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    street: { type: String },
    city: { type: String },
    country: { type: String },
  },
  { _id: false },
);

const studentDataSchema = new Schema<IStudentData>(
  {
    formOfStudy: {
      type: String,
      enum: ['full-time', 'part-time', 'online', 'hybrid'],
    },
    fieldOfStudyId: { type: Schema.Types.ObjectId, ref: 'FieldOfStudy' },
    majorId: { type: Schema.Types.ObjectId, ref: 'Major' },
    typeOfStudy: {
      type: String,
      enum: ['bachelor', 'master', 'phd', 'associate', 'certificate'],
    },
    startYear: { type: Number },
  },
  { _id: false },
);

const instructorDataSchema = new Schema<IInstructorData>(
  {
    fieldOfStudyId: { type: Schema.Types.ObjectId, ref: 'FieldOfStudy' },
    majorId: { type: Schema.Types.ObjectId, ref: 'Major' },
  },
  { _id: false },
);

const profileSchema = new Schema<IProfile>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, unique: true, ref: 'User' },
    dateOfBirth: { type: Date },
    sex: { type: String, enum: ['male', 'female', 'other'] },
    phone: { type: String },
    address: { type: addressSchema },
    studentData: { type: studentDataSchema },
    instructorData: { type: instructorDataSchema },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
