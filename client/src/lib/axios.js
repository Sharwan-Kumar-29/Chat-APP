// axios.js
import axios from "axios";

// Create an Axios instance
export const axiosInstance= axios.create({
  baseURL: import.meta.env.MODE==="development"? "http://localhost:4000/api/v1":"/",
  withCredentials: true, // needed for cookies/session if used
  headers: {
    "Content-Type": "application/json",
  },
});

