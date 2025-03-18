const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const loggerMiddleware = require("./middlewares/logger.middleware");
const messageRoutes = require("./routes/chat.routes");
const Message = require("./models/message.model");

dotenv.config();
const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});


app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);


app.use("/api/auth", authRoutes);

app.use("/api/messages", messageRoutes);


app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


app.use(errorMiddleware);


connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  });


const users = new Map(); 
io.on("connection", (socket) => {
    console.log(`✅ New client connected: ${socket.id}`);
  
    socket.on("join", (userId) => {
      users.set(socket.id, userId);
      console.log(`User ${userId} connected`);
    });
  
    socket.on("private_message", async ({ senderId, receiverId, content }) => {
      const message = new Message({ sender: senderId, receiver: receiverId, content });
      await message.save();
  
      const receiverSocketId = [...users.entries()].find(([_, id]) => id === receiverId)?.[0];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", { senderId, content });
      }
    });
  
    socket.on("disconnect", () => {
      const userId = users.get(socket.id);
      users.delete(socket.id);
      console.log(`❌ User ${userId} disconnected`);
    });
  });
  
module.exports = { app, io };
