// src/lib/socket.js
import { io } from "socket.io-client";

let socket;

export const initiateSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3002",{transports: ["websocket"]});
  }
  console.log(socket);
  return socket;
};

export const getSocket = () => socket;
