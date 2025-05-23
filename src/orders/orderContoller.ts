import { NextFunction, Request, Response } from "express";
import orderModals from "./orderModals";
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";


// Adjust the path to your Order model
// Adjust path based on your directory structure

// Create an order
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { restaurantId, menuId, orderDate, orderQuantity, orderStatus, orderBill } = req.body;
    if (!restaurantId || !menuId || !orderQuantity || !orderDate || !orderBill) {
        return next(createHttpError(404, "All fields are required"));
    }
    try {
        const _req = req as AuthRequest;
        // create a order
        const newOrder = await orderModals.create({
            customerId: _req.userId,
            restaurantId,
            menuId,
            orderDate,
            orderQuantity,
            orderStatus,
            orderBill
        });

        res.status(201).json({ id: newOrder._id });

    } catch (error) {
        console.log("Error while creating Order", error);
    }

}
// cancel order 
const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    // cancel the order
    try {
        const cancelledorder = await orderModals.findByIdAndUpdate(
            {
                _id: orderId,
            }, {
            orderStatus: 'cancelled'
        },
            { new: true }
        );
        res.json({
            success: true,
            cancelledorder
        });
    } catch (error) {
        console.error("Error while cancelling order", error);
        next(createHttpError(500, 'Error while cancelling order'));
    }
}
// get order details
const orderDetails = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    try {
        const orderinfo = await orderModals.findOne({ _id: orderId });
        if (!orderinfo) {
            return next(createHttpError(404, "Order not found"));
        }
        return res.json({ success: true, orderinfo });
    } catch (error) {
        console.log("Error while getting order Details", error);
        return next(createHttpError(500, "Error while getting the Order  details"));
    }
};

export { createOrder, cancelOrder, orderDetails };