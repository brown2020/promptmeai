export const trimText = (text: string, maxLength: number = 100): string => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }

  return text;
};

export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
