import { Server } from "socket.io";
import Redis from "ioredis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let pub, sub, redis;
let redisConnected = false;

// Create in-memory storage as a fallback
const userSockets = new Map(); // { userId: socketId }

// Redis Configuration with Proper Error Handling
const redisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => Math.min(times * 100, 2000), // Retry every 2s max
};

try {
  pub = new Redis(redisOptions);
  sub = new Redis(redisOptions);
  redis = new Redis(redisOptions);

  pub.on("error", handleRedisError);
  sub.on("error", handleRedisError);
  redis.on("error", handleRedisError);

  redis.on("connect", () => {
    redisConnected = true;
    console.log("✅ Redis connected successfully");
  });
} catch (error) {
  handleRedisError(error);
}

// Function to handle Redis errors and switch to fallback
function handleRedisError(error) {
  console.error("❌ Redis connection failed:", error.message);
  redisConnected = false;
}

if (!global.io) {
  const io = new Server(3001, { cors: { origin: "*" } });
  global.io = io;

  io.on("connection", (socket) => {
    console.log("🔵 User connected:", socket.id);

    // Register user socket ID
    socket.on("register", async (userId) => {
      if (redisConnected) {
        try {
          await redis.set(`user:${userId}`, socket.id);
        } catch (error) {
          console.error("❌ Redis SET error:", error.message);
          userSockets.set(userId, socket.id); // Fallback
        }
      } else {
        userSockets.set(userId, socket.id);
      }
      console.log(`✅ User ${userId} registered with socket ID: ${socket.id}`);
    });

    // Handle sending messages
    socket.on("sendMessage", async ({ senderId, senderType, conversationId, content }) => {
      if (!senderId || !conversationId || !content || !senderType) {
        console.error("❌ Missing data:", { senderId, senderType, conversationId, content });
        return;
      }

      console.log(`📨 Sending message in conversation ${conversationId}: ${content}`);

      // Fetch conversation participants
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { user1Id: true, user2Id: true },
      });

      if (!conversation) {
        console.error(`❌ Conversation not found: ${conversationId}`);
        return;
      }

      const receiverId = conversation.user1Id === senderId ? conversation.user2Id : conversation.user1Id;

      if (redisConnected) {
        try {
          await pub.publish(
            "chat",
            JSON.stringify({ senderId, senderType, receiverId, content, conversationId })
          );
        } catch (error) {
          console.error("❌ Redis PUB error:", error.message);
          sendMessageFallback(receiverId, senderId, senderType, content, conversationId);
        }
      } else {
        sendMessageFallback(receiverId, senderId, senderType, content, conversationId);
      }
    });

    // Fallback function to send messages using Socket.io directly
    function sendMessageFallback(receiverId, senderId, senderType, content, conversationId) {
      const receiverSocket = userSockets.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", { senderId, senderType, content, conversationId });
      }
    }

    // Handle user disconnection
    socket.on("disconnect", async () => {
      console.log("🔴 User disconnected:", socket.id);

      if (redisConnected) {
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
      } else {
        // Fallback: Remove user from in-memory map
        for (const [userId, sockId] of userSockets.entries()) {
          if (sockId === socket.id) {
            userSockets.delete(userId);
            console.log(`🗑️ Removed ${userId} from in-memory storage`);
            break;
          }
        }
      }
    });
  });

  if (redisConnected) {
    sub.subscribe("chat");
    sub.on("message", async (channel, message) => {
      try {
        const { senderId, senderType, receiverId, content, conversationId } = JSON.parse(message);

        const newMessage = await prisma.message.create({
          data: { senderId, senderType, receiverId, content, conversationId },
        });

        await prisma.conversation.update({
          where: { id: conversationId },
          data: {
            lastMessageId: newMessage.id,
            lastMessageContent: newMessage.content,
            lastMessageTimestamp: newMessage.timestamp,
            lastMessageSenderId: newMessage.senderId,
          },
        });

        const receiverSocket = await redis.get(`user:${receiverId}`);
        if (receiverSocket) {
          io.to(receiverSocket).emit("receiveMessage", { senderId, senderType, content, conversationId });
        }
      } catch (error) {
        console.error("❌ Redis SUB error:", error.message);
      }
    });
  }

  console.log("🚀 Socket.io server initialized!");
}

export const GET = async () => new Response("Socket initialized", { status: 200 });
