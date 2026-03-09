import React, { createContext, useState, useCallback, useMemo } from "react";



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
  /* ── State ── */
  const [chats, setChats]           = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab]   = useState(0); // 0=chats 1=contacts 2=calls 3=settings
  const [userStatus, setUserStatus] = useState("online"); // online | away | busy | offline
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Derived ── */
  const selectedConversation = useMemo(
    () => chats.find((c) => c.id === selectedId)?.conversation ?? {},
    [chats, selectedId]
  );

  const isOnline = userStatus === "online";

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
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
