import React, { ReactElement } from 'react';
import {
  Typography,
  CardContent,
  CardActionArea,
  makeStyles,
  Box,
} from '@material-ui/core';
import Icon from '@mdi/react';
import NextLink from 'next/link';
import { useAccountListId } from '../../../../src/hooks/useAccountListId';
import theme from '../../../theme';
import AnimatedCard from 'src/components/AnimatedCard';

const useStyles = makeStyles(() => ({
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid',
    height: '200px',
    borderColor: theme.palette.cruGrayMedium.main,
    backgroundColor: theme.palette.cruGrayLight.main,
    '&:hover': {
      border: '2px solid',
      borderColor: theme.palette.mpdxBlue.main,
      cursor: 'pointer',
    },
  },
  cardContent: {
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '200px',
  },
  iconBG: {
    padding: '10px',
    borderRadius: '50%',
    height: '80px',
    width: '80px',
    backgroundColor: 'white',
  },
}));

export interface Props {
  tool: string;
  desc: string;
  icon: string;
  id: string;
}

const Tool = ({ tool, desc, icon, id }: Props): ReactElement => {
  const classes = useStyles();
  const accountListId = useAccountListId();

  return (
    <NextLink
      href={`/accountLists/${accountListId}/tools/${id}`}
      scroll={false}
    >
      <AnimatedCard className={classes.cardContainer}>
        <CardActionArea>
          <CardContent className={classes.cardContent}>
            <Box
              className={classes.iconBG}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Icon path={icon} size={1.5} />
            </Box>
            <Typography variant="h6" data-testid="ToolNameTypography">
              {tool}
            </Typography>
            <Typography variant="body2" data-testid="ToolDescriptionTypography">
              {desc}
            </Typography>
          </CardContent>
        </CardActionArea>
      </AnimatedCard>
    </NextLink>
  );
};

export default Tool;
