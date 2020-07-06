import React, { ReactElement, useState, MouseEvent } from 'react';
import {
    Avatar,
    IconButton,
    Button,
    MenuItem,
    Box,
    Menu,
    ListSubheader,
    makeStyles,
    Toolbar,
    AppBar,
    useScrollTrigger,
    Theme,
    Grid,
} from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useQuery, gql } from '@apollo/client';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Link from 'next/link';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import { GetTopBarQuery } from '../../../../../types/GetTopBarQuery';
import GET_LOCAL_STATE_QUERY from '../../../../queries/getLocalStateQuery.graphql';
import { GetLocalStateQuery } from '../../../../../types/GetLocalStateQuery';
import { SIDE_BAR_WIDTH } from '../SideBar/SideBar';

const useStyles = makeStyles((theme: Theme) => ({
    appBar: {
        paddingTop: `env(safe-area-inset-top)`,
        paddingLeft: `env(safe-area-inset-left)`,
        paddingRight: `env(safe-area-inset-right)`,
        backgroundColor: theme.palette.primary.main,
        width: 'auto',
        left: SIDE_BAR_WIDTH,
        [theme.breakpoints.down('sm')]: {
            left: 0,
        },
    },
    toolbar: {
        backgroundColor: theme.palette.primary.main,
    },
    container: {
        minHeight: '48px',
    },
    sideBarGrid: {
        order: 1,
    },
    sideBarButton: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    accountListsGrid: {
        order: 2,
        [theme.breakpoints.down('xs')]: {
            order: 6,
            marginRight: theme.spacing(1),
        },
    },
    breadcrumbGrid: {
        order: 3,
        marginLeft: theme.spacing(1),
        height: '48px',
        overflow: 'hidden',
        flexGrow: 1,
    },
    helpGrid: {
        order: 4,
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    notificationsGrid: {
        order: 5,
    },
    avatarGrid: {
        order: 6,
    },
    avatar: {
        height: '32px',
        width: '32px',
    },
    link: {
        textTransform: 'none',
        color: 'rgba(255,255,255,0.75)',
        transition: 'color 0.2s ease-in-out',
        '&:hover': {
            color: 'rgba(255,255,255,1)',
        },
    },
    button: {
        textTransform: 'none',
    },
    breadcrumb: {
        fontWeight: 'bold',
        transform: 'translate(0, 48px)',
        transition: 'opacity .15s ease, transform .15s ease',
        lineHeight: '48px',
        opacity: 0,
    },
    breadcrumbTrigger: {
        transform: 'translate(0, 0)',
        opacity: 1,
    },
    menuList: {
        paddingTop: 0,
    },
}));

export const GET_TOP_BAR_QUERY = gql`
    query GetTopBarQuery {
        accountLists {
            nodes {
                id
                name
            }
        }
        user {
            firstName
        }
    }
`;

interface Props {
    handleDrawerToggle: () => void;
}

const TopBar = ({ handleDrawerToggle }: Props): ReactElement => {
    const classes = useStyles();
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });
    const { data } = useQuery<GetTopBarQuery>(GET_TOP_BAR_QUERY);
    const { data: state } = useQuery<GetLocalStateQuery>(GET_LOCAL_STATE_QUERY);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): boolean => {
        setAnchorEl(null);
        return true;
    };

    const currentAccountList =
        state?.currentAccountListId && data?.accountLists?.nodes?.find((node) => node.id == state.currentAccountListId);

    return (
        <>
            <AppBar className={classes.appBar} elevation={trigger ? 3 : 0}>
                <Toolbar className={classes.toolbar}>
                    <Grid container className={classes.container} alignItems="center">
                        <Grid item className={classes.sideBarGrid}>
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                className={classes.sideBarButton}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Grid>
                        <Grid item className={classes.accountListsGrid}>
                            {data?.accountLists?.nodes && (
                                <>
                                    {data.accountLists.nodes.length == 1 && (
                                        <Box display={{ xs: 'none', sm: 'block' }}>{currentAccountList?.name}</Box>
                                    )}
                                    {data.accountLists.nodes.length > 1 && (
                                        <>
                                            <Box display={{ xs: 'none', sm: 'block' }}>
                                                <Button
                                                    aria-controls="account-list-selector"
                                                    aria-haspopup="true"
                                                    onClick={handleClick}
                                                    className={[classes.button, classes.link].join(' ')}
                                                    endIcon={<ArrowDropDownIcon />}
                                                    size="small"
                                                >
                                                    {currentAccountList?.name}
                                                </Button>
                                            </Box>
                                            <Box display={{ xs: 'block', sm: 'none' }}>
                                                <IconButton
                                                    aria-controls="account-list-selector"
                                                    aria-haspopup="true"
                                                    onClick={handleClick}
                                                    className={classes.link}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </Box>
                                            <Menu
                                                id="simple-menu"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={Boolean(anchorEl)}
                                                onClose={handleClose}
                                                classes={{ list: classes.menuList }}
                                            >
                                                <Link href="/accountLists" scroll={false}>
                                                    <MenuItem onClick={handleClose}>See All Account Lists</MenuItem>
                                                </Link>
                                                <ListSubheader>Account Lists</ListSubheader>
                                                {data.accountLists.nodes.map(({ id, name }) => (
                                                    <Link
                                                        key={id}
                                                        href="/accountLists/[accountListId]"
                                                        as={`/accountLists/${id}`}
                                                        scroll={false}
                                                    >
                                                        <MenuItem
                                                            selected={
                                                                state?.currentAccountListId &&
                                                                id == state?.currentAccountListId
                                                            }
                                                            onClick={handleClose}
                                                        >
                                                            {name}
                                                        </MenuItem>
                                                    </Link>
                                                ))}
                                            </Menu>
                                        </>
                                    )}
                                </>
                            )}
                        </Grid>
                        <Grid item className={classes.breadcrumbGrid}>
                            {state?.breadcrumb && (
                                <Box className={clsx(classes.breadcrumb, trigger && classes.breadcrumbTrigger)}>
                                    {state?.breadcrumb}
                                </Box>
                            )}
                        </Grid>
                        <Grid item className={classes.helpGrid}>
                            <Button
                                href="https://help.mpdx.org"
                                className={[classes.button, classes.link].join(' ')}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Go to help
                            </Button>
                        </Grid>
                        <Grid item className={classes.notificationsGrid}>
                            <IconButton className={classes.link}>
                                <NotificationsIcon />
                            </IconButton>
                        </Grid>
                        <Grid item className={classes.avatarGrid}>
                            <Avatar className={classes.avatar}>{data?.user?.firstName[0]}</Avatar>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <AppBar position="static" className={classes.appBar} elevation={0}>
                <Toolbar className={classes.toolbar}>
                    <Grid className={classes.container} />
                </Toolbar>
            </AppBar>
        </>
    );
};

export default TopBar;
