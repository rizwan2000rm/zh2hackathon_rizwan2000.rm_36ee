const axios = require("axios");

exports.handler = async (event, context) => {
  const URL = process.env.REACT_APP_baseURL + "/applications/newIndividual";
  const data = JSON.parse(event.body);

  const options = {
    headers: {
      "Content-Type": "application/json",
      "X-Zeta-AuthToken": process.env.REACT_APP_authToken
    }
  };

  axios({
    method: "post",
    url: URL,
    data: data,
    options
  }).then(
    (response) => {
      console.log(response);
    },
    (error) => {
      console.log(error);
    }
  );
};
