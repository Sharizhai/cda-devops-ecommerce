import {Voucher} from "../types/voucherTypes";

export function calculateDiscount(voucher: Voucher, subtotal: number): number {
    if (!isValidVoucher(voucher, subtotal)) return 0;

    if (voucher.type === 'percentage') return subtotal * (voucher.value / 100);

    return Math.min(voucher.value, subtotal);
}

export function isValidVoucher(voucher: Voucher, subtotal: number): boolean {
    if (voucher.expiresAt && voucher.expiresAt < new Date()) return false;

    if (voucher.minAmount && subtotal < voucher.minAmount) return false;

    return true;
}