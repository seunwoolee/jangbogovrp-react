/* eslint-disable react/no-multi-comp */
import React, {useEffect, useState} from 'react';
import {useLocation, matchPath} from 'react-router';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/styles';
import {
  Drawer,
  Divider,
  Avatar,
  List,
  ListSubheader,
  Typography,
  Hidden,
  Badge,
  Link,
  colors
} from '@material-ui/core';
import NavItem from 'src/components/NavItem';
import axios from "../../utils/my_axios";
// import navConfig from './navConfig';
import {MY_navConfig} from './navConfig';
import IconButton from "@material-ui/core/IconButton";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ChangePasswordDialog from "../../components/MY_changePassword";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 48,
    height: 'calc(100% - 48px)'
  },
  navigation: {
    overflow: 'auto',
    padding: theme.spacing(0, 2, 2, 2),
    flexGrow: 1
  },
  profile: {
    cursor: 'pointer',
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  badge: {
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
  },
  badgeDot: {
    height: 9,
    minWidth: 9
  },
  onlineBadge: {
    backgroundColor: colors.green[600]
  },
  awayBadge: {
    backgroundColor: colors.orange[600]
  },
  busyBadge: {
    backgroundColor: colors.red[600]
  },
  offlineBadge: {
    backgroundColor: colors.grey[300]
  },
  avatar: {
    cursor: 'pointer',
    width: 40,
    height: 40
  },
  details: {
    marginLeft: theme.spacing(2)
  },
  moreButton: {
    marginLeft: 'auto',
    color: colors.blueGrey[200]
  }
}));

function renderNavItems({
  // eslint-disable-next-line react/prop-types
  items, subheader, key, ...rest
}) {
  return (
    <List key={key}>
      {subheader && <ListSubheader disableSticky>{subheader}</ListSubheader>}
      {/* eslint-disable-next-line react/prop-types */}
      {items.reduce(
        // eslint-disable-next-line no-use-before-define
        (acc, item) => reduceChildRoutes({acc, item, ...rest}),
        []
      )}
    </List>
  );
}

function reduceChildRoutes({
  acc, pathname, item, depth = 0
}) {
  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false
    });

    acc.push(
      <NavItem
        depth={depth}
        icon={item.icon}
        key={item.href}
        label={item.label}
        open={Boolean(open)}
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        depth={depth}
        href={item.href}
        icon={item.icon}
        key={item.href}
        label={item.label}
        title={item.title}
      />
    );
  }

  return acc;
}

function NavBar({ openMobile, onMobileClose, className, ...rest }) {
  const classes = useStyles();
  const location = useLocation();
  const session = useSelector((state) => state.session);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }

    // eslint-disable-next-line
  }, [location.pathname]);

  const content = (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <nav className={classes.navigation}>
        {MY_navConfig().map((list) => renderNavItems({
          items: list.items,
          subheader: list.subheader,
          pathname: location.pathname,
          key: list.subheader
        }))}
      </nav>
      <Divider className={classes.divider} />
      {/*<Tooltip title="개인 정보 변경">*/}
      {/*  <div className={classes.profile} onClick={() => setOpen(true)}>*/}
      {/*      <Avatar*/}
      {/*        alt="Person"*/}
      {/*        // onClick={() => setOpen(true)}*/}
      {/*        className={classes.avatar}*/}
      {/*        src={session.user.avatar}*/}
      {/*      />*/}
      {/*    <div className={classes.details}>*/}
      {/*      <Link*/}
      {/*        variant="h5"*/}
      {/*        color="textPrimary"*/}
      {/*        underline="none"*/}
      {/*      >*/}
      {/*        {`${session.user.name} ${session.user.position}`}*/}
      {/*      </Link>*/}
      {/*      <Typography variant="body2">{session.user.department}</Typography>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</Tooltip>*/}
    </div>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{
            paper: classes.mobileDrawer
          }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{
            paper: classes.desktopDrawer
          }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
      <ChangePasswordDialog open={open} onClose={() => setOpen(false)}/>
    </>
  );
}

NavBar.propTypes = {
  className: PropTypes.string,
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default NavBar;
