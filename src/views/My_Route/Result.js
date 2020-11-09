import React, {Fragment, useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";
import {
  Button, Card, CardHeader, ListItemIcon
} from "@material-ui/core";
// eslint-disable-next-line import/no-cycle
import MapGroupList from "./MapGroupList";
import CustomerAddDialog from "./Dialog/customerAddDialog";

const useStyles = makeStyles({
  root: {
    overflow: 'scroll',
    maxHeight: '750px'
  },
  tableRows: {
    cursor: "pointer"
  },

});

export default function Result({
  fetchRoute, mapGroups, groupLines, groupMarkers, map
}) {
  const classes = useStyles();
  const [lineVisible, setLineVisible] = useState(true);
  const [allVisible, setAllVisible] = useState(true);
  const [checked, setChecked] = useState([1]);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  }

  const moveTo = (lon, lat) => {
    map.setCenter(new window.Tmapv2.LatLng(lat, lon));
    map.setZoom(17);
    setTimeout(() => map.zoomOut(), 200);
  };

  const setInvisibleAll = () => {
    for (let i = 0; i < groupLines.length; i++) {
      for (let j = 0; j < groupMarkers[i].length; j++) {
        groupMarkers[i][j].setVisible(false);
      }
      for (let j = 0; j < groupLines[i].length; j++) {
        groupLines[i][j].setVisible(false);
      }
    }
  };

  const toggleVisibleAll = () => {
    // eslint-disable-next-line no-use-before-define
    allVisible ? setChecked([]) : setChecked(createChecked());
    setAllVisible((prev) => !prev);
  };

  const toggleInvisibleLine = () => {
    for (let i = 0; i < checked.length; i++) {
      for (let j = 0; j < groupLines[i].length; j++) {
        lineVisible ? groupLines[checked[i]][j].setVisible(false) : groupLines[checked[i]][j].setVisible(true);
      }
    }
    setLineVisible((prev) => !prev);
  };

  const drawSelected = () => {
    setInvisibleAll();
    for (let i = 0; i < checked.length; i++) {
      for (let j = 0; j < groupMarkers[checked[i]].length; j++) {
        groupMarkers[checked[i]][j].setVisible(true);
      }

      for (let j = 0; j < groupLines[checked[i]].length; j++) {
        groupLines[checked[i]][j].setVisible(true);
      }
    }
  };

  const createChecked = () => {
    const temp = [];
    for (let i = 0; i < mapGroups.length; i++) {
      temp.push(i);
    }
    return temp;
  };

  useEffect(() => {
    setChecked(createChecked());
  }, []);

  useEffect(() => {
    drawSelected();
  }, [checked]);

  const printRoute = () => {
    let routeM = 0;
    for (let i = 0; i < mapGroups.length; i++) {
      if (mapGroups[i][0]) {
        routeM = mapGroups[i][0].route_m;
        break;
      }
    }

    window.open(
      `/printRoute?routeM=${routeM}`,
      "_blank",
      "width=700,height=700"
    );
  };


  return (
    <Paper className={classes.root}>
      <CardHeader
        // title={`배차 내역`}
        action={(
          <>
            <Button size="small" variant="outlined" color="primary" onClick={() => setOpen(true)}>고객추가</Button>
            <Button size="small" variant="contained" color="primary" onClick={printRoute}>인쇄</Button>
            <Button
              size="small"
              variant="contained"
              color={allVisible ? "default" : "secondary"}
              onClick={toggleVisibleAll}
            >
              {allVisible ? '전체선택 해제' : '전체선택'}
            </Button>
            <Button
              size="small"
              variant="contained"
              color={lineVisible ? "default" : "secondary"}
              onClick={toggleInvisibleLine}
            >
              {lineVisible ? '경로선 제거' : '경로선 표시'}
            </Button>
          </>
        )}
      />
      <MapGroupList
        reDraw={fetchRoute}
        mapGroups={mapGroups}
        checked={checked}
        setChecked={setChecked}
        moveTo={moveTo}
      />

      <CustomerAddDialog
        open={open}
        onClose={handleClose}
        fetchRoute={fetchRoute}
        routeM={mapGroups.find(mapGroup => mapGroup.length > 0)[0].route_m} />
    </Paper>
  );
}

Result.propTypes = {
  fetchRoute: PropTypes.func,
  mapGroups: PropTypes.array,
  groupMarkers: PropTypes.array,
  groupLines: PropTypes.array,
  map: PropTypes.object,
};
