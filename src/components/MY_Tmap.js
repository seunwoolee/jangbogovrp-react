import React, {useState, useEffect} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Link, Container
} from '@material-ui/core';
import axios from 'src/utils/axios';
import getInitials from 'src/utils/getInitials';
import {avatar_URL} from "../my_config";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
  },

}));

function MY_Tmap({orders}) {
  const classes = useStyles();
  const [Tmap, _] = useState(window.Tmap);
  const [map, setMap] = useState(null);
  const pr_3857 = new window.Tmap.Projection("EPSG:3857");
  const pr_4326 = new window.Tmap.Projection("EPSG:4326");
  const startLon = 128.539506;
  const startLat = 35.929894;

  const createHtmlicon = (number: string) => {
    const style = "position:absolute; z-index:1; color:#000; margin:3px 0 0 0; width:100%; text-align:center; font-weight:bold;";
    const span = `<span style='${style}'>${String(number)}</span>`;
    // const iconHtml = `<div style="text-align:center;">${span}<img src="images/icon/marker_0.png" /></div>`;
    const iconHtml = `<div style="text-align:center;">${span}<img src="images/marker_0.png" /></div>`;
    return iconHtml;
  };

  const drawMarker = (lon, lat, order) => {
    const markers = new Tmap.Layer.Markers("MarkerLayer");
    map.addLayer(markers);
    const size = new Tmap.Size(26, 38);
    const offset = new Tmap.Pixel(-(size.w / 2), -(size.h / 2));
    const htmlIcon = createHtmlicon(order);
    const markerIcon = new Tmap.IconHtml(htmlIcon, size, offset);// 마커 아이콘 설정
    const marker = new Tmap.Marker(new Tmap.LonLat(lon, lat).transform(pr_4326, pr_3857), markerIcon);
    markers.addMarker(marker);
  };

  const drawStartMaker = () => {
    const markerLayer = new Tmap.Layer.Markers();
    map.addLayer(markerLayer);

    const lonlat = new Tmap.LonLat(startLon, startLat).transform(pr_4326, pr_3857);
    const size = new Tmap.Size(24, 38);
    const offset = new Tmap.Pixel(-(size.w / 2), -(size.h));
    const icon = new Tmap.Icon('images/marker_green.png', size, offset);

    const marker = new Tmap.Marker(lonlat, icon);
    markerLayer.addMarker(marker);
  };

  useEffect(() => {
    setMap(new Tmap.Map({
      div: "myTmap",
      height: '750px',
      transitionEffect: "resize",
      animation: true
    }));
  }, []);

  if (map && orders.length > 0) {
    drawStartMaker();
    for (let i = 0; i < orders.length; i++) {
      drawMarker(orders[i].lon, orders[i].lat, i + 1);
    }
    map.setCenter(new Tmap.LonLat(startLon, startLat).transform(pr_4326, pr_3857), 13);
  }

  return (
    <div className={classes.root} id="myTmap"/>
  );
}

MY_Tmap.propTypes = {
  orders: PropTypes.array
};

export default MY_Tmap;
