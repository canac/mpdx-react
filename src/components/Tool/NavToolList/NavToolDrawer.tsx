import React, { ReactElement } from 'react';
import { makeStyles, Theme, Drawer } from '@material-ui/core';
import NavToolDrawerHandle from './NavToolDrawerHandle';
import NavToolList from './NavToolList';

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    zIndex: 1,
  },
  navToggle: {
    backgroundColor: theme.palette.mpdxBlue.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.mpdxBlue.main,
    },
  },
}));

export interface Props {
  open: boolean;
  toggle: () => void;
}

const NavToolDrawer = ({ open, toggle }: Props): ReactElement => {
  const classes = useStyles();

  return (
    <>
      <Drawer
        anchor={'left'}
        open={open}
        onClose={toggle}
        variant="persistent"
        className={classes.drawer}
      >
        <NavToolList />
      </Drawer>
      <NavToolDrawerHandle open={open} toggle={toggle} />
    </>
  );
};

export default NavToolDrawer;