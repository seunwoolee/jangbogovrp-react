import React, {Fragment, useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";
import ListItem from "@material-ui/core/ListItem";
import {makeStyles} from "@material-ui/core/styles";
import {Card, ListItemIcon} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import getThousand from "../../../utils/getThousand";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {getOrderTotalPrice} from "../MapGroupList";
import axios from "../../../utils/my_axios";

const useStyles = makeStyles((theme) => ({
  avatarRoot: {
    width: "auto"
  },
  avatar: {
    width: '26px',
    height: '37px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  firstListItemAvatar: {
    marginRight: theme.spacing(6)
  },
  secondListItemAvatar: {
    marginRight: theme.spacing(1)
  }
}));


function DialogIndex({fetchRoute, open, onClose, geoDatas, maxRouteNumber}) {
  const classes = useStyles();
  const itemArr = [];
  const [newRouteNumber, setNewRouteNumber] = useState(1);

  const handleSubmit = async () => {
    await changeRouteNumber();
    onClose();
    fetchRoute();
  }

  const changeRouteNumber = async () => {
    const config = {headers: {Authorization: `Token ${localStorage.getItem('token')}`}};
    const url = "delivery/routeDManualUpdate/";
    const data = {
      route_m_id: geoDatas[0].route_m,
      to_route_number: newRouteNumber,
      from_route_number: geoDatas[0].route_number,
      current_route_index: geoDatas[0].route_index,
    };
    return await axios.post(url, data, config);
  }

  for (let i = 0; i < maxRouteNumber; i++) {
    itemArr.push(i);
  }

  useEffect(() => {
    if (geoDatas[0]) {
      setNewRouteNumber(geoDatas[0].route_number);
    }
  }, [geoDatas])

  const handleChange = (event) => {
    setNewRouteNumber(event.target.value);
  }

  const getOrderTotalPrice = (orders) => {
    let totalPrice = 0;
    for (let i = 0; i < orders.length; i++) {
      totalPrice += orders[i].price
    }
    return totalPrice;
  }

  return (
    <div>
      <Dialog
        maxWidth={"lg"}
        open={open}
        onClose={onClose}
      >
        <DialogContent>
          {geoDatas.slice(0, 1).map((geodata, index) => (
            <ListItem key={index}>
              <ListItemAvatar className={classes.firstListItemAvatar}>
                <>
                  <ListItemText
                    secondary={`현재 경로`}
                  />
                  <Avatar
                    classes={{root: classes.avatarRoot, img: classes.avatar}}
                    alt={`Avatar n°${geodata.route_index + 2}`}
                    src={`/images/makers/marker_${geodata.route_number}.png`}
                  />
                </>
              </ListItemAvatar>
              <ListItemAvatar className={classes.secondListItemAvatar}>
                <>
                  <ListItemText
                    secondary={`변경될 경로`}
                  />
                  <Avatar
                    classes={{root: classes.avatarRoot, img: classes.avatar}}
                    alt={`Avatar n°${geodata.route_index + 2}`}
                    src={`/images/makers/marker_${newRouteNumber}.png`}
                  />
                </>
              </ListItemAvatar>
              <FormControl className={classes.formControl}>
                <InputLabel>경로</InputLabel>
                <Select
                  value={newRouteNumber}
                  onChange={handleChange}
                >
                  {itemArr.map(i => (
                    <MenuItem key={i} value={i + 1}>{i + 1}번</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>
          ))}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>경로순서</TableCell>
                <TableCell>주문자명</TableCell>
                <TableCell>주소</TableCell>
                <TableCell>금액</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {geoDatas.map((geoData, index) => (
                <Fragment key={index}>
                  <TableRow>
                    <TableCell align="center">{geoData.route_index}</TableCell>
                    <TableCell align="center">{geoData.customer_info.name}</TableCell>
                    <TableCell align="center">{geoData.customer_info.address}</TableCell>
                    <TableCell align="center">{getThousand(getOrderTotalPrice(geoData.orders)) + '원'}</TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="default" variant={"outlined"}>
            닫기
          </Button>
          <Button onClick={handleSubmit} color="secondary" variant={"outlined"}>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

DialogIndex.propTypes = {
  fetchRoute: PropTypes.func,
  open: PropTypes.bool,
  geoDatas: PropTypes.array,
  onClose: PropTypes.func,
  maxRouteNumber: PropTypes.number
};

export default DialogIndex;
