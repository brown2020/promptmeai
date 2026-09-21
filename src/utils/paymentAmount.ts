export const CATALOG_AMOUNT_CENTS = 9999;

export const isCatalogAmount = (amount: number): boolean =>
  Number.isInteger(amount) && amount === CATALOG_AMOUNT_CENTS;
