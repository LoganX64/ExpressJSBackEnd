import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

import { config } from "../config/config";
import { verify } from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId: string;
}
const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");
    if (!token) {
        return next(createHttpError(401, "Authorization is required"));
    }

    try {
        // Remove 'Bearer ' prefix if present
        // const parsedToken = token.startsWith("Bearer ") ? token.slice(7) : token;

        const parsedToken = token.split(" ")[1];
        // Verify and decode the token
        const decoded = verify(parsedToken, config.jwtSecret as string);
        // Cast request as AuthRequest and attach userId
        const _req = req as AuthRequest;

        _req.userId = decoded.sub as string;

        next();
    } catch (error) {
        console.error(error); // Log error details for debugging
        return next(createHttpError(401, "Expired token"));

    }
};

export default authenticate;
