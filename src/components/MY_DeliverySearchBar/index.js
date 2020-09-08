import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {Grid, Button} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import Search from './Search';
import Filter from './Filter';
import CustomDate from "../CustomDate";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  search: {
    flexGrow: 1,
    maxWidth: 480,
    flexBasis: 480
  },
  filterButton: {
    marginLeft: 'auto'
  },
  filterIcon: {
    marginRight: theme.spacing(1)
  }
}));

const initialValues = {
  batchNumber: '',
  user: '',
  department: '',
};

function MY_SearchBar({onSearch, className, dateValues, setDateValues}) {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
    >
      <Grid item xs={12} md={6}>
        <CustomDate values={dateValues} setValues={setDateValues} onSearch={onSearch}/>
      </Grid>
    </Grid>
  );
}

MY_SearchBar.propTypes = {
  className: PropTypes.string,
  onSearch: PropTypes.func,
  dateValues: PropTypes.object,
  setDateValues: PropTypes.func,
};

export default MY_SearchBar;
