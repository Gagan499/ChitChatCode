import React from 'react';
import { Avatar as MuiAvatar, Badge, styled } from '@mui/material';

// Custom styled badge for the green "online" indicator
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
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
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const CustomAvatar = ({ src, alt, size = 44, isOnline = false, sx, ...props }) => {
  const avatarComponent = (
    <MuiAvatar 
      src={src} 
      alt={alt} 
      sx={{ width: size, height: size, ...sx }} 
      {...props} 
    />
  );

  // If the user is online, wrap the avatar in the styled badge
  if (isOnline) {
    return (
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        {avatarComponent}
      </StyledBadge>
    );
  }

  // Otherwise, just return the plain avatar
  return avatarComponent;
};

export default CustomAvatar;