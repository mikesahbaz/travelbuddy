import { Request, Response } from 'express';
import  User , { isUser } from '../models/userSchema';

// Create a user (POST)
export const createUser = async (req: Request, res: Response): Promise<void> => {
const user = await User.findOne({ email: req.body.email });
if (!user) {
  try {
    const newUser: isUser = new User ({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });
    await newUser.save();
    console.log('Success creating a new user.');
    res.status(201).send({ newUser });
  } catch (error) {
    console.error('Error in createUser', error);
    res.status(500).send({ error, message: 'Could not create the user '});
  }
} else {
  res.status(401).json({ message: 'This email is already in use.'});
}

}


// Get all users (GET) to display in createTrip selector
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await User.find();
  if (users) {
    try {
      res.status(200).json({ users });
    } catch (error) {
      console.error('error in getAllUsers' ,error);
      res.status(500).send({ error, message: 'Could not get all users' });
    }
  } else {
    res.status(401).send({ message: 'Users do not exist yet '});
  }
}



