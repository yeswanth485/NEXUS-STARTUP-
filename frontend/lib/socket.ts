'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = (userId: string) => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
    s.emit('user:online', userId);
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};
