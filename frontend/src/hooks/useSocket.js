import { useEffect, useRef, useState, useCallback } from "react";
import {
  connectSocket,
  disconnectSocket,
  joinRoom,
  leaveRoom,
  sendMessage as emitMessage,
  startTyping,
  stopTyping,
  onSocketEvent,
} from "../services/socketService";

/**
 * useSocket — manages the socket lifecycle for a single chat room.
 *
 * @param {string|null} roomId   — DB id of the room to connect to
 * @param {string|null} token    — JWT token from localStorage / AuthContext
 *
 * Returns:
 *   messages        — array of messages received so far
 *   typingUsers     — { [userId]: username } map of who is typing
 *   connected       — boolean socket connection status
 *   sendMessage(content, type) — send a message to the room
 *   handleTypingStart()        — emit typing start
 *   handleTypingStop()         — emit typing stop
 */
export function useSocket(roomId, token, myId) {
  const [messages,    setMessages]    = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [connected,   setConnected]   = useState(false);

  // Typing debounce timer ref
  const typingTimer = useRef(null);

  useEffect(() => {
    if (!token || !roomId) return;

    // Reset message list when switching rooms
    setMessages([]);

    // Connect (idempotent if already connected)
    const socket = connectSocket(token);

    // Connection status
    const offConnect    = onSocketEvent("connect",    () => {
      setConnected(true);
      // Rejoin room and reload history on reconnect
      joinRoom(roomId);
      // Note: history will be sent by the server on join
    });
    const offDisconnect = onSocketEvent("disconnect", () => setConnected(false));

    // Room history (on join)
    const offHistory = onSocketEvent("room:history", ({ roomId: rid, messages: hist }) => {
      if (rid === roomId) {
        setMessages(hist.map((m) => normalizeMessage(m, myId)));
      }
    });

    // Incoming message
    const offNew = onSocketEvent("message:new", (msg) => {
      if (msg.roomId === roomId) {
        setMessages((prev) => [...prev, normalizeMessage(msg, myId)]);
      }
    });

    // Typing indicators
    const offTypingStart = onSocketEvent("typing:start", ({ roomId: rid, userId, username }) => {
      if (rid === roomId) {
        setTypingUsers((prev) => ({ ...prev, [userId]: username }));
      }
    });

    const offTypingStop = onSocketEvent("typing:stop", ({ roomId: rid, userId }) => {
      if (rid === roomId) {
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
      }
    });

    // Join the room
    joinRoom(roomId);

    return () => {
      leaveRoom(roomId);
      offConnect();
      offDisconnect();
      offHistory();
      offNew();
      offTypingStart();
      offTypingStop();
      clearTimeout(typingTimer.current);
    };
  }, [roomId, token]);

  /* ── Send message ─────────────────────────────────────────────────────── */
  const sendMessage = useCallback((content, messageType = "text") => {
    if (!content?.trim() || !roomId) return;
    emitMessage({ roomId, content, messageType });
    stopTyping(roomId); // stop typing when message is sent
    clearTimeout(typingTimer.current);
  }, [roomId]);

  /* ── Typing helpers ───────────────────────────────────────────────────── */
  const handleTypingStart = useCallback(() => {
    if (!roomId) return;
    startTyping(roomId);
    // Auto-stop after 3 s of no new keystrokes
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => stopTyping(roomId), 3000);
  }, [roomId]);

  const handleTypingStop = useCallback(() => {
    if (!roomId) return;
    clearTimeout(typingTimer.current);
    stopTyping(roomId);
  }, [roomId]);

  return { messages, typingUsers, connected, sendMessage, handleTypingStart, handleTypingStop };
}

/* ── Normalise different message shapes from DB vs socket ─────────────── */
function normalizeMessage(msg, myId) {
  const senderId = msg.User?.id || msg.sender?.id;
  return {
    id:          msg.id,
    message:     msg.content,
    content:     msg.content,
    messageType: msg.message_type || msg.messageType || msg.type || "text",
    type:        msg.type || msg.message_type || msg.messageType || "text",
    time:        msg.created_at   || msg.createdAt,
    isSender:    Boolean(myId && senderId && senderId === myId),
    sender: {
      id:       senderId,
      username: msg.User?.username || msg.sender?.username,
      avatar:   msg.User?.avatar   || msg.sender?.avatar,
    },
  };
}
