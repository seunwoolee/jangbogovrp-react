import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {useDispatch, useSelector} from "react-redux";
import {createHtmlicon, drawStartMaker} from "../My_Route/MY_Tmap";
import DialogIndex from "./Dialog";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
  },

}));

function MY_Tmap({
  fetchOrderData, orders, map, markers, setMarkers
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [order, setOrder] = React.useState(null);
  const [popups, setPopups] = useState([]);
  const session = useSelector((state) => state.session);
  const _address = {
    0: "9",
    1: "8",
    2: "7",
    3: "6",
    4: "5",
    5: "4",
    6: "3",
    7: "2",
    8: "1",
    9: "0",
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onMakerClicked = (marker, order) => {
    marker.addListener('click', (evt) => {
      setOrder(order);
      handleClickOpen();
    });

    marker.addListener('contextmenu', (evt) => {
      if (!marker.isSelected) {
        const htmlIcon = createHtmlicon(0, 0);
        marker.isSelected = true;
        marker.setIconHTML(htmlIcon);
      } else {
        const htmlIcon = createHtmlicon(marker.courseNumber, marker.orderIndex);
        marker.isSelected = false;
        marker.setIconHTML(htmlIcon);
      }

      // const htmlIcon = createHtmlicon(courseNumber, orderIndex);
      //
      // if (marker._htmlElementBack === undefined || marker._htmlElementBack === null) {
      //   marker._htmlElementBack = marker._htmlElement;
      //   marker.setIconHTML("<div>ddd</div>");
      // } else {
      //   marker.setIconHTML(marker._htmlElementBack);
      //   marker._htmlElementBack = null;
      // }

      // setOrder(order);
      // handleClickOpen();
    });
  };

  const drawMarker = (order, orderIndex, _popups, _duplicateAddress) => {
    let {lat} = order;
    let {lon} = order;
    for (let i = 0; i < _duplicateAddress.length; i++) {
      if (_duplicateAddress[i][0] === order.lat && _duplicateAddress[i][1] === order.lon) {
        lat = lat.substring(0, lat.length - 2);
        lat = lat.concat(_address[lat.slice(-1)]);

        lon = lon.substring(0, lon.length - 2);
        lon = lon.concat(_address[lon.slice(-1)]);
        break;
      }
    }

    if (order.lat !== null) {
      _duplicateAddress.push([order.lat, order.lon]);
    }

    let {courseNumber} = order;
    if (courseNumber === 0 || courseNumber === null) {
      const popup = new window.Tmapv2.InfoWindow({
        position: new window.Tmapv2.LatLng(lat, lon),
        content: "<div style='display: inline-block; width: 20px'>@@</div>",
        type: 1,
        align: window.Tmapv2.InfoWindowOptions.ALIGN_CENTERMIDDLE,
        visible: true,
        map
      });
      _popups.push(popup);
      courseNumber = 999;
    }

    const htmlIcon = createHtmlicon(courseNumber, orderIndex);
    const marker = new window.Tmapv2.Marker({
      iconHTML: htmlIcon,
      iconSize: new window.Tmapv2.Size(26, 38),
      position: new window.Tmapv2.LatLng(lat, lon),
      map
    });

    marker.courseNumber = courseNumber;
    marker.orderIndex = orderIndex;
    marker.isSelected = false;
    onMakerClicked(marker, order);

    return marker;
  };

  useEffect(() => {
    if (map && orders.length > 0) {
      markers.map(marker => marker.setMap(null));
      popups.map(popup => popup.setMap(null));

      const _markers = [];
      const _popups = [];
      const _duplicateAddress = [0.0, 0.0];
      drawStartMaker(map, session.user.latitude, session.user.longitude);

      for (let i = 0; i < orders.length; i++) {
        _markers.push(drawMarker(orders[i], i + 1, _popups, _duplicateAddress));
      }

      setMarkers(_markers);
      setPopups(_popups);
    }
  }, [orders]);

  return (
    <>
      <div className={classes.root} id="myTmap" />
      {order !== null ? (
        <DialogIndex
          fetchOrderData={fetchOrderData}
          onClose={handleClose}
          open={open}
          order={order}
          geoDatas={[]}
          maxRouteNumber={25}
        /> // TODO 하드코딩
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
