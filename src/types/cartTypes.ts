import {Product} from "./productTypes";
import {Voucher} from "./voucherTypes";

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

export interface Order {
    id: string;
    items: CartItem[];
    totals: CartTotals;
    voucher?: Voucher;
    timestamp: Date;
}