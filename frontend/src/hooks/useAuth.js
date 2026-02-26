import { useEffect, useState } from "react";
import { getProfile, loginUser } from "../services/api";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch (err) {
      console.error("Auth error:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    const res = await loginUser(data);

    localStorage.setItem("token", res.data.token);

    await fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout
  };
};