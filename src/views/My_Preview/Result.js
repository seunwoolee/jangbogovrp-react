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
    map.setCenter(new window.Tmapv2.LatLng(lat, lon));
    map.setZoom(17);
    setTimeout(() => map.zoomOut(), 200);
  }

  const saveGeolocationToErp = () => {
    if (window.confirm('좌표를 수집 하시겠습니까?')) {
      const url = "customer/preview_order/";
      const config = {
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
        params: {isAm: isAm}
      };

      dispatch(isloading(true));
      axios.get(url, config)
        .then(res => {
          return res.data
        })
        .then(missingAddressGeolocations => {
          return getGeolocationRecursive(missingAddressGeolocations);
        })
        .catch(err => {
          fetchOrderData();
        });
    }
  }

  const getGeolocationRecursive = (missingAddressGeolocations) => {
    const missingAddressGeolocation = missingAddressGeolocations.pop();

    if (missingAddressGeolocation === undefined) {
      return fetchOrderData();
    }

    setTimeout(() => {
      getGeolocationByTmap(missingAddressGeolocation)
        .then(response => {
          const coordinateInfo = response.data.coordinateInfo;
          const coordinate = coordinateInfo.coordinate[0];
          let lat = coordinate.lat;
          let lon = coordinate.lon;
          if (lat === "" && lon === "") {
            lat = coordinate.newLat;
            lon = coordinate.newLon;
          }
          return saveToErp(missingAddressGeolocation.orderNumber, lat, lon);
        })
        .catch(err => {
          console.log(missingAddressGeolocation);
        })
      getGeolocationRecursive(missingAddressGeolocations);
    }, 200)
  }

  const getGeolocationByTmap = async (geolocation) => {
    let params = {
      fullAddr: geolocation.address,
      coordType: "WGS84GEO",
      appKey: APIKEY,
    }
    return await globalAxios.get("https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&callback=result", {params: params})
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

              <TableRow hover className={clsx(
                classes.tableRows, !(order.lon && order.lat) ? classes.missingAddressRow : null) }
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
