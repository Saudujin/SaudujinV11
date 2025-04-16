import mongoose, { Schema, Document } from 'mongoose';

export interface ITournament extends Document {
  title: string;
  game: string;
  date: Date;
  location: string;
  capacity: number;
  registeredUsers: mongoose.Types.ObjectId[];
  attendedUsers: mongoose.Types.ObjectId[];
  loyaltyPointsValue: number;
  isPriorityEvent: boolean;
  description?: string;
  venueInformation?: string;
  participatingTeams?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TournamentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    game: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    registeredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    attendedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    loyaltyPointsValue: { type: Number, default: 1 },
    isPriorityEvent: { type: Boolean, default: false },
    description: { type: String },
    venueInformation: { type: String },
    participatingTeams: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Tournament || mongoose.model<ITournament>('Tournament', TournamentSchema);
