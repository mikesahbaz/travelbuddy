import db from '../database';
import { Document, Schema } from 'mongoose';

export interface IStay {
  propertyId: number;
  images: [string];
  listingName: string;
  avgRating: number;
  publicAddress: string;
  listingBedLabel: string;
  listingBathroomLabel: string;
  listingGuestLabel: string;
  price: string;
}

export interface IStayModel extends IStay, Document {};

const StaySchema: Schema = new Schema ({
  propertyId: Number,
  images: [String],
  listingName: String,
  avgRating: Number,
  publicAddress: String,
  listingBedLabel: String,
  listingBathroomLabel: String,
  listingGuestLabel: String,
  price: String
});

export { StaySchema };

const Stay = db.model<IStayModel>('Stay', StaySchema);
export default Stay;
