import db from '../database';
import { Document, Schema } from 'mongoose';

export interface isFlight extends Document {
  itineraryId: string;
  entityId: string;
  lng: string;
  lat: string;
}

const FlightSchema: Schema = new Schema ({
  itineraryId: String,
  entityId: String,
  lng: String,
  lat: String,
});

const Flight = db.model<isFlight>('Flight', FlightSchema);
export default Flight;
export { FlightSchema };