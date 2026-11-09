import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { ConnectToDB } from "./DB/mongoose.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Start server
const startServer = async () => {
  try {
    await ConnectToDB();
    app.listen(port, () => {
      console.log(`app is running on port : ${port}`);
    });
  } catch (error) {
    console.error("Server not started:", error.message);
    process.exit(1);
  }
};

if (process.env.VERCEL) {
  ConnectToDB();
} else {
  startServer();
}

export default app;