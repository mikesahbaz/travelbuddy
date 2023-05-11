import db from '../database';
import { Document, Schema } from 'mongoose';

interface Leg {
  origin: {
    display_code: String;
  };
  destination: {
    display_code: String;
  };
  departure: Date;
}

const LegSchema: Schema = new Schema ({
  origin: {
    display_code: String
  },
  destination: {
    display_code: String
  },
  departure: Date
});

export interface IFlight {
  itineraryId: string;
  legs: [Leg];
}

export interface IFlightModel extends IFlight, Document {};

const FlightSchema: Schema = new Schema (
  {
    itineraryId: {
      type: String,
      required: true,
    },
    legs: {
      type: [LegSchema],
    }
  },
  {
    versionKey: false,
  }
);
export { FlightSchema };

const Flight = db.model<IFlightModel>('Flight', FlightSchema);
export default Flight;