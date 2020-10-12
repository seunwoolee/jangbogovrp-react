import React, {Fragment, useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";
import MY_Tmap, {pr_3857, pr_4326} from "../../components/MY_Tmap";
import MapGroupList from "./MapGroupList";
import {Button, Card, CardHeader, ListItemIcon} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles({
  root: {
    overflow: 'scroll',
    maxHeight: '750px'
  },
  tableRows: {
    cursor: "pointer"
  },
});


export default function Result({mapGroups, groupLines, groupMarkers, map}) {
  const classes = useStyles();
  const [lineVisible, setLineVisible] = useState(true);
  const [allVisible, setAllVisible] = useState(true);
  const [checked, setChecked] = useState([1]);

  const moveTo = (lon, lat) => {
    map.setCenter(new window.Tmapv2.LatLng(lat, lon));
    map.setZoom(17);
    setTimeout(() => map.zoomOut(), 200);
  }

  const setInvisibleAll = () => {
    for (let i = 0; i < groupLines.length; i++) {
      groupLines[i].setVisible(false);
      for (let j = 0; j < groupMarkers[i].length; j++) {
        groupMarkers[i][j].setVisible(false);
      }
    }
  }

  const setVisibleAll = () => {
    for (let i = 0; i < groupLines.length; i++) {
      groupLines[i].setVisible(true);
      for (let j = 0; j < groupMarkers[i].length; j++) {
        groupMarkers[i][j].setVisible(true);
      }
    }
  }

  const toggleVisibleAll = () => {
    allVisible ? setChecked([]) : setChecked(createChecked());
    setAllVisible((prev) => !prev);
  }

  const toggleInvisibleLine = () => {
    for (let i = 0; i < checked.length; i++) {
      lineVisible ? groupLines[checked[i]].setVisible(false) : groupLines[checked[i]].setVisible(true);
    }
    setLineVisible((prev) => !prev);
  }

  const drawSelected = () => {
    setInvisibleAll();
    for (let i = 0; i < checked.length; i++) {
      groupLines[checked[i]].setVisible(true);
      for (let j = 0; j < groupMarkers[checked[i]].length; j++) {
        groupMarkers[checked[i]][j].setVisible(true);
      }
    }
  }

  const createChecked = () => {
    const temp = [];
    for (let i = 0; i < mapGroups.length; i++) {
      temp.push(i);
    }
    return temp;
  }

  useEffect(() => {
    setChecked(createChecked());
  }, []);

  useEffect(() => {
    drawSelected();
  }, [checked]);

  return (
    <Paper className={classes.root}>
      <CardHeader
        title={`총 대수 4대`}
        action={
          <>
            <Button size={"small"} variant={"contained"} color={allVisible ? "default" : "secondary"}
                    onClick={toggleVisibleAll}>
              {allVisible ? '전체선택 해제' : '전체선택'}
            </Button>
            <Button size={"small"} variant={"contained"} color={lineVisible ? "default" : "secondary"}
                    onClick={toggleInvisibleLine}>
              {lineVisible ? '경로선 제거' : '경로선 표시'}
            </Button>
          </>}/>
      <MapGroupList mapGroups={mapGroups} checked={checked} setChecked={setChecked} moveTo={moveTo}/>
    </Paper>
  );
}

Result.propTypes = {
  mapGroups: PropTypes.array,
  groupMarkers: PropTypes.array,
  groupLines: PropTypes.array,
  map: PropTypes.object,
};
