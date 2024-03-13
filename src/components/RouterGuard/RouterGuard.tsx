import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { DateTime } from 'luxon';
import { signIn, useSession } from 'next-auth/react';

interface Props {
  children?: React.ReactElement;
}

export const RouterGuard: React.FC<Props> = ({ children = null }) => {
  const { push, pathname } = useRouter();

  const session = useSession({
    required: pathname !== '/login',
    onUnauthenticated: () => {
      push('/login');
    },
  });

  useEffect(() => {
    if (session.status === 'authenticated') {
      if (DateTime.now().toISO() > session.data.expires) {
        signIn('okta');
      }
    }
  }, [session]);

  return session.status === 'authenticated' || pathname === '/login' ? (
    children
  ) : (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress size={100} data-testid="LoadingIndicator" />
    </Box>
  );
};
