import { restaurant } from "../restaurant/registerRestaurant/restaurantTypes";
import { menuItems } from "../restaurant/restaurantMenu/menuItemsTypes";
import { user } from "../users/userTypes";

export interface order {
    _id?: string;
    customerId: user;
    restaurantId: restaurant;
    menuId: menuItems;
    orderQuantity: number;
    orderStatus: 'in process' | 'transit' | 'cancelled' | 'delivered';
    orderDate: Date;
    orderBill: number;
}