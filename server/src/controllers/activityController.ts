import { Request, Response } from 'express';
import Trip, { ITripModel } from '../models/tripSchema';
import Activity, { IActivityModel } from '../models/activitySchema';
import { getIo } from '../socket';

// Update a stay (PUT)
export const toggleActivityInTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId: string = req.params.tripId;
    const trip: ITripModel | null = await Trip.findById(tripId);

    const activity: IActivityModel = new Activity(req.body);

    await activity.validate();

    if (trip) {
      const activityIndex = trip.activities.findIndex((activity) => activity.entityId === req.body.entityId);
      if (activityIndex > -1) {
        // activity exist, remove it
        trip.activities.splice(activityIndex, 1);
      } else {
        // activity does not exist, add it
        trip.activities.push(activity);
      }
      await trip.save();
    }
    getIo().emit('trip_update', trip);
    res.status(200).json({ trip });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        res.status(400).json({ message: 'Invalid activity data' });
      } else {
        res.status(500).json({ message: 'Error in toggleActivityInTrip'});
      }
    } else {
      console.error('Caught an unexpected type of error:', error);
      res.status(500).json({ message: 'Unexpected error in toggleActivityInTrip' });
    }
  }
}