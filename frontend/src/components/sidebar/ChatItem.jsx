import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { PushPin, Archive, ArrowCounterClockwise } from "@phosphor-icons/react";

const STATUS_COLORS = {
  online: "#44b700",
  away: "#f59e0b",
  busy: "#ef4444",
};

const ChatItem = ({
  name,
  message,
  time,
  status = "offline",
  online, // kept for backwards compatibility
  selected,
  pinned,
  archived,
  onClick,
  onPinToggle,
  onArchiveToggle,
}) => {
  const effectiveStatus = status || (online ? "online" : "offline");
  const dotColor = STATUS_COLORS[effectiveStatus] || null;
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ mouseX: e.clientX, mouseY: e.clientY });
  };

  const handleClose = () => setContextMenu(null);

  const handleArchive = (e) => {
    e.stopPropagation();
    onArchiveToggle?.();
    handleClose();
  };

  const handlePin = (e) => {
    e.stopPropagation();
    onPinToggle?.();
    handleClose();
  };

  return (
    <>
      <Box
        onClick={onClick}
        onContextMenu={handleContextMenu}
        sx={{
          p: 1.5,
          cursor: "pointer",
          borderRadius: "16px",
          mx: 1,
          my: 0.5,
          transition: "background 0.15s",
          background: selected ? "#5B96F7" : "white",
          color: selected ? "white" : "inherit",
          boxShadow: selected ? "0 2px 12px rgba(91,150,247,0.25)" : "none",
          "&:hover": { background: selected ? "#5B96F7" : "#f1f5fb" },
          userSelect: "none",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            {dotColor ? (
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: dotColor,
                    color: dotColor,
                    boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
                  },
                }}
              >
                <Avatar
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                  sx={{ transition: "filter 0.2s" }}
                />
              </Badge>
            ) : (
              <Avatar
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                sx={{ filter: "grayscale(75%) opacity(0.7)", transition: "filter 0.2s" }}
              />
            )}

            <Stack spacing={0.3}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: selected ? "rgba(255,255,255,0.75)" : "#6b7280", maxWidth: 140 }}
                noWrap
              >
                {message}
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={0.5} alignItems="center">
            <Typography
              variant="caption"
              sx={{ color: selected ? "rgba(255,255,255,0.7)" : "#9ca3af", fontSize: "10px" }}
            >
              {time}
            </Typography>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onPinToggle?.();
              }}
              sx={{ p: "2px" }}
            >
              <PushPin
                size={14}
                weight={pinned ? "fill" : "regular"}
                color={selected ? "white" : pinned ? "#5B96F7" : "#9ca3af"}
              />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* Right-click context menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        slotProps={{
          paper: {
            sx: {
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              minWidth: 180,
              overflow: "visible",
            },
          },
        }}
      >
        <MenuItem onClick={handlePin} dense>
          <ListItemIcon>
            <PushPin size={16} weight={pinned ? "fill" : "regular"} color="#5B96F7" />
          </ListItemIcon>
          <ListItemText
            primary={pinned ? "Unpin chat" : "Pin chat"}
            primaryTypographyProps={{ fontSize: "13px" }}
          />
        </MenuItem>

        <MenuItem onClick={handleArchive} dense>
          <ListItemIcon>
            {archived ? (
              <ArrowCounterClockwise size={16} color="#10b981" />
            ) : (
              <Archive size={16} color="#f59e0b" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={archived ? "Unarchive chat" : "Archive chat"}
            primaryTypographyProps={{ fontSize: "13px" }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ChatItem;
