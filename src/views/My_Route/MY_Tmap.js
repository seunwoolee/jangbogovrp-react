import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {composeWithDevTools} from "redux-devtools-extension";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
  },

}));

// export const pr_3857 = new window.Tmapv2.Projection("EPSG:3857");
// export const pr_4326 = new window.Tmapv2.Projection("EPSG:4326");
// export const routeColor = [
//   "#FF0000",
//   "#FFBB00",
//   "#1DDB16",
//   "#00D8FF",
//   "#0100FF",
//   "#A09323",
//   "#FFE400",
//   "#0054FF",
//   "#5F00FF",
//   "#FF00DD",
//   "#000000",
//   "#FF5E00",
//   "#A6A6A6",
//   "#C4B73B",
//   "#6CC0FF",
//   "#980000",
//   "#B2ADFF",
//   "#269BAF",
//   "#FF9090",
//   "#FFFF6C"];

export const drawStartMaker = (map, lat, lon) => {
  new window.Tmapv2.Marker({
    position: new window.Tmapv2.LatLng(lat, lon),
    icon: '/images/makers/marker_green.png',
    map: map
  });
};

export const createHtmlicon = (vehicleNo: string, vehicleNoIndex: string) => {
  const style = "position:absolute; z-index:1; color:#000; margin:3px 0 0 0; width:100%; text-align:center; font-weight:bold;";
  const span = `<span style='${style}'>${vehicleNoIndex}</span>`;
  const iconHtml = `<div style="text-align:center;">${span}<img src="/images/makers/marker_${vehicleNo}.png" /></div>`;
  return iconHtml;
};


export const routeColor = [
  "#FF0000",
  "#FFBB00",
  "#1DDB16",
  "#00D8FF",
  "#0100FF",
  "#A09323",
  "#FFE400",
  "#0054FF",
  "#5F00FF",
  "#FF00DD",
  "#000000",
  "#FF5E00",
  "#A6A6A6",
  "#C4B73B",
  "#6CC0FF",
  "#980000",
  "#B2ADFF",
  "#269BAF",
  "#FF9090",
  "#FFFF6C"];

function MY_Tmap({geoDatas, groupGeoDatas, groupMarkers, groupLines, map}) {
  const classes = useStyles();
  const startLon = 128.539506;
  const startLat = 35.929894;

  // const onMakerClicked = (marker, geoDataId) => {
  //   marker.addListener('click', function (evt) {
  //     const geoData = geoDatas.find(geodata => geodata.id === geoDataId);
  //     console.log(groupLines);
  //     for (let i = 0; i < groupLines.length; i++) {
  //       groupLines[i].setVisible(false);
  //     }
  //
  //     debugger;
  //     //  open modal
  //   });
  // }
  //
  // const drawMarker = (groupGeoData: Array) => {
  //   for (let i = 0; i < groupGeoData.length; i++) {
  //     const htmlIcon = createHtmlicon(groupGeoData[i].route_number, String(groupGeoData[i].route_index));
  //     const marker = new window.Tmapv2.Marker({
  //       iconHTML: htmlIcon,
  //       iconSize: new window.Tmapv2.Size(26, 38),
  //       position: new window.Tmapv2.LatLng(groupGeoData[i].customer_info.latitude, groupGeoData[i].customer_info.longitude),
  //       map: map
  //     });
  //     onMakerClicked(marker, groupGeoData[i].id);
  //
  //   }
  //
  // const drawLine = (groupGeoData: Array) => {
  //   const groupLine = [];
  //   for (let i = 0; i < groupGeoData.length; i++) {
  //     const latLng = new window.Tmapv2.LatLng(
  //       groupGeoData[i].customer_info.latitude,
  //       groupGeoData[i].customer_info.longitude)
  //     groupLine.push(latLng);
  //   }
  //
  //   const line = new window.Tmapv2.Polyline({
  //     path: groupLine,
  //     fillColor: routeColor[groupGeoData[0].route_number],
  //     strokeColor: routeColor[groupGeoData[0].route_number],
  //     outlineColor: routeColor[groupGeoData[0].route_number],
  //     strokeWeight: 3, // 라인 두께
  //     strokeStyle: "solid", // 선의 종류
  //     map: map // 지도 객체
  //   });
  //
  //   groupLines.push(line);
  // };
  //
  // if (map && geoDatas.length > 0) {
  //   drawStartMaker(map, startLat, startLon);
  //   for (let i = 0; i < groupGeoDatas.length; i++) {
  //     drawMarker(groupGeoDatas[i]);
  //   }
  //   for (let i = 0; i < groupGeoDatas.length; i++) {
  //     drawLine(groupGeoDatas[i]);
  //   }
  //   map.setCenter(new window.Tmapv2.LatLng(startLat, startLon));
  // }

  return (
    <div className={classes.root} id="myTmap"/>
  );
}

MY_Tmap.propTypes = {
  geoDatas: PropTypes.array,
  groupGeoDatas: PropTypes.array,
  groupMarkers: PropTypes.array,
  groupLines: PropTypes.array,
  map: PropTypes.object,
};

export default MY_Tmap;
