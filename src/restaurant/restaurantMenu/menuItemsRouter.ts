import express from "express";
import { createMenuItems, deleteItem, menuList, singleMenuItem, updateMenu } from "./menuControllers";
import multer from "multer";
import path from "node:path";
import authenticate from "../../middlewares/authenticate";

const menuRouter = express.Router();


const upload = multer({
    dest: path.resolve(__dirname, '../../../public/data/uploads'),
    limits: { fileSize: 3e7 }, // 30mb size

})

menuRouter.post("/addItems",
    authenticate,
    upload.fields([{ name: 'itemImage', maxCount: 1 }]),
    createMenuItems
);

//update route
menuRouter.put("/:itemId",
    authenticate,
    upload.fields([{ name: 'itemImage', maxCount: 1 }]),
    updateMenu
);

//get Menu Items
menuRouter.get("/getAllItems",
    //authenticate,
    menuList
)
// get a single item from menu items
menuRouter.get("/:itemId",
    singleMenuItem
)
// delete single item from menu items
menuRouter.delete("/:itemId",
    authenticate,
    deleteItem);

export default menuRouter;