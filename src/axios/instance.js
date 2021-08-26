import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_baseURL,
  headers: {
    "Content-Type": "application/json",
    "X-Zeta-AuthToken": process.env.REACT_APP_authToken,
    "Access-Control-Allow-Origin": "*",
  },
});

export default AxiosInstance;
