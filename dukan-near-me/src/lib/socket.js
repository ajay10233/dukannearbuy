// src/lib/socket.js
import { io } from "socket.io-client";

let socket;

export const initiateSocket = () => {
  
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL,{transports: ["websocket"]});
  }
  console.log(socket);
  return socket;
};

export const getSocket = () => socket;
