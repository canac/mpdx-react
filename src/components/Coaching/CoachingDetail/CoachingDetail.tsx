import React, { Fragment, useState } from 'react';
import { Box, Button, ButtonGroup, Divider, Typography } from '@mui/material';
// TODO: EcoOutlined is not defined on @mui/icons-material, find replacement.
import AccountCircle from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import Skeleton from '@mui/material/Skeleton';
import { AppealProgress } from '../AppealProgress/AppealProgress';
import { MonthlyCommitment } from './MonthlyCommitment/MonthlyCommitment';
import {
  useGetAccountListCoachUsersQuery,
  useGetAccountListUsersQuery,
  useLoadAccountListCoachingDetailQuery,
  useLoadCoachingDetailQuery,
} from './LoadCoachingDetail.generated';
import theme from 'src/theme';
import { MonthlyActivitySection } from 'src/components/Reports/DonationsReport/MonthlyActivity/MonthlyActivitySection';
import { currencyFormat } from 'src/lib/intlFormat';
import { useLocale } from 'src/hooks/useLocale';

interface CoachingDetailProps {
  coachingId: string;
  isAccountListId: boolean;
}

const CoachingLoadingSkeleton = styled(Skeleton)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  margin: theme.spacing(1),
}));

const CoachingDetailContainer = styled(Box)(({}) => ({
  width: '100&',
  minHeight: '100%',
  display: 'flex',
}));

const CoachingSideContainer = styled(Box)(({ theme }) => ({
  minHeight: '100%',
  flexGrow: 1,
  padding: theme.spacing(1),
}));

const CoachingSideTitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  margin: theme.spacing(1),
  alignItems: 'center',
  alignContent: 'center',
}));

const CoachingMainContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  flexGrow: 4,
}));

const CoachingItemContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const CoachingMainTitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  margin: theme.spacing(1),
  alignItems: 'center',
  alignContent: 'center',
}));

const CoachingMonthYearButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  color: theme.palette.primary.contrastText,
}));

const SideContainerText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  margin: theme.spacing(0, 1),
}));

const SideContainerIcon = styled(AccountCircle)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  margin: theme.spacing(0, 1),
}));

export const CoachingDetail: React.FC<CoachingDetailProps> = ({
  coachingId,
  isAccountListId = false,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data: accountListData, loading } =
    useLoadAccountListCoachingDetailQuery({
      variables: { coachingId },
      skip: !isAccountListId,
    });

  const { data: coachingData, loading: coachingLoading } =
    useLoadCoachingDetailQuery({
      variables: { coachingId },
      skip: isAccountListId,
    });

  const { data: coachingUsersData, loading: coachingUsersLoading } =
    useGetAccountListCoachUsersQuery({
      variables: { accountListId: coachingId },
    });

  const { data: accountListUsersData, loading: accountListUsersLoading } =
    useGetAccountListUsersQuery({
      variables: { accountListId: coachingId },
    });

  const data = isAccountListId
    ? accountListData?.accountList
    : coachingData?.coachingAccountList;

  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <CoachingDetailContainer>
      <CoachingSideContainer bgcolor={theme.palette.progressBarGray.main}>
        <CoachingSideTitleContainer>
          {/* TODO: EcoOutlined is not defined on @mui/icons-material, find replacement.
          <EcoOutlined
            style={{
              color: theme.palette.primary.contrastText,
              margin: theme.spacing(1),
            }}
          /> */}
          <SideContainerText variant="h5" display="block">
            {t('Coaching')}
          </SideContainerText>
        </CoachingSideTitleContainer>
        <Divider style={{ background: theme.palette.primary.contrastText }} />
        <CoachingMonthYearButtonGroup
          variant="outlined"
          color="inherit"
          fullWidth
          size="large"
        >
          <Button
            variant={isMonthly ? 'contained' : 'outlined'}
            onClick={() => setIsMonthly(true)}
          >
            {t('Monthly')}
          </Button>
          <Button
            variant={isMonthly ? 'outlined' : 'contained'}
            onClick={() => setIsMonthly(false)}
          >
            {t('Yearly')}
          </Button>
        </CoachingMonthYearButtonGroup>
        <SideContainerText>{t('Staff IDs:')}</SideContainerText>
        <SideContainerText>None</SideContainerText>
        <SideContainerText>
          {t('Last Prayer Letter:') /* TODO: Add value */}
        </SideContainerText>
        <Divider style={{ background: theme.palette.primary.contrastText }} />
        <SideContainerText variant="h5" style={{ margin: theme.spacing(1) }}>
          {t('MPD Info')}
        </SideContainerText>
        <SideContainerText>
          {t('Week on MPD:') /* TODO: Add Value */}
        </SideContainerText>
        <SideContainerText>
          {t('Start Date:') /* TODO: Add Value */}
        </SideContainerText>
        <SideContainerText>
          {t('End Date:') /* TODO: Add Value */}
        </SideContainerText>
        <SideContainerText>
          {t('Commitment Goal:') +
            ' ' +
            currencyFormat(
              data?.monthlyGoal ? data?.monthlyGoal : 0,
              data?.currency,
              locale,
            )}
        </SideContainerText>
        <Divider style={{ background: theme.palette.primary.contrastText }} />
        <SideContainerText variant="h5" style={{ margin: theme.spacing(1) }}>
          {t('Users')}
        </SideContainerText>
        {accountListUsersLoading ? (
          <>
            <CoachingLoadingSkeleton />
            <CoachingLoadingSkeleton />
            <CoachingLoadingSkeleton />
            <CoachingLoadingSkeleton />
          </>
        ) : (
          accountListUsersData?.accountListUsers.nodes.map(
            (accountList, _index) => {
              return (
                <Fragment key={accountList.id}>
                  <SideContainerIcon />
                  <SideContainerText>
                    {accountList.user.firstName +
                      ' ' +
                      accountList.user.lastName}
                  </SideContainerText>
                  <Divider style={{ margin: theme.spacing(1) }} />
                </Fragment>
              );
            },
          )
        )}
        <Divider style={{ background: theme.palette.primary.contrastText }} />
        <SideContainerText variant="h5" style={{ margin: theme.spacing(1) }}>
          {t('Coaches')}
        </SideContainerText>
        {coachingUsersLoading ? (
          <>
            <CoachingLoadingSkeleton />
            <CoachingLoadingSkeleton />
            <CoachingLoadingSkeleton />
            <CoachingLoadingSkeleton />
          </>
        ) : (
          coachingUsersData?.getAccountListCoachUsers?.map((user, _index) => {
            return (
              <>
                <SideContainerIcon />
                <SideContainerText>
                  {user?.firstName + ' ' + user?.lastName}
                </SideContainerText>
                <Divider style={{ margin: theme.spacing(1) }} />
              </>
            );
          })
        )}
      </CoachingSideContainer>
      <CoachingMainContainer>
        {loading || coachingLoading ? (
          <>
            <CoachingLoadingSkeleton />
            <CoachingLoadingSkeleton />
            <CoachingLoadingSkeleton />
            <CoachingLoadingSkeleton />
          </>
        ) : (
          <>
            <CoachingMainTitleContainer>
              <Box style={{ flexGrow: 1 }}>
                <Typography
                  variant="h5"
                  display="block"
                  style={{
                    margin: theme.spacing(1),
                  }}
                >
                  {data?.name}
                </Typography>
              </Box>
              <Box style={{ flexGrow: 1 }}>
                <AppealProgress
                  loading={loading}
                  isPrimary={false}
                  currency={data?.currency}
                  goal={data?.monthlyGoal ?? 0}
                  received={data?.receivedPledges}
                  pledged={data?.totalPledges}
                />
              </Box>
            </CoachingMainTitleContainer>
            <Divider />
            <CoachingItemContainer>
              {/*
                TODO: MonthlyActivitySection doesn't work if coaching is not one of the
                Accountlists. reportDonationsHistories is required for this View and it doesn't
                work with coaching.
              */}
              <MonthlyActivitySection accountListId={coachingId} />
              <Box style={{ margin: theme.spacing(3, 0) }}>
                <MonthlyCommitment
                  coachingId={coachingId}
                  currencyCode={data?.currency}
                  goal={data?.monthlyGoal ? data.monthlyGoal : 0}
                />
              </Box>
            </CoachingItemContainer>
          </>
        )}
      </CoachingMainContainer>
    </CoachingDetailContainer>
  );
};

export default CoachingDetail;
