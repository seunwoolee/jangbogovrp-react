import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";
import moment from "moment";
import {makeStyles} from "@material-ui/styles";
import globalAxios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {APIKEY} from "../../../my_config";
import {getTodoCount, isloading} from "../../../actions";
import axios from "../../../utils/my_axios";

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

export const create_routeOrder = async (routeM: number, routeNumber: number, startLat: number, startLon: number) => {
  const url = "delivery/routeD/";
  let params = {routeM, routeNumber};
  let response = null;
  const config = {
    headers: {Authorization: `Token ${localStorage.getItem('token')}`},
    params
  };

  response = await axios.get(url, config);
  const rows = response.data;

  if (rows.length === 0) {
    return;
  }

  const viaPoints = [];
  for (let i = 0; i < rows.length; i++) {
    const viaPoint = {};
    viaPoint.viaPointId = String(rows[i].customer_info.id);
    viaPoint.viaPointName = rows[i].customer_info.name;
    viaPoint.viaX = rows[i].customer_info.longitude;
    viaPoint.viaY = rows[i].customer_info.latitude;
    viaPoints.push(viaPoint);
  }

  let tmapRouteNumber = '20';
  if (viaPoints.length > 20) {
    tmapRouteNumber = '30';
  }

  params = {
    reqCoordType: "WGS84GEO",
    resCoordType: "EPSG3857",
    startName: "출발",
    startX: String(startLon),
    startY: String(startLat),
    startTime: "201711121314",
    endName: "도착",
    endX: String(startLon),
    endY: String(startLat),
    searchOption: "0",
    viaPoints,
  };

  try {
    response = await globalAxios.post(
      `https://apis.openapi.sk.com/tmap/routes/routeOptimization${tmapRouteNumber}?version=1&format=json`,
      params,
      {headers: {appKey: APIKEY}}
    );

    const resultFeatures = response.data.features;
    const newRouteOrders = [];
    const jsonData = JSON.stringify(resultFeatures); // index가 0인 첫번째에 들어감
    for (const i in resultFeatures) {
      const {geometry} = resultFeatures[i];
      const {properties} = resultFeatures[i];

      if (geometry.type === "Point") {
        if (properties.viaPointId) {
          const temp = {routeM, customerId: properties.viaPointId, index: properties.index};
          if (properties.index === "1") {
            temp.jsonData = jsonData;
            temp.totalDistance = response.data.properties.totalDistance;
          }
          newRouteOrders.push(temp);
        }
      }
    }

    await axios.patch("delivery/routeDUpdate/",
      newRouteOrders, {headers: {Authorization: `Token ${localStorage.getItem('token')}`}});
  } catch (e) {
    console.log(e);
  }

  return routeNumber;
};

function Modal({
  isAm,
  open,
  onClose,
  onComplete,
  setSnackbarsOpen,
  setIsSuccess,
  setInfo,
  selectedMarkers,
  setSelectedMarkers
}) {
  const today = moment().format('YYYY-MM-DD');
  const [carCount, setCarCount] = useState('');
  const [isAutoChecked, setIsAutoChecked] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const session = useSelector((state) => state.session);

  const config = {headers: {Authorization: `Token ${localStorage.getItem('token')}`}};
  const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

  const handleChecked = () => {
    setIsAutoChecked(prev => !prev);
  };

  const onSubmit = async () => {
    dispatch(isloading(true));
    let response = null;

    try {
      response = await create_customer();
    } catch (err) {
      dispatch(isloading(false));
      return onComplete(false, err.response.data.message);
    }

    try {
      response = await create_route();
    } catch (error) {
      dispatch(isloading(false));
      return onComplete(false, '경로 생성 실패, 개발팀 문의 바랍니다');
    }

    const routeMId = response.data.route_m_id;
    const maxRouteNumber = response.data.max_route_number;

    try {
      for (let i = 1; i <= maxRouteNumber; i++) {
        await timeout(30);
        create_routeOrder(routeMId, i, Number(session.user.latitude), Number(session.user.longitude))
          .then(r => {
            if (r === maxRouteNumber) {
              setTimeout(() => history.push(`/route/${String(routeMId)}`), 1000);
            }
          });
      }
    } catch (error) {
      dispatch(isloading(false));
      return onComplete(false, 'Tmap 다중 경유지 생성 실패, 개발팀 문의 바랍니다.');
    }
  };

  const create_route = async () => {
    let url = "core/create_route_manual/";
    if (isAutoChecked === true) {
      url = "core/create_route/";
    }

    const data = {deliveryDate: today, carCount, isAm, selectedMarkers: selectedMarkers.map(marker => marker.orderNumber)};
    return await axios.post(url, data, config);
  };

  const create_customer = async () => {
    const url = "customer/create_customers/";
    const data = {isAm, isAuto: isAutoChecked, selectedMarkers: selectedMarkers.map(marker => marker.orderNumber)};
    return await axios.post(url, data, config);
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle className={classes.title}>
          <DialogContentText className={classes.titleText}>배차시작</DialogContentText>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormControlLabel onChange={handleChecked} checked={isAutoChecked} control={<Switch />} label="자동배차" />
          </DialogContentText>
          {selectedMarkers.length === 0 ? (
            <DialogContentText className={classes.content}>
              {today}
              {' '}
              {isAm ? '오전' : '오후'}
              {' '}
              배차를 시작 하시겠습니까?
            </DialogContentText>
          ) : (
            <DialogContentText className={classes.content}>
              {today}
              {' '}
              {`${selectedMarkers.length}개의 선택 `}
              {' '}
              배차를 시작 하시겠습니까?
            </DialogContentText>
          )}
          {isAutoChecked ? (
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
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="default" variant="outlined">
            닫기
          </Button>
          <Button onClick={onSubmit} color="secondary" variant="outlined">
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
  setOpenModal: PropTypes.func,
  selectedMarkers: PropTypes.array,
  setSelectedMarkers: PropTypes.func,
};

export default Modal;
