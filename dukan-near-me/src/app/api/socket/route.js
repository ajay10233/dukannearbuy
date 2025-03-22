import { Server } from "socket.io";
import Redis from "ioredis";

// Initialize Redis clients
const redis = new Redis(process.env.REDIS_URL);
const pub = new Redis(process.env.REDIS_URL);
const sub = new Redis(process.env.REDIS_URL);

export const GET = (req, { params }) => {
  if (!global.io) {
    const io = new Server(3001, { cors: { origin: "*" } });
    global.io = io;

    io.on("connection", async (socket) => {
      console.log("User connected:", socket.id);

      // Register user and store socket ID in Redis
      socket.on("register", async (userId) => {
        await redis.set(`user:${userId}`, socket.id);
        console.log(`User ${userId} registered with socket ID: ${socket.id}`);
      });

      // Private Messaging using Redis Pub/Sub
      socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
        console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
        await pub.publish("chat", JSON.stringify({ senderId, receiverId, message }));
      });

      // Handle disconnection and remove user from Redis
      socket.on("disconnect", async () => {
        console.log("User disconnected:", socket.id);
        const userKeys = await redis.keys("user:*");

        for (const key of userKeys) {
          const storedSocketId = await redis.get(key);
          if (storedSocketId === socket.id) {
            await redis.del(key);
            console.log(`User ${key.split(":")[1]} removed from Redis`);
            break;
          }
        }
      });
    });

    // Redis Subscriber listens for messages and delivers them to the right socket
    sub.subscribe("chat");
    sub.on("message", async (channel, message) => {
      const { senderId, receiverId, message: msg } = JSON.parse(message);
      const receiverSocket = await redis.get(`user:${receiverId}`);

      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", { senderId, message: msg });
      }
    });

    console.log("Socket.io server with Redis initialized!");
  }

  return new Response("Socket initialized", { status: 200 });
};
