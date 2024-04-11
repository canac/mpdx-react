import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { Box, Button, Drawer, List, Link as MuiLink } from '@mui/material';
import { styled } from '@mui/material/styles';
import { signOut } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { NextLinkComposed } from 'src/components/common/Links/NextLinkComposed';
import { clearDataDogUser } from 'src/hooks/useDataDog';
import { useAccountListId } from '../../../../../../hooks/useAccountListId';
import theme from '../../../../../../theme';
import HandoffLink from '../../../../../HandoffLink';
import { useGetTopBarQuery } from '../../../TopBar/GetTopBar.generated';
import { LeafListItem, Title } from '../../NavItem/NavItem';

type ProfileMenuContent = {
  text: string;
  path: string;
  onClick?: () => void;
};

const MobileDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: 290,
    backgroundColor: theme.palette.cruGrayDark.main,
    zIndex: theme.zIndex.drawer + 201,
  },
}));

const LeafListItemHover = styled(LeafListItem)(() => ({
  '&:hover': {
    backgroundColor: `${theme.palette.cruGrayMedium.main} !important`,
  },
}));

const style = {
  color: theme.palette.text.secondary,
  padding: '11px 8px 11px 40px',
  justifyContent: 'flex-start',
  textTransform: 'none' as any,
  letterSpacing: 0,
  width: '100%',
};
const accountListStyle = {
  paddingLeft: theme.spacing(2),
  paddingTop: 11,
  paddingBottom: 11,
};

const addProfileContent: ProfileMenuContent[] = [
  {
    text: 'Preferences',
    path: '/settings/preferences',
  },
  {
    text: 'Notifications',
    path: '/settings/notifications',
  },
  {
    text: 'Connect Services',
    path: '/settings/integrations',
  },
  {
    text: 'Manage Accounts',
    path: '/settings/manageAccounts',
  },
  {
    text: 'Manage Coaches',
    path: '/settings/manageCoaches',
  },
];

export const ProfileMenuPanel: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useGetTopBarQuery();
  const accountListId = useAccountListId();
  const { push, pathname } = useRouter();
  const client = useApolloClient();
  const [accountsDrawerOpen, setAccountsDrawerOpen] = useState<boolean>(false);

  const toggleAccountsDrawer = (): void => {
    setAccountsDrawerOpen((prevState) => !prevState);
  };

  const changeAccountListId = (id: string): void => {
    setAccountsDrawerOpen(false);
    push({
      pathname: accountListId ? pathname : '/accountLists/[accountListId]/',
      query: { accountListId: id },
    });
  };

  return (
    <List disablePadding data-testid="ProfileMenuPanelForNavBar">
      {data && (
        <>
          <LeafListItem
            data-testid="accountListSelectorButton"
            disableGutters
            onClick={toggleAccountsDrawer}
          >
            <Button style={style}>
              <Title
                style={{
                  whiteSpace: 'nowrap',
                  width: '80%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {
                  data?.accountLists.nodes.find(
                    (accountList) => accountList.id === accountListId,
                  )?.name
                }
              </Title>
              <ChevronRight />
            </Button>
          </LeafListItem>
          <MobileDrawer
            anchor="left"
            open={accountsDrawerOpen}
            onClose={toggleAccountsDrawer}
          >
            <LeafListItem
              data-testid="closeAccountListDrawerButton"
              disableGutters
              onClick={toggleAccountsDrawer}
            >
              <Button style={accountListStyle}>
                <ArrowBackIcon
                  style={{ color: 'white', marginRight: theme.spacing(2) }}
                />
                <Title>{t('Account List Selector')}</Title>
              </Button>
            </LeafListItem>
            {data?.accountLists.nodes.map((accountList) => (
              <LeafListItemHover
                key={accountList.id}
                data-testid={`accountListButton-${accountList.id}`}
                disableGutters
                style={{
                  backgroundColor:
                    accountListId === accountList.id
                      ? theme.palette.cruGrayMedium.main
                      : theme.palette.cruGrayDark.main,
                }}
                onClick={() => changeAccountListId(accountList.id)}
              >
                <Button style={accountListStyle}>
                  <Title>{accountList.name}</Title>
                </Button>
              </LeafListItemHover>
            ))}
          </MobileDrawer>
        </>
      )}
      {addProfileContent.map(({ text, path, onClick }, index) => (
        <LeafListItem key={index} disableGutters onClick={onClick}>
          <Button
            style={style}
            component={NextLinkComposed}
            to={`/accountLists/${accountListId}/${path}`}
          >
            <Title>{t(text)}</Title>
          </Button>
        </LeafListItem>
      ))}
      {(data?.user?.admin ||
        !!data?.user?.administrativeOrganizations?.nodes?.length) && (
        <LeafListItem disableGutters>
          <Button
            style={style}
            component={NextLinkComposed}
            to={`/accountLists/${accountListId}/settings/organizations`}
          >
            <Title>{t('Manage Organizations')}</Title>
          </Button>
        </LeafListItem>
      )}
      {(data?.user?.admin || data?.user?.developer) && (
        <LeafListItem disableGutters>
          <Button
            style={style}
            component={NextLinkComposed}
            to={`/accountLists/${accountListId}/settings/admin`}
          >
            <Title>{t('Admin Console')}</Title>
          </Button>
        </LeafListItem>
      )}
      {data?.user?.developer && (
        <LeafListItem disableGutters>
          <HandoffLink path="/auth/user/admin">
            <Button style={style}>
              <Title>{t('Backend Admin')}</Title>
            </Button>
          </HandoffLink>
        </LeafListItem>
      )}
      {data?.user?.developer && (
        <LeafListItem disableGutters>
          <HandoffLink path="/auth/user/sidekiq">
            <Button style={style}>
              <Title>{t('Sidekiq')}</Title>
            </Button>
          </HandoffLink>
        </LeafListItem>
      )}
      <LeafListItem disableGutters>
        <Box display="flex" flexDirection="column" px={4} py={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() =>
              signOut({ callbackUrl: 'signOut' }).then(() => {
                clearDataDogUser();
                client.clearStore();
              })
            }
          >
            {t('Sign Out')}
          </Button>
          <Box display="flex" justifyContent="center" py={1}>
            <MuiLink
              href="https://get.mpdx.org/privacy-policy/"
              target="_blank"
              color="secondary"
              variant="caption"
            >
              {t('Privacy Policy')}
            </MuiLink>
            &nbsp; • &nbsp;
            <MuiLink
              href="https://get.mpdx.org/terms-of-use/"
              target="_blank"
              color="secondary"
              variant="caption"
            >
              {t('Terms of Use')}
            </MuiLink>
          </Box>
        </Box>
      </LeafListItem>
    </List>
  );
};
