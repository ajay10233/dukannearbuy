import { Server } from "socket.io";

const users = {}; // Store user socket connections

export const GET = (req, { params }) => {
  if (!global.io) {
    const io = new Server(3001, { cors: { origin: "*" } });
    global.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Store user with socket ID
      socket.on("register", (userId) => {
        users[userId] = socket.id;
        console.log(`User ${userId} registered with socket ID: ${socket.id}`);
      });

      // Private Messaging
      socket.on("sendMessage", ({ senderId, receiverId, message }) => {
        console.log(`Message from ${senderId} to ${receiverId}: ${message}`);

        const receiverSocket = users[receiverId];
        if (receiverSocket) {
          io.to(receiverSocket).emit("receiveMessage", { senderId, message });
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        const userId = Object.keys(users).find((key) => users[key] === socket.id);
        if (userId) {
          delete users[userId];
        }
      });
    });

    console.log("Socket.io server initialized!");
  }

  return new Response("Socket initialized", { status: 200 });
};
