import mongoose from "mongoose";
import { user } from "./userTypes";

const userSchema = new mongoose.Schema<user>({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },

}, { timestamps: true });

export default mongoose.model<user>('User', userSchema)

