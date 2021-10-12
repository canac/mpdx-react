import React, { useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  Link,
  List,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { signout } from 'next-auth/client';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import router from 'next/router';
import { LeafButton, LeafListItem, Title } from '../../NavItem/NavItem';
import HandoffLink from '../../../../../HandoffLink';
import { useGetTopBarQuery } from '../../../TopBar/GetTopBar.generated';
import theme from 'src/theme';
import { useAccountListId } from 'src/hooks/useAccountListId';

type ProfileMenuContent = {
  text: string;
  path: string;
  onClick?: () => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  mobileDrawer: {
    width: 290,
    backgroundColor: theme.palette.cruGrayDark.main,
    zIndex: theme.zIndex.drawer + 200,
  },
}));

export const ProfileMenuPanel: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useGetTopBarQuery();
  const accountListId = useAccountListId();
  const classes = useStyles();
  const [accountsDrawerOpen, setAccountsDrawerOpen] = useState<boolean>(false);

  const toggleAccountsDrawer = (): void => {
    setAccountsDrawerOpen((prevState) => !prevState);
  };

  const changeAccountListId = (id: string): void => {
    setAccountsDrawerOpen(false);
    router.push({
      pathname: accountListId
        ? router.pathname
        : '/accountLists/[accountListId]/',
      query: { accountListId: id },
    });
  };

  const addProfileContent: ProfileMenuContent[] = [
    {
      text: 'Preferences',
      path: '/preferences/personal',
    },
    {
      text: 'Notifications',
      path: '/preferences/notifications',
    },
    {
      text: 'Connect Services',
      path: '/preferences/integrations',
    },
    {
      text: 'Manage Accounts',
      path: '/preferences/accounts',
    },
    {
      text: 'Manage Coaches',
      path: '/preferences/coaches',
    },
  ];

  const style = { paddingLeft: 40, paddingTop: 11, paddingBottom: 11 };
  const accountListStyle = {
    paddingLeft: theme.spacing(2),
    paddingTop: 11,
    paddingBottom: 11,
  };

  return (
    <List disablePadding data-testid="ProfileMenuPanelForNavBar">
      {data && (
        <>
          <LeafListItem
            data-testid="accountListSelectorButton"
            button
            disableGutters
            onClick={toggleAccountsDrawer}
          >
            <LeafButton style={style}>
              <Title>{t('Account List Selector')}</Title>
            </LeafButton>
          </LeafListItem>
          <Drawer
            anchor="left"
            open={accountsDrawerOpen}
            onClose={toggleAccountsDrawer}
            classes={{ paper: classes.mobileDrawer }}
          >
            <LeafListItem
              data-testid="closeAccountListDrawerButton"
              button
              disableGutters
              onClick={toggleAccountsDrawer}
            >
              <LeafButton style={accountListStyle}>
                <ArrowBackIcon
                  style={{ color: 'white', marginRight: theme.spacing(2) }}
                />
                <Title>{t('Account List Selector')}</Title>
              </LeafButton>
            </LeafListItem>
            {data?.accountLists.nodes.map((accountList) => (
              <LeafListItem
                key={accountList.id}
                button
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
                <LeafButton style={accountListStyle}>
                  <Title>{accountList.name}</Title>
                </LeafButton>
              </LeafListItem>
            ))}
          </Drawer>
        </>
      )}
      {addProfileContent.map(({ text, path, onClick }, index) => (
        <LeafListItem key={index} button disableGutters onClick={onClick}>
          <HandoffLink path={path}>
            <LeafButton style={style}>
              <Title>{t(text)}</Title>
            </LeafButton>
          </HandoffLink>
        </LeafListItem>
      ))}
      {(data?.user?.admin ||
        !!data?.user?.administrativeOrganizations?.nodes?.length) && (
        <LeafListItem button disableGutters>
          <HandoffLink path="/preferences/organizations">
            <LeafButton style={style}>
              <Title>{t('Manage Organizations')}</Title>
            </LeafButton>
          </HandoffLink>
        </LeafListItem>
      )}
      {(data?.user?.admin || data?.user?.developer) && (
        <LeafListItem button disableGutters>
          <HandoffLink path="/preferences/admin">
            <LeafButton style={style}>
              <Title>{t('Admin Console')}</Title>
            </LeafButton>
          </HandoffLink>
        </LeafListItem>
      )}
      {data?.user?.developer && (
        <LeafListItem button disableGutters>
          <HandoffLink path="/auth/user/admin">
            <LeafButton style={style}>
              <Title>{t('Backend Admin')}</Title>
            </LeafButton>
          </HandoffLink>
        </LeafListItem>
      )}
      {data?.user?.developer && (
        <LeafListItem button disableGutters>
          <HandoffLink path="/auth/user/sidekiq">
            <LeafButton style={style}>
              <Title>{t('Sidekiq')}</Title>
            </LeafButton>
          </HandoffLink>
        </LeafListItem>
      )}
      <LeafListItem button disableGutters>
        <Box display="flex" flexDirection="column" px={4} py={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => signout()}
          >
            {t('Sign Out')}
          </Button>
          <Box display="flex" justifyContent="center" py={1}>
            <Link
              href="https://get.mpdx.org/privacy-policy/"
              target="_blank"
              color="secondary"
              variant="caption"
            >
              {t('Privacy Policy')}
            </Link>
            &nbsp; • &nbsp;
            <Link
              href="https://get.mpdx.org/terms-of-use/"
              target="_blank"
              color="secondary"
              variant="caption"
            >
              {t('Terms of Use')}
            </Link>
          </Box>
        </Box>
      </LeafListItem>
    </List>
  );
};
