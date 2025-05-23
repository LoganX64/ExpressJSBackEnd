import express from "express";
import { createOrder, cancelOrder, orderDetails } from "./orderContoller";
import authenticate from "../middlewares/authenticate";

const orderRouter = express.Router();

orderRouter.post("/createorder",
    authenticate,
    createOrder);

orderRouter.post("/cancelorder/:orderId",
    authenticate,
    cancelOrder);

orderRouter.get("/orderdetails/:orderId",
    authenticate,
    orderDetails);

export default orderRouter;