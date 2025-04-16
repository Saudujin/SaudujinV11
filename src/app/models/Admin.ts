import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  user: mongoose.Types.ObjectId;
  role: 'admin' | 'super_admin';
  permissions: {
    manageUsers: boolean;
    manageAttendance: boolean;
    manageTournaments: boolean;
    viewAnalytics: boolean;
    exportData: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
    permissions: {
      manageUsers: { type: Boolean, default: true },
      manageAttendance: { type: Boolean, default: true },
      manageTournaments: { type: Boolean, default: false },
      viewAnalytics: { type: Boolean, default: true },
      exportData: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
