export function calculateVAT(priceHT: number, vatRate: number): number {
    return priceHT * vatRate;
}

export function calculatePriceTTC(priceHT: number, vatRate: number): number {
    return priceHT + calculateVAT(priceHT, vatRate);
}