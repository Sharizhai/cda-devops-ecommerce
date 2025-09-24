export function calculateVAT(priceHT: number, vatRate: number): number {
    return priceHT * vatRate;
}