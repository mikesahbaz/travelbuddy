import express, { Express } from 'express';
import { config } from './config/config';
import userRouter from './router/userRouter';
import tripRouter from './router/tripRouter';
import flightRouter from './router/flightRouter';
import stayRouter from './router/stayRouter';
import cors from 'cors';
import mongoose from './database';

const app: Express = express();
app.use(cors());
app.use(express.json());

app.use('/users', userRouter);
app.use('/trips', tripRouter);
app.use('/flights', flightRouter);
app.use('/stays', stayRouter);

async function startServer() {
  try {
    await mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority'});
    console.log('Succesfully connected to the DB');
    app.listen(config.server.port, () => {
      console.log(`Server is listening on port ${config.server.port}`);
    });
  } catch (error) {
    console.error('Could not connect to database. Server not started.');
    process.exit(1);
  }
}

startServer();

export default app;