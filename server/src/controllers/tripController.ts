import { Request, Response } from 'express';
import Trip, { ITripModel } from '../models/tripSchema';
import User, { IUserModel } from '../models/userSchema';

// Create a trip (POST)
export const createTrip = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body.users);
  try {
    const trip: ITripModel = new Trip ({
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      creator: req.body.creator,
      travelers: req.body.travelers,
    })
    await trip.save();
    console.log('Trip succesfully created.');
    trip.travelers.forEach( async (userId) => {
      const user: IUserModel | null = await User.findById(userId);
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

// Get trip by TripID (GET)
export const getTripByTripId = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId : string = req.params.tripId;
    const trip: ITripModel | null= await Trip.findById(tripId);
    if (trip) {
      console.log('Trip was found by Trip ID succesfully: ', trip);
      res.status(200).json({ trip });
    } else {
      res.status(404).json({ message: 'Trip does not exist.' });
    }
  } catch (error) {
    console.error('Error in getTripsByTripId', error);
    res.status(500).json({ message: 'Could not get trip by trip ID.' });
  }
}

// Get all trips by userEmail (GET)
export const getAllTripsByUserEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const firebaseEmail = req.params.firebaseEmail;
    console.log(firebaseEmail);
    const user: IUserModel | null = await User.findOne({ email: firebaseEmail });
    if (user) {
      const trips: ITripModel[] = await Trip.find({ _id: { $in: user.trips }});
      if (trips.length > 0) {
        res.status(200).json({ trips });
      } else {
        res.status(404).json({ message: 'No trips exist yet.'});
      }
    } else {
      res.status(404).json({ message: 'User does not exist.'});
    }
  } catch (error) {
    console.error('Error in getAllTripsByUserId', error);
    res.status(500).json({ message: 'Could not get all trips '});
  }
}

// Get all trips by userID (GET)
export const getAllTripsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = req.params.userId;
    const user: IUserModel | null = await User.findById(userId).populate('trips');
    if (user) {
      if (user.trips.length > 0) {
        res.status(200).json({ trips: user.trips });
      } else {
        res.status(404).json({ message: 'No trips exist yet.'});
      }
    }
  } catch (error) {
    console.error('Error in getAllTripsByUserId: ', error);
    res.status(500).json({ message: 'Could not get all trips.'});
  }
}

// Get all travelers of a trip by tripId (GET)
export const getAllUsersByTripId = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId: string = req.params.tripId;
    const trip = await Trip.findById(tripId).populate('travelers');
    if (trip) {
      console.log('Travelers found by tripId successfully.');
      res.status(200).json(trip.travelers);
    } else {
      res.status(404).json({ message: 'Travelers do not exist.' });
    }
  } catch (error) {
    console.error('Error in getAllUsersByTripId: ', error);
    res.status(500).json({ message: 'Could not get all travelers.'});
  }
}

// Update a trip (PUT)
export const updateTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId: string = req.params.tripId;
    const updatedTrip = req.body;
    const trip: ITripModel | null = await Trip.findByIdAndUpdate(tripId, updatedTrip, { new: true });
    if (trip) {
      res.status(201).json({ trip });
      console.log('Trip updated successfully.');
    } else {
      res.status(401).json({ message: 'Trip does not exist.' });
    }
  } catch (error) {
    console.error('Error in updateTrip: ', error);
    res.status(500).json({ message: 'Could not update the trip.'});
  }
}

// Delete a trip (DELETE)
export const deleteTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const tripId: string = req.params.tripId;
    const trip: ITripModel | null = await Trip.findById(tripId);

    if (trip) {
      // Remove the trip from the users' trips array
      await User.updateMany(
        { trips: tripId },
        { $pull: { trips: tripId }}
      );
      // Delete the trip
      await Trip.findByIdAndDelete(tripId);

      res.status(201).json({ trip });
      console.log('Trip deleted successfully');
    } else {
      res.status(404).json({ message: 'Trip does not exist' });
    }
  } catch (error) {
    console.error('Error in deleteTrip: ', error);
    res.status(500).json({ message: 'Could not delete the trip.'});
  }
}