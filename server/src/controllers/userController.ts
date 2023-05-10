import { Request, Response } from 'express';
import mongoose from 'mongoose';
import  User , { IUserModel } from '../models/userSchema';

// Create a user (POST)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const email: string = req.body.email;
    const user: IUserModel | null = await User.findOne({ email });
    if (user) {
      res.status(401).json({ message: 'This email is already in use.'});
    } else {
      const newUser: IUserModel = new User ({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      });
      await newUser.save();
      console.log('New user successfully created.');
      res.status(201).json({ newUser });
    }
  } catch (error) {
    console.error('Error in createUser: ', error);
    res.status(500).json({ message: 'Could not create the user.' });
  }
}

// Get a user (GET)
// export const getUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const userId: string = req.params.userId;
//     const user: IUserModel | null = await User.findById(userId);
//     if (user) {
//       res.status(200).json({ user });
//     } else {
//       res.status(401).json({ message: 'This user does not exist.'});
//     }
//   } catch (error) {
//     console.error('Error in getUser: ', error);
//     res.status(500).json({ message: 'Could not get the user.' });
//   }
// }

// Get all users (GET)
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users: IUserModel[] = await User.find();
    if (users) {
      res.status(200).json({ users });
    } else {
      res.status(401).json({ message: 'Users do not exist.'});
    }
  } catch (error) {
    console.error('Error in getAllUsers: ', error);
    res.status(500).json({ message: 'Could not get all users.' });
  }
}

// Update a user (PUT)
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = req.params.userId;
    const user: IUserModel | null = await User.findById(userId);
    if (user) {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.email = req.body.email;
      await user.save();
      res.status(201).json({ user });
      console.log('User updated successfully.');
    } else {
      res.status(401).json({ message: 'User does not exist.'});
    }
  } catch (error) {
    console.error('Error in updateUser: ', error);
    res.status(500).json({ message: 'Could not update the user.'});
  }
}

// Delete a user (DELETE)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = req.params.userId;
    const user: IUserModel | null = await User.findByIdAndDelete(userId);
    if (user) {
      res.status(201).json({ user });
      console.log('User deleted successfully.');
    } else {
      res.status(401).json({ message: 'User does not exist.'});
    }
  } catch (error) {
    console.error('Error in deleteUser: ', error);
    res.status(500).json({ message: 'Could not delete the user.'});
  }
}
