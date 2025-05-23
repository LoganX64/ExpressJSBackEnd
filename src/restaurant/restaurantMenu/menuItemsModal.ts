import mongoose from "mongoose";
import { menuItems } from "./menuItemsTypes";


const menuItemsSchema = new mongoose.Schema<menuItems>({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    itemName: {
        type: String,
        require: true,
    },
    itemDescription: {
        type: String,
        require: true,
    },
    itemPrice: {
        type: Number,
        require: true,
    },
    itemImage: {
        type: String,
        required: true
    }

}, {
    timestamps: true,
});

export default mongoose.model<menuItems>('MenuItems', menuItemsSchema)