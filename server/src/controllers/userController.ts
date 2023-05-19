import { Request, Response } from 'express';
import  User , { IUserModel } from '../models/userSchema';
import { userValidationSchema } from '../validations/userValidation';

interface IUserRequest extends Request {
  body: IUserModel;
}

// Create a user (POST)
export const createUser = async (req: IUserRequest, res: Response) => {
  try {
    const { error } = userValidationSchema.validate(req.body);

    if (error) {
      console.error(error.details);
      return res.status(400).json({ message: 'Invalid user data' });
    }

    const email = req.body.email;
    const user: IUserModel | null = await User.findOne({ email });
    if (user) return res.status(401).json({ message: 'This email is already in use.'});

    const newUser: IUserModel = new User ({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });
    await newUser.save();
    return res.status(201).json({ newUser });

  } catch (error) {
    console.error('Error in createUser: ', error);
    return res.status(500).json({ message: 'Could not create the user.' });
  }
}

//Get a user (GET)
export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user: IUserModel | null = await User.findById(userId);
    if (user) return res.status(200).json({ user });
    return res.status(404).json({ message: 'This user does not exist.'});
  } catch (error) {
    console.error('Error in getUser: ', error);
    return res.status(500).json({ message: 'Could not get the user.' });
  }
}

// Get all users (GET)
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users: IUserModel[] = await User.find();
    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error in getAllUsers: ', error);
    return res.status(500).json({ message: 'Could not get all users.' });
  }
}

// Update a user (PUT)
export const updateUser = async (req: IUserRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    const { error } = userValidationSchema.validate(req.body);

    if (error) {
      console.error(error.details);
      return res.status(400).json({ message: 'Invalid user data' });
    }

    const updatedUser = req.body;
    const user: IUserModel | null = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
    if (user) return res.status(200).json({ user });

    return res.status(404).json({ message: 'User not found.'});

  } catch (error) {
    console.error('Error in updateUser: ', error);
    return res.status(500).json({ message: 'Could not update the user.'});
  }
}

// Delete a user (DELETE)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    const user: IUserModel | null = await User.findByIdAndDelete(userId);
    if (user) return res.status(204).end();
    return res.status(404).json({ message: 'User not found.'});
  } catch (error) {
    console.error('Error in deleteUser: ', error);
    res.status(500).json({ message: 'Could not delete the user.'});
  }
}
