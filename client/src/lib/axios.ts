import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api/v1", // process.env.API_URL ||
  // import.meta.env.VITE_API_URL,
});

export default api;
