import {Cart, Product} from "../src/Cart";

const pomme: Product = {
    name: "Pomme",
    price: 0.50,
};

const poire: Product = {
    name: "Poire",
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

describe("Itération 2 - Update/Remove", () => {
    beforeEach(() => {
        cart.add(pomme, 3);
        cart.add(poire, 1);
    });

    it("should update product quantity", () => {
        cart.updateQuantity("Pomme", 5);

        const items = cart.getItems();
        const item1 = items.find(item => item.product.name === "Pomme");
        expect(item1?.quantity).toBe(5);
    });

    it("should remove product when quantity is 0", () => {
        cart.updateQuantity("Pomme", 0);

        // Then
        expect(cart.getItems()).toHaveLength(1);
        expect(cart.getItems()[0].product.name).toBe("Poire");
    });

    it("should remove product from cart", () => {
        cart.remove("Pomme");

        expect(cart.getItems()).toHaveLength(1);
        expect(cart.getItems()[0].product.name).toBe("Poire");
    });

    it("should throw error when updating non-existent product", () => {
        expect(() => cart.updateQuantity("Kiwi", 1)).toThrow("Product not found in cart");
    });

    it("should throw error for negative quantity", () => {
        expect(() => cart.updateQuantity("Pomme", -1)).toThrow("Quantity cannot be negative");
    });
});