import { Request, Response } from 'express';
import Trip, { isTrip } from '../models/tripSchema';
import User, { isUser } from '../models/userSchema';

// Create a trip (POST)
export const createTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const userEmails = req.body.users;
    const userIds: string[] = await Promise.all(
      userEmails.map( async (user: string) => { // mapping over the user emails to get their IDs
        const userFound: any = await User.findOne({ email: user });
        return userFound._id;
      })
    );
    console.log(userIds);
    const userCreator = await User.findOne({ email: req.body.creator });
    const creatorId = userCreator?._id; // sets creator to the creator's ID by matching email
    const trip: isTrip = new Trip ({
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      users: userIds,
      creator: creatorId,
      name: req.body.name
    })
    await trip.save();
    console.log('Trip succesfully created');
    trip.users.forEach( async (userId) => {
      const thisUser: isUser | null = await User.findById(userId);
      if (thisUser) {
        thisUser.trips.push(trip._id);
        await thisUser.save();
      }
    });
    res.status(201).send({ trip });
  } catch (error) {
    console.error('Error in createTrip controller', error);
    res.status(500).send({ message: 'Could not create trip' });
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


