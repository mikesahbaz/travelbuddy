import db from '../database';
import { Document, Schema } from 'mongoose';

export interface isActivity extends Document {
  poiName: string;
  poiType: string;
  poiTypeCategory: string;
  poiTypeLocale: string;
};

const ActivitySchema: Schema = new Schema ({
  poiName: String,
  poiType: String,
  poiTypeCategory: String,
  poiTypeLocale: String,
});

const Activity = db.model<isActivity>('Activity', ActivitySchema);
export default Activity;
export { ActivitySchema }; 