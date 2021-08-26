import AxiosInstance from "./instance";
import { toast } from "react-toastify";

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
  AxiosInstance.post("/transfer", payload)
    .then(function (response) {
      // handle success
      console.log(response);
      toast.success("Funds Added", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      toast.success(error, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    });
};

// For passing the money from us (middleman) to the provider
