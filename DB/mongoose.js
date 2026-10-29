import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

////////////////////////////////////////////////////////////////////

// Listen to connection events
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully!");
});

mongoose.connection.on("error", (error) => {
  console.log("MongoDB connection error:", error.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

////////////////////////////////////////////////////////////////////

export const ConnectToDB = async () => {
  
  try{
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is missing from .env file");
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection
    }
      await  mongoose
      .connect(process.env.MONGO_URL)
     
        console.log(`DB is Connected Successfully!`)

  }catch (error) {
    const message = error.message || ""
    const errorCode = error.code

    if (message.includes("MONGO_URL is missing")) {
      console.error("Configuration Error: MONGO_URL is missing from .env")
    } else if (
      errorCode === 8000 ||
      message.includes("bad auth") ||
      message.includes("Authentication failed")
    ) {
      console.error(
        "Authentication Error: Check your MongoDB username and password."
      )
    } else if (
      message.includes("ENOTFOUND") ||
      message.includes("querySrv") ||
      message.includes("Invalid scheme") ||
      message.includes("Invalid connection string")
    ) {
      console.error(
        "Connection URL Error: Check your MongoDB Atlas connection URL."
      )
    } else if (
      message.includes("IP") ||
      message.includes("whitelist") ||
      message.includes("ECONNREFUSED") ||
      message.includes("ETIMEDOUT") ||
      message.includes("Server selection")
    ) {
      console.error(
        "Network Error: Check Atlas Network Access, your internet, and cluster status."
      )
    } else {
      console.error("MongoDB Error:", message)
    }

    throw error
  }
}
