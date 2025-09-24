import {Product} from "./productTypes";

export interface CartItem {
    product: Product,
    price: number,
    quantity: number,
}

export interface CartTotals {
    subtotal: number;
    vat: number;
    discount?: number;
    total: number;
}