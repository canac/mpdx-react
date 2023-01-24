import React, { ReactElement } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import useGetAppSettings from 'src/hooks/useGetAppSettings';
import Loading from '../../../../src/components/Loading';
import { useAccountListId } from '../../../../src/hooks/useAccountListId';
import { CoachingDetail } from 'src/components/Coaching/CoachingDetail/CoachingDetail';

const CoachingReportPage = (): ReactElement => {
  const { t } = useTranslation();
  const accountListId = useAccountListId();
  const { appName } = useGetAppSettings();

  return (
    <>
      <Head>
        <title>
          {appName} | {t('Reports')} | {t('Coaching')}
        </title>
      </Head>
      {accountListId ? (
        <CoachingDetail coachingId={accountListId} isAccountListId={true} />
      ) : (
        <Loading loading />
      )}
    </>
  );
};

export default CoachingReportPage;
