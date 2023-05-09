import db from '../database';
import { Document, Schema } from 'mongoose';
import { isTrip } from './tripSchema';

export interface isUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  trips: isTrip['_id'][];
};

const UserSchema: Schema = new Schema (
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    trips: [{
      type: Schema.Types.ObjectId,
      ref: 'Trip',
    }],
  },
  {
    versionKey: false,
  }
);

const User = db.model<isUser>('User', UserSchema);
export default User;