import React, { useContext } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Sidebar from "../components/layout/Sidebar";
import ChatList from "../components/sidebar/ChatList";
import ChatWindow from "../components/chat/chatWindow";
import GroupsPanel from "../components/groups/GroupsPanel";
import SettingsPage from "./SettingsPage";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { useChat } from "../hooks/useChat";
import { AuthContext } from "../context/AuthContext";
// ─── Placeholder panel ────────────────────────────────────────────────────────
const PlaceholderPanel = ({ icon, label }) => (
  <Stack
    alignItems="center"
    justifyContent="center"
    sx={{ flex: 1, height: "100%", color: "#9ca3af", gap: 2 }}
  >
    <Box sx={{ opacity: 0.3, fontSize: 64 }}>{icon}</Box>
    <Typography variant="h6" sx={{ color: "#9ca3af", fontWeight: 600 }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ color: "#c4c9d4" }}>
      Coming soon
    </Typography>
  </Stack>
);

// ─── Welcome Banner ───────────────────────────────────────────────────────────
const WelcomeBanner = ({ username }) => (
  <Stack
    alignItems="center"
    justifyContent="center"
    sx={{ flex: 1, height: "100%", gap: 2.5, userSelect: "none" }}
  >
    <Box
      sx={{
        fontSize: 64,
        lineHeight: 1,
        animation: "waveHand 1.5s ease-in-out",
        display: "inline-block",
        transformOrigin: "70% 70%",
      }}
    >
      👋
    </Box>
    <Typography
      variant="h4"
      sx={{ fontWeight: 800, color: "#1e293b", letterSpacing: "-0.02em" }}
    >
      Hey, {username}!
    </Typography>
    <Typography variant="body1" sx={{ color: "#64748b", maxWidth: 300, textAlign: "center" }}>
      Select a conversation to start chatting or create a new one.
    </Typography>
    <style>{`
      @keyframes waveHand {
        0%   { transform: rotate(0deg); }
        15%  { transform: rotate(14deg); }
        30%  { transform: rotate(-8deg); }
        45%  { transform: rotate(14deg); }
        60%  { transform: rotate(-4deg); }
        75%  { transform: rotate(10deg); }
        100% { transform: rotate(0deg); }
      }
    `}</style>
  </Stack>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashBoard() {
  const { user } = useContext(AuthContext);
  const {
    activeTab,
    filteredChats,
    selectedId,
    selectedConversation,
    setSelectedId,
    togglePin,
    toggleArchive,
    createGroup,
  } = useChat();

  const username = user?.username || user?.name || "there";

  return (
    <div className="flex h-screen w-full bg-[#F0F4FA]">
      {/* Left icon sidebar */}
      <Sidebar />

      {/* Tab 0 — Chats */}
      {activeTab === 0 && (
        <>
          <ChatList
            chats={filteredChats}
            selectedChatId={selectedId}
            onSelect={setSelectedId}
            onTogglePin={togglePin}
            onToggleArchive={toggleArchive}
            onCreateGroup={createGroup}
          />
          <Box sx={{ flex: 1 }}>
            {selectedConversation ? (
              <ChatWindow conversation={selectedConversation} />
            ) : (
              <WelcomeBanner username={username} />
            )}
          </Box>
        </>
      )}

      {/* Tab 1 — Groups */}
      {activeTab === 1 && (
        <>
          <GroupsPanel />
          <Box sx={{ flex: 1 }}>
            <ChatWindow conversation={selectedConversation} />
          </Box>
        </>
      )}

      {/* Tab 2 — Calls */}
      {activeTab === 2 && (
        <PlaceholderPanel
          icon={<LocalPhoneOutlinedIcon sx={{ fontSize: 64 }} />}
          label="Calls"
        />
      )}

      {/* Tab 3 — Settings */}
      {activeTab === 3 && (
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <SettingsPage />
        </Box>
      )}
    </div>
  );
}

export default DashBoard;
