import { Server } from "socket.io";
import { prisma } from "@/utils/db";

const userSockets = new Map(); // userId -> Set of socketIds
const userStatus = new Map();  // userId -> "online" | "offline"

if (!global.io) {
  const io = new Server(3001, { cors: { origin: "*" } });
  global.io = io;

  io.on("connection", (socket) => {
    console.log("🔵 User connected:", socket.id);

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
        include: {
          user: {
            select: {
              username: true,
              mobileNumber: true,
            },
          },
        },
      });

      socket.emit("tokenUpdated", activeToken);
      socket.emit("completedTokensUpdated", completedTokens);
    });

    socket.on("newToken", async ({ institutionId, token }) => {
      let enrichedToken = token;
      if (token.userId) {
        const user = await prisma.user.findUnique({
          where: { id: token.userId },
          select: { username: true, mobileNumber: true },
        });

        if (user) {
          enrichedToken = { ...token, ...user };
        }
      }

      io.to(`institution:${institutionId}`).emit("tokenUpdated", enrichedToken);
    });

    socket.on("startProcessing", async ({ institutionId, tokenId }) => {
      const processingToken = await prisma.token.update({
        where: { id: tokenId },
        data: { processing: true },
        include: {
          user: {
            select: {
              username: true,
              mobileNumber: true,
            },
          },
        },
      });

      const tokenWithUser = {
        ...processingToken,
        username: processingToken.user?.username || null,
        mobileNumber: processingToken.user?.mobileNumber || null,
      };

      io.to(`institution:${institutionId}`).emit("processingTokenUpdated", tokenWithUser);
    });

    socket.on("completeToken", async ({ institutionId, tokenId }) => {
      await prisma.token.update({
        where: { id: tokenId },
        data: { completed: true, processing: false },
      });

      const completedTokens = await prisma.token.findMany({
        where: { institutionId, completed: true },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: {
            select: {
              username: true,
              mobileNumber: true,
            },
          },
        },
      });

      const enriched = completedTokens.map((t) => ({
        ...t,
        username: t.user?.username || null,
        mobileNumber: t.user?.mobileNumber || null,
      }));

      io.to(`institution:${institutionId}`).emit("completedTokensUpdated", enriched);
    });

    socket.on("getCurrentProcessingTokens", async (institutionId, callback) => {
      if (!institutionId) return callback([]);

      try {
        const processingTokens = await prisma.token.findMany({
          where: { institutionId, processing: true, completed: false },
          include: {
            user: {
              select: {
                username: true,
                mobileNumber: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        });
        callback(processingTokens);
      } catch (error) {
        console.error("❌ Error fetching processing tokens:", error);
        callback([]);
      }
    });

    // Chat features
    socket.on("register", async (userId) => {
      if (!userId) return console.error("❌ Missing userId in register event");

      if (!userSockets.has(userId)) userSockets.set(userId, new Set());
      userSockets.get(userId).add(socket.id);
      userStatus.set(userId, "online");

      io.emit("presenceUpdate", { userId, status: "online" });
    });

    socket.on("sendMessage", async ({ senderId, senderType, receiverId, conversationId, content, timestamp }) => {
      if (!senderId || !receiverId || !content || !senderType) return;

      if (!conversationId) {
        const existingConversation = await prisma.conversation.findFirst({
          where: {
            OR: [
              { user1Id: senderId, user2Id: receiverId },
              { user1Id: receiverId, user2Id: senderId },
            ],
          },
          select: { id: true },
        });

        if (existingConversation) {
          conversationId = existingConversation.id;
        } else {
          const newConversation = await prisma.conversation.create({
            data: { user1Id: senderId, user2Id: receiverId },
          });
          conversationId = newConversation.id;
        }
      }

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

      const sockets = userSockets.get(receiverId) || new Set();
      sockets.forEach((sid) => {
        io.to(sid).emit("receiveMessage", {
          senderId, senderType, receiverId, content, conversationId, timestamp
        });
      });
    });

    socket.on("disconnect", () => {
      for (const [userId, sockets] of userSockets.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            userSockets.delete(userId);
            userStatus.set(userId, "offline");
            io.emit("presenceUpdate", { userId, status: "offline" });
            console.log(`⚫ User ${userId} is offline`);
          }
          break;
        }
      }
    });
  });

  console.log("🚀 Socket.io server initialized (no Redis)!");
}

export const GET = async () => new Response("Socket initialized (no Redis)", { status: 200 });



// Previous code for 23-04-25

// import { Server } from "socket.io";
// import Redis from "ioredis";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// const pub = new Redis(process.env.REDIS_URL);
// const sub = new Redis(process.env.REDIS_URL);
// const redis = new Redis(process.env.REDIS_URL);

// if (!global.io) {
//   const io = new Server(3001, { cors: { origin: "*" } });
//   global.io = io;

//   io.on("connection", (socket) => {
//     console.log("🔵 User connected:", socket.id);
//     // * institution application functionality for live token updation
//     socket.on("joinInstitutionRoom", async (institutionId) => {
//       if (!institutionId) return console.error("❌ Missing institutionId");
//       socket.join(`institution:${institutionId}`);
//       console.log(`👥 User joined institution room: ${institutionId}`);
//       const activeToken = await prisma.token.findFirst({
//         where: { institutionId, completed: false },
//         orderBy: { createdAt: "desc" },
//       });

//       const completedTokens = await prisma.token.findMany({
//         where: { institutionId, completed: true },
//         orderBy: { createdAt: "desc" },
//         include:{
//           user: {
//             select: {
//               username: true,
//               mobileNumber: true,
//             },
//           },
//         },
//         take: 10,
//       });

//       console.log(`🎫 Active token for institution ${institutionId}:`, activeToken);

//       socket.emit("tokenUpdated", activeToken);
//       socket.emit("completedTokensUpdated", completedTokens);
//     });

//     // Emit new token to all users viewing the institution's page
//     socket.on("newToken", async ({ institutionId, token }) => {
//       console.log(`🎫 New token for institution ${institutionId}:`, token);
//       // Fetch associated user details if userId exists
//       let enrichedToken = token;
//       if (token.userId) {
//         const user = await prisma.user.findUnique({
//           where: { id: token.userId },
//           select: { username: true, mobileNumber: true },
//         });

//         if (user) {
//           enrichedToken = {
//             ...token,
//             username: user.username,
//             mobileNumber: user.mobileNumber,
//           };
//         }
//       }
//       io.to(`institution:${institutionId}`).emit("tokenUpdated", enrichedToken);
//     });

//     // Handle token completion & notify all users in the room
//     // Socket Server
//     socket.on("startProcessing", async ({ institutionId, tokenId }) => {
//       // await prisma.token.updateMany({
//       //   where: { institutionId },
//       //   data: { processing: false }, // Unset all processing
//       // });
    
//       const processingToken = await prisma.token.update({
//         where: { id: tokenId },
//         data: { processing: true },
//         include: {
//           user: {
//             select: {
//               username: true,
//               mobileNumber: true,
//             },
//           },
//         },
//       });
    
//       const tokenWithUser = {
//         ...processingToken,
//         username: processingToken.user?.username || null,
//         mobileNumber: processingToken.user?.mobileNumber || null,
//       };
      
//       io.to(`institution:${institutionId}`).emit("processingTokenUpdated", tokenWithUser);
      
//     });
    


//   // Set a token to completed
//   socket.on("completeToken", async ({ institutionId, tokenId }) => {
//     const completedToken = await prisma.token.update({
//       where: { id: tokenId },
//       data: { completed: true, processing: false },
//     });

//     const completedTokens = await prisma.token.findMany({
//       where: { institutionId, completed: true },
//       orderBy: { createdAt: "desc" },
//       take: 10,
//       include: {
//         user: {
//           select: {
//             username: true,
//             mobileNumber: true,
//           },
//         },
//       },
//     });
    
//     const enrichedCompletedTokens = completedTokens.map((t) => ({
//       ...t,
//       username: t.user?.username || null,
//       mobileNumber: t.user?.mobileNumber || null,
//     }));
    
//     io.to(`institution:${institutionId}`).emit("completedTokensUpdated", enrichedCompletedTokens);
//   });

//   socket.on("getCurrentProcessingTokens", async (institutionId, callback) => {
//     if (!institutionId) return callback([]);
  
//     try {
//       const processingTokens = await prisma.token.findMany({
//         where: {
//           institutionId,
//           processing: true,
//           completed: false,
//         },
//         include: {
//           user: {
//             select: {
//               username: true,
//               mobileNumber: true,
//             },
//           },
//         },
//         orderBy: { createdAt: "asc" },
//       });
  
//       callback(processingTokens);
//     } catch (error) {
//       console.error("❌ Error fetching processing tokens:", error);
//       callback([]);
//     }
//   });
  









//     // * chat application functionality
//     // Register user with their socket ID
//     socket.on("register", async (userId) => {
//       if (!userId) return console.error("❌ Missing userId in register event");
//       const userKey = `user:${userId}:sockets`;
//       // Add socket ID to the user's socket set
//       await redis.sadd(userKey, socket.id);
//       await redis.set(`user:${userId}:status`, "online");
//       // await redis.expire(`user:${userId}:status`, 60 * 5);
//       await redis.expire(`user:${userId}:status`, 60);
//       console.log(`\n\n\nRegistration invoked\n\n\n`);
//       pub.publish("presence", JSON.stringify({ userId, status: "online" }));
//     });

//     socket.on("sendMessage", async ({ senderId, senderType, receiverId, conversationId, content,timestamp }) => {
      
//       if (!senderId || !receiverId || !content || !senderType) {
//         console.error("❌ Missing required fields:", { senderId, senderType, receiverId, conversationId, content });
//         return;
//       }
//       console.log("senderId: ", senderId, " receiverId: ", receiverId, " conversationId: ", conversationId, " content: ", content);

//       if (!conversationId) {
//         console.log("senderId: ", senderId, " receiverId: ", receiverId,"_______________________");
//         const existingConversation = await prisma.conversation.findFirst({
//           where: {
//             OR: [
//               { user1Id: senderId, user2Id: receiverId },
//               { user1Id: receiverId, user2Id: senderId },
//             ],
//           },
//           select: { id: true },
//         });

//         console.log("existingConversation: ", existingConversation);

//         if (existingConversation) {
//           conversationId = existingConversation.id;
//         } else {
//           const newConversation = await prisma.conversation.create({
//             data: { user1Id: senderId, user2Id: receiverId },
//           });
//           conversationId = newConversation.id;
//         }
//       }

//       console.log(`📨 Sending message in conversation ${conversationId}: ${content}`);

//       const newMessage = await prisma.message.create({
//         data: { senderId, senderType, receiverId, content, conversationId },
//       });

//       await prisma.conversation.update({
//         where: { id: conversationId },
//         data: {
//           lastMessageId: newMessage.id,
//           lastMessageContent: newMessage.content,
//           lastMessageTimestamp: newMessage.timestamp,
//           lastMessageSenderId: newMessage.senderId,
//         },
//       });

//       await pub.publish(
//         "chat",
//         JSON.stringify({ senderId, senderType, receiverId, content, conversationId,timestamp })
//       );
//     });

//     socket.on("disconnect", async () => {
//       const stream = redis.scanStream({ match: "user:*:sockets" });
    
//       stream.on("data", async (keys) => {
//         for (const key of keys) {
//           const userId = key.split(":")[1];
//           const removed = await redis.srem(key, socket.id);
    
//           // If that was the last socket, set status to offline
//           const remainingSockets = await redis.scard(key);
//           if (remainingSockets === 0) {
//             await redis.set(`user:${userId}:status`, "offline");
//             await redis.del(key);
//             pub.publish("presence", JSON.stringify({ userId, status: "offline" }));
//             console.log(`⚫ User ${userId} is offline`);
//           }
//         }
//       });
    
//       stream.on("error", (err) => console.error("❌ Redis scan error on disconnect:", err));
//     });
    
//   });

//   sub.subscribe("chat");
//   sub.on("message", async (channel, message) => {
//     if (channel !== "chat") return;

//     const { senderId, senderType, receiverId, content, conversationId, timestamp } = JSON.parse(message);

//     console.log(`📩 Redis event received: Message from ${senderId} to ${receiverId} in conversation ${conversationId}`);

//     const receiverSocket = await redis.get(`user:${receiverId}`);
//     if (receiverSocket) {
//       global.io.to(receiverSocket).emit("receiveMessage", { senderId, senderType, receiverId, content, conversationId,timestamp });
//       console.log(`📤 Message sent to ${receiverId} via socket ${receiverSocket}`);
//     }
//   });

//   sub.subscribe("presence");

//   sub.on("message", (channel, message) => {
//     if (channel !== "presence") return;
//     const { userId, status } = JSON.parse(message);
//     console.log(`🔄 Presence update: ${userId} is now ${status}`);
//     global.io.emit("presenceUpdate", { userId, status });
//   });

//   console.log("🚀 Socket.io server initialized!");
// }

// export const GET = async () => new Response("Socket initialized", { status: 200 });
