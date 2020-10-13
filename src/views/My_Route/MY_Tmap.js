import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import DialogIndex from "./Dialog";

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
  "#FFFF6C",
  // "#0054FF",
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


function MY_Tmap({fetchRoute, geoDatas, groupGeoDatas, groupMarkers, setGroupMarkers, groupLines, setGroupLines, map}) {
  const classes = useStyles();
  const startLon = 128.539506;
  const startLat = 35.929894;
  const [open, setOpen] = React.useState(false);
  const [selectedGeoData, setSelectedGeoData] = React.useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onMakerClicked = (marker, geoDataId) => {
    marker.addListener('click', function (evt) {
      const geoData = geoDatas.find(geodata => geodata.id === geoDataId);
      const selectedGeoDatas = geoDatas.filter(geodata =>
        geodata.customer_info.latitude === geoData.customer_info.latitude &&
        geodata.customer_info.longitude === geoData.customer_info.longitude)
      handleClickOpen();
      setSelectedGeoData(selectedGeoDatas);
    });
  }

  const drawMarker = (_groupMarkers: Array, groupGeoData: Array) => {
    const groupMarker = [];
    for (let i = 0; i < groupGeoData.length; i++) {
      const htmlIcon = createHtmlicon(groupGeoData[i].route_number, String(groupGeoData[i].route_index));
      const marker = new window.Tmapv2.Marker({
        iconHTML: htmlIcon,
        iconSize: new window.Tmapv2.Size(26, 38),
        position: new window.Tmapv2.LatLng(groupGeoData[i].customer_info.latitude, groupGeoData[i].customer_info.longitude),
        map: map
      });
      onMakerClicked(marker, groupGeoData[i].id);
      groupMarker.push(marker);
    }
    _groupMarkers.push(groupMarker);
  }

  const drawLine = (_groupLines: Array, groupGeoData: Array) => {
    const groupLine = [];
    for (let i = 0; i < groupGeoData.length; i++) {
      const latLng = new window.Tmapv2.LatLng(
        groupGeoData[i].customer_info.latitude,
        groupGeoData[i].customer_info.longitude)
      groupLine.push(latLng);
    }

    const line = new window.Tmapv2.Polyline({
      path: groupLine,
      fillColor: routeColor[groupGeoData[0].route_number],
      strokeColor: routeColor[groupGeoData[0].route_number],
      outlineColor: routeColor[groupGeoData[0].route_number],
      strokeWeight: 3, // 라인 두께
      strokeStyle: "solid", // 선의 종류
      map: map // 지도 객체
    });

    _groupLines.push(line);
  };

  const destroyMarkersLines = () => {
    for (let i = 0; i < groupMarkers.length; i++) {
      for (let j = 0; j < groupMarkers[i].length; j++) {
        groupMarkers[i][j].setMap(null);
      }
    }
    groupLines.map(line => line.setMap(null));
  }

  useEffect(() => {
    if (groupGeoDatas.length > 1) {
      destroyMarkersLines();
      const _groupMarkers = [];
      const _groupLines = [];

      drawStartMaker(map, startLat, startLon);
      for (let i = 0; i < groupGeoDatas.length; i++) {
        drawMarker(_groupMarkers, groupGeoDatas[i]);
      }
      for (let i = 0; i < groupGeoDatas.length; i++) {
        drawLine(_groupLines, groupGeoDatas[i]);
      }

      setGroupLines(_groupLines);
      setGroupMarkers(_groupMarkers);

      // map.setCenter(new window.Tmapv2.LatLng(startLat, startLon));
    }
  }, [groupGeoDatas])


  return (
    <>
      <div className={classes.root} id="myTmap"/>
      <DialogIndex fetchRoute={fetchRoute} onClose={handleClose} open={open} geoDatas={selectedGeoData}
                   maxRouteNumber={groupMarkers.length}/>
    </>
  );

}

MY_Tmap.propTypes = {
  fetchRoute: PropTypes.func,
  geoDatas: PropTypes.array,
  groupGeoDatas: PropTypes.array,
  groupMarkers: PropTypes.array,
  setGroupMarkers: PropTypes.func,
  groupLines: PropTypes.array,
  setGroupLines: PropTypes.func,
  map: PropTypes.object,
};

export default MY_Tmap;
