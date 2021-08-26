import React, { useContext, useState } from "react";
import { createAccountHolder, getAccountID } from "../axios/index";
import AuthUserContext from "../context/AuthUserContext";
import { createAccountHolderObject, getAccountIDObject } from "../data/data";
import { useHistory } from "react-router";
import { updateUser } from "../firebase/firebase.utils";

const CreateAccount = () => {
  const [contact, setContact] = useState();
  const [authType, setAuthType] = useState("AADHAAR");
  const [authNo, setAuthNo] = useState();
  const [DOB, setDOB] = useState();
  const { authUser } = useContext(AuthUserContext);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullName = authUser.displayName.split(" ");
    const obj = createAccountHolderObject({
      firstName: fullName[0],
      lastName: fullName[1] ? fullName[1] : "",
      contact,
      authType,
      authNo,
      DOB,
      email: authUser.email,
    });
    console.log(obj);
    createAccountHolder(obj)
      .then(function (response) {
        const obj = getAccountIDObject({
          accountHolderID: response.data.individualID,
          contact: "+91" + contact,
        });

        getAccountID(obj)
          .then(function (response) {
            // handle success
            console.log(response.data);
            updateUser(authUser.uid, {
              accountID: response.data.accounts[0].accountID,
              accountHolderID: response.data.accounts[0].accountHolderID,
            });
            history.push("/prototype");
          })
          .catch(function (error) {
            // handle error
            //display toast error

            console.log(error);
          });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
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
              )`,
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
              value={contact}
              placeholder="Contact"
              className="w-full mb-6 px-4 h-10 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring text-sm"
              onChange={(e) => {
                setContact(e.target.value);
              }}
            />

            <select
              value={authType}
              onChange={(e) => setAuthType(e.target.value)}
              className="w-full mb-6 px-4 h-10 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring text-sm"
            >
              <option value="AADHAAR">Aadhar</option>
              <option value="PAN">PAN</option>
            </select>

            <input
              value={authNo}
              onChange={(e) => setAuthNo(e.target.value)}
              type="text"
              placeholder="Aadhar/PAN number"
              className="w-full mb-6 px-4 h-10 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring text-sm"
            />

            <input
              type="date"
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
              placeholder="DOB"
              className=" form-date w-full mb-6 px-4 h-10 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring text-sm"
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
