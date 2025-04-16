import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  location: string;
  favoriteGames: string[];
  isVerified: boolean;
  verificationCode?: string;
  verificationExpires?: Date;
  attendedEvents: mongoose.Types.ObjectId[];
  loyaltyPoints: number;
  rewards: {
    scarf: boolean;
    vipTicket: boolean;
    jersey: boolean;
  };
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    countryCode: { type: String, required: true },
    location: { type: String, required: true },
    favoriteGames: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationExpires: { type: Date },
    attendedEvents: [{ type: Schema.Types.ObjectId, ref: 'Tournament' }],
    loyaltyPoints: { type: Number, default: 0 },
    rewards: {
      scarf: { type: Boolean, default: false },
      vipTicket: { type: Boolean, default: false },
      jersey: { type: Boolean, default: false },
    },
    language: { type: String, enum: ['en', 'ar'], default: 'en' },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
