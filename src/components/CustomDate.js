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

function CustomDate({values, setValues, onSearch}) {
  const classes = useStyles();
  const [calendarTrigger, setCalendarTrigger] = useState(null);
  const calendarOpen = Boolean(calendarTrigger);
  const calendarValue = values[calendarTrigger];

  const handleCalendarOpen = (trigger) => {
    setCalendarTrigger(trigger);
  };

  const handleCalendarChange = () => {
  };

  const handleCalendarAccept = (date) => {
    // eslint-disable-next-line no-unused-expressions
    calendarTrigger === 'startDate'
      ? setValues((prevValues) => ({
        ...prevValues,
        [calendarTrigger]: date,
        endDate: date,
      }))
      : setValues((prevValues) => ({
        ...prevValues,
        [calendarTrigger]: date,
      }));
  };

  const handleCalendarClose = () => {
    setCalendarTrigger(false);
  };

  return (
    <>
      <div className={classes.fieldGroup}>
        <TextField
          className={classes.dateField}
          label="시작일자"
          name="startDate"
          onClick={() => handleCalendarOpen('startDate')}
          value={moment(values.startDate).format('YYYY-MM-DD')}
          variant="outlined"
        />
        <TextField
          className={classes.dateField}
          label="종료일자"
          name="endDate"
          onClick={() => handleCalendarOpen('endDate')}
          value={moment(values.endDate).format('YYYY-MM-DD')}
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
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>
        <DatePicker
          autoOk
          // minDate={calendarMinDate}
          onAccept={handleCalendarAccept}
          onChange={handleCalendarChange}
          onClose={handleCalendarClose}
          open={calendarOpen}
          style={{display: 'none'}}
          value={calendarValue}
          variant="dialog"
        />
      </MuiPickersUtilsProvider>
    </>
  );
}

CustomDate.propTypes = {
  values: PropTypes.object,
  setValues: PropTypes.func,
  onSearch: PropTypes.func,
};


export default CustomDate;
