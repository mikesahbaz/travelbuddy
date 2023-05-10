import express, { Express } from 'express';
import { config } from './config/config';
import userRouter from './router/userRouter';
import tripRouter from './router/tripRouter';
import cors from 'cors';
import mongoose from './database';

const app: Express = express();
app.use(cors());
app.use(express.json());

app.use('/users', userRouter);
app.use('/trips', tripRouter);

function startServer() {
  try {
    mongoose.connection;
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