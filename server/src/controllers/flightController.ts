import { Request, Response } from 'express';
import Flight, { IFlightModel } from '../models/flightSchema';
import Trip, { ITripModel } from '../models/tripSchema';
import { getIo } from '../socket';

// Update a flight (PUT)
export const toggleFlightInTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId: string = req.params.tripId;
    const trip: ITripModel | null = await Trip.findById(tripId);

    const flight: IFlightModel = new Flight(req.body);

    await flight.validate();

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
    getIo().emit('trip_update', trip);
    res.status(200).send({ trip });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid flight data' });
      } else {
        res.status(500).send({ message: 'Error in toggleFlightInTrip'});
      }
    } else {
      console.error('Caught an unexpected type of error:', error);
      res.status(500).send({ message: 'Unexpected error in toggleFlightInTrip' });
    }
  }
}