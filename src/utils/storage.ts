export const clearStorage = () => {
  localStorage.clear();
};

export const setStorage = (key: string, value: any) => {
  return localStorage.setItem(key, JSON.stringify(value));
};

export const getStorage = (key: string) => {
  return JSON.parse(localStorage.getItem(key) || "null");
};

export const setStringStorage = (key: string, value: string) => {
  return localStorage.setItem(key, value);
};

export const getStringStorage = (key: string) => {
  return localStorage.getItem(key) || "";
};
