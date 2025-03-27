import { Server } from "socket.io";
import Redis from "ioredis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const pub = new Redis(process.env.REDIS_URL);
const sub = new Redis(process.env.REDIS_URL);
const redis = new Redis(process.env.REDIS_URL);

if (!global.io) {
  const io = new Server(3001, { cors: { origin: "*" } });
  global.io = io;

  io.on("connection", (socket) => {
    console.log("🔵 User connected:", socket.id);

    socket.on("register", async (userId) => {
      await redis.set(`user:${userId}`, socket.id);
      console.log(`✅ User ${userId} registered with socket ID: ${socket.id}`);
    });

    socket.on("sendMessage", async ({ senderId, senderType, conversationId, content }) => {
      if (!senderId || !conversationId || !content || !senderType) {
        console.error("❌ Missing data:", { senderId, senderType, conversationId, content });
        return;
      }

      console.log(`📨 Sending message in conversation ${conversationId}: ${content}`);

      // Fetch user1 and user2 from the conversationId
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { user1Id: true, user2Id: true },
      });

      if (!conversation) {
        console.error(`❌ Conversation not found: ${conversationId}`);
        return;
      }

      // Determine the receiverId (the other participant in the conversation)
      const receiverId = conversation.user1Id === senderId ? conversation.user2Id : conversation.user1Id;

      await pub.publish(
        "chat",
        JSON.stringify({ senderId, senderType, receiverId, content, conversationId })
      );
    });

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

  sub.subscribe("chat");
  sub.on("message", async (channel, message) => {
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
      global.io.to(receiverSocket).emit("receiveMessage", { senderId, senderType, content, conversationId });
    }
  });

  console.log("🚀 Socket.io server initialized!");
}

export const GET = async () => new Response("Socket initialized", { status: 200 });
