import {Cart, Product} from "../src/Cart";

const pomme: Product = {
    name: 'Pomme',
    price: 0.50,
};

const poire: Product = {
    name: 'Poire',
    price: 0.80,
};
    let cart: Cart;

    beforeEach(() => {
        cart = new Cart();
    });

    describe("Itération 1 - Add Product", () => {
        it("should be empty initially", () => {
            expect(cart.isEmpty()).toBe(true);
            expect(cart.getItemsCount()).toBe(0);
        });

        it("should add a product to cart", () => {
            cart.add(pomme, 2);

            expect(cart.isEmpty()).toBe(false);
            expect(cart.getItemsCount()).toBe(2);

            const items = cart.getItems();
            expect(items).toHaveLength(1);
            expect(items[0].product.name).toBe("Pomme");
            expect(items[0].quantity).toBe(2);
        });

        it("should increase quantity when adding same product", () => {
            cart.add(pomme, 1);

            cart.add(pomme, 2);

            expect(cart.getItemsCount()).toBe(3);
            const items = cart.getItems();
            expect(items[0].quantity).toBe(3);
        });

        it("should throw error for invalid quantity", () => {
            expect(() => cart.add(poire, 0)).toThrow("Quantity must be positive");
            expect(() => cart.add(poire, -5)).toThrow("Quantity must be positive");
        });
    })