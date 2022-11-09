import React, { useContext, useEffect, useState } from 'react'
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography, Collapse, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Popover } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faLink, faSignOutAlt, faUsers, faFileAlt, faBoxes, faChevronDown, faChevronUp, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { AppContext } from '../application/provider';
import LoginService from '../application/services/login.service';
import NotificationsService from '../application/services/user.notifications.service';
import Controls from "../components/controls";
import _ from "lodash";
import { useHistory } from "react-router-dom";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => createStyles({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(4),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(8),
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        textAlign: 'center'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    hide: {
        display: 'none',
    },
    itemMenu: {
        marginLeft: '5px',
        fontSize: '18px'
    }
}));
export default function UserLayout({ children }) {
    const classes = useStyles();
    const theme = useTheme();
    let history = useHistory();
    const [open, setOpen] = useState(false);
    const [state, setState] = useContext(AppContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openReport, setOpenReport] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const check = async () => {
        const email = JSON.parse(localStorage.getItem('email'));
        let res = await LoginService.checkToken(email);
        if (res.success) {
            setState({ ...state, user: res.user, isLogin: true, update: false })
        }
    }

    // useEffect(() => {
    //     check();
    // }, []);

    // useEffect(() => {
    //     check();
    // }, [state.update]);

    const handleClose = async () => {
        let res = await NotificationsService.setViewNotifications();
        if (res.success) {
            setState({ ...state, update: true })
            setAnchorEl(null);
        }
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        setState({ ...state, user: {}, isLogin: false })
        LoginService.logout();
        history.push("/entrar");
    };

    const handleReport = () => {
        setOpenReport(!openReport);
    };

    const openNotification = Boolean(anchorEl);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={clsx(classes.appBar, { [classes.appBarShift]: open, })}>
                <Toolbar variant="dense">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Administrador MiWhats
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                open={open}
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <Typography style={{ flexGrow: 1, color: theme.primary }}>MiWhats</Typography>

                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button component={Link} className={classes.itemMenu} to="/admin/dashboard">
                        <ListItemIcon><FontAwesomeIcon icon={faTachometerAlt} /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button component={Link} className={classes.itemMenu} to="/admin/planes">
                        <ListItemIcon><FontAwesomeIcon icon={faBoxes} /></ListItemIcon>
                        <ListItemText primary="Planes" />
                    </ListItem>
                    <ListItem button component={Link} className={classes.itemMenu} to="/admin/usuarios">
                        <ListItemIcon><FontAwesomeIcon icon={faUsers} /></ListItemIcon>
                        <ListItemText primary="Usuarios" />
                    </ListItem>
                    <ListItem button component={Link} className={classes.itemMenu} to="/admin/miwhats">
                        <ListItemIcon><FontAwesomeIcon icon={faLink} /></ListItemIcon>
                        <ListItemText primary="MiWhats" />
                    </ListItem>
                    {/* <ListItem button component={Link} className={classes.itemMenu} onClick={handleReport}>
                        <ListItemIcon><FontAwesomeIcon icon={faFileAlt} /></ListItemIcon>
                        <ListItemText primary="Reportes" />
                        {openReport ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
                    </ListItem>
                    <Collapse in={openReport} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button className={classes.itemMenu} to="/admin/reportes/pagos">
                                <ListItemIcon><FontAwesomeIcon icon={faFileInvoiceDollar} /></ListItemIcon>
                                <ListItemText primary="Pagos" />
                            </ListItem>
                        </List>
                    </Collapse> */}
                </List>
                <Divider />
                <List>
                    <ListItem button className={classes.itemMenu} onClick={handleLogout}>
                        <ListItemIcon><FontAwesomeIcon icon={faSignOutAlt} /></ListItemIcon>
                        <ListItemText primary="Salir" />
                    </ListItem>
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {children}
            </main>
        </div>
    )
}