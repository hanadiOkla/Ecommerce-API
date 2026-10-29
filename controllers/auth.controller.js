import User from "../models/User.model.js";
import OTP from "../models/OTP.model.js";
import JWT from "jsonwebtoken";
import {sendEmail}  from "../utils/sendEmail.js";
import bcryptjs from "bcryptjs";

export const sendRegisterOtp = async (req , res)=>{
  try {
    const {username, email, password, phone} = req.body

    const existingUser = await User.findOne({email : email})
    if(existingUser){
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    // delete old OTP
    await OTP.deleteMany({email})

    await OTP.create({
      email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      userData: {
        email, username, password, phone
      }
    })

    // send Email
    await sendEmail(
      email,
      "Verify Your Account",  //subject
      `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Email Verification</h2>

        <p>Your verification code is:</p>

        <h1 style="color:#2563eb;">
        ${otp}
        </h1>
      
        <p>
            This code will expire in 10 minutes.
        </p>
      </div>      
      `
    )

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    })

    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}