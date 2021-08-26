export const createAccountHolderObject = ({
  firstName,
  lastName,
  contact,
  authType,
  authNo,
  DOB,
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
      authData: { [authType]: authNo },
      authType: authType,
    },
    vectors: [
      { type: "e", value: email, isVerified: false },
      { type: "p", value: contact, isVerified: false },
    ],
    pops: [],
    customFields: { companyID: [1, 2, 3] },
    tags: [{ type: "vbo", value: "swiggy", isVerified: true }],
    // source: "postman",
  };
};

export const getAccountIDObject = ({ accountHolderID, contact }) => {
  return {
    ifiID: "140793",
    accountHolderID: accountHolderID,
    name: "Bundle 1",
    BundleID: "1d8c1474-f148-42ff-95e1-555e2e5b3975",
    disableCardFFCreation: false,
    disableFFCreation: false,
    disablePhoneFFCreation: false,
    phoneNumber: contact,
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
