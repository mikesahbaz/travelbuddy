import express, { Express } from 'express';
import { config } from './config/config';
import userRoutes from './routes/userRoutes';
import tripRoutes from './routes/tripRoutes';
import flightRoutes from './routes/flightRoutes';
import cors from 'cors';
import mongoose from './database';

const app: Express = express();
app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/trips', tripRoutes);
app.use('/flights', flightRoutes);

async function startServer() {
  try {
    await mongoose.connection;
    app.listen(config.server.port, () => {
      console.log(`Server is listening on port ${config.server.port}`);
    });
  } catch (error) {
    console.error('Could not connect to database. Server not started.');
  }
}

startServer();

export default app;