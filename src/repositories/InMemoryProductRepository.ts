import {Product} from "../types/productTypes";

export interface IInMemoryProductRepository {
    findByName(name: string): Promise<Product | undefined>;
    isInStock(name: string, quantity: number): Promise<boolean>;
    updateInventory(name: string, quantity: number): Promise<void>;
}

export class InMemoryProductRepository implements IInMemoryProductRepository {
    private products: Map<string, Product> = new Map();
    private inventory: Map<string, number> = new Map();

    constructor() {
        this.addProduct({
            name: "Pomme",
            price: 0.50,
            vatRate: 0.05
        }, 10);

        this.addProduct({
            name: "Poire",
            price: 0.80,
            vatRate: 0.06
        }, 50);
    }

    private addProduct(product: Product, stockQuantity: number): void {
        this.products.set(product.name, product);
        this.inventory.set(product.name, stockQuantity);
    }

    async findByName(name: string): Promise<Product | undefined> {
        return this.products.get(name) || undefined;
    }

    async isInStock(name: string, quantity: number): Promise<boolean> {
        const available = this.inventory.get(name) || 0;
        return available >= quantity;
    }

    async updateInventory(name: string, quantity: number): Promise<void> {
        const current = this.inventory.get(name) || 0;
        this.inventory.set(name, Math.max(0, current - quantity));
    }
}