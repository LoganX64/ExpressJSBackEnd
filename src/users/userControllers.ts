import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModal from "./userModal";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { user } from "./userTypes";

//Create new User
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  // Extract and validate input
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  try {
    // Check if user already exists
    const user = await userModal.findOne({ email: email.toLowerCase() });
    if (user) {
      const error = createHttpError(400, "user already exists with this email");
      return next(error);
    }
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while Gettting user"));
  }

  //Hash the password

  const hashPassword = await bcrypt.hash(password, 10);
  // Create new user
  let newUser: user;
  try {
    newUser = await userModal.create({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while creating user"));
  }

  // Generate JWT token

  try {
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    // Respond with token
    res.status(201).json({ accesstoken: token });
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "error while signing the token"));
  }
};

// login user
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  // Check if both email and password are provided
  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }
  try {
    // Find user by email
    const existingUser = await userModal.findOne({
      email: email.toLowerCase(),
    });
    // If user is not found, return a 404 error
    if (!existingUser) {
      return next(createHttpError(404, "USer not available"));
    }
    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    // If passwords do not match, return a 401 error
    if (!isMatch) {
      return next(createHttpError(400, "username or password not correct"));
    }
    // Create access token
    const token = sign({ sub: existingUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });
    // Respond with the token
    res.json({ accesstoken: token });
  } catch (error) {
    console.error("Login error:", error);
    return next(createHttpError(500, "Internal server error"));
  }
};

// Client-side logout function
// Client-side logout function
// const logoutUser = () => {
//     try {
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('user');  // If you store user data separately

//         // Optionally, display a message or update the UI
//         console.log('User logged out successfully');
//     } catch (error) {
//         console.error('Error during logout:', error);
//     }
// };

export { createUser, loginUser };
