import { Request, Response } from 'express';
import Trip, { ITripModel } from '../models/tripSchema';
import Activity, { IActivityModel } from '../models/activitySchema';

export const addFavoriteActivityToTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId = req.params.tripId;
    const activityData: IActivityModel = req.body;
    const trip: ITripModel | null = await Trip.findOne({ _id: tripId });
    const activity: IActivityModel = new Activity(activityData);
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