import { Server as IO } from 'socket.io';

export function initSocketIO(io: IO) {
  return io.on('connection', async socket => {
    try {
    } catch (error) {}
  });
}
