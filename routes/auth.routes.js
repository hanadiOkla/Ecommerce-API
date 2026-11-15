import express from "express";
import {
  sendRegisterOtp,
  verifyRegisterOtp,
  login,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register/send-otp", sendRegisterOtp);

router.post("/register/verify-otp", verifyRegisterOtp);

router.post("/login", login);

router.post("/logout", logout);

export default router;
