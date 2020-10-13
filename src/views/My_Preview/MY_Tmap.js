import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {createHtmlicon, drawStartMaker} from "../My_Route/MY_Tmap";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
  },

}));

export const pr_3857 = new window.Tmap.Projection("EPSG:3857");
export const pr_4326 = new window.Tmap.Projection("EPSG:4326");
export const startLon = 128.539506;
export const startLat = 35.929894;

function MY_Tmap({orders, map, markers, setMarkers}) {
  const classes = useStyles();

  const drawMarker = (lon, lat, order) => {
    const htmlIcon = createHtmlicon('0', order);
    return new window.Tmapv2.Marker({
      iconHTML: htmlIcon,
      iconSize: new window.Tmapv2.Size(26, 38),
      position: new window.Tmapv2.LatLng(lat, lon),
      map: map
    });
  };

  useEffect(() => {
  if (map && orders.length > 0) {
    markers.map(marker => marker.setMap(null));

    const _markers = [];
    drawStartMaker(map, startLat, startLon);
    for (let i = 0; i < orders.length; i++) {
      _markers.push(drawMarker(orders[i].lon, orders[i].lat, i + 1));
    }
    setMarkers(_markers);
    map.setCenter(new window.Tmapv2.LatLng(startLat, startLon));
  }

  }, [orders])

  return (
    <div className={classes.root} id="myTmap"/>
  );
}

MY_Tmap.propTypes = {
  orders: PropTypes.array,
  markers: PropTypes.array,
  map: PropTypes.object,
  setMarkers: PropTypes.func,
};

export default MY_Tmap;
