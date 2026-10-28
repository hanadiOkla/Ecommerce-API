import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  postalCode: { type: String, trim: true },
});
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
   password: {
  type: String,
  required: [true, "Password is required"],
  minlength: [6, "Password must be at least 6 characters"],
  select: false,
},
    phone: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,

    },
    role: {
        type: String,
        enum: ["admin", "customer"],
        default: "customer"
    },
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken:String,
    resetPasswordExpire: Date,

},
    { timestamps: true }

)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;