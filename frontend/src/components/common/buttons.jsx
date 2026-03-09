import React from 'react';
import { Button, IconButton } from '@mui/material';

// 1. Solid Blue Primary Button
export const PrimaryButton = ({ children, onClick, fullWidth, disabled, sx, ...props }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      fullWidth={fullWidth}
      disabled={disabled}
      disableElevation
      sx={{
        backgroundColor: '#4285F4',
        color: 'white',
        borderRadius: '12px',
        textTransform: 'none', // Prevents MUI's default ALL CAPS text
        fontWeight: 600,
        padding: '10px 24px',
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: '#3b77db',
          boxShadow: '0 4px 14px 0 rgba(66, 133, 244, 0.4)', // Soft blue glow
        },
        '&.Mui-disabled': {
          backgroundColor: '#93C5FD', // Lighter blue for disabled state
          color: '#ffffff',
        },
        ...sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

// 2. Rounded Icon Button for Navbars/Toolbars
export const SidebarIconButton = ({ icon, isActive, onClick, sx, ...props }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        backgroundColor: isActive ? '#4285F4' : 'transparent',
        color: isActive ? 'white' : '#94A3B8',
        borderRadius: '14px',
        padding: 1.5,
        transition: 'all 0.2s',
        boxShadow: isActive ? '0 4px 14px 0 rgba(66, 133, 244, 0.4)' : 'none',
        '&:hover': {
          backgroundColor: isActive ? '#3b77db' : '#F1F5F9',
          color: isActive ? 'white' : '#4285F4',
        },
        ...sx
      }}
      {...props}
    >
      {icon}
    </IconButton>
  );
};