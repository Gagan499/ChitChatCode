import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Avatar,
  IconButton,
  Switch,
  Divider,
  Slider,
  Button,
  TextField,
  Chip,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  User,
  Bell,
  Lock,
  Palette,
  DeviceMobile,
  SignOut,
  Camera,
  CaretRight,
  Moon,
  SunHorizon,
  CheckCircle,
  ShieldCheck,
  Keyboard,
  ChatCircleText,
  Globe,
} from "@phosphor-icons/react";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";
import { updateProfile } from "../services/api";

/* ─── Shared section wrapper ─────────────────────────────────────────────── */
const Section = ({ title, children }) => (
  <Box
    sx={{
      background: "#ffffff",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      mb: 2,
    }}
  >
    {title && (
      <Typography
        variant="caption"
        sx={{
          display: "block",
          px: 2.5,
          pt: 2,
          pb: 0.5,
          color: "#9ca3af",
          fontWeight: 700,
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {title}
      </Typography>
    )}
    {children}
  </Box>
);

/* ─── Row item ───────────────────────────────────────────────────────────── */
const SettingRow = ({ icon, label, sub, action, danger, onClick, noPad }) => (
  <ListItem
    sx={{
      px: noPad ? 0 : 2.5,
      py: 1.2,
      cursor: onClick ? "pointer" : "default",
      "&:hover": onClick ? { background: "#f8faff" } : {},
      transition: "background 0.15s",
    }}
    onClick={onClick}
  >
    {icon && (
      <ListItemIcon sx={{ minWidth: 36, color: danger ? "#ef4444" : "#5B96F7" }}>
        {icon}
      </ListItemIcon>
    )}
    <ListItemText
      primary={
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: danger ? "#ef4444" : "#111827", fontSize: "13px" }}
        >
          {label}
        </Typography>
      }
      secondary={
        sub && (
          <Typography variant="caption" sx={{ color: "#9ca3af", fontSize: "11px" }}>
            {sub}
          </Typography>
        )
      }
    />
    {action && <ListItemSecondaryAction>{action}</ListItemSecondaryAction>}
    {onClick && !action && (
      <ListItemSecondaryAction>
        <CaretRight size={16} color="#d1d5db" />
      </ListItemSecondaryAction>
    )}
  </ListItem>
);

/* ─── Accent colour picker ───────────────────────────────────────────────── */
const ACCENTS = ["#5B96F7", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4"];

/* ─── Settings Page ──────────────────────────────────────────────────────── */
const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { userStatus, setUserStatus } = useChat();

  const [activeSection, setActiveSection] = useState("profile");

  // Appearance
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chitchat:darkMode") || "false");
    } catch {
      return false;
    }
  });
  const [fontSize, setFontSize] = useState(() => {
    try {
      return parseInt(localStorage.getItem("chitchat:fontSize") || "14");
    } catch {
      return 14;
    }
  });
  const [accent, setAccent] = useState(() => {
    try {
      return localStorage.getItem("chitchat:accent") || "#5B96F7";
    } catch {
      return "#5B96F7";
    }
  });
  const [wallpaper, setWallpaper] = useState(() => {
    try {
      return localStorage.getItem("chitchat:wallpaper") || "default";
    } catch {
      return "default";
    }
  });

  // Notifications
  const [notifMessages, setNotifMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chitchat:notifMessages") || "true");
    } catch {
      return true;
    }
  });
  const [notifSounds, setNotifSounds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chitchat:notifSounds") || "true");
    } catch {
      return true;
    }
  });
  const [notifPreviews, setNotifPreviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chitchat:notifPreviews") || "true");
    } catch {
      return true;
    }
  });
  const [notifDesktop, setNotifDesktop] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chitchat:notifDesktop") || "false");
    } catch {
      return false;
    }
  });

  // Privacy
  const [lastSeen, setLastSeen] = useState(() => {
    try {
      return localStorage.getItem("chitchat:lastSeen") || "everyone";
    } catch {
      return "everyone";
    }
  });
  const [readReceipts, setReadReceipts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chitchat:readReceipts") || "true");
    } catch {
      return true;
    }
  });

  // Profile edit
  const [editName, setEditName] = useState(user?.name || user?.username || "User");
  const [editAbout, setEditAbout] = useState("Hey there! I am using ChitChatCode 💬");
  const [saving, setSaving] = useState(false);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem("chitchat:darkMode", JSON.stringify(darkMode));
    } catch {}
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem("chitchat:fontSize", fontSize.toString());
    } catch {}
  }, [fontSize]);

  useEffect(() => {
    try {
      localStorage.setItem("chitchat:accent", accent);
    } catch {}
  }, [accent]);

  useEffect(() => {
    try {
      localStorage.setItem("chitchat:wallpaper", wallpaper);
    } catch {}
  }, [wallpaper]);

  useEffect(() => {
    try {
      localStorage.setItem("chitchat:notifMessages", JSON.stringify(notifMessages));
    } catch {}
  }, [notifMessages]);

  useEffect(() => {
    try {
      localStorage.setItem("chitchat:notifSounds", JSON.stringify(notifSounds));
    } catch {}
  }, [notifSounds]);

  useEffect(() => {
    try {
      localStorage.setItem("chitchat:notifPreviews", JSON.stringify(notifPreviews));
    } catch {}
  }, [notifPreviews]);

  useEffect(() => {
    try {
      localStorage.setItem("chitchat:notifDesktop", JSON.stringify(notifDesktop));
    } catch {}
  }, [notifDesktop]);

  useEffect(() => {
    try {
      localStorage.setItem("chitchat:lastSeen", lastSeen);
    } catch {}
  }, [lastSeen]);

  useEffect(() => {
    try {
      localStorage.setItem("chitchat:readReceipts", JSON.stringify(readReceipts));
    } catch {}
  }, [readReceipts]);

  // Handle profile save
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: editName, about: editAbout });
      // Optionally update user context or show success
    } catch (err) {
      console.warn("Failed to save profile", err);
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc =
    user?.avatar ||
    user?.profilePicture ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "user"}`;

  const navItems = [
    { id: "profile", icon: <User size={18} />, label: "Profile" },
    { id: "notifications", icon: <Bell size={18} />, label: "Notifications" },
    { id: "privacy", icon: <Lock size={18} />, label: "Privacy" },
    { id: "appearance", icon: <Palette size={18} />, label: "Appearance" },
    { id: "chats", icon: <ChatCircleText size={18} />, label: "Chats" },
    { id: "shortcuts", icon: <Keyboard size={18} />, label: "Shortcuts" },
  ];

  const wallpapers = [
    { id: "default", label: "Default", bg: "#F0F4FA" },
    { id: "dark", label: "Dark", bg: "#1e1e2e" },
    { id: "light", label: "Light", bg: "#ffffff" },
    { id: "gradient", label: "Gradient", bg: "linear-gradient(135deg,#667eea,#764ba2)" },
    { id: "warm", label: "Warm", bg: "linear-gradient(135deg,#f6d365,#fda085)" },
  ];

  return (
    <Box sx={{ display: "flex", height: "100%", background: "#F0F4FA" }}>
      {/* ── Left nav ── */}
      <Box
        sx={{
          width: 220,
          background: "#F8FAFF",
          borderRight: "1px solid #e8edf5",
          display: "flex",
          flexDirection: "column",
          py: 2,
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, px: 2.5, pb: 2 }}>
          Settings
        </Typography>

        <List dense disablePadding>
          {navItems.map((item) => (
            <ListItem
              key={item.id}
              button
              onClick={() => setActiveSection(item.id)}
              sx={{
                mx: 1,
                borderRadius: "10px",
                mb: 0.3,
                width: "auto",
                background: activeSection === item.id ? "#EAF2FE" : "transparent",
                color: activeSection === item.id ? "#5B96F7" : "#374151",
                fontWeight: activeSection === item.id ? 700 : 500,
                "&:hover": { background: activeSection === item.id ? "#EAF2FE" : "#f1f5f9" },
              }}
            >
              <ListItemIcon
                sx={{ minWidth: 32, color: activeSection === item.id ? "#5B96F7" : "#6b7280" }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "13px",
                  fontWeight: activeSection === item.id ? 700 : 500,
                }}
              />
              {activeSection === item.id && (
                <Box
                  sx={{
                    width: 3,
                    height: 20,
                    borderRadius: "4px",
                    background: "#5B96F7",
                    position: "absolute",
                    right: 0,
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>

        <Box sx={{ flex: 1 }} />

        {/* Logout */}
        <ListItem
          button
          onClick={logout}
          sx={{
            mx: 1,
            borderRadius: "10px",
            color: "#ef4444",
            "&:hover": { background: "#fef2f2" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: "#ef4444" }}>
            <SignOut size={18} />
          </ListItemIcon>
          <ListItemText
            primary="Log out"
            primaryTypographyProps={{ fontSize: "13px", fontWeight: 600 }}
          />
        </ListItem>
      </Box>

      {/* ── Content ── */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>

        {/* ── PROFILE ── */}
        {activeSection === "profile" && (
          <>
            <Section>
              {/* Avatar */}
              <Stack alignItems="center" sx={{ pt: 3, pb: 2 }}>
                <Box sx={{ position: "relative", mb: 2 }}>
                  <Avatar
                    src={avatarSrc}
                    sx={{ width: 96, height: 96, boxShadow: "0 4px 20px rgba(91,150,247,0.2)" }}
                  />
                  <Tooltip title="Change photo">
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        background: "#5B96F7",
                        color: "white",
                        width: 28,
                        height: 28,
                        "&:hover": { background: "#3b7ef4" },
                      }}
                    >
                      <Camera size={14} weight="fill" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {user?.name || user?.username || "User"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                  {user?.email || "No email"}
                </Typography>
              </Stack>

              <Divider />

              <Stack spacing={2} sx={{ p: 2.5 }}>
                <TextField
                  label="Display Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  size="small"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      "&.Mui-focused fieldset": { borderColor: "#5B96F7" },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#5B96F7" },
                  }}
                />
                <TextField
                  label="About"
                  value={editAbout}
                  onChange={(e) => setEditAbout(e.target.value)}
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                  inputProps={{ maxLength: 140 }}
                  helperText={`${editAbout.length}/140`}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      "&.Mui-focused fieldset": { borderColor: "#5B96F7" },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#5B96F7" },
                  }}
                />
                <Button
                  variant="contained"
                  disableElevation
                  onClick={handleSaveProfile}
                  disabled={saving}
                  sx={{
                    alignSelf: "flex-end",
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 700,
                    background: "#5B96F7",
                    "&:hover": { background: "#3b7ef4" },
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Stack>
            </Section>

            <Section title="Account">
              <SettingRow icon={<DeviceMobile size={18} />} label="Linked Devices" sub="Manage your devices" onClick={() => {}} />
              <Divider sx={{ mx: 2 }} />
              <SettingRow icon={<Globe size={18} />} label="Language" sub="English (US)" onClick={() => {}} />
              <Divider sx={{ mx: 2 }} />
              <SettingRow icon={<ShieldCheck size={18} />} label="Two-Step Verification" sub="Add extra security" onClick={() => {}} />
            </Section>
          </>
        )}

        {/* ── NOTIFICATIONS ── */}
        {activeSection === "notifications" && (
          <Section title="Notifications">
            <SettingRow
              icon={<Bell size={18} />}
              label="Message Notifications"
              sub="Notify for new messages"
              action={
                <Switch checked={notifMessages} onChange={() => setNotifMessages(!notifMessages)} size="small"
                  sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#5B96F7" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#5B96F7" } }}
                />
              }
            />
            <Divider sx={{ mx: 2 }} />
            <SettingRow
              icon={<Bell size={18} />}
              label="Notification Sounds"
              sub="Play sound for notifications"
              action={
                <Switch checked={notifSounds} onChange={() => setNotifSounds(!notifSounds)} size="small"
                  sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#5B96F7" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#5B96F7" } }}
                />
              }
            />
            <Divider sx={{ mx: 2 }} />
            <SettingRow
              icon={<ChatCircleText size={18} />}
              label="Message Previews"
              sub="Show message content in notifications"
              action={
                <Switch checked={notifPreviews} onChange={() => setNotifPreviews(!notifPreviews)} size="small"
                  sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#5B96F7" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#5B96F7" } }}
                />
              }
            />
            <Divider sx={{ mx: 2 }} />
            <SettingRow
              icon={<DeviceMobile size={18} />}
              label="Desktop Notifications"
              sub="Show notifications on desktop"
              action={
                <Switch checked={notifDesktop} onChange={() => setNotifDesktop(!notifDesktop)} size="small"
                  sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#5B96F7" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#5B96F7" } }}
                />
              }
            />
          </Section>
        )}

        {/* ── PRIVACY ── */}
        {activeSection === "privacy" && (
          <>
            <Section title="Who Can See">
              <Box sx={{ px: 2.5, py: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, fontSize: "13px" }}>
                  Last Seen & Online
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    value={lastSeen}
                    onChange={(e) => setLastSeen(e.target.value)}
                    sx={{ borderRadius: "10px", fontSize: "13px" }}
                  >
                    <MenuItem value="everyone">Everyone</MenuItem>
                    <MenuItem value="contacts">My Contacts</MenuItem>
                    <MenuItem value="nobody">Nobody</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Divider sx={{ mx: 2 }} />
              <SettingRow
                icon={<CheckCircle size={18} />}
                label="Read Receipts"
                sub="Show blue ticks when messages are read"
                action={
                  <Switch checked={readReceipts} onChange={() => setReadReceipts(!readReceipts)} size="small"
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#5B96F7" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#5B96F7" } }}
                  />
                }
              />
              <Divider sx={{ mx: 2 }} />
              <SettingRow
                icon={<Globe size={18} />}
                label="Show Online Status"
                sub="Let others know when you're online"
                action={
                  <Switch checked={userStatus === "online"} onChange={(e) => setUserStatus(e.target.checked ? "online" : "offline")} size="small"
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#5B96F7" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#5B96F7" } }}
                  />
                }
              />
            </Section>
            <Section title="Security">
              <SettingRow icon={<ShieldCheck size={18} />} label="End-to-End Encryption" sub="All messages are encrypted" action={<Chip label="Active" size="small" sx={{ background: "#d1fae5", color: "#065f46", fontWeight: 700, fontSize: "10px" }} />} />
              <Divider sx={{ mx: 2 }} />
              <SettingRow icon={<Lock size={18} />} label="Change Password" onClick={() => {}} />
              <Divider sx={{ mx: 2 }} />
              <SettingRow icon={<Lock size={18} />} label="Two-Step Verification" sub="Adds a PIN when registering" onClick={() => {}} />
            </Section>
          </>
        )}

        {/* ── APPEARANCE ── */}
        {activeSection === "appearance" && (
          <>
            <Section title="Theme">
              <Stack direction="row" spacing={2} sx={{ px: 2.5, py: 2 }}>
                {[
                  { id: false, icon: <SunHorizon size={22} weight="fill" />, label: "Light" },
                  { id: true, icon: <Moon size={22} weight="fill" />, label: "Dark" },
                ].map((t) => (
                  <Box
                    key={String(t.id)}
                    onClick={() => setDarkMode(t.id)}
                    sx={{
                      flex: 1,
                      py: 2,
                      borderRadius: "12px",
                      border: darkMode === t.id ? "2px solid #5B96F7" : "2px solid #e8edf5",
                      background: darkMode === t.id ? "#EAF2FE" : "#f8faff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 0.5,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      color: darkMode === t.id ? "#5B96F7" : "#6b7280",
                    }}
                  >
                    {t.icon}
                    <Typography variant="caption" sx={{ fontWeight: darkMode === t.id ? 700 : 500, fontSize: "11px" }}>
                      {t.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Section>

            <Section title="Accent Color">
              <Stack direction="row" spacing={1.5} sx={{ px: 2.5, py: 2 }}>
                {ACCENTS.map((color) => (
                  <Box
                    key={color}
                    onClick={() => setAccent(color)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: color,
                      cursor: "pointer",
                      border: accent === color ? "3px solid #111" : "3px solid transparent",
                      boxShadow: accent === color ? `0 0 0 2px ${color}44` : "none",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {accent === color && <CheckCircle size={14} color="white" weight="fill" />}
                  </Box>
                ))}
              </Stack>
            </Section>

            <Section title="Font Size">
              <Box sx={{ px: 2.5, py: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="caption" sx={{ color: "#9ca3af" }}>A</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#5B96F7" }}>{fontSize}px</Typography>
                  <Typography variant="body1" sx={{ color: "#9ca3af", fontWeight: 700 }}>A</Typography>
                </Stack>
                <Slider
                  value={fontSize}
                  onChange={(_, v) => setFontSize(v)}
                  min={12}
                  max={20}
                  step={1}
                  sx={{ color: "#5B96F7" }}
                />
              </Box>
            </Section>

            <Section title="Chat Wallpaper">
              <Stack direction="row" spacing={1.5} sx={{ px: 2.5, py: 2, flexWrap: "wrap", gap: 1 }}>
                {wallpapers.map((wp) => (
                  <Tooltip key={wp.id} title={wp.label}>
                    <Box
                      onClick={() => setWallpaper(wp.id)}
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "12px",
                        background: wp.bg,
                        cursor: "pointer",
                        border: wallpaper === wp.id ? "3px solid #5B96F7" : "3px solid transparent",
                        transition: "border 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {wallpaper === wp.id && <CheckCircle size={18} color="#5B96F7" weight="fill" />}
                    </Box>
                  </Tooltip>
                ))}
              </Stack>
            </Section>
          </>
        )}

        {/* ── CHATS ── */}
        {activeSection === "chats" && (
          <Section title="Chat Settings">
            <SettingRow icon={<ChatCircleText size={18} />} label="Enter Key Sends Message" sub="Press Enter to send, Shift+Enter for new line" action={<Switch defaultChecked size="small" sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#5B96F7" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#5B96F7" } }} />} />
            <Divider sx={{ mx: 2 }} />
            <SettingRow icon={<CheckCircle size={18} />} label="Message Timestamps" sub="Show time on every message" action={<Switch defaultChecked size="small" sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#5B96F7" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#5B96F7" } }} />} />
            <Divider sx={{ mx: 2 }} />
            <SettingRow icon={<Globe size={18} />} label="Auto-Download Media" sub="Download media when on Wi-Fi" action={<Switch defaultChecked size="small" sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#5B96F7" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#5B96F7" } }} />} />
          </Section>
        )}

        {/* ── SHORTCUTS ── */}
        {activeSection === "shortcuts" && (
          <Section title="Keyboard Shortcuts">
            {[
              ["New Chat", "Ctrl + N"],
              ["Search", "Ctrl + F"],
              ["Archive Chat", "Ctrl + E"],
              ["Mute Chat", "Ctrl + M"],
              ["Mark as Read", "Ctrl + Shift + U"],
              ["Bold Text", "Ctrl + B"],
              ["Italic Text", "Ctrl + I"],
              ["Strikethrough", "Ctrl + S"],
              ["Emoji Picker", "Ctrl + E"],
              ["Attach File", "Ctrl + A"],
            ].map(([action, shortcut], i, arr) => (
              <React.Fragment key={action}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ px: 2.5, py: 1.2 }}
                >
                  <Typography variant="body2" sx={{ fontSize: "13px", color: "#374151" }}>
                    {action}
                  </Typography>
                  <Chip
                    label={shortcut}
                    size="small"
                    sx={{
                      fontFamily: "monospace",
                      background: "#f1f5f9",
                      color: "#374151",
                      fontWeight: 600,
                      fontSize: "11px",
                      borderRadius: "6px",
                    }}
                  />
                </Stack>
                {i < arr.length - 1 && <Divider sx={{ mx: 2 }} />}
              </React.Fragment>
            ))}
          </Section>
        )}
      </Box>
    </Box>
  );
};

export default SettingsPage;
