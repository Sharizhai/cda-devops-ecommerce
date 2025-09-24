import {Cart} from "../src/Cart";

test("test", () => {
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
            cart.add("pomme", 2, 1.5);

            expect(cart.isEmpty()).toBe(false);
            expect(cart.getItemsCount()).toBe(2);

            const items = cart.getItems();
            expect(items).toHaveLength(1);
            expect(items[0].product).toBe("pomme");
            expect(items[0].quantity).toBe(2);
        });

        it("should increase quantity when adding same product", () => {
            cart.add("pomme", 1, 1.5);

            cart.add("pomme", 2, 1.5);

            expect(cart.getItemsCount()).toBe(3);
            const items = cart.getItems();
            expect(items[0].quantity).toBe(3);
        });

        it("should throw error for invalid quantity", () => {
            expect(() => cart.add("poire", 0, 1.5)).toThrow("Quantity must be positive");
            expect(() => cart.add("poire", -1, 1.5)).toThrow("Quantity must be positive");
        });
    });
})