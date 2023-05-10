import { Request, Response } from 'express';
import Trip, { isTrip } from '../models/tripSchema';
import User, { isUser } from '../models/userSchema';

// Create a trip (POST)
export const createTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const trip: isTrip = new Trip ({
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      creator: req.body.creator,
      users: req.body.users
    })
    await trip.save();
    console.log('Trip succesfully created.');
    console.log(req.body.creator);
    console.log(req.body.users);
    const theCreator: isUser | null = await User.findById(req.body.creator);
    if (theCreator) {
      theCreator.trips.push(trip._id);
      await theCreator.save();
    }
    trip.users.forEach( async (userId) => {
      const user: isUser | null = await User.findById(userId);
      if (user) {
        user.trips.push(trip._id);
        await user.save();
      }
    });
    res.status(201).json({ trip });
  } catch (error) {
    console.error('Error in createTrip: ', error);
    res.status(500).json({ message: 'Could not create trip.' });
  }
}


// Get all Trips by userID (GET)
export const getAllTripsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const firebaseEmail = req.params.firebaseEmail;
    const user = await User.findOne({ email: firebaseEmail });
    const userId = user?._id;
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
    const trip: isTrip | null = await Trip.findOne({ _id: tripId});
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
    const tripUsers = await Trip.findOne({ _id: tripId }).populate('users');
    console.log(tripUsers);
    console.log('Users found by Trip Id successfully');

    res.status(200).send({ tripUsers });
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


