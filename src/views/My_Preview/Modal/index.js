import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";
import Header from "../Header";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/styles";
import axios from "../../../utils/my_axios";
import {getTodoCount, isloading} from "../../../actions";
import {APIKEY} from "../../../my_config";
import globalAxios from "axios";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router";
import {Redirect} from "react-router-dom";

const useStyles = makeStyles(() => ({
  title: {
    backgroundColor: '#2962ff',
  },
  titleText: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 550,
    marginBottom: 0
  },
  content: {
    paddingTop: 10,
    fontSize: '16px'

  }
}));

function Modal({isAm, open, onClose, onComplete, setSnackbarsOpen, setIsSuccess, setInfo}) {
  const today = moment().format('YYYY-MM-DD');
  const history = useHistory();
  const [carCount, setCarCount] = useState('');
  const classes = useStyles();
  const dispatch = useDispatch();

  const config = {headers: {Authorization: `Token ${localStorage.getItem('token')}`}};
  const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

  const onSubmit = async () => {
    dispatch(isloading(true));
    let response = null;

    try {
      response = await create_customer();
    } catch (error) {
      dispatch(isloading(false));
      return onComplete(false, '수집 되지 않은 좌표가 있습니다');
    }

    try {
      response = await create_route();
    } catch (error) {
      dispatch(isloading(false));
      return onComplete(false, '경로 생성 실패, 개발팀 문의 바랍니다');
    }

    return history.push('/route/' + String(response.data));
  };

  const create_route = async () => {
    const url = "core/create_route/";
    const data = {deliveryDate: today, carCount: carCount, isAm: isAm};
    return await axios.post(url, data, config)
  }

  const create_customer = async () => {
    const url = "customer/create_customers/";
    const data = {isAm: isAm};
    return await axios.post(url, data, config);
  }

  const getMutualDistanceByTmapRecursive = async (invalidMutualDistanceCustomers: Array) => {

    const customer: Array = invalidMutualDistanceCustomers.pop();

    if (customer === undefined) {
      return;
    }

    await timeout(400);

    const response = await getMutualDistanceByTmap(customer[0], customer[1]);
    const totalDistance = response.data.features[0].properties.totalDistance;
    const jsonMap = JSON.stringify(response.data);
    await save(customer[0], customer[1], totalDistance, jsonMap);
    await getMutualDistanceByTmapRecursive(invalidMutualDistanceCustomers);

  }

  const getMutualDistanceByTmap = async (start: Object, end: Object) => {
    let params = {
      startName: '출발지',
      startX: start.lon,
      startY: start.lat,
      endName: '도착지',
      endX: end.lon,
      endY: end.lat,

      roadType: 16,
      directionOption: 0,
      resCoordType: 'EPSG3857',
      reqCoordType: 'WGS84GEO',
      searchOption: '10',
      appKey: APIKEY,

    }
    return await globalAxios.get("https://api2.sktelecom.com/tmap/routes", {params: params})
  }


  const save = async (start, end, distance, jsonMap) => {
    const url = "customer/save_mutual_distance/";
    const data = {
      start: start.customer_id,
      end: end.customer_id,
      distance: distance,
      jsonMap: jsonMap,
    };
    return await axios.post(url, data, config);
  }

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle className={classes.title}>
          <DialogContentText className={classes.titleText}>배차시작</DialogContentText>
        </DialogTitle>
        <DialogContent>
          <DialogContentText className={classes.content}>
            {today} {isAm ? '오전' : '오후'} 배차를 시작 하시겠습니까?
          </DialogContentText>
          <TextField
            onChange={(event) => setCarCount(event.target.value)}
            value={carCount}
            autoFocus
            margin="dense"
            id="carCount"
            label="차량배차대수"
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="default" variant={"outlined"}>
            닫기
          </Button>
          <Button onClick={onSubmit} color="secondary" variant={"outlined"}>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

Modal.propTypes = {
  isAm: PropTypes.bool,
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func
};

export default Modal;
