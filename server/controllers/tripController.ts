import { Request, Response } from 'express';
import Trip, { isTrip } from '../models/tripSchema';
import User, { isUser } from '../models/userSchema';

// Create a trip (POST)
export const createTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const trip: isTrip = new Trip ({
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      users: req.body.users,
      creator: req.body.creator,
      name: req.body.name
    })
    await trip.save();
    console.log('Trip succesfully created');
    res.status(201).send({ trip });
  } catch (error) {
    console.error('Error in createTrip controller', error);
    res.status(500).send({ message: 'Could not create trip' });
  }
}


// Get all Trips by userID (GET)
export const getAllTripsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const trips: isTrip[] = await Trip.find({ users: userId });
    res.status(200).send({ trips });
  } catch (error) {
    console.error('Error in getAllTripsByUserId', error);
    res.status(500).send({ message: 'Could not get all trips '});
  }
}


// Get trip by TripID (GET)
export const getTripByTripId = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId = req.params.tripId;
    const trip: isTrip | null = await Trip.findOne({ id: tripId});
    console.log(trip);
    console.log('Trip was found by Trip ID succesfully');
    if (trip) {
      res.status(200).send({ trip });
    } else {
      res.status(404).send({ message: 'The trip does not exist' });
    }
  } catch (error) {
    console.error('Error in getTripsByTripId', error);
    res.status(500).send({ message: 'Could not get trip by trip ID' });
  }
}


// Get all users in a Trip by Trip ID (GET)
export const getAllUsersByTripId = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId = req.params.tripId;
    const users: isUser[] = await User.find({ trips: tripId });
    console.log('Users found by Trip Id successfully');
    res.status(200).send({ users });
  } catch (error) {
    console.error('Error in getAllUsersByTripId', error);
    res.status(500).send({ message: 'Could not get all users '});
  }
}


// Delete Trip (DELETE)
export const deleteTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId = req.params.tripId;
    const deletedTrip = await Trip.findByIdAndDelete(tripId);
    console.log('Trip deleted successfully');
    res.status(201).send({ deletedTrip });
  } catch (error) {
    console.error('Error in deleteTrip', error);
    res.status(500).send({ message: 'Could not delete the trip '});
  }
}



// Update Trip (PUT)