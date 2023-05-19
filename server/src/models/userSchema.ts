import db from '../database';
import { Document, Schema } from 'mongoose';
import { ITripModel } from './tripSchema';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  trips: ITripModel['_id'][];
}

export interface IUserModel extends IUser, Document {};

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

const User = db.model<IUserModel>('User', UserSchema);
export default User;
