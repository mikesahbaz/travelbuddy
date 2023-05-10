import { Request, Response } from 'express';
import Flight, { IFlightModel } from '../models/flightSchema';
import Trip, { ITripModel } from '../models/tripSchema';

// Update a flight (PUT)
export const toggleFlightInTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId: string = req.params.tripId;
    const trip: ITripModel | null = await Trip.findById(tripId);

    const flightData: IFlightModel = req.body;
    const flight: IFlightModel = new Flight(flightData);

    if (trip) {
      const flightIndex = trip.flights.findIndex((flight) => flight.itineraryId === req.body.itineraryId);
      if (flightIndex > -1) {
        // flight exist, remove it
        trip.flights.splice(flightIndex, 1);
      } else {
        // flight does not exist, add it
        trip.flights.push(flight);
      }
      await trip.save();
    }
    res.status(200).send({ trip });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error in toggleFlightInTrip'});
  }
}