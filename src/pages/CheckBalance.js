import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { checkBalance } from "../axios";
import AuthUserContext from "../context/AuthUserContext";
import { getUserById } from "../firebase/firebase.utils";

const CheckBalance = () => {
  const [balance, setBalance] = useState(0);

  const { authUser } = useContext(AuthUserContext);
  useEffect(() => {
    getUserById(authUser.uid).then((user) => {
      console.log(user.data());
      checkBalance(user.data().accountID)
        .then((res) => {
          console.log(res.data);
          setBalance(res.data.balance);
        })
        .catch((err) => console.log(err));
    });
  }, [authUser.uid]);

  return (
    <div className="h-full w-full flex items-start mt-10 justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold text-green-700">Check Balance</h1>
        <span className="text-center text-2xl mt-5">
          Your current balance is ${balance}
        </span>
      </div>
    </div>
  );
};

export default CheckBalance;
