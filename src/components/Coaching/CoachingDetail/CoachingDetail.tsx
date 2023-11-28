import React, { useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
// TODO: EcoOutlined is not defined on @mui/icons-material, find replacement.
import { styled } from '@mui/material/styles';
import { AppealProgress } from '../AppealProgress/AppealProgress';
import { MonthlyCommitment } from './MonthlyCommitment/MonthlyCommitment';
import {
  useGetCoachingDonationGraphQuery,
  useLoadAccountListCoachingDetailQuery,
  useLoadCoachingDetailQuery,
} from './LoadCoachingDetail.generated';
import { useGetTaskAnalyticsQuery } from 'src/components/Dashboard/ThisWeek/NewsletterMenu/NewsletterMenu.generated';
import DonationHistories from 'src/components/Dashboard/DonationHistories';
import { useGetDonationGraphQuery } from 'src/components/Reports/DonationsReport/GetDonationGraph.generated';
import { AppointmentResults } from './AppointmentResults/AppointmentResults';
import { MultilineSkeleton } from '../../Shared/MultilineSkeleton';
import { CoachingSidebar } from './CoachingSidebar';
import { useTranslation } from 'react-i18next';

export enum CoachingPeriodEnum {
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}

export enum AccountListTypeEnum {
  Own = 'Own',
  Coaching = 'Coaching',
}

interface CoachingDetailProps {
  accountListId: string;
  // Whether the account list belongs to the user or someone that the user coaches
  accountListType: AccountListTypeEnum;
}

const CoachingDetailContainer = styled(Box)({
  minHeight: '100%',
  display: 'flex',
});

const CoachingMainContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  width: '100vw',
  [theme.breakpoints.up('md')]: {
    width: 'calc(100vw - 20rem)',
  },
}));

const CoachingItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  margin: theme.spacing(2),
}));

const CoachingMainTitleContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  margin: theme.spacing(1),
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export const CoachingDetail: React.FC<CoachingDetailProps> = ({
  accountListId,
  accountListType,
}) => {
  const { t } = useTranslation();

  const { data: ownData, loading: ownLoading } =
    useLoadAccountListCoachingDetailQuery({
      variables: { accountListId },
      skip: accountListType !== AccountListTypeEnum.Own,
    });

  const { data: coachingData, loading: coachingLoading } =
    useLoadCoachingDetailQuery({
      variables: { coachingAccountListId: accountListId },
      skip: accountListType !== AccountListTypeEnum.Coaching,
    });

  const loading =
    accountListType === AccountListTypeEnum.Own ? ownLoading : coachingLoading;
  const accountListData =
    accountListType === AccountListTypeEnum.Own
      ? ownData?.accountList
      : coachingData?.coachingAccountList;

  const { data: ownDonationGraphData } = useGetDonationGraphQuery({
    variables: {
      accountListId,
    },
    skip: accountListType !== AccountListTypeEnum.Own,
  });

  const { data: coachingDonationGraphData } = useGetCoachingDonationGraphQuery({
    variables: {
      coachingAccountListId: accountListId,
    },
    skip: accountListType !== AccountListTypeEnum.Coaching,
  });

  const donationGraphData =
    accountListType === AccountListTypeEnum.Own
      ? ownDonationGraphData
      : coachingDonationGraphData;

  const { data: taskAnalyticsData } = useGetTaskAnalyticsQuery({
    variables: {
      accountListId,
    },
  });

  const [period, setPeriod] = useState(CoachingPeriodEnum.Weekly);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleCloseDrawer = () => setDrawerVisible(false);

  const sidebarDrawer = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down('md'),
  );
  useEffect(() => {
    if (sidebarDrawer) {
      handleCloseDrawer();
    }
  }, [sidebarDrawer]);

  const sidebar = (
    <CoachingSidebar
      period={period}
      setPeriod={setPeriod}
      showClose={sidebarDrawer}
      handleClose={handleCloseDrawer}
      loading={loading}
      accountListData={accountListData}
      taskAnalyticsData={taskAnalyticsData}
    />
  );

  return (
    <CoachingDetailContainer>
      <Hidden mdUp>
        <Drawer open={drawerVisible} onClose={handleCloseDrawer}>
          {sidebar}
        </Drawer>
      </Hidden>
      <Hidden mdDown>{sidebar}</Hidden>
      <CoachingMainContainer>
        {loading ? (
          <MultilineSkeleton lines={4} />
        ) : (
          <>
            <CoachingMainTitleContainer>
              <Box style={{ flexGrow: 1 }}>
                <Typography variant="h5" m={1}>
                  <Hidden mdUp>
                    <IconButton
                      onClick={() => setDrawerVisible(!drawerVisible)}
                      aria-label={t('Toggle account details')}
                    >
                      <MenuOpenIcon />
                    </IconButton>
                  </Hidden>
                  {accountListData?.name}
                </Typography>
              </Box>
              <Box style={{ flexGrow: 1 }}>
                <AppealProgress
                  loading={ownLoading}
                  isPrimary={false}
                  currency={accountListData?.currency}
                  goal={accountListData?.monthlyGoal ?? undefined}
                  received={accountListData?.receivedPledges}
                  pledged={accountListData?.totalPledges}
                />
              </Box>
            </CoachingMainTitleContainer>
            <Divider />
            <CoachingItemContainer>
              <DonationHistories
                goal={accountListData?.monthlyGoal ?? undefined}
                pledged={accountListData?.totalPledges}
                reportsDonationHistories={
                  donationGraphData?.reportsDonationHistories
                }
                currencyCode={accountListData?.currency}
              />
              <MonthlyCommitment
                coachingId={accountListId}
                currencyCode={accountListData?.currency}
                goal={accountListData?.monthlyGoal ?? 0}
              />
              <AppointmentResults
                accountListId={accountListId}
                currency={accountListData?.currency}
                period={period}
              />
            </CoachingItemContainer>
          </>
        )}
      </CoachingMainContainer>
    </CoachingDetailContainer>
  );
};

export default CoachingDetail;
