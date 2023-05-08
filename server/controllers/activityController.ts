import { Request, Response } from 'express';
import Trip, { isTrip } from '../models/tripSchema';
//import User, { isUser } from '../models/userSchema';
import Activity, { isActivity } from '../models/activitySchema';

export const addFavoriteActivityToTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId = req.params.tripId;
    const activityData: isActivity = req.body;
    const trip: isTrip | null = await Trip.findOne({ _id: tripId });
    const activity: isActivity = new Activity(activityData);
    if (trip) {
      trip.activities.push(activity);
      await trip.save();
    }
    res.status(200).send({ trip });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error in addFavoriteActivityToTrip'});
  }
}