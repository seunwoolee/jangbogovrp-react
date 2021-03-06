import React, {Fragment, useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import axios from "../../../../utils/my_axios";
import moment from "moment";
import {isloading} from "../../../../actions";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

const options = [
  {value: 'chocolate', label: 'Chocolate'},
];

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: "auto!important",
    right: "auto!important",
  },
  backdrop: {
    opacity: "0.2!important"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function DriverAddDialog({open, onClose, fetchDrivers}) {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [company, setCompany] = useState('0');


  const createDriver = async () => {
    const config = {headers: {Authorization: `Token ${localStorage.getItem('token')}`}};
    const url = "company/create_driver/";
    const data = {name: name, courseNumber: courseNumber, company: company};
    await axios.post(url, data, config);
  };

  const handleSubmit = async () => {
    try {
      await createDriver();
      fetchDrivers();
      onClose();
    } catch (e) {
      alert(e.response.data.message);
    }
  }

  const handleNameChanged = (event) => {
    setName(event.target.value);
  }

  const handleCourseNumberChanged = (event) => {
    setCourseNumber(event.target.value);
  }

  const handleCompanyChanged = (event) => {
    setCompany(event.target.value);
  }

  useEffect(() => {
    setName(null);
  }, [open])

  return (
    <div>
      <Dialog
        BackdropProps={{className: classes.backdrop}}
        className={classes.root}
        maxWidth="md"
        open={open}
        onClose={onClose}
      >
        <DialogContent>
          <DialogContentText>
            배송 기사 추가
          </DialogContentText>
          <TextField
            onChange={handleNameChanged}
            value={name}
            autoFocus
            margin="normal"
            id="name"
            label="이름"
            fullWidth
          />
          <TextField
            type="number"
            onChange={handleCourseNumberChanged}
            value={courseNumber}
            margin="normal"
            id="name"
            label="코스번호"
            fullWidth
          />
          <FormControl className={classes.formControl}>
            <InputLabel>회사</InputLabel>
            <Select
              value={company}
              onChange={handleCompanyChanged}
            >
              {/*  TODO 하드 코딩*/}
              <MenuItem value={'0'}>배송센터</MenuItem>
              <MenuItem value={'011'}>반야월</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="default" variant="outlined">
            닫기
          </Button>
          <Button onClick={handleSubmit} color="secondary" variant="outlined">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

DriverAddDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  fetchDrivers: PropTypes.func,
};

export default DriverAddDialog;
