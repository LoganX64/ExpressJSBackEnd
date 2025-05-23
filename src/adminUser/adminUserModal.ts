import mongoose from "mongoose";
import { Admin } from "./adminUserTypes";

const adminSchema = new mongoose.Schema<Admin>({

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
    userType: {
        type: String,
        required: true,
        enum: ['admin', 'user', 'restOwner'],
    },

}, { timestamps: true });

export default mongoose.model<Admin>('Admin', adminSchema)

