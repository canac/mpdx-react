import React, { useState } from 'react';
import {
  makeStyles,
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  CircularProgress,
} from '@material-ui/core';

import { Trans, useTranslation } from 'react-i18next';
import { useAccountListId } from '../../../../src/hooks/useAccountListId';
import theme from '../../../theme';
import { useGetContactDuplicatesQuery } from './GetContactDuplicates.generated';
import Contact from './Contact';
import NoContacts from './NoContacts';

const useStyles = makeStyles(() => ({
  container: {
    padding: theme.spacing(3),
    width: '70%',
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      width: '80%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  outer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  descriptionBox: {
    marginBottom: theme.spacing(2),
  },
  footer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: theme.palette.mpdxBlue.main,
    width: 200,
    color: 'white',
  },
}));

// Temporary date for desting, structure most likely isn't accurate
// but making adjustments should be easy in the future
// const testData = [
//   {
//     contact1: {
//       id: 'aa',
//       title: 'Test Contact and Friends',
//       address: {
//         street: '70 Test Ave',
//         city: 'Vancouver',
//         state: 'BC',
//         zip: 'V5Z 2V7',
//       },
//       source: 'DonorHub',
//       date: '01/01/2021',
//     },
//     contact2: {
//       id: 'bb',
//       title: 'Test Contact Duplicate',
//       address: {
//         street: '123 Another St',
//         city: 'Test',
//         state: 'TS',
//         zip: '4321',
//       },
//       source: 'DonorHub',
//       date: '03/23/2023',
//     },
//   },
// ];

interface actionType {
  action: string;
  mergeId?: string;
}

interface actionsType {
  [key: string]: actionType;
}

const MergeContacts: React.FC = () => {
  const classes = useStyles();
  const [actions, setActions] = useState<actionsType>({});
  const { t } = useTranslation();
  const accountListId = useAccountListId();
  const { data, loading } = useGetContactDuplicatesQuery({
    variables: { accountListId: accountListId || '' },
  });

  const updateActions = (id1: string, id2: string, action: string): void => {
    if (action === 'cancel') {
      setActions((prevState) => ({
        ...prevState,
        [id1]: { action: '' },
        [id2]: { action: '' },
      }));
    } else {
      setActions((prevState) => ({
        ...prevState,
        [id1]: { action: 'merge', mergeId: id2 },
        [id2]: { action: 'delete' },
      }));
    }
  };

  const testFnc = (): void => {
    for (const [id, action] of Object.entries(actions)) {
      switch (action.action) {
        case 'merge':
          console.log(`Merging ${id} with ${action.mergeId}`);
          break;
        case 'delete':
          console.log(`Deleting ${id}`);
          break;
        default:
          break;
      }
    }
  };

  return (
    <>
      <Box
        className={classes.outer}
        display="flex"
        flexDirection="column"
        data-testid="Home"
      >
        {!loading && data ? (
          <Grid container className={classes.container}>
            <Grid item xs={12}>
              <Typography variant="h4">{t('Merge Contacts')}</Typography>
              <Divider className={classes.divider} />
              <Box className={classes.descriptionBox}>
                <Typography>
                  {t(
                    ' You have {{amount}} possible duplicate contacts. This is sometimes caused when you imported data into MPDX. We recommend reconciling these as soon as possible. Please select the duplicate that should win the merge. No data will be lost. ',
                    { amount: data?.contactDuplicates.nodes.length },
                  )}
                </Typography>
                <Typography>
                  <strong>{t('This cannot be undone.')}</strong>
                </Typography>
              </Box>
            </Grid>
            {data?.contactDuplicates.nodes.length > 0 ? (
              <>
                <Grid item xs={12}>
                  {data?.contactDuplicates.nodes.map((duplicate) => (
                    <Contact
                      key={duplicate.id}
                      contact1={duplicate.recordOne}
                      contact2={duplicate.recordTwo}
                      update={updateActions}
                    />
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ width: '100%' }}
                    p={2}
                  >
                    <Button
                      variant="contained"
                      onClick={() => testFnc()}
                      className={classes.confirmButton}
                    >
                      {t('Confirm and Continue')}
                    </Button>
                    <Box ml={2} mr={2}>
                      <Typography>
                        <strong>{t('OR')}</strong>
                      </Typography>
                    </Box>
                    <Button className={classes.confirmButton}>
                      {t('Confirm and Leave')}
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.footer}>
                    <Typography>
                      <Trans
                        defaults="Showing <bold>{{value}}</bold> of <bold>{{value}}</bold>"
                        values={{ value: data?.contactDuplicates.nodes.length }}
                        components={{ bold: <strong /> }}
                      />
                    </Typography>
                  </Box>
                </Grid>
              </>
            ) : (
              <NoContacts />
            )}
          </Grid>
        ) : (
          <CircularProgress style={{ marginTop: theme.spacing(3) }} />
        )}
      </Box>
    </>
  );
};

export default MergeContacts;
