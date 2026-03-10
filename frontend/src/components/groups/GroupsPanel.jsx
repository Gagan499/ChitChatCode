import React, { useState, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  Avatar,
  IconButton,
  InputBase,
  Divider,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Drawer,
} from "@mui/material";
import { useChat } from "../../hooks/useChat";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PushPinIcon from "@mui/icons-material/PushPin";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import PeopleIcon from "@mui/icons-material/People";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UsersThree, X } from "@phosphor-icons/react";

/* ─── Create Group Dialog ─────────────────────────────────────────────────── */
const CreateGroupDialog = ({ open, onClose, contacts, onCreate }) => {
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => contacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [contacts, search]
  );

  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleCreate = () => {
    if (!groupName.trim() || selected.length < 1) return;
    onCreate({ name: groupName.trim(), members: selected });
    reset();
  };

  const reset = () => {
    setGroupName("");
    setSelected([]);
    setSearch("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={reset}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: "20px", boxShadow: "0 24px 48px rgba(0,0,0,0.15)" } }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 36, height: 36, borderRadius: "10px",
                background: "linear-gradient(135deg, #5B96F7 0%, #7c3aed 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <UsersThree size={18} color="white" weight="fill" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "16px" }}>
              New Group
            </Typography>
          </Stack>
          <IconButton size="small" onClick={reset}>
            <X size={16} weight="bold" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <TextField
          autoFocus fullWidth label="Group name" placeholder="e.g. Family, Work Team…"
          value={groupName} onChange={(e) => setGroupName(e.target.value)} size="small"
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": { borderRadius: "12px", "&.Mui-focused fieldset": { borderColor: "#5B96F7" } },
            "& .MuiInputLabel-root.Mui-focused": { color: "#5B96F7" },
          }}
        />
        {selected.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
            {selected.map((id) => {
              const c = contacts.find((x) => x.id === id);
              return (
                <Chip
                  key={id} label={c?.name} size="small"
                  avatar={<Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c?.name}`} />}
                  onDelete={() => toggle(id)}
                  sx={{ background: "#EAF2FE", color: "#3b7ef4", fontWeight: 600 }}
                />
              );
            })}
          </Box>
        )}
        <Typography variant="caption" sx={{ color: "#9ca3af", display: "block", mb: 0.5 }}>Add participants</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, background: "#f1f5f9", borderRadius: "10px", px: 1.5, py: 0.5, mb: 1 }}>
          <SearchIcon sx={{ color: "#9ca3af", fontSize: 18 }} />
          <InputBase placeholder="Search contacts…" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ fontSize: "13px", flex: 1 }} />
        </Box>
        <Box sx={{ maxHeight: 200, overflowY: "auto", border: "1px solid #f1f5f9", borderRadius: "12px" }}>
          <List dense disablePadding>
            {filtered.map((contact, idx) => (
              <ListItemButton
                key={contact.id} onClick={() => toggle(contact.id)}
                sx={{ borderRadius: "8px", "&:hover": { background: "#f8faff" }, borderBottom: idx < filtered.length - 1 ? "1px solid #f1f5f9" : "none" }}
              >
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`} sx={{ width: 32, height: 32 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={contact.name} primaryTypographyProps={{ fontSize: "13px", fontWeight: 600 }}
                  secondary={contact.online ? "Online" : "Offline"}
                  secondaryTypographyProps={{ fontSize: "11px", color: contact.online ? "#10b981" : "#9ca3af" }}
                />
                <ListItemSecondaryAction>
                  <Checkbox checked={selected.includes(contact.id)} onChange={() => toggle(contact.id)} size="small"
                    sx={{ color: "#d1d5db", "&.Mui-checked": { color: "#5B96F7" } }} />
                </ListItemSecondaryAction>
              </ListItemButton>
            ))}
            {filtered.length === 0 && (
              <Box sx={{ textAlign: "center", py: 3, color: "#9ca3af" }}>
                <Typography variant="body2">No contacts found</Typography>
              </Box>
            )}
          </List>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
        <Button onClick={reset} sx={{ borderRadius: "10px", textTransform: "none", color: "#6b7280" }}>Cancel</Button>
        <Button
          onClick={handleCreate} variant="contained"
          disabled={!groupName.trim() || selected.length < 1}
          disableElevation
          sx={{
            borderRadius: "10px", textTransform: "none", fontWeight: 700,
            background: "linear-gradient(135deg, #5B96F7 0%, #7c3aed 100%)",
            "&:hover": { opacity: 0.9 }, "&.Mui-disabled": { opacity: 0.4, color: "white" },
          }}
        >
          Create Group
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ─── Confirm Dialog ──────────────────────────────────────────────────────── */
const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmLabel, confirmColor = "error" }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
    <DialogTitle sx={{ fontWeight: 700, fontSize: "16px" }}>{title}</DialogTitle>
    <DialogContent>
      <Typography variant="body2" sx={{ color: "#6b7280" }}>{message}</Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} sx={{ borderRadius: "10px", textTransform: "none", color: "#6b7280" }}>Cancel</Button>
      <Button
        onClick={() => { onConfirm(); onClose(); }}
        variant="contained" color={confirmColor} disableElevation
        sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700 }}
      >
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

/* ─── Group Info Drawer (slides in from the right) ────────────────────────── */
const GroupInfoDrawer = ({ open, onClose, group, onDelete, onExit }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

  if (!group) return null;
  const memberCount = group.conversation?.participant?.status || "0 members";

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: 340,
            borderRadius: "20px 0 0 20px",
            boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #5B96F7 0%, #7c3aed 100%)",
            px: 2.5, pt: 3, pb: 4, position: "relative",
          }}
        >
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: "white", position: "absolute", top: 12, left: 12, "&:hover": { background: "rgba(255,255,255,0.15)" } }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Stack alignItems="center" spacing={1.5} sx={{ pt: 1 }}>
            <Avatar
              sx={{
                width: 80, height: 80,
                background: "rgba(255,255,255,0.2)",
                border: "3px solid rgba(255,255,255,0.6)",
                fontSize: 32, fontWeight: 800, color: "white",
                backdropFilter: "blur(10px)",
              }}
            >
              {group.name?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "white", textAlign: "center" }}>
              {group.name}
            </Typography>
            <Chip
              icon={<PeopleIcon sx={{ fontSize: 14, color: "rgba(255,255,255,0.8) !important" }} />}
              label={memberCount}
              size="small"
              sx={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                fontSize: "12px",
                backdropFilter: "blur(8px)",
              }}
            />
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2 }}>

          {/* Info section */}
          <Box
            sx={{
              background: "#f8faff", borderRadius: "14px", p: 2, mb: 2,
              border: "1px solid #e8edf5",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 36, height: 36, borderRadius: "10px",
                  background: "linear-gradient(135deg, #EAF2FE, #ede9fe)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <InfoOutlinedIcon sx={{ fontSize: 18, color: "#5B96F7" }} />
              </Box>
              <Stack spacing={0.2}>
                <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.05em" }}>
                  Group Info
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151" }}>
                  {memberCount}
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 1.5, borderColor: "#f1f5f9" }} />

            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 36, height: 36, borderRadius: "10px",
                  background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <AccessTimeIcon sx={{ fontSize: 18, color: "#d97706" }} />
              </Box>
              <Stack spacing={0.2}>
                <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.05em" }}>
                  Created
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151" }}>
                  {group.time || "—"}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Divider sx={{ mb: 2, borderColor: "#f1f5f9" }} />

          {/* Danger zone */}
          <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.06em", mb: 1, display: "block" }}>
            Actions
          </Typography>

          {/* Exit Group */}
          <Box
            onClick={() => setConfirmExit(true)}
            sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              p: 1.5, borderRadius: "12px", cursor: "pointer",
              border: "1px solid #fde68a", background: "#fffbeb",
              mb: 1.5, transition: "all 0.15s",
              "&:hover": { background: "#fef3c7", borderColor: "#f59e0b" },
            }}
          >
            <Box
              sx={{
                width: 36, height: 36, borderRadius: "10px",
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <ExitToAppIcon sx={{ fontSize: 18, color: "#d97706" }} />
            </Box>
            <Stack>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#92400e" }}>Exit Group</Typography>
              <Typography variant="caption" sx={{ color: "#b45309" }}>Leave this group conversation</Typography>
            </Stack>
          </Box>

          {/* Delete Group */}
          <Box
            onClick={() => setConfirmDelete(true)}
            sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              p: 1.5, borderRadius: "12px", cursor: "pointer",
              border: "1px solid #fecaca", background: "#fff5f5",
              transition: "all 0.15s",
              "&:hover": { background: "#fee2e2", borderColor: "#ef4444" },
            }}
          >
            <Box
              sx={{
                width: 36, height: 36, borderRadius: "10px",
                background: "linear-gradient(135deg, #fee2e2, #fecaca)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 18, color: "#ef4444" }} />
            </Box>
            <Stack>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#991b1b" }}>Delete Group</Typography>
              <Typography variant="caption" sx={{ color: "#b91c1c" }}>Permanently delete this group</Typography>
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/* Exit confirm */}
      <ConfirmDialog
        open={confirmExit}
        onClose={() => setConfirmExit(false)}
        onConfirm={() => { onExit(group.id); onClose(); }}
        title="Exit Group?"
        message={`You'll leave "${group.name}" and won't receive messages from this group anymore.`}
        confirmLabel="Exit"
        confirmColor="warning"
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => { onDelete(group.id); onClose(); }}
        title="Delete Group?"
        message={`"${group.name}" will be permanently deleted for everyone. This cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
      />
    </>
  );
};

/* ─── Single Group Row ────────────────────────────────────────────────────── */
const GroupRow = ({ group, selected, onSelect, onOpenInfo, onPin, onArchive }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const memberStatus = group.conversation?.participant?.status || "";

  return (
    <>
      <Box
        onClick={() => onSelect(group.id)}
        sx={{
          display: "flex", alignItems: "center", gap: 1.5,
          px: 2, py: 1.5, cursor: "pointer", borderRadius: "16px", mx: 1, my: 0.5,
          background: selected ? "#5B96F7" : "white",
          color: selected ? "white" : "inherit",
          boxShadow: selected ? "0 2px 12px rgba(91,150,247,0.25)" : "none",
          transition: "background 0.15s",
          "&:hover": { background: selected ? "#5B96F7" : "#f1f5fb" },
        }}
      >
        <Avatar
          sx={{
            width: 46, height: 46, flexShrink: 0,
            background: "linear-gradient(135deg, #5B96F7, #7c3aed)",
            fontSize: 18, fontWeight: 700,
          }}
        >
          {group.name?.[0]?.toUpperCase()}
        </Avatar>
        <Stack sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: selected ? "white" : "#1a202c" }} noWrap>
            {group.name}
          </Typography>
          <Typography variant="caption" sx={{ color: selected ? "rgba(255,255,255,0.75)" : "#6b7280" }} noWrap>
            {group.message || memberStatus}
          </Typography>
        </Stack>
        <Stack alignItems="flex-end" spacing={0.5} sx={{ flexShrink: 0 }}>
          <Typography variant="caption" sx={{ color: selected ? "rgba(255,255,255,0.7)" : "#9ca3af", fontSize: "10px" }}>
            {group.time}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); setMenuAnchor(e.currentTarget); }}
            sx={{ p: "2px", color: selected ? "rgba(255,255,255,0.8)" : "#9ca3af", "&:hover": { color: selected ? "white" : "#5B96F7" } }}
          >
            <MoreVertIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{ sx: { borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: 180 } }}
      >
        <MenuItem dense onClick={() => { onSelect(group.id); setMenuAnchor(null); }}>
          <ListItemIcon><ChatBubbleOutlineIcon fontSize="small" sx={{ color: "#5B96F7" }} /></ListItemIcon>
          <Typography variant="body2">Open Chat</Typography>
        </MenuItem>
        <MenuItem dense onClick={() => { onOpenInfo(group); setMenuAnchor(null); }}>
          <ListItemIcon><InfoOutlinedIcon fontSize="small" sx={{ color: "#7c3aed" }} /></ListItemIcon>
          <Typography variant="body2">Group Info</Typography>
        </MenuItem>
        <Divider />
        <MenuItem dense onClick={() => { onPin(group.id); setMenuAnchor(null); }}>
          <ListItemIcon><PushPinIcon fontSize="small" sx={{ color: group.pinned ? "#5B96F7" : "#9ca3af" }} /></ListItemIcon>
          <Typography variant="body2">{group.pinned ? "Unpin" : "Pin"}</Typography>
        </MenuItem>
        <MenuItem dense onClick={() => { onArchive(group.id); setMenuAnchor(null); }}>
          <ListItemIcon>
            {group.archived
              ? <UnarchiveIcon fontSize="small" sx={{ color: "#10b981" }} />
              : <ArchiveIcon fontSize="small" sx={{ color: "#f59e0b" }} />}
          </ListItemIcon>
          <Typography variant="body2">{group.archived ? "Unarchive" : "Archive"}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

/* ─── Main GroupsPanel ────────────────────────────────────────────────────── */
const GroupsPanel = () => {
  const {
    chats, selectedId, setSelectedId, setActiveTab,
    togglePin, toggleArchive, createGroup, deleteGroup, exitGroup,
  } = useChat();

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [infoGroup, setInfoGroup] = useState(null);

  const allGroups = chats.filter((c) => c.isGroup);
  const nonGroupContacts = chats.filter((c) => !c.isGroup).map(({ id, name, online }) => ({ id, name, online }));

  const filtered = useMemo(() => {
    if (!search.trim()) return allGroups;
    return allGroups.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));
  }, [allGroups, search]);

  const pinned = filtered.filter((g) => g.pinned && !g.archived);
  const active = filtered.filter((g) => !g.pinned && !g.archived);
  const archived = filtered.filter((g) => g.archived);

  const handleSelect = (id) => {
    setSelectedId(id);
    setActiveTab(0);
  };

  return (
    <Box sx={{ height: "100%", width: 320, flexShrink: 0, background: "#F8FAFF", boxShadow: "1px 0 0 #e8edf5", display: "flex", flexDirection: "column" }}>

      {/* ── Header ── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 2.5, pb: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Groups</Typography>
          {allGroups.length > 0 && (
            <Chip
              label={allGroups.length} size="small"
              sx={{ height: 20, fontSize: "11px", fontWeight: 700, background: "linear-gradient(135deg, #5B96F7, #7c3aed)", color: "white" }}
            />
          )}
        </Stack>
        <Tooltip title="New Group">
          <IconButton
            size="small" onClick={() => setCreateOpen(true)}
            sx={{ background: "linear-gradient(135deg, #5B96F7 0%, #7c3aed 100%)", color: "white", borderRadius: "10px", p: "7px", "&:hover": { opacity: 0.88 } }}
          >
            <AddIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* ── Search ── */}
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, background: "#f1f5f9", borderRadius: "12px", px: 1.5, py: 0.8 }}>
          <SearchIcon sx={{ color: "#9ca3af", fontSize: 18 }} />
          <InputBase placeholder="Search groups…" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ fontSize: "13px", flex: 1 }} />
          {search && (
            <IconButton size="small" onClick={() => setSearch("")} sx={{ p: "2px" }}>
              <CloseIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
            </IconButton>
          )}
        </Box>
      </Box>

      <Divider sx={{ mx: 2, borderColor: "#f1f5f9" }} />

      {/* ── List ── */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {allGroups.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", gap: 2, color: "#9ca3af", px: 3 }}>
            <Box sx={{ width: 72, height: 72, borderRadius: "20px", background: "linear-gradient(135deg, #EAF2FE, #ede9fe)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GroupsOutlinedIcon sx={{ fontSize: 36, color: "#5B96F7", opacity: 0.7 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#374151" }}>No groups yet</Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af", textAlign: "center" }}>
              Create a group to start chatting with multiple people at once.
            </Typography>
            <Button
              variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)} disableElevation
              sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg, #5B96F7 0%, #7c3aed 100%)", "&:hover": { opacity: 0.9 } }}
            >
              Create Group
            </Button>
          </Stack>
        ) : (
          <>
            {pinned.length > 0 && (
              <>
                <Typography variant="caption" sx={{ px: 2, py: 1, display: "block", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "10px" }}>
                  Pinned
                </Typography>
                {pinned.map((g) => (
                  <GroupRow key={g.id} group={g} selected={g.id === selectedId} onSelect={handleSelect} onOpenInfo={setInfoGroup} onPin={togglePin} onArchive={toggleArchive} />
                ))}
              </>
            )}
            {active.length > 0 && (
              <>
                <Typography variant="caption" sx={{ px: 2, pt: pinned.length > 0 ? 2 : 1, pb: 1, display: "block", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "10px" }}>
                  All Groups
                </Typography>
                {active.map((g) => (
                  <GroupRow key={g.id} group={g} selected={g.id === selectedId} onSelect={handleSelect} onOpenInfo={setInfoGroup} onPin={togglePin} onArchive={toggleArchive} />
                ))}
              </>
            )}
            {archived.length > 0 && (
              <>
                <Divider sx={{ mx: 2, my: 1, borderColor: "#f1f5f9" }} />
                <Typography variant="caption" sx={{ px: 2, py: 1, display: "block", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "10px" }}>
                  Archived
                </Typography>
                {archived.map((g) => (
                  <GroupRow key={g.id} group={g} selected={g.id === selectedId} onSelect={handleSelect} onOpenInfo={setInfoGroup} onPin={togglePin} onArchive={toggleArchive} />
                ))}
              </>
            )}
            {filtered.length === 0 && search && (
              <Stack alignItems="center" justifyContent="center" sx={{ height: 200, color: "#9ca3af", gap: 1 }}>
                <SearchIcon sx={{ fontSize: 32, opacity: 0.3 }} />
                <Typography variant="body2">No groups match "{search}"</Typography>
              </Stack>
            )}
          </>
        )}
      </Box>

      {/* ── Dialogs & Drawer ── */}
      <CreateGroupDialog open={createOpen} onClose={() => setCreateOpen(false)} contacts={nonGroupContacts} onCreate={createGroup} />

      <GroupInfoDrawer
        open={Boolean(infoGroup)}
        onClose={() => setInfoGroup(null)}
        group={infoGroup}
        onDelete={deleteGroup}
        onExit={exitGroup}
      />
    </Box>
  );
};

export default GroupsPanel;
