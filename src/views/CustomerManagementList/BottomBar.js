import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Drawer, Grid, Typography, Button, Hidden
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  button: {
    fontFamily: 'GmarketSansBold',
    fontSize: '1rem'
  }
}));

function BottomBar({
  selected,
  className,
  onWriteReport,
  ...rest
}) {
  const classes = useStyles();
  const open = selected.length > 0;

  return (
    <Drawer
      anchor="bottom"
      open={open}
      // eslint-disable-next-line react/jsx-sort-props
      PaperProps={{ elevation: 1 }}
      variant="persistent"
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Grid
          alignItems="center"
          container
          spacing={2}
        >
          <Hidden smDown>
            <Grid
              item
              md={3}
            >
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {selected.length}
                {' '}
                선택됨
              </Typography>
            </Grid>
          </Hidden>
          <Grid
            item
            md={6}
            xs={12}
          >
            <div className={classes.actions}>
              <Button onClick={onWriteReport} className={classes.button}>
                <CheckIcon className={classes.buttonIcon} />
                기안 작성
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </Drawer>
  );
}

BottomBar.propTypes = {
  className: PropTypes.string,
  onWriteReport: PropTypes.func,
  selected: PropTypes.array.isRequired
};

export default BottomBar;
