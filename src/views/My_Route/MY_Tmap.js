import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
  },

}));

export const pr_3857 = new window.Tmap.Projection("EPSG:3857");
export const pr_4326 = new window.Tmap.Projection("EPSG:4326");
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
  let format = null;

  // const [format, setFormat] = useState()


  const createHtmlicon = (vehicleNo: string, vehicleNoIndex: string) => {
    const style = "position:absolute; z-index:1; color:#000; margin:3px 0 0 0; width:100%; text-align:center; font-weight:bold;";
    const span = `<span style='${style}'>${vehicleNoIndex}</span>`;
    const iconHtml = `<div style="text-align:center;">${span}<img src="/images/makers/marker_${vehicleNo}.png" /></div>`;
    return iconHtml;
  };

  const drawMarker = (geoData) => {
    const markers = new window.Tmap.Layer.Markers("MarkerLayer");
    map.addLayer(markers);
    const size = new window.Tmap.Size(26, 38);
    const offset = new window.Tmap.Pixel(-(size.w / 2), -(size.h / 2));
    const htmlIcon = createHtmlicon(geoData.route_number, String(geoData.route_index));
    const markerIcon = new window.Tmap.IconHtml(htmlIcon, size, offset);// 마커 아이콘 설정
    const marker = new window.Tmap.Marker(new window.Tmap.LonLat(geoData.customer_info.longitude, geoData.customer_info.latitude)
      .transform(pr_4326, pr_3857), markerIcon);
    markers.addMarker(marker);
  };

  const drawStartMaker = () => {
    const markerLayer = new window.Tmap.Layer.Markers();
    map.addLayer(markerLayer);

    const lonlat = new window.Tmap.LonLat(startLon, startLat).transform(pr_4326, pr_3857);
    const size = new window.Tmap.Size(24, 38);
    const offset = new window.Tmap.Pixel(-(size.w / 2), -(size.h));
    const icon = new window.Tmap.Icon('/images/makers/marker_green.png', size, offset);

    const marker = new window.Tmap.Marker(lonlat, icon);
    markerLayer.addMarker(marker);
  };

  const drawLine = (geoData) => {
    const styleMap = new window.Tmap.StyleMap({
      'default': new window.Tmap.Style({
        pointColor: routeColor[Number(geoData.vehicleNo)],
        pointRadius: 5,
        strokeColor: routeColor[Number(geoData.vehicleNo)],
        strokeWidth: 4,
        strokeOpacity: 4,
        strokeLinecap: "square",
        graphicZIndex: 0
      })
    });
    const vectorLayer = new window.Tmap.Layer.Vector("vector", {styleMap: styleMap});
    // vectorLayer.events.register("featuresadded", vectorLayer, null); // 그리기 완료 이벤트 생성
    map.addLayer(vectorLayer);
    if (geoData.jsonData) {
      const geoForm = format.read(geoData.json_map);
      vectorLayer.addFeatures(geoForm);
    }

  };


  if (map && geoDatas.length > 0) {
    format = new window.Tmap.Format.GeoJSON({
      'internalProjection': map.baseLayer.projection,
      'externalProjection': new window.Tmap.Projection("EPSG:3857")
    });

    drawStartMaker();
    for (let i = 0; i < geoDatas.length; i++) {
      drawMarker(geoDatas[i]);
      drawLine(geoDatas[i]);
    }
    // for (let i = 0; i < geoDatas.length; i++) {
    // }

    map.setCenter(new window.Tmap.LonLat(startLon, startLat).transform(pr_4326, pr_3857), 13);
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
