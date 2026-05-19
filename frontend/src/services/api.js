import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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

// ── Auth ──────────────────────────────────────────────────────────────────
export const loginUser       = (data) => API.post("/auth/login", data);
export const registerUser    = (data) => API.post("/auth/register", data);
export const LogoutUser      = ()     => API.post("/auth/logout");
export const getProfile      = ()     => API.get("/auth/me");
export const updateProfile   = (data) => API.put("/auth/me", data);

// ── Users / contacts ──────────────────────────────────────────────────────
export const getUsers        = ()     => API.get("/users");
export const getDirectRoom   = (id)   => API.get(`/rooms/direct/${id}`);

// ── Profile (new dedicated route) ────────────────────────────────────────
export const updateUserProfile = (data) => API.put("/users/update-profile", data);

// ── Account settings ──────────────────────────────────────────────────────
export const updateLanguage  = (data) => API.put("/users/language", data);
export const toggle2FA       = ()     => API.put("/users/toggle-2fa");

// ── Notification settings ─────────────────────────────────────────────────
export const getNotifSettings    = ()     => API.get("/users/notifications");
export const updateNotifSettings = (data) => API.put("/users/notifications", data);

// ── Linked devices ────────────────────────────────────────────────────────
export const getDevices      = ()     => API.get("/users/devices");
export const deleteDevice    = (id)   => API.delete(`/users/devices/${id}`);

// ── Google Auth ───────────────────────────────────────────────────────────
export const googleLogin = (data) => API.post("/auth/google", data);

// ── Password reset ─────────────────────────────────────────────────────────
export const forgotPassword = (data)        => API.post("/auth/forgot-password", data);
export const resetPassword  = (token, data) => API.post(`/auth/reset-password/${token}`, data);

export default API;
