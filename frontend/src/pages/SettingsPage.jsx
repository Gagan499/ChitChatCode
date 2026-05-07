import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Stack,
  Typography,
  Avatar,
  Switch,
  Divider,
  Button,
  TextField,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  User,
  Bell,
  Lock,
  SignOut,
  CaretRight,
  ShieldCheck,
} from "@phosphor-icons/react";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import {
  updateUserProfile,
  updateLanguage,
  toggle2FA,
} from "../services/api";

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
const SettingRow = ({ icon, label, sub, action, danger, onClick }) => (
  <ListItem
    sx={{
      px: 2.5,
      py: 1.2,
      cursor: onClick ? "pointer" : "default",
      "&:hover": onClick ? { background: "#f8faff" } : {},
      transition: "background 0.15s",
    }}
    onClick={onClick}
  >
    {icon && (
      <ListItemIcon
        sx={{ minWidth: 36, color: danger ? "#ef4444" : "#5B96F7" }}
      >
        {icon}
      </ListItemIcon>
    )}
    <ListItemText
      primary={
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: danger ? "#ef4444" : "#111827",
            fontSize: "13px",
          }}
        >
          {label}
        </Typography>
      }
      secondary={
        sub && (
          <Typography
            variant="caption"
            sx={{ color: "#9ca3af", fontSize: "11px" }}
          >
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


/* ─── Settings Page ──────────────────────────────────────────────────────── */
const SettingsPage = () => {
  const { user, logout, updateUser } = useAuth();
  const { settings: notifSettings, updateSetting: updateNotifSetting } = useNotifications();

  // ── Feedback state ────────────────────────────────────────────────────────
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const showFeedback = (type, msg = "") => {
    if (type === "success") { setSaveSuccess(true); setSaveError(""); }
    else { setSaveError(msg); setSaveSuccess(false); }
    setTimeout(() => { setSaveSuccess(false); setSaveError(""); }, 3500);
  };

  // ── Profile edit ──────────────────────────────────────────────────────────
  const [editName, setEditName] = useState(user?.username || user?.name || "User");
  const [editAbout, setEditAbout] = useState(user?.about || "");
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!editName.trim()) { showFeedback("error", "Display name cannot be empty"); return; }
    setSaving(true);
    try {
      const { data } = await updateUserProfile({ username: editName.trim(), about: editAbout });
      updateUser({ username: data.username, about: data.about });
      showFeedback("success");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to save profile";
      showFeedback("error", msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Notification settings ────────────────────────────────────────────────
  const notifMessages = notifSettings?.message_notifications ?? true;
  const notifSounds = notifSettings?.sound ?? true;

  const handleToggleNotif = useCallback(async (key, currentValue) => {
    await updateNotifSetting(key, !currentValue);
  }, [updateNotifSetting]);

  // ── Language ─────────────────────────────────────────────────────────────
  const [language, setLanguage] = useState(user?.language || "en");
  const [savingLang, setSavingLang] = useState(false);

  const handleSaveLanguage = async (lang) => {
    setLanguage(lang);
    setSavingLang(true);
    try {
      await updateLanguage({ language: lang });
      updateUser({ language: lang });
    } catch (err) {
      console.warn("Failed to save language", err);
    } finally {
      setSavingLang(false);
    }
  };

  // ── 2FA ───────────────────────────────────────────────────────────────────
  const [twoFA, setTwoFA] = useState(user?.two_factor_enabled ?? false);
  const [toggling2FA, setToggling2FA] = useState(false);

  const handleToggle2FA = async () => {
    setToggling2FA(true);
    try {
      const { data } = await toggle2FA();
      setTwoFA(data.two_factor_enabled);
      updateUser({ two_factor_enabled: data.two_factor_enabled });
    } catch (err) {
      console.warn("Failed to toggle 2FA", err);
    } finally {
      setToggling2FA(false);
    }
  };

  const avatarSrc =
    user?.avatar ||
    user?.profilePicture ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || user?.name || "user"}`;

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
          <ListItem
            button
            sx={{
              mx: 1,
              borderRadius: "10px",
              mb: 0.3,
              width: "auto",
              background: "#EAF2FE",
              color: "#5B96F7",
              fontWeight: 700,
              "&:hover": {
                background: "#EAF2FE",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: "#5B96F7" }}>
              <User size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{
                fontSize: "13px",
                fontWeight: 700,
              }}
            />
          </ListItem>
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
        <Section>
          {/* Avatar */}
          <Stack alignItems="center" sx={{ pt: 3, pb: 2 }}>
            <Avatar
              src={avatarSrc}
              sx={{
                width: 96,
                height: 96,
                boxShadow: "0 4px 20px rgba(91,150,247,0.2)",
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 2 }}>
              {user?.username || user?.name || "User"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
              {user?.email || "No email"}
            </Typography>
          </Stack>

          <Divider />

          <Stack spacing={2} sx={{ p: 2.5 }}>
            {/* Feedback alerts */}
            {saveSuccess && (
              <Alert severity="success" sx={{ borderRadius: "10px", fontSize: "12px" }}>
                Profile saved successfully!
              </Alert>
            )}
            {saveError && (
              <Alert severity="error" sx={{ borderRadius: "10px", fontSize: "12px" }}>
                {saveError}
              </Alert>
            )}
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

        {/* ── NOTIFICATIONS ── */}
        <Section title="Notifications">
          <SettingRow
            icon={<Bell size={18} />}
            label="Message Notifications"
            sub="Notify for new messages"
            action={
              <Switch
                checked={notifMessages}
                onChange={() => handleToggleNotif("message_notifications", notifMessages)}
                size="small"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#5B96F7" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#5B96F7",
                  },
                }}
              />
            }
          />
          <Divider sx={{ mx: 2 }} />
          <SettingRow
            icon={<Bell size={18} />}
            label="Sound Notifications"
            sub="Play sound for alerts"
            action={
              <Switch
                checked={notifSounds}
                onChange={() => handleToggleNotif("sound", notifSounds)}
                size="small"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#5B96F7" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#5B96F7",
                  },
                }}
              />
            }
          />
        </Section>

        {/* ── ACCOUNT ── */}
        <Section title="Account">
          {/* Language */}
          <Box sx={{ px: 2.5, py: 1.5 }}>
            <Stack direction="row" alignItems="center" gap={1} mb={0.8}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "13px" }}>
                Language
              </Typography>
              {savingLang && <CircularProgress size={12} sx={{ color: "#5B96F7" }} />}
            </Stack>
            <FormControl size="small" fullWidth>
              <Select
                value={language}
                onChange={(e) => handleSaveLanguage(e.target.value)}
                sx={{ borderRadius: "10px", fontSize: "13px" }}
              >
                <MenuItem value="en">English (US)</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="hi">Hindi</MenuItem>
                <MenuItem value="zh">Chinese</MenuItem>
                <MenuItem value="ar">Arabic</MenuItem>
                <MenuItem value="pt">Portuguese</MenuItem>
                <MenuItem value="ja">Japanese</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Divider sx={{ mx: 2 }} />
          {/* Two-Step Verification */}
          <SettingRow
            icon={<ShieldCheck size={18} />}
            label="Two-Factor Authentication"
            sub={twoFA ? "Enabled" : "Add extra security"}
            action={
              <Switch
                checked={twoFA}
                onChange={handleToggle2FA}
                disabled={toggling2FA}
                size="small"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#5B96F7" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#5B96F7" },
                }}
              />
            }
          />
        </Section>
      </Box>
    </Box>
  );
};

export default SettingsPage;
