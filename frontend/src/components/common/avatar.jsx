import React from 'react';
import { Avatar as MuiAvatar, Badge } from '@mui/material';

// Map status -> dot color
const STATUS_COLORS = {
  online: '#44b700',
  away: '#f59e0b',
  busy: '#ef4444',
};

// Palette of gradients — picked by hashing the user's name
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #7c3aed, #4f46e5)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
  'linear-gradient(135deg, #f97316, #eab308)',
  'linear-gradient(135deg, #14b8a6, #6366f1)',
  'linear-gradient(135deg, #e11d48, #f59e0b)',
];

/** Stable hash → gradient index based on name string */
function gradientFromName(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

/** Extract up to 2 initials from a full name/username */
function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const CustomAvatar = ({ src, alt, size = 44, status, isOnline = false, sx, ...props }) => {
  const gradient = gradientFromName(alt || '');
  const initials = getInitials(alt || '');
  const fontSize = Math.max(10, Math.round(size * 0.38));

  // Prefer explicit status; fallback to boolean online flag for backwards compatibility.
  const statusKey = status || (isOnline ? 'online' : null);
  const statusColor = statusKey ? STATUS_COLORS[statusKey] : null;

  const avatarComponent = (
    <MuiAvatar
      src={src || undefined}
      alt={alt}
      sx={{
        width: size,
        height: size,
        background: gradient,
        fontSize: fontSize,
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '0.03em',
        ...sx,
      }}
      {...props}
    >
      {/* Shown only when src is absent or fails to load */}
      {!src && initials}
    </MuiAvatar>
  );

  if (!statusColor) return avatarComponent;

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: statusColor,
          color: statusColor,
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
          '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
          },
        },
        '@keyframes ripple': {
          '0%': { transform: 'scale(.8)', opacity: 1 },
          '100%': { transform: 'scale(2.4)', opacity: 0 },
        },
      }}
    >
      {avatarComponent}
    </Badge>
  );
};

export default CustomAvatar;
