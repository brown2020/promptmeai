export const convertToSubcurrency = (amount: number, factor = 100) => {
  return Math.round(amount * factor);
};

export const subcurrencyToNumber = (amount: number, factor = 100) => {
  return Math.round(amount / factor);
};

export const formatNumber = (
  number: number,
  decimals: number = 2,
  currencySymbol: string = "",
  locale: string = "en-US"
): string => {
  return (
    currencySymbol +
    number.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
};
