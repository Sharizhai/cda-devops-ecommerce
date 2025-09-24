export interface Voucher {
    code: string;
    type: "percentage" | "fixed";
    value: number;
    expiresAt?: Date;
    minAmount?: number;
}