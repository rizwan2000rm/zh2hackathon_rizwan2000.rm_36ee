import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import Popup from "reactjs-popup";
import { toast } from "react-toastify";
import AsyncSelect from "react-select/async";
import { uid } from "uid";

import { addBill, getUserById, db } from "../firebase/firebase.utils";
import AuthUserContext from "../context/AuthUserContext";
import { transferMoney } from "../axios/index";

import {
  House,
  PlusCircle,
  ListDashes,
  CheckSquareOffset,
} from "phosphor-react";
import "react-toastify/dist/ReactToastify.css";
import SplitteraLogo from "../assets/logos/SplitteraLogo";

const modalOverlayStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  backdropFilter: "blur(1px)",
};

const Navbar = () => {
  const [vendor, setVendor] = useState([]);
  const [amount, setAmount] = useState();
  const { authUser } = useContext(AuthUserContext);

  // REACT SELECT
  const [value, setValue] = useState([]);
  const [vendorInputValue, setVendorInputValue] = useState(false);
  const [inputValue, setInputValue] = useState(false);

  const handleChange = (value, actionMeta) => {
    setValue(value);
  };

  const handleVendorChange = (value, actionMeta) => {
    console.log(vendor);
    setVendor(value);
  };

  const handleVendorInputChange = (vendorInputValue) => {
    setVendorInputValue(vendorInputValue);
  };

  const handleInputChange = (inputValue) => {
    setInputValue(inputValue);
  };

  const handleSubmit = (e, close) => {
    e.preventDefault();
    if (!vendor) {
      toast.warn("Vendor Name is empty", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if (amount <= 0) {
      toast.warn("Enter suitable amount", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (value.length === 0) {
      toast.warn("Enter atleast 1 user to split with", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const userEmails = value.map((email) => email.value);
    addBill(vendor.value, amount, userEmails, authUser)
      .then(() => {
        close();
        setVendor("");
        setValue([]);
        setAmount("");
        toast.success("Bill Created", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Bill Creation failed", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const fetchUsers = (inputValue, callback) => {
    db.collection("users").onSnapshot((snapshot) => {
      const newUsers = snapshot.docs
        .map((doc) => {
          return {
            value: doc.data().email,
            label: doc.data().email,
          };
        })
        //filtering the users which do not match the current authenticated user
        .filter((user) => user.value !== authUser.email);
      if (!inputValue) {
        callback(newUsers);
      }
      callback(newUsers.filter((user) => user.value.startsWith(inputValue)));
    });
  };

  const fetchVendors = (vendorInputValue, callback) => {
    db.collection("vendors").onSnapshot((snapshot) => {
      const newVendors = snapshot.docs.map((doc) => {
        return {
          value: {
            name: doc.data().name,
            accountID: doc.data().accountID,
          },
          label: doc.data().name,
        };
      });
      if (!vendorInputValue) {
        callback(newVendors);
      }
      callback(
        newVendors.filter((vendor) =>
          vendor.label.toLowerCase().startsWith(vendorInputValue.toLowerCase())
        )
      );
    });
  };

  const addFunds = (amount) => {
    getUserById(authUser.uid).then((user) => {
      transferMoney({
        requestID: uid(),
        amount: {
          currency: "INR",
          amount: amount,
        },
        transferCode: "ATLAS_P2M_AUTH",
        debitAccountID: process.env.REACT_APP_fundingAccountId,
        creditAccountID: user.data().accountID,
        transferTime: 1574741608000,
        remarks: "Funds Added",
        attributes: {},
      })
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
            progress: undefined,
          });
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          toast.error(error, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    });
  };

  const defaultVendorOptions = [
    {
      value: {
        name: "Sagar Restaurant",
        accountID: "eed3940f-faaa-4cb5-ac09-44e4db3294ea",
      },
      label: "Sagar Restaurant",
    },
  ];

  const defaultOptions = [
    {
      value: "rizwan2000.rm@gmail.com",
      label: "rizwan2000.rm@gmail.com",
    },
    {
      value: "saistashaikh2019@gmail.com",
      label: "saistashaikh2019@gmail.com",
    },
    {
      value: "salik.ansari6@gmail.com",
      label: "salik.ansari6@gmail.com",
    },
  ];

  return (
    <>
      <div className="flex justify-around md:justify-start md:flex-col items-center w-full h-full py-4 shadow-xl">
        <div className="hidden md:block  mx-auto mb-3 lg:mb-6">
          <SplitteraLogo height={50} width={"auto"} />
        </div>
        <NavLink
          exact
          to="/prototype/"
          activeClassName="bg-red-300 text-white"
          className="flex items-center flex-nowrap lg:w-36 gap-2 m-3 px-4 py-2 transition-all rounded-lg font-bold cursor-pointer hover:bg-red-300 hover:text-white hover:font-bold"
        >
          <House size={22} />
          <span className="hidden lg:block">Dashboard</span>
        </NavLink>
        <Popup
          trigger={
            <button>
              <div className="flex items-center flex-nowrap lg:w-36 gap-2 m-3 px-4 py-2 transition-all rounded-lg font-bold cursor-pointer hover:bg-red-300 hover:text-white hover:font-bold">
                <PlusCircle size={22} />
                <span className="hidden lg:block">New Bill</span>
              </div>
            </button>
          }
          overlayStyle={modalOverlayStyle}
          modal
          position="center center"
        >
          {(close) => (
            <div className="border bg-white px-4 py-6 lg:px-12 lg:py-8">
              <button
                className="absolute right-0 top-0 h-12 w-12 text-3xl text-red-300 hover:opacity-80"
                onClick={close}
              >
                &times;
              </button>
              <div className="w-64 sm:w-72 md:w-96">
                <div className="text-gray-600 font-bold mb-6">
                  <h1>Create New Bill</h1>
                </div>
                <form
                  onSubmit={(e) => handleSubmit(e, close)}
                  className="flex flex-col"
                >
                  <AsyncSelect
                    // components={components}
                    onChange={handleVendorChange}
                    defaultOptions={defaultVendorOptions}
                    onInputChange={handleVendorInputChange}
                    loadOptions={fetchVendors}
                    isClearable
                    // isMulti
                    value={vendor}
                    inputValue={vendorInputValue}
                    placeholder="Search for partner vendors..."
                    className="w-full mb-6 bg-gray-100 rounded-lg shadow-sm text-sm"
                  />
                  <AsyncSelect
                    // components={components}
                    onChange={handleChange}
                    defaultOptions={defaultOptions.filter(
                      (user) => user.value !== authUser.email
                    )}
                    onInputChange={handleInputChange}
                    loadOptions={fetchUsers}
                    isClearable
                    isMulti
                    value={value}
                    inputValue={inputValue}
                    placeholder="Search for registered users with email to split bill..."
                    className="w-full mb-6 bg-gray-100 rounded-lg shadow-sm text-sm"
                  />
                  <input
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                    type="number"
                    placeholder="Amount"
                    className="w-full mb-6 px-4 h-10 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring text-sm"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 w-full mx-auto rounded-lg bg-blue-400 text-white text-sm hover:opacity-80"
                  >
                    Split Now
                  </button>
                </form>
              </div>
            </div>
          )}
        </Popup>
        <NavLink
          to="/prototype/splitreqs"
          activeClassName="bg-red-300 text-white"
          className="flex items-center flex-nowrap lg:w-36 gap-2 m-3 px-4 py-2 transition-all rounded-lg font-bold cursor-pointer hover:bg-red-300 hover:text-white hover:font-bold"
        >
          <ListDashes size={22} />
          <span className="hidden lg:block"> Requests</span>
        </NavLink>
        <NavLink
          to="/prototype/history"
          activeClassName="bg-red-300 text-white"
          className="flex items-center flex-nowrap lg:w-36 gap-2 m-3 px-4 py-2 transition-all rounded-lg font-bold cursor-pointer hover:bg-red-300 hover:text-white hover:font-bold"
        >
          <CheckSquareOffset size={22} />
          <span className="hidden lg:block">History</span>
        </NavLink>

        <Popup
          trigger={
            <button>
              <div className="flex items-center flex-nowrap lg:w-36 gap-2 m-3 px-4 py-2 transition-all rounded-lg font-bold cursor-pointer hover:bg-red-300 hover:text-white hover:font-bold">
                <PlusCircle size={22} />
                <span className="hidden lg:block">Add funds</span>
              </div>
            </button>
          }
          overlayStyle={modalOverlayStyle}
          modal
          position="center center"
        >
          {(close) => (
            <div className="border bg-white px-4 py-6 lg:px-12 lg:py-8">
              <button
                className="absolute right-0 top-0 h-12 w-12 text-3xl text-red-300 hover:opacity-80"
                onClick={close}
              >
                &times;
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 m-4 md:m-6 items-center">
                <div
                  class="shadow-lg cursor-pointer hover:shadow-2xl rounded-2xl w-56 p-4 bg-white relative overflow-hidden"
                  onClick={() => addFunds(10)}
                >
                  <img
                    alt="moto"
                    src="https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                    class="absolute -right-20 -bottom-8 h-40 w-40 mb-4"
                  />
                  <div class="w-4/6">
                    <p class="text-gray-800 text-lg font-medium mb-2">
                      Lite Pack
                    </p>
                    <p class="text-gray-400 text-xs h-8 mr-2 mb-2">
                      Split Bills remove hassle
                    </p>
                    <p class="text-indigo-500 text-xl font-medium">$10</p>
                  </div>
                </div>
                <div
                  onClick={() => addFunds(29)}
                  class="shadow-lg cursor-pointer hover:shadow-2xl rounded-2xl w-56 p-4 bg-white relative overflow-hidden"
                >
                  <img
                    alt="moto"
                    src="https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                    class="absolute -right-20 -bottom-8 h-40 w-40 mb-4"
                  />
                  <div class="w-4/6">
                    <p class="text-gray-800 text-lg font-medium mb-2">
                      Basic Pack
                    </p>
                    <p class="text-gray-400 text-xs h-8 mr-2 mb-2">
                      Get Rewards every month
                    </p>
                    <p class="text-indigo-500 text-xl font-medium">$29</p>
                  </div>
                </div>
                <div
                  onClick={() => addFunds(49)}
                  class="shadow-lg cursor-pointer hover:shadow-2xl rounded-2xl w-56 p-4 bg-white relative overflow-hidden"
                >
                  <img
                    alt="moto"
                    src="https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                    class="absolute -right-20 -bottom-8 h-40 w-40 mb-4"
                  />
                  <div class="w-4/6">
                    <p class="text-gray-800 text-lg font-medium mb-2">
                      Premium Pack
                    </p>
                    <p class="text-gray-400 text-xs h-8 mr-2 mb-2">
                      Guranteed Discounts with partners
                    </p>
                    <p class="text-indigo-500 text-xl font-medium">$49</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Popup>
        <NavLink
          to="/prototype/checkBalance"
          activeClassName="bg-red-300 text-white"
          className="flex items-center flex-nowrap lg:w-36 gap-2 m-3 px-4 py-2 transition-all rounded-lg font-bold cursor-pointer hover:bg-red-300 hover:text-white hover:font-bold"
        >
          <ListDashes size={22} />
          <span className="hidden lg:block"> Check Balance</span>
        </NavLink>
      </div>
    </>
  );
};

export default Navbar;
