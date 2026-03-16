import React, { createContext, useState, useCallback, useMemo, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { getUsers } from "../services/api";
import { connectSocket, disconnectSocket, onSocketEvent, setPresenceStatus } from "../services/socketService";

/* ─── Status options ─────────────────────────────────────────────────────── */
export const STATUS_OPTIONS = [
  { value: "online",  label: "Online",         color: "#22c55e" },
  { value: "away",    label: "Away",            color: "#f59e0b" },
  { value: "busy",    label: "Do Not Disturb",  color: "#ef4444" },
  { value: "offline", label: "Appear Offline",  color: "#9ca3af" },
];

/* ─── Context ────────────────────────────────────────────────────────────── */
export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);

  /* ── State ── */
  const [chats, setChats]           = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab]   = useState(0); // 0=chats 1=contacts 2=calls 3=settings
  const [userStatus, setUserStatus] = useState(() => {
    try {
      return localStorage.getItem("chitchat:userStatus") || "online";
    } catch {
      return "online";
    }
  }); // online | away | busy | offline
  const [searchQuery, setSearchQuery] = useState("");

  // Persist the selected status so it survives reloads.
  useEffect(() => {
    try {
      localStorage.setItem("chitchat:userStatus", userStatus);
    } catch {
      // ignore
    }
  }, [userStatus]);

  // Load other users as contacts once authenticated
  useEffect(() => {
    if (!user) {
      setChats([]);
      setSelectedId(null);
      return;
    }

    const loadContacts = async () => {
      try {
        const { data } = await getUsers();
        const contacts = (Array.isArray(data) ? data : []).map((u) => ({
          id: u.id,
          name: u.username || u.email,
          message: "",
          time: "",
          status: "offline",
          online: false,
          pinned: false,
          archived: false,
          isGroup: false,
          conversation: {
            participant: {
              id: u.id,
              name: u.username || u.email,
              avatar: u.avatar || u.profile_picture || null,
              status: "Offline",
            },
            messages: [],
          },
        }));

        setChats(contacts);
        setSelectedId(contacts.length ? contacts[0].id : null);
      } catch (err) {
        console.warn("Failed to load contacts", err);
      }
    };

    loadContacts();
  }, [user]);

  // Keep presence updated using socket events
  useEffect(() => {
    if (!token) return; // if token not available, skip

    const socket = connectSocket(token);

    const normalizePresenceList = (list) => {
      if (!Array.isArray(list)) return [];
      return list
        .map((item) => {
          if (typeof item === "string" || typeof item === "number") {
            return { userId: item, status: "online" };
          }
          if (item && typeof item === "object" && item.userId) {
            return { userId: item.userId, status: item.status || "online" };
          }
          return null;
        })
        .filter(Boolean);
    };

    const offPresenceUpdate = onSocketEvent("presence:update", ({ userId, status }) => {
      if (!userId) return;

      // update status of contacts in the list
      setChats((prev) =>
        prev.map((chat) =>
          String(chat.id) === String(userId)
            ? { ...chat, status: status || "offline", online: status === "online" }
            : chat
        )
      );

      // update self status too (only if we are offline or were offline)
      if (userId === user?.id) {
        setUserStatus((prev) => {
          if (status === "offline") return "offline";
          return prev === "offline" ? status || "online" : prev;
        });
      }
    });

    const offPresenceState = onSocketEvent("presence:state", ({ online }) => {
      const list = normalizePresenceList(online);
      if (!list.length) return;

      setChats((prev) =>
        prev.map((chat) => {
          const found = list.find((p) => String(p.userId) === String(chat.id));
          if (!found) return { ...chat, status: "offline", online: false };
          return { ...chat, status: found.status || "online", online: found.status === "online" };
        })
      );
    });

    // Notify server of our current status as soon as we connect
    setPresenceStatus(userStatus);

    // cleanup on logout / token change
    return () => {
      offPresenceUpdate();
      offPresenceState();
      disconnectSocket();
    };
  }, [token, user?.id, setUserStatus, userStatus]);
  /* ── Derived ── */
  const selectedConversation = useMemo(() => {
    const chat = chats.find((c) => c.id === selectedId);
    if (!chat) return {};

    const conv = chat.conversation || {};
    const participant = conv.participant || {};

    // Keep the header status in sync with presence values (online/away/busy/offline).
    // For groups we keep whatever status text is already set.
    const derivedStatus = chat.isGroup
      ? participant.status
      : (chat.status || "offline").replace(/^./, (c) => c.toUpperCase());

    return {
      ...conv,
      participant: {
        ...participant,
        status: derivedStatus,
      },
    };
  }, [chats, selectedId]);

  const isOnline = userStatus !== "offline";

  /* ── Actions ── */
  const togglePin = useCallback((id) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));
  }, []);

  const toggleArchive = useCallback((id) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, archived: !c.archived } : c)));
  }, []);

  const sendMessage = useCallback(({ chatId, text, file }) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg = file
      ? {
          type: file.type.startsWith("image") ? "image" : "file",
          fileData: { name: file.name, url: URL.createObjectURL(file) },
          time: now,
          isSender: true,
        }
      : { message: text, time: now, isSender: true };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          message: `You: ${text || file?.name || ""}`,
          time: now,
          conversation: {
            ...c.conversation,
            messages: [...(c.conversation?.messages ?? []), newMsg],
          },
        };
      })
    );
  }, []);

  const createGroup = useCallback(({ name, members }) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    // Build member objects from the existing non-group chats
    const memberObjects = members.map((id) => ({
      id,
      name: chats.find((c) => c.id === id)?.name || `Member ${id}`,
      avatar: chats.find((c) => c.id === id)?.conversation?.participant?.avatar || null,
      isAdmin: false,
    }));
    // Current user is always admin
    const adminMember = { id: "me", name: "You", avatar: null, isAdmin: true };
    const allMembers = [adminMember, ...memberObjects];

    const newGroup = {
      id: Date.now(),
      name,
      message: `Group · ${allMembers.length} members`,
      time: now,
      online: false,
      pinned: false,
      archived: false,
      isGroup: true,
      members: allMembers,
      adminId: "me",
      conversation: {
        participant: { name, avatar: null, status: `${allMembers.length} members` },
        messages: [],
      },
    };
    setChats((prev) => [newGroup, ...prev]);
    setSelectedId(newGroup.id);
    setActiveTab(0);
  }, []);

  const kickMember = useCallback((groupId, memberId) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== groupId || !c.isGroup) return c;
        const newMembers = c.members.filter((m) => m.id !== memberId);
        return {
          ...c,
          members: newMembers,
          message: `Group · ${newMembers.length} members`,
          conversation: {
            ...c.conversation,
            participant: { ...c.conversation.participant, status: `${newMembers.length} members` },
          },
        };
      })
    );
  }, []);

  const addMember = useCallback((groupId, newMember) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== groupId || !c.isGroup) return c;
        if (c.members.find((m) => m.id === newMember.id)) return c; // already in group
        const newMembers = [...c.members, { ...newMember, isAdmin: false }];
        return {
          ...c,
          members: newMembers,
          message: `Group · ${newMembers.length} members`,
          conversation: {
            ...c.conversation,
            participant: { ...c.conversation.participant, status: `${newMembers.length} members` },
          },
        };
      })
    );
  }, []);

  const toggleAdmin = useCallback((groupId, memberId) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== groupId || !c.isGroup) return c;
        return {
          ...c,
          members: c.members.map((m) =>
            m.id === memberId ? { ...m, isAdmin: !m.isAdmin } : m
          ),
        };
      })
    );
  }, []);

  const deleteGroup = useCallback((id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const exitGroup = useCallback((id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  /* ── Filtered chats (by search query) ── */
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    return chats.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.message || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  const updateChatPreview = useCallback((userId, { message, time }) => {
    if (!userId) return;
    setChats((prev) =>
      prev.map((c) => (c.id === userId ? { ...c, message, time } : c))
    );
  }, []);

  const value = {
    /* state */
    chats,
    filteredChats,
    selectedId,
    selectedConversation,
    activeTab,
    userStatus,
    isOnline,
    searchQuery,
    /* setters */
    setSelectedId,
    setActiveTab,
    setUserStatus,
    setSearchQuery,
    /* actions */
    togglePin,
    toggleArchive,
    sendMessage,
    createGroup,
    kickMember,
    addMember,
    toggleAdmin,
    deleteGroup,
    exitGroup,
    updateChatPreview,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
