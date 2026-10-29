import express from "express";
import dotenv from "dotenv";
import{ ConnectToDB } from "./DB/mongoose.js"
dotenv.config();
//import dns from "dns";

const app = express();
const port =  process.env.PORT || 3000
//dns.setServers(["8.8.8.8" , "8.8.4.4"]);

app.get("/" ,(req , res )=>{
    res.send("the page is home this is page is important")
})

  
ConnectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`app is running on port : ${port}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });
// //////////////////////////////////////////////////
