import React, {Fragment, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";
import MY_Tmap, {pr_3857, pr_4326} from "../../components/MY_Tmap";
import {Typography} from "@material-ui/core";
import moment from "moment";
import Button from "@material-ui/core/Button";
import {isloading} from "../../actions";
import axios from "../../utils/my_axios";
import globalAxios from "axios"
import {useDispatch} from "react-redux";
import {APIKEY} from "../../my_config";
import clsx from "clsx";

const useStyles = makeStyles({
  root: {
    overflow: 'scroll',
    maxHeight: '750px'
  },
  tableRows: {
    cursor: "pointer"
  },
  missingAddressRow: {
    backgroundColor: '#e0e0e0'
  }
});


export default function Result({orders, fetchOrderData, map, isAm, setIsAm}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const moveTo = (lon, lat) => {
    map.setCenter(new window.Tmap.LonLat(lon, lat).transform(pr_4326, pr_3857), 16);
  }

  const saveGeolocationToErp = () => {
    if (window.confirm('좌표를 수집 하시겠습니까?')) {
      dispatch(isloading(true));
      const url = "customer/pre_processing_geolocations/";
      const config = {
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
        params: {isAm: isAm}
      };

      dispatch(isloading(true));
      axios.get(url, config)
        .then(res => {
          return res.data
        })
        .then(geolocations => {
          return getGeolocationRecursive(geolocations);
        })
        .catch(err => {
          fetchOrderData();
        });
    }
  }

  const getGeolocationRecursive = (geolocations) => {
    const geolocation = geolocations.pop();

    if (geolocation === undefined) {
      return fetchOrderData();
    }

    setTimeout(() => {
      getGeolocationByTmap(geolocation)
        .then(response => {
          const coordinateInfo = response.data.coordinateInfo;
          let lat = coordinateInfo.lat;
          let lon = coordinateInfo.lon;
          if (lat === "" && lon === "") {
            lat = coordinateInfo.newLat;
            lon = coordinateInfo.newLon;
          }
          return saveToErp(geolocation.orderNumber, lat, lon);
        })
      getGeolocationRecursive(geolocations);
    }, 200)
  }

  const getGeolocationByTmap = async (geolocation) => {
    let params = {
      city_do: geolocation.si,
      gu_gun: geolocation.gu,
      dong: `${geolocation.dong} ${geolocation.bun_ji} ${geolocation.detail}`,
      addressFlag: "F00",
      coordType: "WGS84GEO",
      appKey: APIKEY,
    }
    return await globalAxios.get("https://api2.sktelecom.com/tmap/geo/geocoding", {params: params})
  }

  const saveToErp = async (orderNumber, lat, lon) => {
    const url = "customer/save_geolocation/";
    let params = {
      orderNumber: orderNumber,
      lat: lat,
      lon: lon,
    }
    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      params: params
    };
    return await axios.get(url, config)
  }

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Typography variant="h4">
        {moment().format('YYYY년 MM월 DD일 ')}
        <Button variant="outlined" onClick={saveGeolocationToErp} size={"small"}>좌표수집</Button>
        <Button variant="contained" color={isAm ? "primary" : "default"} onClick={() => setIsAm(true)}
                size={"small"}>오전</Button>
        <Button variant="contained" color={!isAm ? "primary" : "default"} onClick={() => setIsAm(false)}
                size={"small"}>오후</Button>
      </Typography>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">번호</TableCell>
            <TableCell align="center">주문번호</TableCell>
            <TableCell align="center">주소</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <Fragment key={order.id}>
              <TableRow>
                <TableCell colSpan={3}>
                  고객명 : {order.name}
                </TableCell>
              </TableRow>

              <TableRow hover className={clsx(classes.tableRows,
                                        !(order.lon && order.lat) ? classes.missingAddressRow : null) }
                        onClick={() => order.lon && order.lat ? moveTo(order.lon, order.lat) : null}>
                <TableCell align="center">
                  {order.id}
                </TableCell>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.address}</TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

Result.propTypes = {
  orders: PropTypes.array,
  fetchOrderData: PropTypes.func,
  map: PropTypes.object,
  isAm: PropTypes.bool,
  setIsAm: PropTypes.func,
};
