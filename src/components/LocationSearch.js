import React, {useState} from 'react';
import koLocale from "date-fns/locale/ko";
import DateFnsUtils from "@date-io/date-fns";
import clsx from 'clsx';
import moment from 'moment';
import {makeStyles} from '@material-ui/styles';
import {Button, TextField} from '@material-ui/core';
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import PropTypes from "prop-types";
import SearchBar from "./SearchBar";

const useStyles = makeStyles((theme) => ({
  root: {},
  alert: {
    marginBottom: theme.spacing(3)
  },
  formGroup: {
    marginBottom: theme.spacing(3)
  },
  fieldGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  fieldHint: {
    margin: theme.spacing(1, 0)
  },
  flexGrow: {
    flexGrow: 1
  },
  dateField: {
    backgroundColor: 'white',
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  },
  searchButton: {
    backgroundColor: theme.palette.common.white,
    marginLeft: theme.spacing(2)
  }
}));

function LocationSearch({productCode, setProductCode, onSearch}) {
  const classes = useStyles();

  const handleChange = (event) => {
    setProductCode(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  return (
    <>
      <div className={classes.fieldGroup}>
        <TextField
          value={productCode}
          onChange={handleChange}
          className={classes.dateField}
          onKeyPress={handleKeyPress}
          label="상품코드"
          name="productCode"
          variant="outlined"
        />
        <Button
          className={classes.searchButton}
          onClick={onSearch}
          size="large"
          variant="contained"
        >
          검색
        </Button>
      </div>
    </>
  );
}

LocationSearch.propTypes = {
  productCode: PropTypes.string,
  setProductCode: PropTypes.func,
  onSearch: PropTypes.func,
};

export default LocationSearch;
