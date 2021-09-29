import React, { ReactElement, useMemo, useState } from 'react';
import {
  makeStyles,
  Grid,
  MenuItem,
  ListItemText,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  Paper,
  Box,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';
import Icon from '@mdi/react';
import { ReportNavItems } from '../../../../../Reports/NavReportsList/ReportNavItems';
import { ToolsList } from '../../../../../Tool/Home/ToolList';
import { useCurrentToolId } from '../../../../../../hooks/useCurrentToolId';
import theme from '../../../../../../theme';
import { useGetToolNotificationsQuery } from './GetToolNotifcations.generated';

const useStyles = makeStyles(() => ({
  navListItem: {
    order: 2,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  subMenu: {
    backgroundImage: `linear-gradient(0deg, ${theme.palette.cruGrayDark.main}, ${theme.palette.cruGrayDark.main})`,
  },
  menuItem: {
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.cruGrayMedium.main,
      backgroundBlendMode: 'multiply',
    },
  },
  menuItemSelected: {
    backgroundBlendMode: 'multiply',
    backgroundColor: theme.palette.cruGrayMedium.main,
  },
  needsAttention: {
    backgroundImage: `linear-gradient(0deg, ${theme.palette.mpdxYellow.main}, ${theme.palette.mpdxYellow.main})`,
  },
  menuIcon: {
    marginRight: theme.spacing(1),
  },
  notificationBox: {
    backgroundColor: theme.palette.progressBarYellow.main,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: '25%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing(2),
  },
  darkText: {
    color: theme.palette.cruGrayDark.main,
  },
  whiteText: {
    color: 'white',
  },
}));

enum ToolName {
  fixCommitmentInfo = 'fixCommitmentInfo',
  fixMailingAddresses = 'fixMailingAddresses',
  fixSendNewsletter = 'fixSendNewsletter',
  fixEmailAddresses = 'fixEmailAddresses',
  fixPhoneNumbers = 'fixPhoneNumbers',
  mergeContacts = 'mergeContacts',
  mergePeople = 'mergePeople',
}

interface NavBarProps {
  accountListId: string;
}

const NavMenu = ({ accountListId }: NavBarProps): ReactElement => {
  const { t } = useTranslation();
  const classes = useStyles();
  const currentToolId = useCurrentToolId();
  const { data, loading } = useGetToolNotificationsQuery({
    variables: { accountListId },
  });

  const toolData: { [key: string]: { totalCount: number } } = {
    [ToolName.fixCommitmentInfo]: data?.[ToolName.fixCommitmentInfo] ?? {
      totalCount: 0,
    },
    [ToolName.fixMailingAddresses]: data?.[ToolName.fixMailingAddresses] ?? {
      totalCount: 0,
    },
    [ToolName.fixSendNewsletter]: data?.[ToolName.fixSendNewsletter] ?? {
      totalCount: 0,
    },
    [ToolName.fixEmailAddresses]: data?.[ToolName.fixEmailAddresses] ?? {
      totalCount: 0,
    },
    [ToolName.fixPhoneNumbers]: data?.[ToolName.fixPhoneNumbers] ?? {
      totalCount: 0,
    },
    [ToolName.mergeContacts]: data?.[ToolName.mergeContacts] ?? {
      totalCount: 0,
    },
    [ToolName.mergePeople]: data?.[ToolName.mergePeople] ?? { totalCount: 0 },
  };

  const sum = useMemo<number>(() => {
    return data
      ? Object.values(toolData).reduce(
          (sum, toolContacts) => sum + toolContacts.totalCount,
          0,
        )
      : 0;
  }, [loading]);

  const [reportsMenuOpen, setReportsMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const anchorRef = React.useRef<HTMLLIElement>(null);
  const anchorRefTools = React.useRef<HTMLLIElement>(null);

  const handleReportsMenuToggle = () => {
    setReportsMenuOpen((prevOpen) => !prevOpen);
    handleToolsMenuClose();
  };

  const handleReportsMenuClose = () => {
    setReportsMenuOpen(false);
  };

  const handleToolsMenuToggle = () => {
    setToolsMenuOpen((prevOpen) => !prevOpen);
    handleReportsMenuClose();
  };

  const handleToolsMenuClose = () => {
    setToolsMenuOpen(false);
  };

  return (
    <>
      {accountListId ? (
        <Grid container item alignItems="center" xs="auto">
          <Grid item className={classes.navListItem}>
            <NextLink
              href="/accountLists/[accountListId]"
              as={`/accountLists/${accountListId}`}
              scroll={false}
            >
              <MenuItem>
                <ListItemText primary={t('Dashboard')} />
              </MenuItem>
            </NextLink>
          </Grid>
          <Grid item className={classes.navListItem}>
            <NextLink
              href="/accountLists/[accountListId]/contacts"
              as={`/accountLists/${accountListId}/contacts`}
              scroll={false}
            >
              <MenuItem>
                <ListItemText primary={t('Contacts')} />
              </MenuItem>
            </NextLink>
          </Grid>
          <Grid item className={classes.navListItem}>
            <NextLink
              href="/accountLists/[accountListId]/tasks"
              as={`/accountLists/${accountListId}/tasks`}
              scroll={false}
            >
              <MenuItem>
                <ListItemText primary={t('Tasks')} />
              </MenuItem>
            </NextLink>
          </Grid>
          <Grid item className={classes.navListItem}>
            <MenuItem
              ref={anchorRef}
              aria-controls={reportsMenuOpen ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleReportsMenuToggle}
              data-testid="ReportMenuToggle"
            >
              <ListItemText primary={t('Reports')} />
              <ArrowDropDownIcon
                className={clsx(classes.expand, {
                  [classes.expandOpen]: reportsMenuOpen,
                })}
              />
            </MenuItem>
            <Popper
              open={reportsMenuOpen}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleReportsMenuClose}>
                      <MenuList
                        autoFocusItem={reportsMenuOpen}
                        id="menu-list-grow"
                      >
                        {ReportNavItems.map((reportItem) => (
                          <NextLink
                            key={reportItem.id}
                            href={`/accountLists/[accountListId]/reports/${reportItem.id}`}
                            as={`/accountLists/${accountListId}/reports/${reportItem.id}`}
                            scroll={false}
                          >
                            <MenuItem onClick={handleReportsMenuClose}>
                              <ListItemText
                                primary={t(
                                  `${reportItem.title}${
                                    reportItem.subTitle
                                      ? ` (${reportItem.subTitle})`
                                      : ''
                                  }`,
                                )}
                              />
                            </MenuItem>
                          </NextLink>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Grid>
          <Grid item className={classes.navListItem}>
            <MenuItem
              ref={anchorRefTools}
              aria-controls={toolsMenuOpen ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToolsMenuToggle}
              data-testid="ToolsMenuToggle"
            >
              <ListItemText primary={t('Tools')} />
              {sum > 0 && (
                <Box
                  className={classes.notificationBox}
                  data-testid="notificationTotal"
                >
                  <Typography data-testid="notificationTotalText">
                    {sum}
                  </Typography>
                </Box>
              )}
              <ArrowDropDownIcon
                className={clsx(classes.expand, {
                  [classes.expandOpen]: toolsMenuOpen,
                })}
              />
            </MenuItem>
            <Popper
              open={toolsMenuOpen}
              anchorEl={anchorRefTools.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <Paper className={classes.subMenu}>
                    <ClickAwayListener onClickAway={handleToolsMenuClose}>
                      <MenuList
                        autoFocusItem={toolsMenuOpen}
                        id="menu-list-grow"
                      >
                        {ToolsList.map((toolsGroup) => (
                          <Box key={toolsGroup.groupName}>
                            {toolsGroup.items.map((tool) => {
                              const needsAttention = toolData
                                ? toolData[tool.id]?.totalCount > 0
                                : false;
                              return (
                                <NextLink
                                  key={tool.id}
                                  href={`/accountLists/[accountListId]/tools/${tool.id}`}
                                  as={`/accountLists/${accountListId}/tools/${tool.id}`}
                                  scroll={false}
                                >
                                  <MenuItem
                                    onClick={handleToolsMenuClose}
                                    data-testid={`${tool.id}-${
                                      currentToolId === tool.id
                                    }`}
                                    className={clsx(
                                      classes.menuItem,
                                      needsAttention && classes.needsAttention,
                                      currentToolId === tool.id &&
                                        classes.menuItemSelected,
                                    )}
                                  >
                                    <Icon
                                      path={tool.icon}
                                      size={1}
                                      className={clsx(
                                        classes.menuIcon,
                                        needsAttention
                                          ? classes.darkText
                                          : classes.whiteText,
                                      )}
                                    />
                                    <ListItemText
                                      className={clsx(
                                        needsAttention
                                          ? classes.darkText
                                          : classes.whiteText,
                                      )}
                                      primary={t('{{toolname}}', {
                                        toolname: tool.tool,
                                      })}
                                    />
                                    {!loading && needsAttention && (
                                      <Box
                                        className={classes.notificationBox}
                                        data-testid={`${tool.id}-notifications`}
                                      >
                                        <Typography>
                                          {toolData[tool.id].totalCount}
                                        </Typography>
                                      </Box>
                                    )}
                                  </MenuItem>
                                </NextLink>
                              );
                            })}
                          </Box>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Grid>
          <Grid item className={classes.navListItem}>
            <NextLink
              href="/accountLists/[accountListId]/coaching"
              as={`/accountLists/${accountListId}/coaching`}
            >
              <MenuItem component="a">
                <ListItemText primary={t('Coaches')} />
              </MenuItem>
            </NextLink>
          </Grid>
        </Grid>
      ) : null}
    </>
  );
};

export default NavMenu;
