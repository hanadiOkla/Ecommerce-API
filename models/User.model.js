import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { type } from "node:os";
import { number, required } from "joi";

const userSchema =  new mongoose.Schema({
    firstName: {
        type: String ,
        trim: true,
        required: true
    },
    lastName: {
        type: String ,
        trim: true,
        required: true
    },
    email: {
        type: String ,
        unique: true,
        trim: true,
    },
    phone: {
        type: String ,
        trim: true,
    },
    age: {
        type: number ,
    },
    password: {
        type: String,
        trim: true 
    }
})

const User = mongoose.model("User" , userSchema)
export default User