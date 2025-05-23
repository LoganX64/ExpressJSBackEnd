import mongoose from "mongoose";
import { restaurant } from "./restaurantTypes";

const restaurantSchema = new mongoose.Schema<restaurant>({
    restaurantEmail: {
        type: String,
        required: true
    },
    restaurantPwd: {
        type: String,
        required: [true, "password is required"]
    },
    restaurantName: {
        type: String,
        required: true
    },
    restaurantAddress: {
        type: String,
        required: true
    },
    restaurantPhoneNo: {
        type: Number,
        required: true,
        unique: true
    }
}, { timestamps: true });

export default mongoose.model<restaurant>('restaurant', restaurantSchema)