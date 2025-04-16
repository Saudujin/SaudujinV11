import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  user: mongoose.Types.ObjectId;
  tournament: mongoose.Types.ObjectId;
  registrationDate: Date;
  attendanceStatus: 'registered' | 'approved' | 'attended' | 'no-show';
  checkedInBy?: mongoose.Types.ObjectId;
  checkedInAt?: Date;
  loyaltyPointsEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
    registrationDate: { type: Date, default: Date.now },
    attendanceStatus: { 
      type: String, 
      enum: ['registered', 'approved', 'attended', 'no-show'], 
      default: 'registered' 
    },
    checkedInBy: { type: Schema.Types.ObjectId, ref: 'User' },
    checkedInAt: { type: Date },
    loyaltyPointsEarned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Create a compound index to ensure a user can only register once per tournament
AttendanceSchema.index({ user: 1, tournament: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
