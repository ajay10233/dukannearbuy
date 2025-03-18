const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");

const errorMiddleware = require("./middlewares/error.middleware");
const loggerMiddleware = require("./middlewares/logger.middleware");

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

// Connect to MongoDB
connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}).catch(err => console.error("DB Connection Error:", err));

module.exports = app;