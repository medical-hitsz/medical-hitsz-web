const AUTHORIZATION_KEY = "__MEDICAL_HITSZ_AUTHORIZATION";

export const getAuthorization = () => {
  return localStorage.getItem(AUTHORIZATION_KEY) || "";
};

export const setAuthorization = (newAuthorization: string) => {
  localStorage.setItem(AUTHORIZATION_KEY, newAuthorization);
};

export const clearAuthorization = () => {
  localStorage.removeItem(AUTHORIZATION_KEY);
};

export const clearStorage = () => {
  localStorage.clear();
};
