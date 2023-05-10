import mongoose from 'mongoose';
import { config } from './config/config';

async function connectToDatabase () {
  try {
<<<<<<< HEAD
    await mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority'});
    console.log('Succesfully connected to the DB');
=======
    await mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority' });
    console.log('Connected to the database.');
>>>>>>> d09c5882ccb731529a2a2f0fb7b13ef3065c780d
  } catch (err) {
    console.log('Error connecting to the database: ', err);
    process.exit(1);
  }
}

connectToDatabase();

mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));

export default mongoose;
