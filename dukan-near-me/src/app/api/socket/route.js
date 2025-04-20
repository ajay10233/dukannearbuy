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
    // Socket Server
    socket.on("startProcessing", async ({ institutionId, tokenId }) => {
      // await prisma.token.updateMany({
      //   where: { institutionId },
      //   data: { processing: false }, // Unset all processing
      // });
    
      const processingToken = await prisma.token.update({
        where: { id: tokenId },
        data: { processing: true },
      });
    
      io.to(`institution:${institutionId}`).emit("processingTokenUpdated", processingToken);
    });
    


  // Set a token to completed
  socket.on("completeToken", async ({ institutionId, tokenId }) => {
    const completedToken = await prisma.token.update({
      where: { id: tokenId },
      data: { completed: true, processing: false },
    });

    const completedTokens = await prisma.token.findMany({
      where: { institutionId, completed: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    io.to(`institution:${institutionId}`).emit("completedTokensUpdated", completedTokens);
  });

  socket.on("getCurrentProcessingTokens", async (institutionId, callback) => {
    if (!institutionId) return callback([]);
  
    try {
      const processingTokens = await prisma.token.findMany({
        where: {
          institutionId,
          processing: true,
          completed: false,
        },
        orderBy: { createdAt: "asc" },
      });
  
      callback(processingTokens);
    } catch (error) {
      console.error("❌ Error fetching processing tokens:", error);
      callback([]);
    }
  });
  









    // * chat application functionality
    // Register user with their socket ID
    socket.on("register", async (userId) => {
      if (!userId) return console.error("❌ Missing userId in register event");
      const userKey = `user:${userId}:sockets`;
      // Add socket ID to the user's socket set
      await redis.sadd(userKey, socket.id);
      await redis.set(`user:${userId}:status`, "online");
      // await redis.expire(`user:${userId}:status`, 60 * 5);
      await redis.expire(`user:${userId}:status`, 60);
      console.log(`\n\n\nRegistration invoked\n\n\n`);
      pub.publish("presence", JSON.stringify({ userId, status: "online" }));
    });

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
      const stream = redis.scanStream({ match: "user:*:sockets" });
    
      stream.on("data", async (keys) => {
        for (const key of keys) {
          const userId = key.split(":")[1];
          const removed = await redis.srem(key, socket.id);
    
          // If that was the last socket, set status to offline
          const remainingSockets = await redis.scard(key);
          if (remainingSockets === 0) {
            await redis.set(`user:${userId}:status`, "offline");
            await redis.del(key);
            pub.publish("presence", JSON.stringify({ userId, status: "offline" }));
            console.log(`⚫ User ${userId} is offline`);
          }
        }
      });
    
      stream.on("error", (err) => console.error("❌ Redis scan error on disconnect:", err));
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

  sub.subscribe("presence");

  sub.on("message", (channel, message) => {
    if (channel !== "presence") return;
    const { userId, status } = JSON.parse(message);
    console.log(`🔄 Presence update: ${userId} is now ${status}`);
    global.io.emit("presenceUpdate", { userId, status });
  });

  console.log("🚀 Socket.io server initialized!");
}

export const GET = async () => new Response("Socket initialized", { status: 200 });
