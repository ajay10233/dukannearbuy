import { Server } from "socket.io";
import Redis from "ioredis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const pub = new Redis(process.env.REDIS_URL);
const sub = new Redis(process.env.REDIS_URL);
const redis = new Redis(process.env.REDIS_URL);

// Ensure only one instance of io is created
if (!global.io) {
  const io = new Server(3001, { cors: { origin: "*" } });
  global.io = io;

  io.on("connection", async (socket) => {
    console.log("🔵 User connected:", socket.id);

    // Register user in Redis
    socket.on("register", async (userId) => {
      await redis.set(`user:${userId}`, socket.id);
      console.log(`✅ User ${userId} registered with socket ID: ${socket.id}`);
    });

    // Handle message sending
    socket.on("sendMessage", async ({ senderId, SenderType, receiverId, content }) => {
      if (!senderId || !receiverId || !content || !SenderType) {
        console.error("❌ Missing data:", { senderId, SenderType, receiverId, content });
        return;
      }

      console.log(`📨 Sending message from ${senderId} to ${receiverId}: ${content}`);

      try {
        // Publish message to Redis
        await pub.publish("chat", JSON.stringify({ senderId, SenderType, receiverId, content }));
        console.log("📡 Message published to Redis.");
      } catch (error) {
        console.error("❌ Error publishing to Redis:", error);
      }
    });

    // Remove user from Redis on disconnect
    socket.on("disconnect", async () => {
      console.log("🔴 User disconnected:", socket.id);

      try {
        const stream = redis.scanStream({ match: "user:*" });
        stream.on("data", async (keys) => {
          for (const key of keys) {
            const storedSocketId = await redis.get(key);
            if (storedSocketId === socket.id) {
              await redis.del(key);
              console.log(`🗑️ Removed ${key.split(":")[1]} from Redis`);
              return;
            }
          }
        });
        stream.on("error", (err) => console.error("❌ Redis scan error:", err));
      } catch (error) {
        console.error("❌ Error removing user from Redis:", error);
      }
    });
  });

  // Redis Subscriber listens for messages and forwards to users
  sub.subscribe("chat");
  sub.on("message", async (channel, message) => {
    console.log("🔔 Received message from Redis:", message);
    try {
      const { senderId, SenderType, receiverId, content } = JSON.parse(message);

      if (!senderId || !receiverId || !content || !SenderType) {
        console.error("❌ Invalid message data:", { senderId, SenderType, receiverId, content });
        return;
      }

      // Save message in MongoDB
      const savedMessage = await prisma.message.create({
        data: { senderId, senderType: SenderType, receiverId, content },
      });
      console.log("✅ Message saved:", savedMessage);

      // Fetch receiver's socket ID from Redis
      const receiverSocket = await redis.get(`user:${receiverId}`);

      if (receiverSocket) {
        global.io.to(receiverSocket).emit("receiveMessage", { senderId, SenderType, content });
        console.log(`📤 Delivered message to ${receiverId} (Socket: ${receiverSocket})`);
      }
    } catch (error) {
      console.error("❌ Error handling message:", error);
    }
  });

  console.log("🚀 Socket.io server initialized!");
}

export const GET = async () => new Response("Socket initialized", { status: 200 });
