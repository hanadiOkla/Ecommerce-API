import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ConnectToDB } from "./DB/mongoose.js";

const app = express();
const port = process.env.PORT || 3000;

// الاتصال بقاعدة البيانات //
ConnectToDB();

app.use(express.json());

// Listen
app.listen(port, () => {
    console.log(`app is running on port : ${port}`);
});