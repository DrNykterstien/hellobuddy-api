import { Server as IO, Socket } from 'socket.io';
import { getUserFromSocketHeaders } from '../services/auth.service';
import ApiError from '../utils/api-error';
import Logger from '../utils/logger';
import { SocketEventsEnum } from '../constants/enums';

export function initSocketIO(io: IO) {
  return io.on('connection', async (socket: Socket) => {
    try {
      const currentUser = await getUserFromSocketHeaders(socket);
      if (!currentUser) throw new ApiError(401, 'Unauthorized handshake');
      socket.data.userId = currentUser.id;
      Logger.info(`🟢 User ID: ${socket.data.userId} - connected - (Socket ID: ${socket.id})`);
      socket.emit(SocketEventsEnum.CONNECTED_EVENT); // inform the client of the successful connection

      socket.on(SocketEventsEnum.DISCONNECT_EVENT, () => {
        Logger.info(`🔴 User ID: ${socket.data.userId} - disconnected - (Socket ID: ${socket.id})`);
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Something went wrong while connecting to the socket';
      socket.emit(SocketEventsEnum.ERROR_EVENT, message);
      if (error instanceof ApiError && error.code === 401) socket.disconnect(true);
    }
  });
}
