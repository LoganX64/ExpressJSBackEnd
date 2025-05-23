import { Request, Response, NextFunction } from "express";
import { restaurant } from "./restaurantTypes";
import registerRestaurantModal from "./registerRestaurantModal";
import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import { sign } from "jsonwebtoken";
import { config } from "../../config/config";


// create restaurant owners
const createRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    const { restaurantEmail, restaurantPwd, restaurantName, restaurantAddress, restaurantPhoneNo } = req.body;

    // Validate input
    if (!restaurantEmail || !restaurantPwd || !restaurantName || !restaurantAddress || !restaurantPhoneNo) {
        const error = createHttpError(400, "All fields are Required");
        return next(error);
    }

    try {
        // Check if restaurant owner already exists
        const existingOwner = await registerRestaurantModal.findOne({ restaurantEmail });
        if (existingOwner) {
            const error = createHttpError(400, "Restaurant owner already exists with this email");
            return next(error);
        }

    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Error while getting User"));
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(restaurantPwd, 10);

    // Create new restaurant owner
    let newOwner: restaurant;
    try {
        newOwner = await registerRestaurantModal.create({
            restaurantEmail,
            restaurantPwd: hashPassword,
            restaurantName,
            restaurantAddress,
            restaurantPhoneNo
        });
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Error while creating User"));
    }
    // Generate JWT token
    try {
        const token = sign({ sub: newOwner._id }, config.jwtSecret as string, { expiresIn: "1d" });
        // Respond with the token
        res.status(201).json({ accesstoken: token });
    } catch (error) {
        console.log("Error while creating token", error);
        return next(createHttpError(500, "Internal server error while Token"));
    }
};


//login restaurant owner
const loginOwner = async (req: Request, res: Response, next: NextFunction) => {

    const { restaurantEmail, restaurantPwd } = req.body;

    // Validate input
    if (!restaurantEmail || !restaurantPwd) {
        return next(createHttpError(400, "All fields are required"));
    }

    try {
        // Find restaurant Owner by email
        const restOwner = await registerRestaurantModal.findOne({ restaurantEmail });
        // If restOwner is not found, return a 404 error
        if (!restOwner) {
            return next(createHttpError(404, "Restaurant owner not found"));
        }
        // Compare provided password with the stored hashed password
        const isMatch = await bcrypt.compare(restaurantPwd, restOwner.restaurantPwd);
        // If passwords do not match, return a 401 error
        if (!isMatch) {
            return next(createHttpError(400, "Invalid credentials"));
        }
        // Create access token
        const token = sign({ sub: restOwner._id }, config.jwtSecret as string, { expiresIn: "7d" });
        // Respond with the token
        res.json({ accesstoken: token });
    } catch (error) {
        console.error('Login error:', error);
        return next(createHttpError(500, 'Internal server error during login'));
    }
};
export { createRestaurant, loginOwner };