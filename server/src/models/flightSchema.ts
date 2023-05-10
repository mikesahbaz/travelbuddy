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

export interface isFlight extends Document {
  itineraryId: string;
  legs: [Legs];
}

const FlightSchema: Schema = new Schema ({
  itineraryId: {
    type: String,
    required: true,
  },
  legs: {
    type: [LegsSchema],
  }
  
});

const Flight = db.model<isFlight>('Flight', FlightSchema);
export default Flight;
export { FlightSchema };