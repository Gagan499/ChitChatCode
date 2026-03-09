import { createContext, useState, useEffect } from "react";
import { getProfile } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // 🔁 Restore session on refresh
  useEffect(() => {
    const fetchProfile = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser  = localStorage.getItem("user");

      if (storedToken) {
        // Immediately restore from localStorage for fast render
        if (storedUser) {
          try { setUser(JSON.parse(storedUser)); } catch (_) {}
        }
        // Then verify with backend
        try {
          const { data } = await getProfile();
          const profile = data.user || data;
          if (profile) {
            setUser(profile);
            localStorage.setItem("user", JSON.stringify(profile));
          }
        } catch (err) {
          // Token invalid → clear session
          console.warn("[Auth] Session expired, clearing.", err?.response?.status);
          if (err?.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token]);

  /**
   * Called by Login / Register pages AFTER the socket has already
   * verified credentials and stored token + user in localStorage.
   * This simply syncs React state so the app immediately re-renders.
   */
  const login = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser  = localStorage.getItem("user");
    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)); } catch (_) {}
      }
    }
    return { success: true };
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
