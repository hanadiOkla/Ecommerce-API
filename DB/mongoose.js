import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const ConnectToDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(`DB is Connected Successfully!`);
    })
    .catch((error) => {
      console.log(`Error. : ${error}`);
    });
};
