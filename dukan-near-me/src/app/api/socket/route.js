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
    // * institution application functionality for live token updation
    socket.on("joinInstitutionRoom", async (institutionId) => {
      if (!institutionId) return console.error("❌ Missing institutionId");
      socket.join(`institution:${institutionId}`);
      console.log(`👥 User joined institution room: ${institutionId}`);
      const activeToken = await prisma.token.findFirst({
        where: { institutionId, completed: false },
        orderBy: { createdAt: "desc" },
      });

      const completedTokens = await prisma.token.findMany({
        where: { institutionId, completed: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      socket.emit("tokenUpdated", activeToken);
      socket.emit("completedTokensUpdated", completedTokens);
    });

    // Emit new token to all users viewing the institution's page
    socket.on("newToken", async ({ institutionId, token }) => {
      console.log(`🎫 New token for institution ${institutionId}:`, token);
      io.to(`institution:${institutionId}`).emit("tokenUpdated", token);
    });

    // Handle token completion & notify all users in the room
    socket.on("completeToken", async ({ institutionId, tokenId }) => {
      console.log(`✅ Token ${tokenId} completed for institution ${institutionId}`);

      await prisma.token.update({
        where: { id: tokenId },
        data: { completed: true },
      });

      const completedTokens = await prisma.token.findMany({
        where: { institutionId, completed: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      io.to(`institution:${institutionId}`).emit("completedTokensUpdated", completedTokens);
    });








    // * chat application functionality
    // Register user with their socket ID
    socket.on("register", async (userId) => {
      if (!userId) return console.error("❌ Missing userId in register event");
      await redis.set(`user:${userId}`, socket.id);
      console.log(`✅ User ${userId} registered with socket ID: ${socket.id}`);
    });

    // Send message event
    socket.on("sendMessage", async ({ senderId, senderType, receiverId, conversationId, content,timestamp }) => {
      
      if (!senderId || !receiverId || !content || !senderType) {
        console.error("❌ Missing required fields:", { senderId, senderType, receiverId, conversationId, content });
        return;
      }
      console.log("senderId: ", senderId, " receiverId: ", receiverId, " conversationId: ", conversationId, " content: ", content);

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

      await pub.publish(
        "chat",
        JSON.stringify({ senderId, senderType, receiverId, content, conversationId,timestamp })
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

  sub.subscribe("chat");
  sub.on("message", async (channel, message) => {
    if (channel !== "chat") return;

    const { senderId, senderType, receiverId, content, conversationId, timestamp } = JSON.parse(message);

    console.log(`📩 Redis event received: Message from ${senderId} to ${receiverId} in conversation ${conversationId}`);

    const receiverSocket = await redis.get(`user:${receiverId}`);
    if (receiverSocket) {
      global.io.to(receiverSocket).emit("receiveMessage", { senderId, senderType, receiverId, content, conversationId,timestamp });
      console.log(`📤 Message sent to ${receiverId} via socket ${receiverSocket}`);
    }
  });

  console.log("🚀 Socket.io server initialized!");
}

export const GET = async () => new Response("Socket initialized", { status: 200 });
