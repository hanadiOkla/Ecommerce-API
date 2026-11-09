import express from "express";
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js';
import{ ConnectToDB } from "./DB/mongoose.js"
import morgan from "morgan";
dotenv.config();
//import dns from "dns";

const app = express();
const port =  process.env.PORT || 3000
//dns.setServers(["8.8.8.8" , "8.8.4.4"]);

app.use(express.json());
app.use(morgan("dev"))

app.use('/api/auth', authRoutes);



ConnectToDB()
//Listen 
app.listen(port, () => {
    console.log(`app is running on port : ${port}`);
})