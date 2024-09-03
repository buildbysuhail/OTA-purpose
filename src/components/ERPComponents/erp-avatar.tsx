import React from 'react';
import { Avatar, Box, Stack } from '@mui/material';

interface ERPAvatarProps {
  name?: string;
  alt?: string;
  children?: React.ReactNode;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  sizes?: string;
  src?: string;
  srcSet?: string;
  variant?: 'circular' | 'rounded' | 'square';
  sx?: any;
  onClick?: () => void;
  useStringAvatar?: boolean;
  [key: string]: any;
}

function stringToColor(string: string): string {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function getInitials(name: string) {
  const nameParts = name.split(' ');
  return `${nameParts[0][0]}${nameParts[1] ? nameParts[1][0] : ''}`;
}

const ERPAvatar: React.FC<ERPAvatarProps> = ({
  name,
  alt,
  children,
  sizes,
  src,
  srcSet,
  variant = 'circular',
  sx,
  onClick,
  useStringAvatar = true,
  // ...otherProps
}) => {
  debugger;
  name = name??alt;
  const bgColor = useStringAvatar && (src == undefined || src == null || src == '#') && name ? stringToColor(name): '';
  const initials = useStringAvatar && (src == undefined || src == null || src == '#') && name ? getInitials(name): '';
  return (
    <Box>
      <Avatar
        alt={alt || name}
        src={src}
        srcSet={srcSet}
        variant={variant}
        sizes={sizes}
        onClick={onClick}
        sx={{ bgcolor: bgColor, ...sx }}
        // {...otherProps}
      >
        {useStringAvatar && (src == undefined || src == null || src == '#') && name ? initials:null}
      </Avatar>
    </Box>
  );
};

export default React.memo(ERPAvatar);