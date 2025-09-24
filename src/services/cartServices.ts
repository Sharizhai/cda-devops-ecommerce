import {InMemoryProductRepository} from "../repositories/InMemoryProductRepository";
import {EmailServices} from "./emailServices";
import {Order} from "../types/cartTypes";
import {Cart} from "../Cart";


export class CartServices {
    constructor(
        private cart: Cart,
        private productRepository: InMemoryProductRepository,
        private emailService: EmailServices
    ) {}

    async addProduct(productName: string, quantity: number = 1): Promise<void> {
        const product = await this.productRepository.findByName(productName);
        if (!product) {
            throw new Error("Product not found");
        }

        const inStock = await this.productRepository.isInStock(productName, quantity);
        if (!inStock) {
            throw new Error("Insufficient stock");
        }

        this.cart.add(product, quantity);
    }

    async checkout(customerEmail: string): Promise<Order> {
        if (this.cart.isEmpty()) {
            throw new Error("Cannot checkout empty cart");
        }

        for (const item of this.cart.getItems()) {
            const inStock = await this.productRepository.isInStock(item.product.name, item.quantity);
            if (!inStock) {
                throw new Error(`Insufficient stock for ${item.product.name}`);
            }
        }

        const order: Order = {
            id: this.generateOrderId(),
            items: [...this.cart.getItems()],
            totals: this.cart.calculateTotals(),
            timestamp: new Date()
        };

        for (const item of order.items) {
            await this.productRepository.updateInventory(item.product.name, item.quantity);
        }

        await this.emailService.sendOrderConfirmation(order.id, customerEmail);

        this.cart.clear();

        return order;
    }

    private generateOrderId(): string {
        return `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}