import db from '../database';
import { Document, Schema } from 'mongoose';
import { isFlight } from '../models/flightSchema';
import { isAirbnb } from '../models/airbnbSchema';
import { isActivity } from '../models/activitySchema';
import { FlightSchema } from '../models/flightSchema';
import { AirbnbSchema } from '../models/airbnbSchema';
import { ActivitySchema } from '../models/activitySchema';


export interface isTrip extends Document {
  flights: isFlight[];
  stays: isAirbnb[];
  activities: isActivity[];
  startDate: Date;
  endDate: Date;
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
  }
});

const Trip = db.model<isTrip>('Trip', TripSchema);