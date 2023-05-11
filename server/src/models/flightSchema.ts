import db from '../database';
import { Document, Schema } from 'mongoose';

interface Legs {
  origin: String;
  destination: String;
  date: Date;
}

const LegsSchema: Schema = new Schema ({
  origin: String,
  destination: String,
  date: Date
});


export interface IFlight {
  itineraryId: string;
  legs: [Legs];
}

export interface IFlightModel extends IFlight, Document {};

const FlightSchema: Schema = new Schema (
  {
    itineraryId: {
      type: String,
      required: true,
    },
    legs: {
      type: [LegsSchema],
    }
  },
  {
    versionKey: false,
  }
);
export { FlightSchema };

const Flight = db.model<IFlightModel>('Flight', FlightSchema);
export default Flight;