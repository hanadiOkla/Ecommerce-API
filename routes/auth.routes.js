import express from 'express';
import { sendRegisterOtp, verifyRegisterOtp } from '../controllers/auth.controller.js';

const router = express.Router();

// 1. Send Register OTP Route
router.post('/register/send-otp', sendRegisterOtp);

// 2. Verify Register OTP & Create User Route
router.post('/register/verify-otp', verifyRegisterOtp);

export default router;