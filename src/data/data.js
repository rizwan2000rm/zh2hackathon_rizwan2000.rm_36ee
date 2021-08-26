export const createAccountHolderObject = ({
  firstName,
  lastName,
  aadhaarNo,
  email,
}) => {
  return {
    ifiID: "140793",
    spoolID: "123",
    individualType: "REAL",
    firstName: firstName,
    lastName: lastName,
    dob: { year: 1992, month: 7, day: 5 },
    kycDetails: {
      kycStatus: "MINIMAL",
      kycStatusPostExpiry: "string",
      kycAttributes: {},
      authData: { AADHAAR: aadhaarNo },
      authType: "AADHAAR",
    },
    vectors: [
      { type: "e", value: "salik.ansari6@gmail.com", isVerified: false },
    ],
    pops: [],
    customFields: { companyID: [1, 2, 3] },
    tags: [{ type: "vbo", value: "swiggy", isVerified: true }],
    // source: "postman",
  };
};

export const assignBundleToAccountHolderObject = ({ accountHolderID }) => {
  return {
    ifiID: "140793",
    accountHolderID: accountHolderID,
    name: "Fintechwalletbundle9adcf36",
  };
};

export const transferMoneyObject = ({
  requestID,
  amount,
  debitAccountID,
  creditAccountID,
  transferTime,
  remarks,
}) => {
  return {
    requestID: requestID,
    amount: {
      currency: "INR",
      amount: amount,
    },
    transferCode: "ATLAS_P2M_AUTH",
    debitAccountID: debitAccountID,
    creditAccountID: creditAccountID,
    transferTime: transferTime,
    remarks: remarks,
    attributes: {},
  };
};
