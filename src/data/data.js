export const createAccoundHolder = ({
  salutation,
  firstName,
  middleName,
  lastName,
  dob,
  authData,
  authType,
  email
}) => {
  return {
    ifiID: "140793",
    spoolID: "3deb5a70-311c-11ea-978f-2e728ce88125",
    individualType: "REAL",
    salutation: salutation,
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    profilePicURL: "",
    // dob: { year: 1992, month: 7, day: 5 },
    dob: dob,
    gender: "MALE",
    kycDetails: {
      kycStatus: "MINIMAL",
      kycStatusPostExpiry: "string",
      kycAttributes: {},
      authData: { PAN: authData },
      authType: authType
    },
    vectors: [{ type: "e", value: email, isVerified: true }],
    pops: [],
    customFields: { companyID: [1, 2, 3] },
    tags: [{ type: "vbo", value: "swiggy", isVerified: true }],
    source: "postman"
  };
};

export const assignBundleToAccountHolderObject = ({ accountHolderID }) => {
  return {
    ifiID: "140793",
    accountHolderID: accountHolderID,
    name: "Fintechwalletbundle9adcf36"
  };
};

export const transferMoneyObject = ({
  requestID,
  amount,
  debitAccountID,
  creditAccountID,
  transferTime,
  remarks
}) => {
  return {
    requestID: requestID,
    amount: {
      currency: "INR",
      amount: amount
    },
    transferCode: "ATLAS_P2M_AUTH",
    debitAccountID: debitAccountID,
    creditAccountID: creditAccountID,
    transferTime: transferTime,
    remarks: remarks,
    attributes: {}
  };
};
