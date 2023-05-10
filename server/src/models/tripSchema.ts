import db from '../database';
import { Document, Schema } from 'mongoose';
import { IUserModel } from './userSchema';

import { IFlightModel, FlightSchema } from './flightSchema';
import { IStayModel, StaySchema } from './staySchema';
import { IActivityModel, ActivitySchema } from './activitySchema';

export interface ITrip {
  name: string; // name of trip
  startDate: Date;
  endDate: Date;
  creator: IUserModel['_id']; // the user who created the trip
  travelers: IUserModel['_id'][]; // the users who are traveling on the trip
  flights: IFlightModel[];
  stays: IStayModel[];
  activities: IActivityModel[];
}

export interface ITripModel extends ITrip, Document {};

const TripSchema: Schema = new Schema (
  {
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    travelers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    flights: {
      type: [FlightSchema],
      default: [],
    },
    stays: {
      type: [StaySchema],
      default: [],
    },
    activities: {
      type: [ActivitySchema],
      default: [],
    },
  },
  {
    versionKey: false,
  }
);

const Trip = db.model<ITripModel>('Trip', TripSchema);
export default Trip;