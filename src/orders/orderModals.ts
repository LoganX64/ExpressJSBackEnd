import mongoose from "mongoose";
import { order } from "./orderTypes";


const orderSchema = new mongoose.Schema<order>({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant',
        required: true
    },
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItems',
        required: true
    },
    orderQuantity: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['in process', 'transit', 'cancelled', 'delivered']
    },
    orderBill: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export default mongoose.model<order>("Order", orderSchema)