import AxiosInstance from "./instance";

// Make account holder for every user
export const createAccountHolder = (payload) => {
  AxiosInstance.post("/applications/newIndividual", payload)
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

// Assign a bundle to every account holder
// Will return accountID
export const assignBundleToAccountHolder = (payload) => {
  AxiosInstance.post(`/accountHolders/${payload.accountHolderID}`, payload)
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

// Account To Account Transfer
export const transferMoney = (payload) => {
  AxiosInstance.post("/transfers", payload)
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

// For passing the money from us (middleman) to the provider
