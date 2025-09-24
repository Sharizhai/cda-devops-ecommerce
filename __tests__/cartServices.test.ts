import {InMemoryProductRepository} from "../src/repositories/InMemoryProductRepository";
import {EmailServices} from "../src/services/emailServices";
import {CartServices} from "../src/services/cartServices";
import {Cart} from "../src/Cart";

describe("CartService", () => {
    let cartService: CartServices;
    let cart: Cart;
    let productRepository: InMemoryProductRepository;
    let emailServices: EmailServices;

    beforeEach(() => {
        cart = new Cart();
        productRepository = new InMemoryProductRepository();
        emailServices = new EmailServices();
        cartService = new CartServices(cart, productRepository, emailServices);
    });

    describe("Itération 5 - Stock", () => {
        it("should add product when in stock", async () => {
            await cartService.addProduct("Pomme", 2);

            expect(cart.getItemsCount()).toBe(2);
        });

        it("should throw error when product not found", async () => {
            await expect(cartService.addProduct("999", 1))
                .rejects.toThrow("Product not found");
        });

        it("should throw error when insufficient stock", async () => {
            await expect(cartService.addProduct("Pomme", 100))
                .rejects.toThrow("Insufficient stock");
        });

        it("should checkout successfully", async () => {
            await cartService.addProduct("Pomme", 1);
            await cartService.addProduct("Poire", 2);

            const order = await cartService.checkout("customer@test.com");

            expect(order.id).toMatch(/^ORDER-\d+-\w+$/);
            expect(order.items).toHaveLength(2);
            expect(order.totals.subtotal).toBeCloseTo(2.1, 2);
            expect(cart.isEmpty()).toBe(true);

            expect(emailServices.sentEmails).toHaveLength(1);
            expect(emailServices.sentEmails[0].customerEmail).toBe("customer@test.com");
        });

        it("should throw error when checkout empty cart", async () => {
            await expect(cartService.checkout("test@test.com"))
                .rejects.toThrow("Cannot checkout empty cart");
        });
    });
});