import React, { ReactElement } from 'react';
import {
  CardHeader,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  CardContent,
  styled,
} from '@material-ui/core';
import { DateTime } from 'luxon';
import { Skeleton } from '@material-ui/lab';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AnimatedCard from '../../../AnimatedCard';
import HandoffLink from '../../../HandoffLink';
import illustration14 from '../../../../images/drawkit/grape/drawkit-grape-pack-illustration-14.svg';
import { GetThisWeekQuery } from '../GetThisWeek.generated';

const LateCommitmentsContainer = styled(AnimatedCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '322px',
  [theme.breakpoints.down('xs')]: {
    height: 'auto',
  },
}));

const MotionDiv = styled(motion.div)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
}));

const CardList = styled(List)(() => ({
  flex: 1,
  padding: 0,
  overflow: 'auto',
}));

const LateCommitmentsCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '& > img': {
    height: '150px',
    marginBottom: theme.spacing(2),
  },
}));

interface Props {
  loading?: boolean;
  latePledgeContacts?: GetThisWeekQuery['latePledgeContacts'];
}

const LateCommitments = ({
  loading,
  latePledgeContacts,
}: Props): ReactElement => {
  const { t } = useTranslation();

  return (
    <LateCommitmentsContainer>
      <CardHeader title={t('Late Commitments')} />
      {loading && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-testid="LateCommitmentsDivLoading"
        >
          <CardList>
            {[0, 1, 2].map((index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={<Skeleton variant="text" width={100} />}
                  secondary={<Skeleton variant="text" width={200} />}
                />
              </ListItem>
            ))}
          </CardList>
          <CardActions>
            <Button size="small" color="primary" disabled>
              {t('View All ({{ totalCount, number }})', { totalCount: 0 })}
            </Button>
          </CardActions>
        </MotionDiv>
      )}
      {!loading && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {(!latePledgeContacts || latePledgeContacts.nodes.length === 0) && (
            <LateCommitmentsCardContent data-testid="LateCommitmentsCardContentEmpty">
              <img src={illustration14} alt="empty" />
              {t('No late commitments to show.')}
            </LateCommitmentsCardContent>
          )}
          {latePledgeContacts && latePledgeContacts.nodes.length > 0 && (
            <>
              <CardList data-testid="LateCommitmentsListContacts">
                {latePledgeContacts.nodes.map((contact) => {
                  if (!contact.lateAt) {
                    return null;
                  }
                  const daysLate = Math.round(
                    DateTime.local().diff(
                      DateTime.fromISO(contact.lateAt),
                      'days',
                    ).days,
                  );

                  return (
                    <HandoffLink
                      key={contact.id}
                      path={`/contacts/${contact.id}`}
                    >
                      <ListItem
                        component="a"
                        button
                        data-testid={`LateCommitmentsListItemContact-${contact.id}`}
                      >
                        <ListItemText
                          primary={contact.name}
                          secondary={t(
                            'Their gift is {{ daysLate, number }} day late.',
                            {
                              daysLate,
                            },
                          )}
                        />
                      </ListItem>
                    </HandoffLink>
                  );
                })}
              </CardList>
              <CardActions>
                <HandoffLink
                  path={`/contacts?filters=${encodeURIComponent(
                    JSON.stringify({
                      late_at: `1970-01-01..${DateTime.local()
                        .endOf('day')
                        .toISODate()}`,
                      status: 'Partner - Financial',
                    }),
                  )}`}
                >
                  <Button
                    size="small"
                    color="primary"
                    data-testid="LateCommitmentsButtonViewAll"
                  >
                    {t('View All ({{ totalCount, number }})', {
                      totalCount: latePledgeContacts?.totalCount,
                    })}
                  </Button>
                </HandoffLink>
              </CardActions>
            </>
          )}
        </MotionDiv>
      )}
    </LateCommitmentsContainer>
  );
};

export default LateCommitments;
