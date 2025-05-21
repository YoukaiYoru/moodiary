import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // process.env.API_URL ||
  //
});

export default api;
