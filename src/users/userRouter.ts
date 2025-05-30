import express from "express";
import { createUser, loginUser } from "./userControllers";
const userRouter = express.Router();

//routes
userRouter.post("/register", createUser);

userRouter.post("/login", loginUser);

// userRouter.post("/logout", logoutUser);

export default userRouter; 