import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'react-i18next';
import useGetAppSettings from 'src/hooks/useGetAppSettings';
import { clearDataDogUser } from 'src/hooks/useDataDog';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import { signOut } from 'next-auth/react';

const BoxWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.cruGrayLight.main,
  height: 300,
  minWidth: 700,
  margin: 'auto',
  padding: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const LogoutPage = ({}): ReactElement => {
  const { t } = useTranslation();
  const { appName } = useGetAppSettings();

  useEffect(() => {
    signOut({ callbackUrl: 'signOut' }).then(() => {
      clearDataDogUser();
    });
  }, []);

  return (
    <>
      <Head>
        <title>
          {t('Logout')} | {appName}
        </title>
      </Head>
      <BoxWrapper boxShadow={3} data-testid="EmptyReport">
        <Box mb={2}>
          <ExitToAppRoundedIcon fontSize="large" color="disabled" />
        </Box>
        <Typography variant="h5">
          {t("You're currently being logged out.")}
        </Typography>
      </BoxWrapper>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    'Set-Cookie',
    `mpdx-handoff.logged-in=; path=/; Max-Age=0; domain=${process.env.REWRITE_DOMAIN}`,
  );
  return {
    props: {},
  };
};

export default LogoutPage;