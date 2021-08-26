import React, { useState } from "react";
import { createAccountHolder } from "../axios/index";
import { createAccountHolderObject } from "../data/data";

const CreateAccount = () => {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [authData, setAuthData] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    const obj = createAccountHolderObject({
      firstName: firstName,
      lastName: lastName,
      aadhaarNo: authData
      // email: email,
    });
    console.log(obj);
    createAccountHolder(obj);
  };

  return (
    <div class="container mx-auto">
      <div class="flex justify-center px-6 my-12">
        <div class="hidden lg:flex xl:w-3/4 lg:w-11/12">
          <div
            class="w-full h-auto bg-gray-400 hidden lg:block bg-center rounded-l-lg"
            style={{
              backgroundImage: `url(
                "https://source.unsplash.com/Mv9hjnEUHR4/600x800"
              )`
            }}
          ></div>
        </div>
        <div class="max-w-2xl bg-white p-5 rounded-lg lg:rounded-l-none">
          <h3 class="pt-4 text-2xl text-center">Create an Account!</h3>
          <form
            class="px-8 pt-6 pb-8 mb-4 bg-white rounded"
            onSubmit={(e) => handleSubmit(e)}
          >
            <input
              type="text"
              placeholder="First Name"
              className="w-full mb-6 px-4 h-10 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring text-sm"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full mb-6 px-4 h-10 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring text-sm"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="text"
              className="w-full mb-6 px-4 h-10 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring text-sm"
              onChange={(e) => {
                setAuthData(e.target.value);
              }}
            />
            <button
              type="submit"
              className="px-6 py-2 w-full mx-auto rounded-lg bg-blue-400 text-white text-sm hover:opacity-80"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
