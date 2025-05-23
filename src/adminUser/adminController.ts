import adminUserModal from "./adminUserModal";
import { Admin } from "./adminUserTypes";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

//Create new admin
const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    // Extract and validate input
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    try {
        // Check if user already exists
        const existinguser = await adminUserModal.findOne({ email });
        if (existinguser) {
            return next(createHttpError(
                400,
                "Admin already exists with this email"
            ));

        }
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Error while Getting admin"));
    }

    //Hash the password

    const hashPassword = await bcrypt.hash(password, 10);
    // Create new admin
    let newAdmin: Admin;
    try {
        newAdmin = await adminUserModal.create({
            name,
            email,
            password: hashPassword,
            userType: "admin",
        });
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Error whie creating user"));
    }

    // Generate JWT token

    try {
        const token = sign({ sub: newAdmin._id }, config.jwtSecret as string, {
            expiresIn: "7d",
        });

        // Respond with token
        res.status(201).json({ accesstoken: token });
    } catch (err) {
        console.log(err);
        return next(createHttpError(500, "error while signing the token"));
    }
};

//admin login
const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(createHttpError(400, "All fields are required"));
    }
    try {
        const adminUser = await adminUserModal.findOne({ email });
        if (!adminUser) {
            return next(createHttpError(404, "Admin not available"));
        }
        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (!isMatch) {
            return next(createHttpError(401, "Invalid credentials"));
        }
        //create access token
        const token = sign({ sub: adminUser._id }, config.jwtSecret as string, {
            expiresIn: "1d",
        });

        res.json({ accesstoken: token });
    } catch (err) {
        console.log(err);
        return next(createHttpError(500, "Internal Server Error"));
    }
};

export { loginAdmin, createAdmin };
