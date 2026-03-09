import React from "react";
import { Box, Stack, Tooltip, Divider, Menu, MenuItem, ListItemIcon, Typography } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";
import { STATUS_OPTIONS } from "../../context/ChatContext";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import CustomAvatar from "../common/avatar";
import { SidebarIconButton } from "../common/buttons";

const Sidebar = () => {
  const { user } = useAuth();
  const { activeTab, setActiveTab, userStatus, setUserStatus, isOnline } = useChat();

  const [statusMenuAnchor, setStatusMenuAnchor] = React.useState(null);

  const avatarSrc =
    user?.avatar ||
    user?.profilePicture ||
    user?.photoURL ||
    "https://i.pravatar.cc/150?img=47";
  const avatarAlt = user?.name || user?.username || "User";

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === userStatus) ?? STATUS_OPTIONS[0];

  const tabs = [
    { icon: <ChatBubbleOutlineIcon />, label: "Chats" },
    { icon: <GroupsOutlinedIcon />, label: "Groups" },
    { icon: <LocalPhoneOutlinedIcon />, label: "Calls" },
  ];

  return (
    <Box
      sx={{
        width: 80,
        height: "100vh",
        backgroundColor: "#F8FAFC",
        borderRight: "1px solid #E2E8F0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingY: 3,
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <Stack direction="column" alignItems="center" spacing={4} sx={{ width: "100%" }}>
        {/* Logo — click to refresh */}
        <Tooltip title="Refresh" placement="right">
          <Box
            onClick={() => window.location.reload()}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "#D1E4FF",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(8deg)",
              cursor: "pointer",
              transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                backgroundColor: "#b3d0ff",
                transform: "rotate(8deg) scale(1.1)",
                boxShadow: "0 4px 16px rgba(66,133,244,0.25)",
              },
              "&:active": { transform: "rotate(8deg) scale(0.95)" },
            }}
          >
            <BoltIcon sx={{ color: "#EAB308", transform: "rotate(-8deg)", fontSize: 32 }} />
          </Box>
        </Tooltip>

        {/* Nav tabs */}
        <Stack direction="column" alignItems="center" spacing={2} sx={{ width: "100%" }}>
          {tabs.map((tab, i) => (
            <Tooltip key={i} title={tab.label} placement="right">
              <span>
                <SidebarIconButton
                  icon={tab.icon}
                  isActive={activeTab === i}
                  onClick={() => setActiveTab(i)}
                />
              </span>
            </Tooltip>
          ))}

          <Divider
            flexItem
            sx={{ borderStyle: "dashed", borderColor: "#CBD5E1", borderWidth: 1, marginX: 2 }}
          />

          <Tooltip title="Settings" placement="right">
            <span>
              <SidebarIconButton
                icon={<SettingsOutlinedIcon />}
                isActive={activeTab === 3}
                onClick={() => setActiveTab(3)}
              />
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Bottom: status dot + avatar */}
      <Stack direction="column" alignItems="center" spacing={2.5}>
        {/* Status toggle button — shows current colour, click to cycle/open menu */}
        <Tooltip title={`Status: ${currentStatus.label}`} placement="right">
          <Box
            onClick={(e) => setStatusMenuAnchor(e.currentTarget)}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "12px",
              background: "#f1f5f9",
              border: `2px solid ${currentStatus.color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { background: "#e8edf5", transform: "scale(1.08)" },
            }}
          >
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: currentStatus.color,
                boxShadow: `0 0 6px ${currentStatus.color}88`,
                transition: "background 0.3s",
              }}
            />
          </Box>
        </Tooltip>

        {/* Status menu */}
        <Menu
          anchorEl={statusMenuAnchor}
          open={Boolean(statusMenuAnchor)}
          onClose={() => setStatusMenuAnchor(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "left" }}
          PaperProps={{
            sx: {
              borderRadius: "14px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              minWidth: 180,
              p: 0.5,
            },
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem
              key={opt.value}
              onClick={() => {
                setUserStatus(opt.value);
                setStatusMenuAnchor(null);
              }}
              selected={userStatus === opt.value}
              sx={{
                borderRadius: "10px",
                mb: 0.3,
                "&.Mui-selected": { background: "#EAF2FE" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: opt.color,
                    boxShadow: `0 0 4px ${opt.color}88`,
                  }}
                />
              </ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: userStatus === opt.value ? 700 : 500, fontSize: "13px" }}>
                {opt.label}
              </Typography>
            </MenuItem>
          ))}
        </Menu>

        {/* Avatar with live status ring */}
        <Tooltip title={avatarAlt} placement="right">
          <Box sx={{ position: "relative" }}>
            <CustomAvatar
              alt={avatarAlt}
              src={avatarSrc}
              isOnline={isOnline}
              size={44}
              sx={{ cursor: "pointer" }}
            />
            {/* Coloured ring shows current status */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: currentStatus.color,
                border: "2px solid #F8FAFC",
                transition: "background 0.3s",
              }}
            />
          </Box>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default Sidebar;
