import db from '../database';
import { Document, Schema } from 'mongoose';

export interface isAirbnb extends Document {
  propertyId: number;
};

const AirbnbSchema: Schema = new Schema ({
  propertyId: String,
});

const Airbnb = db.model<isAirbnb>('Airbnb', AirbnbSchema);
export default Airbnb;
export { AirbnbSchema };