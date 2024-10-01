export const convertToSubcurrency = (
  amount: number,
  factor = 100,
  round = true
) => {
  const result = amount * factor;
  return round ? Math.round(result) : result;
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
