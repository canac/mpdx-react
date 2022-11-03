import React from 'react';
import {
  Box,
  Divider,
  Grid,
  GridProps,
  Hidden,
  IconButton,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Delete } from '@mui/icons-material';

export const SectionHeading = styled(Typography)(() => ({
  fontWeight: 700,
  lineHeight: 1,
  display: 'block',
}));

const SmallColumnLabels = styled(Grid)(() => ({
  display: 'flex',
  alignItems: 'flex-end',
  '& span': {
    fontSize: '0.6875em',
    lineHeight: 1,
  },
}));

interface OptionHeadingsProps {
  smallCols: GridProps['sm'];
  align?: GridProps['justifyContent'];
  children?: React.ReactNode;
}

export const OptionHeadings: React.FC<OptionHeadingsProps> = ({
  smallCols,
  align = 'center',
  children,
}) => (
  <SmallColumnLabels item sm={smallCols} justifyContent={align}>
    <Typography component="span">{children}</Typography>
  </SmallColumnLabels>
);

export const EmptyIcon: React.FC<{ size?: number }> = ({ size = 24 }) => {
  return (
    <span
      style={{ width: `${size}px`, height: `${size}px`, display: 'block' }}
    ></span>
  );
};

const btnBorder = '1px solid rgba(0, 0, 0, 0.23)';

export const StyledGridContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    border: btnBorder,
    borderRadius: theme.shape.borderRadius,
    "&[class*='WithStyles']": {
      marginTop: theme.spacing(1),
      "& + [class*='WithStyles']": {
        marginTop: theme.spacing(3),
      },
    },
  },
}));

export const StyledGridItem = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '& .MuiButtonBase-root': {
    border: btnBorder,
    borderRadius: 4,
    padding: 9,
  },
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
}));

interface HiddenSmLabelProps {
  children?: React.ReactNode;
}

export const HiddenSmLabel: React.FC<HiddenSmLabelProps> = ({ children }) => (
  <Hidden smUp>
    <Typography component="span">{children}</Typography>
  </Hidden>
);

export const DeleteButton: React.FC = () => (
  <>
    <HiddenSmLabel>Delete</HiddenSmLabel>
    <IconButton disableRipple>
      <Delete />
    </IconButton>
  </>
);

export const AddButtonBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  [theme.breakpoints.up('sm')]: { marginTop: theme.spacing(1) },
}));

export const StyledDivider = styled(Divider)(({ theme }) => {
  return {
    marginTop: theme.spacing(3),
    marginLeft: 0,
    marginRight: 0,
    marginBottom: theme.spacing(3),
  };
});
