export const convertToSubcurrency = (amount: number, factor = 100) => {
  return Math.round(amount * factor);
};

export const subcurrencyToNumber = (amount: number, factor = 100) => {
  return amount / factor;
};

export const formatNumber = (
  number: number,
  decimals: number = 0,
  currencySymbol: string = "",
  locale: string = "en-US"
): string => {
  const fixedNumber = number.toFixed(decimals); // Prevents unwanted rounding

  return (
    currencySymbol +
    Number(fixedNumber).toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
};
