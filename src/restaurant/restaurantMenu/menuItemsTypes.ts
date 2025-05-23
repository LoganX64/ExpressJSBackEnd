import { restaurant } from "../registerRestaurant/restaurantTypes";

export interface menuItems{
    _id:string;
    restaurantId:restaurant;
    itemName:string;
    itemPrice:number;
    itemDescription:string;
    itemImage:string;
}