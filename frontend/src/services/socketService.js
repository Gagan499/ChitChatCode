import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket = null;

/**
 * Initialise and connect the socket with a JWT token.
 * Safe to call multiple times — returns the existing socket if already connected.
 */
export function connectSocket(token) {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("[Socket] Connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.warn("[Socket] Disconnected:", reason);
  });

  return socket;
}

/** Disconnect and clear the singleton. */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/** Return the active socket instance (null if not connected). */
export function getSocket() {
  return socket;
}

/* ── Convenience emitters ───────────────────────────────────────────────── */

/** Join a chat room and listen for history. */
export function joinRoom(roomId, otherUserId = null) {
  socket?.emit("room:join", { roomId, otherUserId });
}

/** Leave a chat room. */
export function leaveRoom(roomId) {
  socket?.emit("room:leave", { roomId });
}

/** Send a text or file message to a room. */
export function sendMessage({ roomId, content, messageType = "text" }) {
  socket?.emit("message:send", { roomId, content, messageType });
}

/** Emit typing start indicator. */
export function startTyping(roomId) {
  socket?.emit("typing:start", { roomId });
}

/** Emit typing stop indicator. */
export function stopTyping(roomId) {
  socket?.emit("typing:stop", { roomId });
}

/** Broadcast a code execution result to a room. */
export function broadcastCodeResult({
  roomId,
  snippetId,
  output,
  error,
  language,
}) {
  socket?.emit("code:result", { roomId, snippetId, output, error, language });
}

/** Set this user's presence status (online/away/busy/offline). */
export function setPresenceStatus(status) {
  socket?.emit("presence:set", { status });
}

/* ── Convenience listeners ──────────────────────────────────────────────── */

/**
 * Subscribe to a socket event.
 * Returns an unsubscribe function: call it on component unmount.
 */
export function onSocketEvent(event, handler) {
  socket?.on(event, handler);
  return () => socket?.off(event, handler);
}
