import express from "express";
import { createAdmin, loginAdmin } from "./adminController";


const adminRouter = express.Router();

// routes 
adminRouter.post('/createAdmin',createAdmin);

adminRouter.post('/adminlogin',loginAdmin);

export default adminRouter;