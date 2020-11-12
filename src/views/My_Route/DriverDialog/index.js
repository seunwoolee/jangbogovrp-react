import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Select from 'react-select';
import DriverAddDialog from "./Dialog";
import axios from "../../../utils/my_axios";


const useStyles = makeStyles((theme) => ({
  root: {
    bottom: "auto!important",
    right: "auto!important",
  },
  backdrop: {
    opacity: "0.2!important"
  },
  DialogContent: {
    width: '500px',
    height: '400px'
  },
  deleteButton: {
    backgroundColor: '#96cbfe'
  }
}));

function DriverDialog({open, onClose, routeD, reDraw}) {
  const classes = useStyles();
  const [selectedDriver, setSelectedDriver] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);

  const fetchDrivers = async () => {
    const url = "company/get_drivers/";
    const config = {headers: {Authorization: `Token ${localStorage.getItem('token')}`}}
    const response = await axios.get(url, config);
    console.log(response.data);
    const drivers = response.data.map(driver => {
      return {value: driver.id, label: `[${driver.course_number}] ${driver.name}`}
    })
    setDrivers(drivers);
  };

  const handleSubmit = async () => {
    if (!selectedDriver.value) {
      return alert('기사를 선택해주세요');
    }
    const config = {headers: {Authorization: `Token ${localStorage.getItem('token')}`}};
    const url = "delivery/add_driver_to_routeD/";
    const data = {driver_id: selectedDriver.value, route_d_id: routeD.id};
    await axios.post(url, data, config);
    onClose();
    reDraw();
  }

  const handleClosed = () => {
    setAddOpen(false);
  }

  const handleDelete = async () => {
    if (selectedDriver !== '') {
      if (window.confirm('선택하신 기사를 삭제하시겠습니까?')) {
        const url = "company/delete_driver/";
        const config = {
          headers: {Authorization: `Token ${localStorage.getItem('token')}`},
          data: {id: selectedDriver.value}
        };

        await axios.delete(url, config);
        fetchDrivers();
      }
    }
  }

  useEffect(() => {
    fetchDrivers();
  }, [open]);

  return (
    <div>
      <Dialog
        BackdropProps={{className: classes.backdrop}}
        className={classes.root}
        maxWidth="lg"
        open={open}
        onClose={onClose}
      >
        <Button
          onClick={() => setAddOpen(true)}
          color={"secondary"}
          size={"medium"}
          variant={"contained"}>
          기사추가
        </Button>
        <Button
          className={classes.deleteButton}
          onClick={handleDelete}
          size={"medium"}
          variant={"contained"}>
          기사삭제
        </Button>
        <DialogContent className={classes.DialogContent}>
          <Select
            defaultValue={selectedDriver}
            onChange={setSelectedDriver}
            options={drivers}
          />
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

      <DriverAddDialog fetchDrivers={fetchDrivers} open={addOpen} onClose={handleClosed}/>
    </div>
  );
}

DriverDialog.propTypes = {
  open: PropTypes.bool,
  routeD: PropTypes.object,
  onClose: PropTypes.func,
  reDraw: PropTypes.func,
};

export default DriverDialog;
