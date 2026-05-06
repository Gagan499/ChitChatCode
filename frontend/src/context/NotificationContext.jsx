import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { getNotifSettings, updateNotifSettings } from "../services/api";

export const NotificationContext = createContext(null);

// Default values used before backend responds
const DEFAULTS = {
  message_notifications: true,
  sound: true,
  previews: true,
  desktop: false,
};

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [settings, setSettings] = useState(() => {
    // Seed from localStorage for instant render, backend will overwrite
    try {
      const cached = localStorage.getItem("chitchat:notifSettings");
      return cached ? JSON.parse(cached) : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });
  const [loaded, setLoaded] = useState(false);

  // Load from backend when user is available
  useEffect(() => {
    if (!user) return;
    getNotifSettings()
      .then(({ data }) => {
        const merged = { ...DEFAULTS, ...data };
        setSettings(merged);
        try {
          localStorage.setItem("chitchat:notifSettings", JSON.stringify(merged));
        } catch {}
        setLoaded(true);
      })
      .catch(() => {
        // Fall back to localStorage / defaults quietly
        setLoaded(true);
      });
  }, [user]);

  // Update a single setting: optimistic UI + persist to backend
  const updateSetting = useCallback(async (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    try {
      localStorage.setItem("chitchat:notifSettings", JSON.stringify(next));
    } catch {}
    try {
      await updateNotifSettings({ [key]: value });
    } catch (err) {
      console.warn("[Notif] Failed to persist setting", err);
    }
  }, [settings]);

  // Request desktop notification permission
  const requestDesktopPermission = useCallback(async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    const result = await Notification.requestPermission();
    return result === "granted";
  }, []);

  // Show a desktop notification (called from socket listener)
  const showDesktopNotification = useCallback((title, body) => {
    if (!settings.desktop) return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    new Notification(title, { body, icon: "/vite.svg" });
  }, [settings.desktop]);

  // Play notification sound
  const playSound = useCallback(() => {
    if (!settings.sound) return;
    try {
      // Simple beep using Web Audio API — no external file needed
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch {
      // AudioContext not available — silent fallback
    }
  }, [settings.sound]);

  const value = {
    settings,
    loaded,
    updateSetting,
    requestDesktopPermission,
    showDesktopNotification,
    playSound,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
