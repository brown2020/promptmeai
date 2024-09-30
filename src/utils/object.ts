export const areObjectsEqual = <T>(obj1: T, obj2: T): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const isObjectEmpty = <T extends Record<string, string>>(
  obj: T
): boolean => {
  return Object.values(obj).every((value) => value === "");
};
