import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const LogoutUser = () => API.delete("/auth/logout");
export const getProfile = () => API.get("/auth/me");
export const updateProfile = (data) => API.put("/auth/me", data);
export const getUsers = () => API.get("/users");
export const getDirectRoom = (otherUserId) =>
  API.get(`/rooms/direct/${otherUserId}`);

export default API;
