import db from '../database';
import { Document, Schema } from 'mongoose';

export interface IActivity {
  poiName: string;
  poiType: string;
  poiTypeCategory: string;
  poiTypeLocale: string;
};

export interface IActivityModel extends IActivity, Document {};

const ActivitySchema: Schema = new Schema ({
  poiName: String,
  poiType: String,
  poiTypeCategory: String,
  poiTypeLocale: String,
});
export { ActivitySchema };

const Activity = db.model<IActivityModel>('Activity', ActivitySchema);
export default Activity;