import { Request, Response, NextFunction } from "express";
import cloudinary from "../../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import menuItemsModal from "./menuItemsModal";
import fs from "node:fs";
import { AuthRequest } from "../../middlewares/authenticate";

//create menu Items
const createMenuItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { itemName, itemDescription, itemPrice } = req.body;

  //console.log("files",req.files);

  // Check for files and cast appropriately
  if (!itemName || !itemDescription || !itemPrice) {
    return next(createHttpError(400, "All fields and an image are required"));
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (!files || !files.itemImage || files.itemImage.length === 0) {
    return next(createHttpError(400, "Item image is required"));
  }

  try {
    const itemImageMimeType = files.itemImage[0].mimetype.split("/").at(-1);
    const fileName = files.itemImage[0].filename;
    const filepath = path.resolve(
      __dirname,
      "../../../public/data/uploads",
      fileName
    );
    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filepath, {
      filename_override: fileName,
      folder: "ItemImage",
      format: itemImageMimeType,
    });

    //console.log("UploadResult", uploadResult);

    const _req = req as AuthRequest;
    // Create new menu item
    const newMenuItem = await menuItemsModal.create({
      restaurantId: _req.userId,
      itemName,
      itemDescription,
      itemImage: uploadResult.secure_url,
      itemPrice,
    });

    //delete temp files
    await fs.promises.unlink(filepath);
    res.status(201).json({ id: newMenuItem._id });
  } catch (error) {
    console.log("Error while creating menu item:", error);
    return next(createHttpError(500, "error while uploading the files"));
  }
};

//Update menu Items
const updateMenu = async (req: Request, res: Response, next: NextFunction) => {
  const { itemName, itemDescription, itemPrice } = req.body;
  const itemId = req.params.itemId;

  try {
    // Find menu item
    const menu = await menuItemsModal.findOne({ _id: itemId });
    if (!menu) {
      return res.status(404).json({ message: "menu item not found" });
    }
    // Authorization check
    const _req = req as AuthRequest;
    if (menu.restaurantId.toString() != _req.userId) {
      return next(createHttpError(403, "You are not authorized to update"));
      return res.status(403).json({ message: "unauthorized" });
    }
    // Handle file upload if provided
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let newItemImage = "";
    if (files.itemImage) {
      const fileName = files.itemImage[0].filename;
      const fileMimetype = files.itemImage[0].mimetype.split("/").at(-1);

      // Construct the file path
      const filepath = path.resolve(
        __dirname,
        "../../../public/data/uploads",
        fileName
      );
      newItemImage = fileName;

      // Upload new image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(filepath, {
        filename_override: newItemImage,
        folder: "ItemImage",
        format: fileMimetype,
      });

      newItemImage = uploadResult.secure_url;
      // Remove the old image from Cloudinary
      const splitPublicId = menu.itemImage.split("/");
      const itemPublicId =
        splitPublicId.at(-2) + "/" + splitPublicId.at(-1)?.split(".").at(-2);
      await cloudinary.uploader.destroy(itemPublicId);

      // Remove the file from local storage
      await fs.promises.unlink(filepath);
    }
    // Update the menu item
    const updatedMenu = await menuItemsModal.findOneAndUpdate(
      {
        _id: itemId,
      },
      {
        itemName: itemName,
        itemDescription: itemDescription,
        itemImage: newItemImage ? newItemImage : menu.itemImage,
        itemPrice: itemPrice,
      },
      { new: true }
    );
    res.json(updatedMenu);
  } catch (error) {
    console.error("Error updating menu item:", error);
    next(createHttpError(500, "Error updating the menu item"));
  }
};

// Get list of menu items
const menuList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menu = await menuItemsModal.find();
    res.json(menu);
  } catch (error) {
    console.log(error);
    console.error("Error getting menu list:", error);
    return next(createHttpError(500, "Error while getting menu items"));
  }
};

// Get single menu item
const singleMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const itemid = req.params.itemId;
  try {
    const menuitem = await menuItemsModal.findOne({ _id: itemid });
    if (!menuitem) {
      return next(createHttpError(404, "Menu item not found"));
    }
    return res.json(menuitem);
  } catch (error) {
    console.log("Error getting menu item:", error);
    return next(createHttpError(500, "Error while getting the menu item"));
  }
};

// Delete menu item
const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  const itemId = req.params.itemId;

  const menuitem = await menuItemsModal.findOne({ _id: itemId });
  if (!menuitem) {
    return next(createHttpError(404, "item not Found"));
  }
  // Authorization check
  const _req = req as AuthRequest;
  if (menuitem.restaurantId.toString() != _req.userId) {
    return next(
      createHttpError(403, "You are not authorized to delete this item")
    );
  }
  // Delete image from Cloudinary
  const splitPublicId = menuitem.itemImage.split("/");
  //const itemPublicId = splitPublicId.slice(-2).join('/');
  const itemPublicId =
    splitPublicId.at(-2) + "/" + splitPublicId.at(-1)?.split(".").at(-2);
  // Delete menu item from database
  try {
    await cloudinary.uploader.destroy(itemPublicId);
    await menuItemsModal.deleteOne({ _id: itemId });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return next(createHttpError(500, "Error while deleting the menu item"));
  }
  return res.sendStatus(204);
};
export { createMenuItems, updateMenu, menuList, singleMenuItem, deleteItem };
