import React, { useState, useEffect, useContext } from "react";
import AuthUserContext from "../context/AuthUserContext";
import {
  auth,
  payBill,
  declineBill,
  getUserById,
  getUsersByEmail,
} from "../firebase/firebase.utils";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import Avatar from "react-avatar";

const ActiveSplitRequest = ({ activeRequest, setActiveRequest, history }) => {
  const [mySplit, setMySplit] = useState(null);
  const [creatorName, setCreatorName] = useState(null);
  const [splitters, setSplitters] = useState([]);
  const { authUser } = useContext(AuthUserContext);

  const modalOverlayStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(1px)",
  };

  useEffect(() => {
    setMySplit(() => {
      return activeRequest.users
        .find((user) => {
          return user.email === auth.currentUser.email;
        })
        .amount.toFixed(2);
    });

    getUserById(activeRequest.creatorId).then((user) => {
      setCreatorName(() => {
        if (authUser.uid === activeRequest.creatorId) {
          return "You";
        }
        return user.data().displayName;
      });
    });

    getUsersByEmail(...activeRequest.userEmails).onSnapshot((snapshot) => {
      const newSplitters = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setSplitters(newSplitters);
    });
  }, [activeRequest, authUser.uid]);

  return (
    <>
      <div className="rounded-lg px-1 py-4 mt-2 sm:px-1 md:max-w-lg md:mx-auto sm:py-8 sm:mt-5">
        <button
          className="absolute  right-0 top-0 h-12 w-12 text-3xl text-red-300 hover:opacity-80 md:hidden"
          onClick={() => setActiveRequest(null)}
        >
          &times;
        </button>
        <div className="flex justify-center items-center">
          <Avatar
            name={activeRequest.name && activeRequest.name.toUpperCase()}
            size={80}
            round={true}
            maxInitials={2}
          />
        </div>
        <h1 className="font-bold text-base text-center pt-6">
          Hey {auth.currentUser && auth.currentUser.displayName}
        </h1>
        <p className="text-center mx-auto px-8 text-sm pt-2">
          <span className="font-bold">{creatorName && creatorName}</span>{" "}
          requested you a split bill payment of{" "}
          <span className="font-medium text-yellow-400">${mySplit}</span> from{" "}
          <span className="font-bold">{activeRequest.name}</span>
        </p>
        <div className="px-8 pt-8 flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="text-base">Split Bill</div>
            <div className="font-bold text-gray-600">${mySplit}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-base">Total Bill</div>
            <div className="font-bold text-gray-600">
              ${activeRequest.totalAmount}
            </div>
          </div>
        </div>
        <div className="px-8 pt-4 flex gap-4">
          {!history && (
            <>
              <button
                onClick={async () => {
                  //Removing the authenticated user from the userEmails array and users array
                  const updatedUsers = activeRequest.users
                    .filter((user) => user.email !== authUser.email)
                    .map((user) => {
                      console.log(activeRequest.users.length);
                      return {
                        ...user,
                        amount:
                          activeRequest.totalAmount /
                          (activeRequest.users.length - 1),
                      };
                    });

                  declineBill(activeRequest.id, authUser, updatedUsers).then(
                    () => {
                      toast.error("Payment Declined", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                    }
                  );
                  setActiveRequest(null);
                }}
                className="px-6 py-3 w-full sm:w-1/2 rounded-lg bg-red-400 text-white text-sm hover:opacity-80"
              >
                Decline
              </button>
              <button
                onClick={async () => {
                  //Updating the field paid for the authenticated user as true and update the array of users
                  //Wrote the logic for updating boolean field because firebase does allow to update array of objects
                  //REF: https://stackoverflow.com/questions/63679460/how-to-update-an-array-of-maps-objects-on-firestore-in-angular-or-angularfires
                  const updatedUsers = activeRequest.users.map((user) => {
                    if (user.email !== authUser.email) {
                      return user;
                    }
                    return {
                      ...user,
                      paid: true,
                    };
                  });

                  //Updating the bill in firebase which updates the whole document
                  payBill(updatedUsers, activeRequest.id)
                    .then(() => {
                      toast.success("Payment Successful", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                      setActiveRequest(null);
                    })
                    .catch((err) => {
                      console.log("error");
                    });
                }}
                className="px-6 py-3 w-full sm:w-1/2 rounded-lg bg-blue-400 text-white text-sm hover:opacity-80"
              >
                Accept
              </button>
            </>
          )}
        </div>
        <div className="text-xl font-bold px-8 pt-4 text-gray-600">
          Split With
        </div>
        <div className="avatar-list flex px-8 pt-4">
          {splitters &&
            splitters.map((splitter) => {
              return (
                <Popup
                  overlayStyle={modalOverlayStyle}
                  modal
                  trigger={(close) => (
                    <img
                      className="h-12 w-12 rounded-full  border-white cursor-pointer border-2 -mr-3 shadow"
                      src={splitter.photoURL}
                      alt="avatar"
                    />
                  )}
                >
                  {(close) => (
                    <div className="border bg-white">
                      <button
                        className="absolute right-0 top-0 h-12 w-12 text-3xl text-red-300 hover:opacity-80"
                        onClick={close}
                      >
                        &times;
                      </button>
                      <div className="p-6 sm:p-12 md:p-24 flex flex-col items-center md:flex-row gap:4 md:gap-12">
                        <img
                          className="w-1/2 rounded-full"
                          src={splitter.photoURL}
                          alt=""
                        />
                        <div className="my-2">
                          <div className="font-bold text-center text-xl text-gray-600">
                            {splitter.displayName}
                          </div>
                          <div className="font-bold text-center text-gray-600">
                            {splitter.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Popup>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ActiveSplitRequest;
