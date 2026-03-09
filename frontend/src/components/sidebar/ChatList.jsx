import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
  Checkbox,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from "@mui/material";
import { CircleDashed, Archive, ArrowLeft, UsersThree, X } from "@phosphor-icons/react";
import ChatItem from "./ChatItem";
import SearchBar from "./SearchBar";

/* ─── Create Group Dialog ───────────────────────────────────────────────────── */
const CreateGroupDialog = ({ open, onClose, contacts = [], onCreate }) => {
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState([]);

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleCreate = () => {
    if (!groupName.trim() || selected.length < 2) return;
    onCreate?.({ name: groupName.trim(), members: selected });
    setGroupName("");
    setSelected([]);
    onClose();
  };

  const handleClose = () => {
    setGroupName("");
    setSelected([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #5B96F7 0%, #7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UsersThree size={18} color="white" weight="fill" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "16px" }}>
              Create New Group
            </Typography>
          </Stack>
          <IconButton size="small" onClick={handleClose}>
            <X size={16} weight="bold" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Group name input */}
        <TextField
          autoFocus
          fullWidth
          label="Group name"
          placeholder="e.g. Design Team"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          size="small"
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "&.Mui-focused fieldset": { borderColor: "#5B96F7" },
            },
            "& .MuiInputLabel-root.Mui-focused": { color: "#5B96F7" },
          }}
        />

        {/* Selected chips */}
        {selected.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
            {selected.map((id) => {
              const c = contacts.find((x) => x.id === id);
              return (
                <Chip
                  key={id}
                  label={c?.name}
                  size="small"
                  avatar={<Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c?.name}`} />}
                  onDelete={() => toggle(id)}
                  sx={{ background: "#EAF2FE", color: "#3b7ef4", fontWeight: 600 }}
                />
              );
            })}
          </Box>
        )}

        <Typography variant="caption" sx={{ color: "#9ca3af", display: "block", mb: 0.5 }}>
          Select members (min 2)
        </Typography>

        {/* Contact list */}
        <Box sx={{ maxHeight: 220, overflowY: "auto", border: "1px solid #f1f5f9", borderRadius: "12px" }}>
          <List dense disablePadding>
            {contacts.map((contact, idx) => (
              <ListItemButton
                key={contact.id}
                onClick={() => toggle(contact.id)}
                sx={{
                  borderRadius: "8px",
                  "&:hover": { background: "#f8faff" },
                  borderBottom: idx < contacts.length - 1 ? "1px solid #f1f5f9" : "none",
                }}
              >
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`}
                    sx={{ width: 32, height: 32 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={contact.name}
                  primaryTypographyProps={{ fontSize: "13px", fontWeight: 600 }}
                  secondary={contact.online ? "Online" : "Offline"}
                  secondaryTypographyProps={{
                    fontSize: "11px",
                    color: contact.online ? "#10b981" : "#9ca3af",
                  }}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    checked={selected.includes(contact.id)}
                    onChange={() => toggle(contact.id)}
                    size="small"
                    sx={{
                      color: "#d1d5db",
                      "&.Mui-checked": { color: "#5B96F7" },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItemButton>
            ))}
          </List>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
        <Button
          onClick={handleClose}
          sx={{ borderRadius: "10px", textTransform: "none", color: "#6b7280" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={!groupName.trim() || selected.length < 2}
          disableElevation
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            background: "linear-gradient(135deg, #5B96F7 0%, #7c3aed 100%)",
            "&:hover": { opacity: 0.9 },
            "&.Mui-disabled": { opacity: 0.4, color: "white" },
          }}
        >
          Create Group
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ─── ChatList ──────────────────────────────────────────────────────────────── */
const ChatList = ({
  chats = [],
  selectedChatId,
  onSelect,
  onTogglePin,
  onToggleArchive,
  onCreateGroup,
}) => {
  const [showArchived, setShowArchived] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);

  // Exclude groups — they live in the Groups tab
  const nonGroupChats = chats.filter((c) => !c.isGroup);
  const activeChats = nonGroupChats.filter((c) => !c.archived);
  const archivedChats = nonGroupChats.filter((c) => c.archived);
  const pinnedChats = activeChats.filter((c) => c.pinned);
  const otherChats = activeChats.filter((c) => !c.pinned);

  // Use only non-group chats as contacts for group creation
  const contacts = nonGroupChats.map(({ id, name, online }) => ({ id, name, online }));

  const handleCreateGroup = (groupData) => {
    onCreateGroup?.(groupData);
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: 320,
        background: "#F8FAFF",
        boxShadow: "1px 0 0 #e8edf5",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* ── Header ── */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, pt: 2.5, pb: 1.5 }}
      >
        {showArchived ? (
          <>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton size="small" onClick={() => setShowArchived(false)} sx={{ color: "#5B96F7" }}>
                <ArrowLeft size={20} weight="bold" />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Archived
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
              {archivedChats.length} chat{archivedChats.length !== 1 ? "s" : ""}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Chats
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              {/* Create Group button */}
              <Tooltip title="Create group">
                <IconButton
                  size="small"
                  onClick={() => setGroupDialogOpen(true)}
                  sx={{
                    background: "linear-gradient(135deg, #5B96F7 0%, #7c3aed 100%)",
                    color: "white",
                    borderRadius: "10px",
                    p: "7px",
                    "&:hover": { opacity: 0.88 },
                  }}
                >
                  <UsersThree size={18} weight="fill" />
                </IconButton>
              </Tooltip>

              <IconButton size="small">
                <CircleDashed size={22} />
              </IconButton>
            </Stack>
          </>
        )}
      </Stack>

      {/* ── Search ── */}
      {!showArchived && <SearchBar />}

      {/* ── Archive Banner ── */}
      {!showArchived && (
        <Box
          onClick={() => setShowArchived(true)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.2,
            cursor: "pointer",
            transition: "background 0.15s",
            "&:hover": { background: "#f1f5fb" },
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Archive size={18} color="#d97706" weight="fill" />
          </Box>
          <Stack spacing={0}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151" }}>
              Archived Chats
            </Typography>
            {archivedChats.length > 0 && (
              <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                {archivedChats.length} archived
              </Typography>
            )}
          </Stack>
        </Box>
      )}

      <Divider sx={{ mx: 2, my: 0.5, borderColor: "#f1f5f9" }} />

      {/* ── Chat List ── */}
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

        {/* Archived View */}
        {showArchived && (
          <>
            {archivedChats.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" sx={{ height: 200, color: "#9ca3af" }}>
                <Archive size={40} />
                <Typography variant="body2" sx={{ mt: 1 }}>No archived chats</Typography>
              </Stack>
            ) : (
              archivedChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  name={chat.name}
                  message={chat.message}
                  time={chat.time}
                  online={chat.online}
                  selected={chat.id === selectedChatId}
                  pinned={chat.pinned}
                  archived={true}
                  onClick={() => onSelect?.(chat.id)}
                  onPinToggle={() => onTogglePin?.(chat.id)}
                  onArchiveToggle={() => onToggleArchive?.(chat.id)}
                />
              ))
            )}
          </>
        )}

        {/* Active View */}
        {!showArchived && (
          <>
            {pinnedChats.length > 0 && (
              <>
                <Typography
                  variant="caption"
                  sx={{
                    px: 2, py: 1, display: "block", color: "#9ca3af",
                    fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "10px",
                  }}
                >
                  Pinned
                </Typography>
                {pinnedChats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    name={chat.name}
                    message={chat.message}
                    time={chat.time}
                    online={chat.online}
                    selected={chat.id === selectedChatId}
                    pinned={chat.pinned}
                    archived={false}
                    onClick={() => onSelect?.(chat.id)}
                    onPinToggle={() => onTogglePin?.(chat.id)}
                    onArchiveToggle={() => onToggleArchive?.(chat.id)}
                  />
                ))}
              </>
            )}

            {otherChats.length > 0 && (
              <>
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    pt: pinnedChats.length > 0 ? 2 : 1,
                    pb: 1,
                    display: "block",
                    color: "#9ca3af",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontSize: "10px",
                  }}
                >
                  Chats
                </Typography>
                {otherChats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    name={chat.name}
                    message={chat.message}
                    time={chat.time}
                    online={chat.online}
                    selected={chat.id === selectedChatId}
                    pinned={chat.pinned}
                    archived={false}
                    onClick={() => onSelect?.(chat.id)}
                    onPinToggle={() => onTogglePin?.(chat.id)}
                    onArchiveToggle={() => onToggleArchive?.(chat.id)}
                  />
                ))}
              </>
            )}

            {activeChats.length === 0 && (
              <Stack alignItems="center" justifyContent="center" sx={{ height: 200, color: "#9ca3af" }}>
                <Typography variant="body2">No chats yet</Typography>
              </Stack>
            )}
          </>
        )}
      </Box>

      {/* ── Create Group Dialog ── */}
      <CreateGroupDialog
        open={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
        contacts={contacts}
        onCreate={handleCreateGroup}
      />
    </Box>
  );
};

export default ChatList;
