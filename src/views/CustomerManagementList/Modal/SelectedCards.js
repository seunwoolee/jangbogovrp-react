import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import getShortBigo from "../../../utils/getShortBigo";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2)
  },
  content: {
    padding: theme.spacing(2),
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexWrap: 'wrap'
    },
    '&:last-child': {
      paddingBottom: theme.spacing(2)
    }
  },
  stats: {
    width: 150,
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%'
    }
  },
  bigo: {
    width: 330,
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%'
    }
  }
}));

function SelectedCards({ selectedCustomers, className, ...rest }) {
  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <div className={classes.stats}>
          <Typography variant="body2">공급자명</Typography>
          <Typography variant="h6">{selectedCustomers.공급자명}</Typography>
        </div>
        <div className={classes.stats}>
          <Typography variant="body2">금액</Typography>
          <Typography variant="h6">
            {selectedCustomers.통화}
            {selectedCustomers.총액}
          </Typography>
        </div>
        <div className={classes.bigo}>
          <Typography variant="body2">비고</Typography>
          <Typography variant="h6">{getShortBigo(0, selectedCustomers.비고)}</Typography>
        </div>
        <div className={classes.stats}>
          <Typography variant="body2">일자</Typography>
          <Typography variant="h6">
            {selectedCustomers.일자}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

SelectedCards.propTypes = {
  className: PropTypes.string,
  selectedCustomers: PropTypes.object.isRequired
};

export default SelectedCards;
