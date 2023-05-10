import { Request, Response } from 'express';
import Trip, { ITripModel } from '../models/tripSchema';
import Stay, { IStayModel } from '../models/staySchema';

// Update a stay (PUT)
export const toggleStayInTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId: string = req.params.tripId;
    const trip: ITripModel | null = await Trip.findById(tripId);

    const airbnbData: IStayModel = req.body;
    const stay: IStayModel = new Stay(airbnbData);

    if (trip) {
      const stayIndex = trip.stays.findIndex((stay) => stay.propertyId === req.body.propertyId);
      if (stayIndex > -1) {
        // stay exist, remove it
        trip.stays.splice(stayIndex, 1);
      } else {
        // stay does not exist, add it
        trip.stays.push(stay);
      }
      await trip.save();
    }
    res.status(200).send({ trip });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error in toggleStayInTrip'});
  }
}

