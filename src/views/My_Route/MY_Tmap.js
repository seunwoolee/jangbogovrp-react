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

export const pr_3857 = new window.Tmapv2.Projection("EPSG:3857");
export const pr_4326 = new window.Tmapv2.Projection("EPSG:4326");
export const routeColor = ["#FF0000",
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

function MY_Tmap({geoDatas, map}) {
  const classes = useStyles();
  const startLon = 128.539506;
  const startLat = 35.929894;
  const pointArr = [];

  const createHtmlicon = (vehicleNo: string, vehicleNoIndex: string) => {
    const style = "position:absolute; z-index:1; color:#000; margin:3px 0 0 0; width:100%; text-align:center; font-weight:bold;";
    const span = `<span style='${style}'>${vehicleNoIndex}</span>`;
    const iconHtml = `<div style="text-align:center;">${span}<img src="/images/makers/marker_${vehicleNo}.png" /></div>`;
    return iconHtml;
  };

  const onMakerClicked = (marker, geoDataId) => {
    marker.addListener('click', function (evt) {
      console.log(geoDataId);
    });
  }

  const drawMarker = (geoData) => {
    const htmlIcon = createHtmlicon(geoData.route_number, String(geoData.route_index));
    // const markerIcon = new window.Tmapv2.IconHtml(htmlIcon, size, offset);// 마커 아이콘 설정
    const marker = new window.Tmapv2.Marker({
      iconHTML: htmlIcon,
      iconSize: new window.Tmapv2.Size(26, 38),
      position: new window.Tmapv2.LatLng(geoData.customer_info.latitude, geoData.customer_info.longitude),
      map: map
    });
    onMakerClicked(marker, geoData.id);
  };

  const drawStartMaker = () => {
    const marker = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(startLat, startLon),
      icon: '/images/makers/marker_green.png',
      map: map
    });
  };

  const drawLine = (geoData) => {
    // const styleMap = new window.Tmapv2.StyleMap({
    //   'default': new window.Tmapv2.Style({
    //     pointColor: routeColor[Number(geoData.route_number)],
    //     pointRadius: 5,
    //     strokeColor: routeColor[Number(geoData.route_number)],
    //     strokeWidth: 4,
    //     strokeOpacity: 4,
    //     strokeLinecap: "square",
    //     graphicZIndex: 0
    //   })
    // });
    // const vectorLayer = new window.Tmapv2.Layer.Vector("vector", {styleMap: styleMap});
    // map.addLayer(vectorLayer);
    if (geoData.json_map) {
      const geoForm = JSON.parse(geoData.json_map);
      const points = geoForm.features.filter(f => f.geometry.type === "Point");
      const geometries = points.map(p => p.geometry.coordinates);
      for (let j in geometries) {
        const latlng = new window.Tmapv2.Point(
          geometries[j][0],
          geometries[j][1]);
        const convertPoint = new window.Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
          latlng);
        const convertChange = new window.Tmapv2.LatLng(
          convertPoint._lat,
          convertPoint._lng);
        pointArr.push(convertChange);
      }
      console.log(routeColor[Number(geoData.route_number)]);
      new window.Tmapv2.Polyline({
        path: pointArr,
        strokeColor: `${routeColor[Number(geoData.route_number)]}`, // 라인 색상
        strokeWeight: 3, // 라인 두께
        strokeStyle: "solid", // 선의 종류
        map: map // 지도 객체
      });
      debugger
      // console.log(points);
      // // 경로들의 결과값들을 포인트 객체로 변환
      // const latlng = new window.Tmapv2.Point(
      //   geometry.coordinates[j][0],
      //   geometry.coordinates[j][1]);
      // // 포인트 객체를 받아 좌표값으로 변환
      // const convertPoint = new window.Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
      //   latlng);

      // const polyline = new window.Tmapv2.Polyline({
      //   path: geoForm,
      //   strokeColor: routeColor[Number(geoData.route_number)], // 라인 색상
      //   strokeWeight: 3, // 라인 두께
      //   strokeStyle: "solid", // 선의 종류
      //   map: map // 지도 객체
      // });

      // const geoForm = format.read(geoData.json_map);
      // vectorLayer.addFeatures(geoForm);
    }

    // const polyline = new Tmapv2.Polyline({
    //   path: [
    //     new Tmapv2.LatLng(37.566381, 126.984523), // 선의 꼭짓점 좌표
    //     new Tmapv2.LatLng(37.566581, 126.984523), // 선의 꼭짓점 좌표
    //     new Tmapv2.LatLng(37.566381, 126.984673), // 선의 꼭짓점 좌표
    //     new Tmapv2.LatLng(37.566581, 126.984823), // 선의 꼭짓점 좌표
    //     new Tmapv2.LatLng(37.566381, 126.984823) // 선의 꼭짓점 좌표
    //   ],
    //   strokeColor: routeColor[Number(geoData.route_number)], // 라인 색상
    //   strokeWeight: 3, // 라인 두께
    //   strokeStyle: "solid", // 선의 종류
    //   map: map // 지도 객체
    // });
  };

  if (map && geoDatas.length > 0) {
    // format = new window.Tmap.Format.GeoJSON({
    //   'internalProjection': map.baseLayer.projection,
    //   'externalProjection': new window.Tmap.Projection("EPSG:3857")
    // });

    drawStartMaker();
    for (let i = 0; i < geoDatas.length; i++) {
      drawMarker(geoDatas[i]);
      drawLine(geoDatas[i]);
    }
    map.setCenter(new window.Tmapv2.LatLng(startLat, startLon));
  }

  return (
    <div className={classes.root} id="myTmap"/>
  );
}

MY_Tmap.propTypes = {
  geoDatas: PropTypes.array,
  map: PropTypes.object,
};

export default MY_Tmap;
