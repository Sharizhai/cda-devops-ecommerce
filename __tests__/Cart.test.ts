import {Product} from "../src/types/productTypes";
import {Cart} from "../src/Cart";

const pomme: Product = {
    name: "Pomme",
    price: 0.50,
    vatRate: 0.05
};

const poire: Product = {
    name: "Poire",
    price: 0.80,
    vatRate: 0.06
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

describe("Itération 3 - Totals & VAT", () => {
    it("should return zero totals for empty cart", () => {
        const totals = cart.calculateTotals();

        expect(totals.subtotal).toBe(0);
        expect(totals.vat).toBe(0);
        expect(totals.total).toBe(0);
    });

    it("should calculate totals correctly", () => {
        cart.add(pomme, 1);
        cart.add(poire, 2);

        const totals = cart.calculateTotals();

        expect(totals.subtotal).toBeCloseTo(2.10, 2);
        expect(totals.vat).toBeCloseTo(0.121, 2);
        expect(totals.total).toBeCloseTo(2.221, 2);
    });
});

describe("Itération 4 - Coupons", () => {
    beforeEach(() => {
        cart.add(pomme, 1);
    });

    it("should apply percentage coupon", () => {
        const coupon = {
            code: "SAVE10",
            type: "percentage" as const,
            value: 10
        };

        cart.applyVoucher(coupon);
        const totals = cart.calculateTotals();

        expect(totals.discount).toBeCloseTo(0.05, 2);
        expect(totals.total).toBeCloseTo(0.48, 2);
    });

    it("should apply fixed amount coupon", () => {
        //Given
        const coupon = {
            code: "SAVE50",
            type: "fixed" as const,
            value: 0.15
        };

        //When
        cart.applyVoucher(coupon);
        const totals = cart.calculateTotals();

        //Then
        expect(totals.discount).toBe(0.15);
        expect(totals.total).toBeCloseTo(0.38, 2);
    });

    it("should not apply expired coupon", () => {
        //Given
        const expiredCoupon = {
            code: "EXPIRED",
            type: "percentage" as const,
            value: 10,
            expiresAt: new Date("2020-01-01")
        };

        //When
        cart.applyVoucher(expiredCoupon);
        const totals = cart.calculateTotals();

        //Then
        expect(totals.discount).toBe(0);
    });

    it("should not apply coupon if minimum amount not met", () => {
        //Given
        cart.add(poire, 1);

        const coupon = {
            code: "BIG50",
            type: "fixed" as const,
            value: 5,
            minAmount: 100
        };

        //When
        cart.applyVoucher(coupon);
        const totals = cart.calculateTotals();

        //Then
        expect(totals.discount).toBe(0);
    });
});

describe("Itération 7 - Timers debounce", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should debounce recalculation", () => {
        cart.add(pomme, 1);
        cart.add(poire, 1);
        cart.updateQuantity("Pomme", 3);

        expect(jest.getTimerCount()).toBe(1);

        jest.advanceTimersByTime(200);
        expect(jest.getTimerCount()).toBe(0);
    });
});