import { Request, Response } from 'express';
import mongoose from 'mongoose';
import  User , { isUser } from '../models/userSchema';

// Create a user (POST)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(401).json({ message: 'This email is already in use.'});
  } else {
    try {
      const newUser: isUser = new User ({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      });
      await newUser.save();
      console.log('Success creating a new user.');
      res.status(201).json({ newUser });
    } catch (error) {
      console.error('Error in createUser: ', error);
      res.status(500).json({ message: 'Could not create the user.' });
    }
  }
}

// Get a user (GET)
// export const getUser = async (req: Request, res: Response): Promise<void> => {
//   const userId = req.params.userId;
//   const user = await User.findById(userId);
//   if (!user) {
//     res.status(401).json({ message: 'This user does not exist.'});
//   } else {
//     try {
//       res.status(200).json({ user });
//     } catch (error) {
//       console.error('Error in getUser: ', error);
//       res.status(500).json({ message: 'Could not get the user.' });
//     }
//   }
// }

// Get all users (GET)
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await User.find();
  if (!users) {
    res.status(401).json({ message: 'No users exist yet.'});
  } else {
    try {
      res.status(200).json({ users });
    } catch (error) {
      console.error('Error in getAllUsers: ', error);
      res.status(500).json({ message: 'Could not get all users' });
    }
  }
}

// Update a user (PUT)
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) {
    res.status(401).json({ message: 'This user does not exist.'});
  } else {
    try {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.email = req.body.email;
      await user.save();
      res.status(201).json({ user });
    } catch (error) {
      console.error('Error in updateUser: ', error);
      res.status(500).json({ message: 'Could not delete the user.'});
    }
  }
}

// Delete a user (DELETE)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    res.status(401).json({ message: 'This user does not exist.'});
  } else {
    try {
      res.status(201).json({ user });
    } catch (error) {
      console.error('Error in deleteUser: ', error);
      res.status(500).json({ message: 'Could not delete the user.'});
    }
  }
}