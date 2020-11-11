import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from "prop-types";
import Result from "./Result";
import {Button, Card, CardHeader, colors, ListItemIcon} from "@material-ui/core";
import getThousand from "../../utils/getThousand";
import TableCell from "@material-ui/core/TableCell";
import Index from "./Modal";
import {create_routeOrder} from "../My_Preview/Modal";
import LoadingBar from "../../components/MY_LoadingBar";
import Page from "../../components/Page";
import {useDispatch, useSelector} from "react-redux";
import {isloading} from "../../actions";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  avatarRoot: {
    width: "auto"
  },
  avatar: {
    width: '26px',
    height: '37px',
  },
  textSecondary: {
    cursor: "pointer",
    fontWeight: 650,
    fontSize: '15px',
  },
}));


export default function MapGroupList({reDraw, mapGroups, checked, setChecked, moveTo}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [detailIndex, setDetailIndex] = useState(0);
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session);

  const handleRedraw = async (routeM, routeNumber) => {
    if (window.confirm('경로를 다시 그리겠습니까?')) {
      dispatch(isloading(true));
      await create_routeOrder(routeM, routeNumber, Number(session.user.latitude), Number(session.user.longitude));
      dispatch(isloading(false));
      return reDraw();
    }
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleOpen = (index: number) => {
    setOpen(true);
    setDetailIndex(index);
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const getOrderTotalPrice = (mapGroup) => {
    let totalPrice = 0;
    for (let i = 0; i < mapGroup.length; i++) {
      for (let j = 0; j < mapGroup[i].orders.length; j++) {
        totalPrice += mapGroup[i].orders[j].price;
      }
    }
    return totalPrice;
  }

  const getTotalDistance = (mapGroup) => {
    let totalDistance = 0;
    for (let i = 0; i < mapGroup.length; i++) {
      totalDistance += mapGroup[i].distance;
    }
    return totalDistance;
  }


  return (
    <List dense className={classes.root}>

      <LoadingBar/>

      {mapGroups.filter(mapGroup => mapGroup.length > 0).map((mapGroup, index) => {
        const labelId = `checkbox-list-secondary-label-${index}`;
        return (
          <Card key={index}>
            <CardHeader
              title={`${mapGroup[0].route_number}번 ${mapGroup[0].driver ? mapGroup[0].driver.name : ''}`}
              action={
                <Button size={"small"}
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => handleRedraw(mapGroup[0].route_m, mapGroup[0].route_number)}>
                  경로 그리기
                </Button>}>
            </CardHeader>

            <ListItem>
              <ListItemIcon>
                <Checkbox
                  edge="end"
                  onChange={handleToggle(mapGroup[0].route_number - 1)}
                  checked={checked.indexOf(mapGroup[0].route_number - 1) !== -1}
                  inputProps={{'aria-labelledby': labelId}}
                />
              </ListItemIcon>
              <ListItemAvatar>
                <Avatar
                  classes={{root: classes.avatarRoot, img: classes.avatar}}
                  alt={`Avatar n°${mapGroup[0].route_number}`}
                  src={`/images/makers/marker_${mapGroup[0].route_number}.png`}
                />
              </ListItemAvatar>
              <ListItemText onClick={() => handleOpen(mapGroup[0].route_number - 1)} classes={{secondary: classes.textSecondary}}
                            primary={`운행거리`}
                            secondary={(getTotalDistance(mapGroup) / 1000).toFixed(1) + 'km'}/>
              <ListItemText onClick={() => handleOpen(mapGroup[0].route_number - 1)} classes={{secondary: classes.textSecondary}}
                            primary={`배송건수`}
                            secondary={mapGroup.length + '건'}/>
              <ListItemText onClick={() => handleOpen(mapGroup[0].route_number - 1)} classes={{secondary: classes.textSecondary}}
                            primary={`배송금액`}
                            secondary={getThousand(getOrderTotalPrice(mapGroup)) + '원'}/>
            </ListItem>
          </Card>
        );
      })}

      {mapGroups.length > 0 ?
        <Index open={open} onClose={handleClose} mapGroup={mapGroups[detailIndex]} reDraw={reDraw}/> : null}
    </List>
  );
}

MapGroupList.propTypes = {
  reDraw: PropTypes.func,
  mapGroups: PropTypes.array,
  checked: PropTypes.array,
  setChecked: PropTypes.func,
  moveTo: PropTypes.func
};
