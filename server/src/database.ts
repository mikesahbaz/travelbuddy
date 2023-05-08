import mongoose from 'mongoose';
import { config } from './config/config';

async function connectToDatabase () {
  try {
    await mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority'});
  } catch (err) {
    console.log('Error connecting to the database: ', err);
    throw err;
  }
}

connectToDatabase();

mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));

export default mongoose;
