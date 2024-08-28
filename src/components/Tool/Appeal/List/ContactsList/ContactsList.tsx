import React, { useEffect, useMemo } from 'react';
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { InfiniteList } from 'src/components/InfiniteList/InfiniteList';
import { navBarHeight } from 'src/components/Layouts/Primary/Primary';
import NullState from 'src/components/Shared/Filters/NullState/NullState';
import { headerHeight } from 'src/components/Shared/Header/ListHeader';
import theme from 'src/theme';
import {
  AppealHeaderInfo,
  appealHeaderInfoHeight,
} from '../../AppealDetails/AppealHeaderInfo';
import { AppealQuery } from '../../AppealDetails/AppealsMainPanel/AppealInfo.generated';
import {
  AppealStatusEnum,
  AppealsContext,
  AppealsType,
} from '../../AppealsContext/AppealsContext';
import { ContactRow } from '../ContactRow/ContactRow';

const useStyles = makeStyles()(() => ({
  headerContainer: {
    borderBottom: `1px solid ${theme.palette.cruGrayLight.main}`,
  },
  contactHeader: {
    padding: theme.spacing(1, 2),
  },
  givingHeader: {
    padding: '8px 16px 8px 30px',
    [theme.breakpoints.down('md')]: {
      padding: '8px 16px 8px 8px',
    },
  },
}));

interface ContactsListProps {
  appealInfo?: AppealQuery;
  appealInfoLoading: boolean;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  appealInfo,
  appealInfoLoading,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const [nullStateTitle, setNullStateTitle] = React.useState<string>('');

  const {
    contactsQueryResult,
    isFiltered,
    searchTerm,
    setActiveFilters,
    activeFilters,
    contactDetailsOpen,
  } = React.useContext(AppealsContext) as AppealsType;

  const { data, loading, fetchMore } = contactsQueryResult;

  useEffect(() => {
    if (!activeFilters.appealStatus) {
      return;
    }
    switch (activeFilters.appealStatus.toLowerCase()) {
      case 'processed':
        setNullStateTitle(t('No donations yet towards this appeal'));
        break;
      case 'excluded':
        setNullStateTitle(t('No contacts have been excluded from this appeal'));
        break;
      case 'asked':
        setNullStateTitle(
          t('All contacts for this appeal have committed to this appeal'),
        );
        break;
      case 'not_received':
        setNullStateTitle(
          t(
            'There are no contacts for this appeal that have not been received.',
          ),
        );
        break;
      case 'received_not_processed':
        setNullStateTitle(
          t('No gifts have been received and not yet processed to this appeal'),
        );
        break;
      default:
        setNullStateTitle('');
        break;
    }
  }, [activeFilters]);

  const columnName = useMemo(() => {
    let name = t('Regular Giving');
    if (
      activeFilters.appealStatus === AppealStatusEnum.NotReceived ||
      activeFilters.appealStatus === AppealStatusEnum.ReceivedNotProcessed
    ) {
      name = t('Amount Committed');
    } else if (activeFilters.appealStatus === AppealStatusEnum.Processed) {
      name = t('Donation(s)');
    }
    return name;
  }, [activeFilters]);

  return (
    <>
      <AppealHeaderInfo
        appealInfo={appealInfo?.appeal}
        loading={appealInfoLoading}
      />

      <Grid container alignItems="center" className={classes.headerContainer}>
        <Grid item xs={10} md={6} className={classes.contactHeader}>
          <Typography variant="subtitle1" fontWeight={800}>
            {t('Contact')}
          </Typography>
        </Grid>
        <Grid item xs={2} md={6} className={classes.givingHeader}>
          <Box justifyContent={contactDetailsOpen ? 'flex-end' : undefined}>
            <Box>
              <Typography variant="subtitle1" fontWeight={800}>
                {columnName}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <InfiniteList
        loading={loading}
        data={data?.contacts?.nodes ?? []}
        style={{
          height: `calc(100vh - ${navBarHeight} - ${headerHeight} - ${appealHeaderInfoHeight})`,
        }}
        itemContent={(index, contact) => (
          <ContactRow
            key={contact.id}
            contact={contact}
            useTopMargin={index === 0}
          />
        )}
        groupBy={(item) => ({ label: item.name[0].toUpperCase() })}
        endReached={() =>
          data?.contacts?.pageInfo.hasNextPage &&
          fetchMore({
            variables: {
              after: data.contacts?.pageInfo.endCursor,
            },
          })
        }
        EmptyPlaceholder={
          <Box width="75%" margin="auto" mt={2}>
            <NullState
              page="contact"
              totalCount={data?.contacts.totalCount || 0}
              filtered={isFiltered || !!searchTerm}
              changeFilters={setActiveFilters}
              title={nullStateTitle}
              paragraph={''}
            />
          </Box>
        }
      />
    </>
  );
};