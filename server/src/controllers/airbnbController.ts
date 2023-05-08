import { Request, Response } from 'express';
import Trip, { isTrip } from '../models/tripSchema';
//import User, { isUser } from '../models/userSchema';
import Airbnb, { isAirbnb } from '../models/airbnbSchema';

export const addFavoriteAirbnbToTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId = req.params.tripId;
    const airbnbData: isAirbnb = req.body;
    const trip: isTrip | null = await Trip.findOne({ _id: tripId });
    const stay: isAirbnb = new Airbnb(airbnbData);
    if (trip) {
      trip.stays.push(stay);
      await trip.save();
    }
    res.status(200).send({ trip });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error in addFavoriteAirbnbToTrip'});
  }
}