import React, { useState, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Switch,
  Chip,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputBase,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Video,
  Phone,
  MagnifyingGlass,
  CaretDown,
  X,
  Bell,
  Lock,
  Trash,
  ImageSquare,
  FileText,
  Link as LinkIcon,
  PushPin,
  Star,
  UserMinus,
  UserPlus,
  WarningCircle,
  UsersThree,
  Crown,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { useChat } from "../../hooks/useChat";



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

/* ─── Add Member Dialog ───────────────────────────────────────────────────── */
const AddMemberDialog = ({ open, onClose, existingMemberIds, allContacts, onAdd }) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const available = useMemo(
    () => allContacts.filter(
      (c) => !existingMemberIds.includes(c.id) &&
             c.name.toLowerCase().includes(search.toLowerCase())
    ),
    [allContacts, existingMemberIds, search]
  );

  const toggle = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleAdd = () => {
    selected.forEach((id) => {
      const contact = allContacts.find((c) => c.id === id);
      if (contact) onAdd({ id: contact.id, name: contact.name, avatar: null, isAdmin: false });
    });
    setSelected([]);
    setSearch("");
    onClose();
  };

  const reset = () => { setSelected([]); setSearch(""); onClose(); };

  return (
    <Dialog open={open} onClose={reset} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "20px" } }}>
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg,#5B96F7,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserPlus size={18} color="white" weight="fill" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "16px" }}>Add Members</Typography>
          </Stack>
          <IconButton size="small" onClick={reset}><CloseIcon fontSize="small" /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {/* selected chips */}
        {selected.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
            {selected.map((id) => {
              const c = allContacts.find((x) => x.id === id);
              return (
                <Chip key={id} label={c?.name} size="small"
                  avatar={<Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c?.name}`} />}
                  onDelete={() => toggle(id)}
                  sx={{ background: "#EAF2FE", color: "#3b7ef4", fontWeight: 600 }}
                />
              );
            })}
          </Box>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, background: "#f1f5f9", borderRadius: "10px", px: 1.5, py: 0.5, mb: 1 }}>
          <SearchIcon sx={{ color: "#9ca3af", fontSize: 18 }} />
          <InputBase placeholder="Search contacts…" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ fontSize: "13px", flex: 1 }} />
        </Box>
        <Box sx={{ maxHeight: 220, overflowY: "auto", border: "1px solid #f1f5f9", borderRadius: "12px" }}>
          <List dense disablePadding>
            {available.map((c, idx) => (
              <ListItemButton key={c.id} onClick={() => toggle(c.id)}
                sx={{ "&:hover": { background: "#f8faff" }, borderBottom: idx < available.length - 1 ? "1px solid #f1f5f9" : "none" }}
              >
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`} sx={{ width: 32, height: 32 }} />
                </ListItemAvatar>
                <ListItemText primary={c.name}
                  primaryTypographyProps={{ fontSize: "13px", fontWeight: 600 }}
                  secondary={c.online ? "Online" : "Offline"}
                  secondaryTypographyProps={{ fontSize: "11px", color: c.online ? "#10b981" : "#9ca3af" }}
                />
                <ListItemSecondaryAction>
                  <Checkbox checked={selected.includes(c.id)} onChange={() => toggle(c.id)} size="small"
                    sx={{ color: "#d1d5db", "&.Mui-checked": { color: "#5B96F7" } }} />
                </ListItemSecondaryAction>
              </ListItemButton>
            ))}
            {available.length === 0 && (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="body2" sx={{ color: "#9ca3af" }}>No contacts to add</Typography>
              </Box>
            )}
          </List>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
        <Button onClick={reset} sx={{ borderRadius: "10px", textTransform: "none", color: "#6b7280" }}>Cancel</Button>
        <Button onClick={handleAdd} disabled={selected.length === 0} variant="contained" disableElevation
          sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#5B96F7,#7c3aed)", "&:hover": { opacity: 0.9 }, "&.Mui-disabled": { opacity: 0.4, color: "white" } }}
        >
          Add {selected.length > 0 ? `(${selected.length})` : ""}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ─── Section header ──────────────────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <Typography variant="caption" sx={{ display: "block", px: 2, pt: 2, pb: 0.8, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.07em" }}>
    {children}
  </Typography>
);

/* ─── Group Info Panel ────────────────────────────────────────────────────── */
const GroupInfoPanel = ({ groupChat, onClose }) => {
  const { chats, kickMember, addMember, toggleAdmin, deleteGroup, exitGroup, setActiveTab } = useChat();

  const [confirmKick,   setConfirmKick]   = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmExit,   setConfirmExit]   = useState(false);
  const [confirmAdmin,  setConfirmAdmin]  = useState(null); // { member, action:'make'|'remove' }
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [memberMenuAnchor, setMemberMenuAnchor] = useState(null);
  const [menuMember,   setMenuMember]    = useState(null);
  const [mediaTab,     setMediaTab]      = useState("media"); // media | docs | links

  // Always read fresh from context so it updates live
  const freshGroup = chats.find((c) => c.id === groupChat?.id) || groupChat;
  if (!freshGroup) return null;

  const members   = freshGroup.members || [];
  const adminId   = freshGroup.adminId || "me";
  const isAdmin   = adminId === "me";
  const groupId   = freshGroup.id;
  const groupName = freshGroup.name;

  // Contacts not yet in the group
  const nonGroupContacts = chats
    .filter((c) => !c.isGroup)
    .map(({ id, name, online }) => ({ id, name, online }));
  const existingIds = members.map((m) => m.id);

  const openMemberMenu = (e, member) => {
    e.stopPropagation();
    setMenuMember(member);
    setMemberMenuAnchor(e.currentTarget);
  };
  const closeMemberMenu = () => { setMemberMenuAnchor(null); setMenuMember(null); };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      {/* ── Header ── */}
      <Stack direction="row" alignItems="center" spacing={1}
        sx={{ px: 2, py: 1.5, borderBottom: "1px solid #f1f5f9", background: "#F8FAFF", flexShrink: 0 }}
      >
        <IconButton size="small" onClick={onClose}><X size={18} weight="bold" /></IconButton>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Group Info</Typography>
      </Stack>

      {/* ── Group avatar + name ── */}
      <Stack alignItems="center" spacing={1.5} sx={{ py: 3, px: 2, background: "linear-gradient(180deg,#f0f4ff 0%,#F8FAFF 100%)", flexShrink: 0 }}>
        <Avatar
          sx={{
            width: 88, height: 88,
            background: "linear-gradient(135deg,#5B96F7,#7c3aed)",
            fontSize: 34, fontWeight: 800, color: "white",
            boxShadow: "0 6px 24px rgba(91,150,247,0.3)",
          }}
        >
          {groupName?.[0]?.toUpperCase()}
        </Avatar>
        <Stack alignItems="center" spacing={0.5}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>{groupName}</Typography>
          <Chip
            label={`${members.length} members`}
            size="small"
            icon={<UsersThree size={13} weight="fill" style={{ marginLeft: 6, color: "#5B96F7" }} />}
            sx={{ background: "#EAF2FE", color: "#3b7ef4", fontWeight: 600, fontSize: "11px" }}
          />
          <Typography variant="caption" sx={{ color: "#9ca3af" }}>Created {freshGroup.time}</Typography>
        </Stack>
      </Stack>

      <Divider />

      {/* ── Media / Docs / Links tabs ── */}
      <Box sx={{ flexShrink: 0 }}>
        <Stack direction="row" sx={{ px: 2, pt: 1.5, gap: 1 }}>
          {["media", "docs", "links"].map((tab) => (
            <Chip
              key={tab}
              label={tab.charAt(0).toUpperCase() + tab.slice(1)}
              size="small"
              onClick={() => setMediaTab(tab)}
              sx={{
                fontWeight: 700, fontSize: "11px", cursor: "pointer",
                background: mediaTab === tab ? "linear-gradient(135deg,#5B96F7,#7c3aed)" : "#f1f5f9",
                color: mediaTab === tab ? "white" : "#6b7280",
                "&:hover": { opacity: 0.9 },
              }}
            />
          ))}
        </Stack>

        {/* Media grid */}
        {mediaTab === "media" && (() => {
          const mediaImgs = (freshGroup.conversation?.messages || [])
            .filter((m) => m.type === "image" && m.fileData?.url);
          return mediaImgs.length > 0 ? (
            <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0.5, borderRadius: "12px", overflow: "hidden" }}>
                {mediaImgs.map((m, i) => (
                  <Box key={i} component="img" src={m.fileData.url}
                    sx={{ width: "100%", aspectRatio: "1", objectFit: "cover", cursor: "pointer", "&:hover": { opacity: 0.85 } }}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ py: 4, color: "#9ca3af" }}>
              <ImageSquare size={36} style={{ opacity: 0.3 }} />
              <Typography variant="body2">No media yet</Typography>
            </Stack>
          );
        })()}

        {/* Docs */}
        {mediaTab === "docs" && (() => {
          const docs = (freshGroup.conversation?.messages || [])
            .filter((m) => m.type === "file" && m.fileData?.name);
          return docs.length > 0 ? (
            <Box sx={{ px: 2, pt: 1, pb: 1 }}>
              {docs.map((m, i) => (
                <Stack key={i} direction="row" alignItems="center" spacing={1.5}
                  sx={{ py: 1, px: 1.5, borderRadius: "10px", cursor: "pointer", "&:hover": { background: "#f8faff" } }}
                >
                  <Typography sx={{ fontSize: 24 }}>📄</Typography>
                  <Stack sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "13px" }} noWrap>{m.fileData.name}</Typography>
                    <Typography variant="caption" sx={{ color: "#9ca3af" }}>{m.time}</Typography>
                  </Stack>
                </Stack>
              ))}
            </Box>
          ) : (
            <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ py: 4, color: "#9ca3af" }}>
              <FileText size={36} style={{ opacity: 0.3 }} />
              <Typography variant="body2">No documents yet</Typography>
            </Stack>
          );
        })()}

        {/* Links */}
        {mediaTab === "links" && (() => {
          const links = (freshGroup.conversation?.messages || [])
            .filter((m) => m.type === "link" && m.url);
          return links.length > 0 ? (
            <Box sx={{ px: 2, pt: 1, pb: 1 }}>
              {links.map((m, i) => (
                <Stack key={i} direction="row" alignItems="center" spacing={1.5}
                  sx={{ py: 1, px: 1.5, borderRadius: "10px", cursor: "pointer", "&:hover": { background: "#f8faff" } }}
                >
                  <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: "#EAF2FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <LinkIcon size={16} color="#5B96F7" />
                  </Box>
                  <Stack sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "13px" }} noWrap>{m.title || m.url}</Typography>
                    <Typography variant="caption" sx={{ color: "#5B96F7" }} noWrap>{m.url}</Typography>
                  </Stack>
                </Stack>
              ))}
            </Box>
          ) : (
            <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ py: 4, color: "#9ca3af" }}>
              <LinkIcon size={36} style={{ opacity: 0.3 }} />
              <Typography variant="body2">No links yet</Typography>
            </Stack>
          );
        })()}
      </Box>

      <Divider sx={{ mx: 2, borderColor: "#f1f5f9" }} />

      {/* ── Members section ── */}
      <Box sx={{ flexShrink: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pr: 1 }}>
          <SectionLabel>Members ({members.length})</SectionLabel>
          {isAdmin && (
            <Tooltip title="Add member">
              <IconButton size="small" onClick={() => setAddMemberOpen(true)}
                sx={{ mr: 1, background: "linear-gradient(135deg,#5B96F7,#7c3aed)", color: "white", borderRadius: "8px", p: "4px", "&:hover": { opacity: 0.88 } }}
              >
                <AddIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {members.map((member) => (
          <Stack key={member.id} direction="row" alignItems="center" justifyContent="space-between"
            sx={{ px: 2, py: 1, "&:hover": { background: "#f8faff" } }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar
                src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                sx={{ width: 40, height: 40 }}
              />
              <Stack spacing={0.1}>
                <Stack direction="row" alignItems="center" spacing={0.7}>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "13px" }}>
                    {member.id === "me" ? "You" : member.name}
                  </Typography>
                  {member.isAdmin && (
                    <Chip
                      label="Admin"
                      size="small"
                      icon={<Crown size={10} weight="fill" style={{ marginLeft: 5, color: "#d97706" }} />}
                      sx={{ height: 18, fontSize: "10px", fontWeight: 700, background: "#fef3c7", color: "#92400e", px: 0.3 }}
                    />
                  )}
                </Stack>
                <Typography variant="caption" sx={{ color: "#9ca3af", fontSize: "11px" }}>
                  {member.id === "me" ? "You · Admin" : member.isAdmin ? "Group Admin" : "Member"}
                </Typography>
              </Stack>
            </Stack>

            {/* Three-dot menu — only admin can see it for other members */}
            {isAdmin && member.id !== "me" && (
              <IconButton size="small" onClick={(e) => openMemberMenu(e, member)}
                sx={{ color: "#9ca3af", "&:hover": { color: "#5B96F7" } }}
              >
                <DotsThreeVertical size={18} />
              </IconButton>
            )}
          </Stack>
        ))}
      </Box>

      <Divider sx={{ mx: 2, my: 1, borderColor: "#f1f5f9" }} />

      {/* ── Danger actions ── */}
      <Box sx={{ flexShrink: 0, pb: 2 }}>
        <SectionLabel>Group Actions</SectionLabel>

        {/* Exit Group */}
        <Stack direction="row" alignItems="center" spacing={1.5}
          onClick={() => setConfirmExit(true)}
          sx={{ px: 2, py: 1.4, cursor: "pointer", "&:hover": { background: "#fffbeb" }, transition: "background 0.15s" }}
        >
          <Box sx={{ color: "#d97706" }}><ExitToAppIcon fontSize="small" /></Box>
          <Stack>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#92400e" }}>Exit Group</Typography>
            <Typography variant="caption" sx={{ color: "#b45309" }}>Leave this group</Typography>
          </Stack>
        </Stack>

        {/* Delete Group */}
        <Stack direction="row" alignItems="center" spacing={1.5}
          onClick={() => setConfirmDelete(true)}
          sx={{ px: 2, py: 1.4, cursor: "pointer", "&:hover": { background: "#fff5f5" }, transition: "background 0.15s" }}
        >
          <Box sx={{ color: "#ef4444" }}><DeleteOutlineIcon fontSize="small" /></Box>
          <Stack>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#991b1b" }}>Delete Group</Typography>
            <Typography variant="caption" sx={{ color: "#b91c1c" }}>Permanently delete this group</Typography>
          </Stack>
        </Stack>
      </Box>

      {/* ── Per-member context menu ── */}
      <Menu
        anchorEl={memberMenuAnchor}
        open={Boolean(memberMenuAnchor)}
        onClose={closeMemberMenu}
        PaperProps={{ sx: { borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: 200 } }}
      >
        {menuMember && !menuMember.isAdmin && (
          <MenuItem dense onClick={() => { setConfirmAdmin({ member: menuMember, action: "make" }); closeMemberMenu(); }}>
            <ListItemIcon><Crown size={16} color="#d97706" weight="fill" /></ListItemIcon>
            <Typography variant="body2">Make Group Admin</Typography>
          </MenuItem>
        )}
        {menuMember && menuMember.isAdmin && (
          <MenuItem dense onClick={() => { setConfirmAdmin({ member: menuMember, action: "remove" }); closeMemberMenu(); }}>
            <ListItemIcon><Crown size={16} color="#9ca3af" /></ListItemIcon>
            <Typography variant="body2">Remove Admin</Typography>
          </MenuItem>
        )}
        <Divider />
        <MenuItem dense onClick={() => { setConfirmKick(menuMember); closeMemberMenu(); }}
          sx={{ "&:hover": { background: "#fff5f5" } }}
        >
          <ListItemIcon><UserMinus size={16} color="#ef4444" /></ListItemIcon>
          <Typography variant="body2" sx={{ color: "#ef4444" }}>Remove from Group</Typography>
        </MenuItem>
      </Menu>

      {/* ── Confirm dialogs ── */}
      <ConfirmDialog
        open={Boolean(confirmKick)}
        onClose={() => setConfirmKick(null)}
        onConfirm={() => kickMember(groupId, confirmKick?.id)}
        title="Remove Member?"
        message={`Remove "${confirmKick?.name}" from "${groupName}"?`}
        confirmLabel="Remove"
        confirmColor="error"
      />
      <ConfirmDialog
        open={Boolean(confirmAdmin)}
        onClose={() => setConfirmAdmin(null)}
        onConfirm={() => toggleAdmin(groupId, confirmAdmin?.member?.id)}
        title={confirmAdmin?.action === "make" ? "Make Admin?" : "Remove Admin?"}
        message={
          confirmAdmin?.action === "make"
            ? `"${confirmAdmin?.member?.name}" will be able to add/remove members and change group info.`
            : `"${confirmAdmin?.member?.name}" will no longer be an admin.`
        }
        confirmLabel={confirmAdmin?.action === "make" ? "Make Admin" : "Remove Admin"}
        confirmColor={confirmAdmin?.action === "make" ? "primary" : "warning"}
      />
      <ConfirmDialog
        open={confirmExit}
        onClose={() => setConfirmExit(false)}
        onConfirm={() => { exitGroup(groupId); onClose(); setActiveTab(1); }}
        title="Exit Group?"
        message={`You will leave "${groupName}" and stop receiving messages.`}
        confirmLabel="Exit"
        confirmColor="warning"
      />
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => { deleteGroup(groupId); onClose(); setActiveTab(1); }}
        title="Delete Group?"
        message={`"${groupName}" will be permanently deleted for everyone. This cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
      />

      <AddMemberDialog
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        existingMemberIds={existingIds}
        allContacts={nonGroupContacts}
        onAdd={(member) => addMember(groupId, member)}
      />
    </Box>
  );
};

/* ─── Contact Info Panel (1-on-1 chats) ──────────────────────────────────── */
const ContactInfoPanel = ({ participant, avatarUrl, onClose }) => {
  const [muted, setMuted] = useState(false);

  const infoSections = [
    {
      title: "Media, Links & Docs",
      items: [
        { icon: <ImageSquare size={18} />, label: "Photos & Videos", count: 12 },
        { icon: <FileText size={18} />, label: "Documents", count: 3 },
        { icon: <LinkIcon size={18} />, label: "Links", count: 5 },
      ],
    },
    {
      title: "Chat Settings",
      items: [
        {
          icon: <Bell size={18} />, label: "Mute Notifications",
          action: (
            <Switch checked={muted} onChange={() => setMuted(!muted)} size="small"
              sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#5B96F7" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#5B96F7" } }}
            />
          ),
        },
        { icon: <Star size={18} />, label: "Starred Messages" },
        { icon: <PushPin size={18} />, label: "Pinned Messages" },
      ],
    },
    {
      title: "Privacy & Support",
      items: [
        { icon: <Lock size={18} />, label: "Encryption", sub: "Messages are end-to-end encrypted" },
        { icon: <UserMinus size={18} />, label: "Block Contact", danger: true },
        { icon: <WarningCircle size={18} />, label: "Report Contact", danger: true },
        { icon: <Trash size={18} />, label: "Clear Chat", danger: true },
      ],
    },
  ];

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}
        sx={{ px: 2, py: 1.5, borderBottom: "1px solid #f1f5f9", background: "#F8FAFF", flexShrink: 0 }}
      >
        <IconButton size="small" onClick={onClose}><X size={18} weight="bold" /></IconButton>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Contact Info</Typography>
      </Stack>

      <Stack alignItems="center" spacing={1.5} sx={{ py: 3, px: 2, background: "#F8FAFF" }}>
        <Avatar src={avatarUrl} sx={{ width: 88, height: 88, boxShadow: "0 4px 20px rgba(91,150,247,0.2)" }} />
        <Stack alignItems="center" spacing={0.3}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{participant?.name || "Unknown"}</Typography>
          <Chip label={participant?.status || "Offline"} size="small"
            sx={{ background: participant?.status === "Online" ? "#d1fae5" : "#f1f5f9", color: participant?.status === "Online" ? "#065f46" : "#6b7280", fontWeight: 600, fontSize: "11px" }}
          />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
          {[{ icon: <Phone size={20} weight="fill" />, label: "Audio" }, { icon: <Video size={20} weight="fill" />, label: "Video" }, { icon: <MagnifyingGlass size={20} weight="bold" />, label: "Search" }].map(({ icon, label }) => (
            <Stack key={label} alignItems="center" spacing={0.5}>
              <Box sx={{ width: 44, height: 44, borderRadius: "14px", background: "#EAF2FE", display: "flex", alignItems: "center", justifyContent: "center", color: "#5B96F7", cursor: "pointer", "&:hover": { background: "#d0e6fd" } }}>{icon}</Box>
              <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "10px" }}>{label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Divider />

      {infoSections.map((section) => (
        <Box key={section.title}>
          <Typography variant="caption" sx={{ display: "block", px: 2, pt: 2, pb: 0.5, color: "#9ca3af", fontWeight: 700, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {section.title}
          </Typography>
          {section.items.map((item, i) => (
            <Stack key={i} direction="row" alignItems="center" justifyContent="space-between"
              sx={{ px: 2, py: 1.2, cursor: item.action ? "default" : "pointer", "&:hover": { background: item.action ? "transparent" : "#f8faff" } }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ color: item.danger ? "#ef4444" : "#5B96F7" }}>{item.icon}</Box>
                <Stack>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: item.danger ? "#ef4444" : "#111827", fontSize: "13px" }}>{item.label}</Typography>
                  {item.sub && <Typography variant="caption" sx={{ color: "#9ca3af", fontSize: "10px" }}>{item.sub}</Typography>}
                </Stack>
              </Stack>
              {item.action && item.action}
              {item.count !== undefined && <Typography variant="caption" sx={{ color: "#5B96F7", fontWeight: 700 }}>{item.count}</Typography>}
            </Stack>
          ))}
          <Divider sx={{ mx: 2, my: 0.5, borderColor: "#f1f5f9" }} />
        </Box>
      ))}
    </>
  );
};

/* ─── ChatWindow ─────────────────────────────────────────────────────────── */
const ChatWindow = ({ conversation = {} }) => {
  const { participant = {}, messages = [] } = conversation;
  const { chats, selectedId, setActiveTab } = useChat();
  const [infoOpen, setInfoOpen] = useState(false);

  const currentChat = chats.find((c) => c.id === selectedId);
  const isGroup = Boolean(currentChat?.isGroup);

  const avatarUrl =
    participant.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.name || "User"}`;

  // Clicking group name in header → switch to Groups tab AND open info panel
  const handleHeaderClick = () => {
    if (isGroup) {
      setActiveTab(1);
      setInfoOpen(true);
    } else {
      setInfoOpen((p) => !p);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Main chat column */}
      <Stack sx={{ flex: 1, minWidth: 0, background: "#F0F4FA", transition: "all 0.3s ease" }}>

        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, background: "#F8FAFF", boxShadow: "0 1px 0 #e8edf5" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">

            {/* Clickable name */}
            <Stack direction="row" spacing={1.5} alignItems="center" onClick={handleHeaderClick}
              sx={{ cursor: "pointer", borderRadius: "10px", px: 1, py: 0.5, ml: -1, transition: "background 0.15s", "&:hover": { background: "#EAF2FE" } }}
            >
              {isGroup ? (
                <Avatar sx={{ width: 40, height: 40, background: "linear-gradient(135deg,#5B96F7,#7c3aed)", fontSize: 16, fontWeight: 800 }}>
                  {participant.name?.[0]?.toUpperCase()}
                </Avatar>
              ) : (
                <Avatar src={avatarUrl} sx={{ width: 40, height: 40 }} />
              )}
              <Stack>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {participant.name || "Unknown"}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: "11px", color: isGroup ? "#7c3aed" : participant.status === "Online" ? "#10b981" : "#9ca3af" }}>
                  {isGroup
                    ? `${currentChat?.members?.length || 0} members · tap for info`
                    : participant.status}
                </Typography>
              </Stack>
            </Stack>

            {/* Action icons */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Tooltip title="Video call"><IconButton size="small"><Video size={20} color="#6b7280" /></IconButton></Tooltip>
              <Tooltip title="Voice call"><IconButton size="small"><Phone size={20} color="#6b7280" /></IconButton></Tooltip>
              <Tooltip title="Search"><IconButton size="small"><MagnifyingGlass size={20} color="#6b7280" /></IconButton></Tooltip>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <Tooltip title={infoOpen ? "Close info" : isGroup ? "Group info" : "Contact info"}>
                <IconButton size="small" onClick={() => setInfoOpen((p) => !p)}>
                  {isGroup
                    ? <UsersThree size={20} color={infoOpen ? "#5B96F7" : "#6b7280"} weight={infoOpen ? "fill" : "regular"} />
                    : <CaretDown size={20} color="#6b7280" style={{ transform: infoOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                  }
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: "#9ca3af", mb: 3 }}>Today</Typography>
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg.message} time={msg.time} isSender={msg.isSender} type={msg.type} fileData={msg.fileData} />
          ))}
        </Box>

        <ChatInput />
      </Stack>

      {/* Slide-in info panel */}
      <Box
        sx={{
          width: infoOpen ? 320 : 0,
          overflow: "hidden",
          transition: "width 0.3s ease",
          flexShrink: 0,
          borderLeft: infoOpen ? "1px solid #e8edf5" : "none",
          background: "#ffffff",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {infoOpen && (
          isGroup
            ? <GroupInfoPanel groupChat={currentChat} onClose={() => setInfoOpen(false)} />
            : <ContactInfoPanel participant={participant} avatarUrl={avatarUrl} onClose={() => setInfoOpen(false)} />
        )}
      </Box>
    </Box>
  );
};

export default ChatWindow;
