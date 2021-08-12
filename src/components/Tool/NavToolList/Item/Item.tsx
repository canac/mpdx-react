import React, { ReactElement } from 'react';
import { ListItem, ListItemText, makeStyles, Theme } from '@material-ui/core';
import { ArrowForwardIos } from '@material-ui/icons';
import NextLink from 'next/link';
import { useAccountListId } from 'src/hooks/useAccountListId';

const useStyles = makeStyles((theme: Theme) => ({
  liButton: {
    '&:hover': {
      backgroundColor: theme.palette.cruGrayLight.main,
    },
  },
}));

interface Props {
  key: string;
  id: string;
  title: string;
}

export const Item = ({ id, title }: Props): ReactElement => {
  const accountListId = useAccountListId();
  const classes = useStyles();

  return (
    <NextLink
      href={`/accountLists/${accountListId}/tools/${id}`}
      scroll={false}
    >
      <ListItem button className={classes.liButton}>
        <ListItemText
          primaryTypographyProps={{
            variant: 'subtitle1',
            color: 'textPrimary',
          }}
          primary={title}
        />
        <ArrowForwardIos fontSize="small" color="disabled" />
      </ListItem>
    </NextLink>
  );
};
