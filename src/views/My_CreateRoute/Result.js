import React, {Fragment} from 'react';
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


export default function Result({mapGroups, map}) {
  const classes = useStyles();

  const moveTo = (lon, lat) => {
    map.setCenter(new window.Tmap.LonLat(lon, lat).transform(pr_4326, pr_3857), 16);
  }

  const printRoute = () => {
    window.open(
      `/reportPrint?documentId=${document.id}`,
      "_blank",
      "width=700,height=700"
    );
  };

  return (
    <Paper>
      <CardHeader
        title={`총 대수 4대`}
        action={
          <>
            <Button size={"small"} variant={"contained"} color={"primary"} onClick={printRoute}>인쇄</Button>
            <Button size={"small"} variant={"contained"} color={"secondary"}>전체선택 해제</Button>
            <Button size={"small"} variant={"contained"}>경로선 제거</Button>
          </>}/>
      <MapGroupList mapGroups={mapGroups}/>
    </Paper>
  );
}

Result.propTypes = {
  mapGroups: PropTypes.array,
  map: PropTypes.object,
};
