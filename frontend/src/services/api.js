import axios from "axios";

const API_URL = "https://full-stack-e-commerce-website-43mmjpahw.vercel.app/api";
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send the httpOnly auth cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach a bearer token from localStorage too, as a fallback for
// environments where cross-site cookies are restricted.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
