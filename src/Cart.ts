export type Product = {
    name: string,
    price: number,
}

export type CartItem = {
    product: Product,
    price: number,
    quantity: number,
}

export class Cart {
    private items: Map<string, CartItem> = new Map();

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