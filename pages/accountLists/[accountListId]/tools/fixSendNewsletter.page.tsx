import React from 'react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import FixSendNewsletter from '../../../../src/components/Tool/FixSendNewsletter/FixSendNewsletter';

const FixSendNewsletterPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>MPDX | {t('Fix Send Newsletter')}</title>
      </Head>
      <FixSendNewsletter />
    </>
  );
};

export default FixSendNewsletterPage;
