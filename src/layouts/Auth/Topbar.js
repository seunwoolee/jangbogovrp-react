import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {AppBar, Button, Toolbar} from '@material-ui/core';
import NoteOutlinedIcon from "@material-ui/icons/NoteOutlined";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: 'none'
  },
  toolbar: {
      minHeight: 48,
      backgroundColor: '#1e4a6d',
  },
  logos: {
    fontSize: '1rem',
    color: theme.palette.common.white,
  },
}));

function Topbar({ className, ...rest }) {
  const classes = useStyles();

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      color="primary"
    >
      <Toolbar className={classes.toolbar}>
        <RouterLink to="/auth/login">
          <Button
            className={classes.logos}
          >
            {/*<LocalShippingIcon className={classes.logoutIcon} />*/}
            자동배차시스템
          </Button>
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
}

Topbar.propTypes = {
  className: PropTypes.string
};

export default Topbar;
