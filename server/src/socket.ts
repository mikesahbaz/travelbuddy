import { Server as IoServer } from 'socket.io';
import { Server } from 'http';

let io: IoServer;

export const startIoServer = (server: Server) => {
  io = new IoServer(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
    });
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}

export const getIo = () => {
  return io;
}
