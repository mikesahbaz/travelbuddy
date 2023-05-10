import { Request, Response } from 'express';
import Trip, { isTrip } from '../models/tripSchema';
//import User, { isUser } from '../models/userSchema';
import Flight, { isFlight } from '../models/flightSchema';
// for commit
// favoriteFlight (PUT)

export const addFavoriteFlightToTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId = req.params.tripId;
    const flightData: isFlight = req.body;
    const trip: isTrip | null = await Trip.findOne({ _id: tripId });
    const flight: isFlight = new Flight(flightData);
    if (trip) {
      trip.flights.push(flight);
      await trip.save();
    }
    res.status(200).send({ trip });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error in addFavoriteFlightToTrip'});
  }
}

