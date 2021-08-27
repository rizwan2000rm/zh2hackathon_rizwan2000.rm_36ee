import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { transferMoney } from "../axios/index";
import { uid } from "uid";
import { toast } from "react-toastify";

var firebaseConfig = {
  apiKey: "AIzaSyBqyB_QEe6Uj0BXDRS6OpgrISdP0U_fEpw",
  authDomain: "oreo-e0436.firebaseapp.com",
  projectId: "oreo-e0436",
  storageBucket: "oreo-e0436.appspot.com",
  messagingSenderId: "518701931556",
  appId: "1:518701931556:web:3488def6c2040d31e18cb1",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = db.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return userRef;
};

export const updateUser = async (userID, params) => {
  return db.collection("users").doc(userID).update(params);
};

export const getBills = (email) => {
  return db
    .collection("bills")
    .orderBy("createdAt", "desc")
    .where("userEmails", "array-contains", email);
};

export const addBill = async (vendor, amount, userEmails, authUser) => {
  const splitAmount = amount / (userEmails.length + 1);
  if (authUser) {
    return db.collection("bills").add({
      createdAt: firebase.firestore.Timestamp.now(),
      name: vendor.name,
      accountID: vendor.accountID,
      creatorEmail: authUser.email,
      creatorId: authUser.uid,
      totalAmount: amount,
      userEmails: [...userEmails, authUser.email],
      users: [...userEmails, authUser.email].map((userEmail) => ({
        amount: splitAmount,
        email: userEmail,
        paid: false,
      })),
    });
  }
};

export const getBill = async (billId) => {
  console.log(billId);
  return db.collection("bills").doc(billId).get();
};

export const getUserById = async (creatorId) => {
  return db.collection("users").doc(creatorId).get();
};

export const payBill = async (updatedUsers, billId, payingUserId, mySplit) => {
  getBill(billId).then((bill) => {
    getUserById(payingUserId).then((user) => {
      transferMoney({
        requestID: uid(),
        amount: {
          currency: "INR",
          amount: mySplit,
        },
        transferCode: "ATLAS_P2M_AUTH",
        debitAccountID: user.data().accountID,
        creditAccountID: bill.data().accountID,
        transferTime: 1574741608000,
        remarks: "Split Recieved",
        attributes: {},
      })
        .then((response) => {
          console.log(response);
          if (response.data.name === "Error") {
            toast.error("Insufficient Funds", {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            return;
          }

          if (response.status === 200) {
            toast.success("Amount Paid", {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            return db.collection("bills").doc(billId).update({
              users: updatedUsers,
            });
          } else {
            throw new Error(response.data);
          }
        })
        .catch((error) => {
          toast.error(error, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          console.log(error);
        });
    });
  });
};

export const declineBill = async (billId, authUser, updatedUsers) => {
  return db
    .collection("bills")
    .doc(billId)
    .update({
      userEmails: firebase.firestore.FieldValue.arrayRemove(authUser.email),
      users: updatedUsers,
    });
};

export const getUsersByEmail = (...emails) => {
  return db.collection("users").where("email", "in", [...emails]);
};

export default firebase;
