import AxiosInstance from "./instance";

// Make account holder for every user
export const createAccountHolder = (payload) => {
  return AxiosInstance.post("/applications/newIndividual", payload);
};

// Assign a bundle to every account holder
// Will return accountID
export const getAccountID = (payload) => {
  return AxiosInstance.post(`/getAccountID`, payload);
};

// Account To Account Transfer
export const transferMoney = (payload) => {
  return AxiosInstance.post("/transfer", payload);
};
