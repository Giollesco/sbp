import axios from "axios";

// Default timeout
export const DEFAULT_AXIOS_TIMEOUT: number = 5000 //? 5 seconds;
const api = (timeout: number = DEFAULT_AXIOS_TIMEOUT) => 
  axios.create({
    baseURL: process.env.REACT_APP_HOST_BACKEND + '/api',
    timeout,
});


export default api;