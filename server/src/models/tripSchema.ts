import db from '../database';
import { Document, Schema } from 'mongoose';
import { isFlight } from './flightSchema';
import { isAirbnb } from './airbnbSchema';
import { isActivity } from './activitySchema';
import { isUser } from './userSchema';
import { FlightSchema } from './flightSchema';
import { AirbnbSchema } from './airbnbSchema';
import { ActivitySchema } from './activitySchema';


export interface isTrip extends Document {
  flights: isFlight[];
  stays: isAirbnb[];
  activities: isActivity[];
  startDate: Date;
  endDate: Date;
  users: isUser['_id'][];
  creator: isUser['_id'];
  name: string;
};

const TripSchema: Schema = new Schema ({
  flights: {
    type: [FlightSchema],
    default: [],
  },
  stays: {
    type: [AirbnbSchema],
    default: [],
  },
  activities: {
    type: [ActivitySchema],
    default: [],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Trip = db.model<isTrip>('Trip', TripSchema);
export default Trip;