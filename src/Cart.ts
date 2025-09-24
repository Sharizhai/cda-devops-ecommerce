import {CartItem, CartTotals} from "./types/cartTypes";
import {Product} from "./types/productTypes";
import {Voucher} from "./types/voucherTypes";

import {calculateDiscount} from "./utils/voucherUtils";
import {calculateVAT} from "./utils/vatUtils";

export class Cart {
    private items: Map<string, CartItem> = new Map();
    private appliedCoupon?: Voucher;

    add(product: Product, quantity: number): void {
        if (quantity <= 0) {
            throw new Error("Quantity must be positive");
        }

        const existing = this.items.get(product.name);

        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.set(product.name, {
                product,
                quantity: quantity,
                price: product.price
            });
        }
    }

    updateQuantity(productName: string, quantity: number): void {
        const item = this.items.get(productName);

        if (!item) throw new Error("Product not found in cart");

        if (quantity < 0) throw new Error("Quantity cannot be negative");

        if (quantity === 0) this.items.delete(productName);

        item.quantity = quantity;
    }

    remove(productName: string): void {
        const item = this.items.get(productName);

        if (!item) throw new Error("Product not found in cart");

        this.items.delete(productName);
    }

    applyVoucher(voucher:  Voucher): void {
        this.appliedCoupon = voucher;
    }

    calculateTotals(): CartTotals {
        const items = this.getItems();
        let subtotal = 0;
        let vat = 0;

        for (const item of items) {
            const itemSubtotal = item.product.price * item.quantity;
            const itemVat = calculateVAT(itemSubtotal, item.product.vatRate);

            subtotal += itemSubtotal;
            vat += itemVat;
        }

        const discount = this.appliedCoupon ? calculateDiscount(this.appliedCoupon, subtotal) : 0;
        const total = subtotal + vat - discount;

        return {
            subtotal: Math.round(subtotal * 100) / 100,
            vat: Math.round(vat * 100) / 100,
            discount: Math.round(discount * 100) / 100,
            total: Math.round(total * 100) / 100
        };
    }

    getItems(): CartItem[] {
        return Array.from(this.items.values());
    }

    getItemsCount(): number {
        return Array.from(this.items.values()).reduce((sum, item) => sum + item.quantity, 0);
    }

    isEmpty(): boolean {
        return this.items.size === 0;
    }
}