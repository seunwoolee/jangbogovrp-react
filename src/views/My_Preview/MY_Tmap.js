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
  fetchOrderData, orders, map, markers, setMarkers, selectedMarkers, setSelectedMarkers
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [order, setOrder] = React.useState(null);
  const [popups, setPopups] = useState([]);
  const session = useSelector((state) => state.session);
  const _address = {
    0: "99",
    1: "33",
    2: "44",
    3: "55",
    4: "66",
    5: "77",
    6: "88",
    7: "22",
    8: "11",
    9: "33",
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

    if (order.done === 1) {
      return;
    }

    marker.addListener('contextmenu', (evt) => {
      if (!marker.isSelected) {
        const htmlIcon = createHtmlicon(0, '★');
        marker.isSelected = true;
        marker.setIconHTML(htmlIcon);
        setSelectedMarkers(prevState => [...prevState, marker]);
      } else {
        const htmlIcon = createHtmlicon(marker.courseNumber, marker.orderIndex);
        marker.isSelected = false;
        marker.setIconHTML(htmlIcon);
        setSelectedMarkers(prevState => prevState.filter(currentMarker => currentMarker.orderIndex !== marker.orderIndex));
      }
    });
  };

  const drawMarker = (order, orderIndex, _popups, _duplicateAddress) => {
    const {lat} = order;
    let {lon} = order;

    const duplicateAddresses = _duplicateAddress.filter(address => address[0] === order.lat && address[1] === order.lon);

    for (let i = 0; i < duplicateAddresses.length; i++) {
      const duplicateAddress = duplicateAddresses[i];
      let lastLon = duplicateAddress[1].substr(duplicateAddress[1].length - 2, 1);

      if (i >= 1) {
        lastLon = lon.substr(lon.length - 2, 1);
      }

      lon = lon.substring(0, lon.length - 2);
      lon = lon.concat(_address[lastLon]);
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

    let htmlIcon = createHtmlicon(courseNumber, orderIndex);
    if (order.done === 1) {
      htmlIcon = createHtmlicon(0, orderIndex);
    }

    const marker = new window.Tmapv2.Marker({
      iconHTML: htmlIcon,
      iconSize: new window.Tmapv2.Size(26, 38),
      position: new window.Tmapv2.LatLng(lat, lon),
      map
    });

    marker.courseNumber = courseNumber;
    marker.orderIndex = orderIndex;
    marker.isSelected = false;
    marker.orderNumber = order.orderNumber;
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
  selectedMarkers: PropTypes.array,
  map: PropTypes.object,
  setMarkers: PropTypes.func,
  setSelectedMarkers: PropTypes.func,
};

export default MY_Tmap;
