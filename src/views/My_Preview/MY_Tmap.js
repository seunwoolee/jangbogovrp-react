import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {createHtmlicon, drawStartMaker} from "../My_Route/MY_Tmap";
import DialogIndex from "./Dialog";

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

function MY_Tmap({fetchOrderData, orders, map, markers, setMarkers}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [order, setOrder] = React.useState(null);
  const [popups, setPopups] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onMakerClicked = (marker, order) => {
    marker.addListener('click', function (evt) {
      setOrder(order);
      handleClickOpen();
    });
  }
  const drawMarker = (order, orderIndex, _popups) => {
    let courseNumber = order.courseNumber;

    if (courseNumber === 0 || courseNumber === null) {
      const popup = new window.Tmapv2.InfoWindow({
        position: new window.Tmapv2.LatLng(order.lat, order.lon),
        content: "<div style='display: inline-block; width: 20px'>@@</div>",
        type: 1,
        align: window.Tmapv2.InfoWindowOptions.ALIGN_CENTERMIDDLE,
        visible: true,
        map: map
      });
      _popups.push(popup);
      courseNumber = 999;
    }

    const htmlIcon = createHtmlicon(courseNumber, orderIndex);
    const marker = new window.Tmapv2.Marker({
      iconHTML: htmlIcon,
      iconSize: new window.Tmapv2.Size(26, 38),
      position: new window.Tmapv2.LatLng(order.lat, order.lon),
      map: map
    });

    onMakerClicked(marker, order);

    return marker;
  };

  useEffect(() => {
    if (map && orders.length > 0) {
      markers.map(marker => marker.setMap(null));
      popups.map(popup => popup.setMap(null));

      const _markers = [];
      const _popups = [];

      drawStartMaker(map, startLat, startLon);

      for (let i = 0; i < orders.length; i++) {
        _markers.push(drawMarker(orders[i], i + 1, _popups));
      }

      setMarkers(_markers);
      setPopups(_popups);

    }

  }, [orders])

  return (
    <>
    <div className={classes.root} id="myTmap"/>
      {order !== null ? (
      <DialogIndex fetchOrderData={fetchOrderData} onClose={handleClose} open={open} order={order} geoDatas={[]}
                   maxRouteNumber={Math.max(...orders.map(order => order.courseNumber))}/>
      ) : null}
    </>
  );
}

MY_Tmap.propTypes = {
  fetchOrderData: PropTypes.func,
  orders: PropTypes.array,
  markers: PropTypes.array,
  map: PropTypes.object,
  setMarkers: PropTypes.func,
};

export default MY_Tmap;
