import db from '../database';
import { Document, Schema } from 'mongoose';

export interface IActivity {
  entityId: string;
  poiName: string;
  poiType: string;
  poiTypeCategory: string;
  poiTypeLocale: string;
};

export interface IActivityModel extends IActivity, Document {};

const ActivitySchema: Schema = new Schema (
  {
    entityId: String,
    poiName: String,
    poiType: String,
    poiTypeCategory: String,
    poiTypeLocale: String,
  },
  {
    versionKey: false,
  }
);
export { ActivitySchema };

const Activity = db.model<IActivityModel>('Activity', ActivitySchema);
export default Activity;