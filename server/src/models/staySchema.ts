import db from '../database';
import { Document, Schema } from 'mongoose';

export interface IStay {
  propertyId: number;
}

export interface IStayModel extends IStay, Document {};

const StaySchema: Schema = new Schema ({
  propertyId: Number,
});
export { StaySchema };

const Stay = db.model<IStayModel>('Stay', StaySchema);
export default Stay;