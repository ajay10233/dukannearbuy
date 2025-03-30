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

    // Register user with their socket ID
    socket.on("register", async (userId) => {
      if (!userId) return console.error("❌ Missing userId in register event");
      await redis.set(`user:${userId}`, socket.id);
      console.log(`✅ User ${userId} registered with socket ID: ${socket.id}`);
    });

    // Send message event
    socket.on("sendMessage", async ({ senderId, senderType, receiverId, conversationId, content }) => {
      
      if (!senderId || !receiverId || !content || !senderType) {
        console.error("❌ Missing required fields:", { senderId, senderType, receiverId, conversationId, content });
        return;
      }

      if (!conversationId) {
        console.log("senderId: ", senderId, " receiverId: ", receiverId,"_______________________");
        const existingConversation = await prisma.conversation.findFirst({
          where: {
            OR: [
              { user1Id: senderId, user2Id: receiverId },
              { user1Id: receiverId, user2Id: senderId },
            ],
          },
          select: { id: true },
        });

        console.log("existingConversation: ", existingConversation);

        if (existingConversation) {
          conversationId = existingConversation.id;
        } else {
          const newConversation = await prisma.conversation.create({
            data: { user1Id: senderId, user2Id: receiverId },
          });
          conversationId = newConversation.id;
        }
      }

      console.log(`📨 Sending message in conversation ${conversationId}: ${content}`);

      // Save message to the database
      const newMessage = await prisma.message.create({
        data: { senderId, senderType, receiverId, content, conversationId },
      });

      // Update conversation with last message details
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageId: newMessage.id,
          lastMessageContent: newMessage.content,
          lastMessageTimestamp: newMessage.timestamp,
          lastMessageSenderId: newMessage.senderId,
        },
      });

      // Publish message via Redis for real-time syncing
      await pub.publish(
        "chat",
        JSON.stringify({ senderId, senderType, receiverId, content, conversationId })
      );
    });

    // Handle user disconnection
    socket.on("disconnect", async () => {
      console.log("🔴 User disconnected:", socket.id);

      try {
        const stream = redis.scanStream({ match: "user:*" });

        stream.on("data", async (keys) => {
          for (const key of keys) {
            const storedSocketId = await redis.get(key);
            if (storedSocketId === socket.id) {
              await redis.del(key);
              console.log(`🗑️ Removed user ${key.split(":")[1]} from Redis`);
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

  // Subscribe to Redis chat messages
  sub.subscribe("chat");
  sub.on("message", async (channel, message) => {
    if (channel !== "chat") return;

    const { senderId, senderType, receiverId, content, conversationId } = JSON.parse(message);

    console.log(`📩 Redis event received: Message from ${senderId} to ${receiverId} in conversation ${conversationId}`);

    // Fetch receiver's socket ID from Redis
    const receiverSocket = await redis.get(`user:${receiverId}`);
    if (receiverSocket) {
      global.io.to(receiverSocket).emit("receiveMessage", { senderId, senderType, content, conversationId });
      console.log(`📤 Message sent to ${receiverId} via socket ${receiverSocket}`);
    }
  });

  console.log("🚀 Socket.io server initialized!");
}

export const GET = async () => new Response("Socket initialized", { status: 200 });
