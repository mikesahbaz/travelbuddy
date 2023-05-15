import express, { Express } from 'express';
import { Server } from 'http';
import { Server as IoServer } from 'socket.io';
import { config } from './config/config';
import userRouter from './router/userRouter';
import tripRouter from './router/tripRouter';
import flightRouter from './router/flightRouter';
import stayRouter from './router/stayRouter';
import activityRouter from './router/activityRouter';
import cors from 'cors';
import mongoose from './database';

const app: Express = express();
const server = new Server(app);
const io = new IoServer(server);
app.use(cors());
app.use(express.json());

app.use('/users', userRouter);
app.use('/trips', tripRouter);
app.use('/flights', flightRouter);
app.use('/stays', stayRouter);
app.use('/activities', activityRouter);

async function startServer() {
  try {
    await mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority' });
    console.log('Succesfully connected to the DB');
    app.listen(config.server.port, () => {
      console.log(`Server is listening on port ${config.server.port}`);
    });
  } catch (error) {
    console.error('Could not connect to database. Server not started.');
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('trip_update', () => {
    console.log('Trip updated');
    io.emit('trip_update');
  })

});


export default app;