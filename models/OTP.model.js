import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
// OTP-Schema
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  userData: {
    type: Object,
  }
  })

// Automatically delete expired documents using a TTL(Time-to-Live) index
// This tells MongoDB to remove the document from the collection when expiresAt is reached
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save hook
otpSchema.pre('save', async function () {
  const doc = this; // => Document

  if (doc.isModified('otp')) {
    doc.otp = await bcryptjs.hash(doc.otp, 10);
  }
});

//method compareOtp
otpSchema.methods.compareOtp = async function (enteredOtp) {
  return await bcryptjs.compare(enteredOtp, this.otp);
};

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;