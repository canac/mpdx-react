import React, { ReactNode } from 'react';
import { Box, styled } from '@material-ui/core';

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: 0,
  justifyContent: 'center',
  position: 'absolute',
  top: '50%',
  left: 8,
  transform: 'translateY(-50%)',
  color: theme.palette.cruGrayMedium.main,
}));

interface ModalSectionIconProps {
  icon: ReactNode;
}

export const ModalSectionIcon: React.FC<ModalSectionIconProps> = ({ icon }) => {
  return <IconContainer>{icon}</IconContainer>;
};