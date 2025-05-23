
import express from "express";
import { createRestaurant, loginOwner } from "./restaurantControllers";
import authenticate from "../../middlewares/authenticate";

const restaurantRouter = express.Router();

restaurantRouter.post("/createRestaurant", createRestaurant);

restaurantRouter.post("/ownerLogin", authenticate, loginOwner);

export default restaurantRouter;