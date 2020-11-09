import React, {Fragment, useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from "prop-types";
import ListItem from "@material-ui/core/ListItem";
import {makeStyles} from "@material-ui/core/styles";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from "@material-ui/core/FormControl";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import axios from "../../../utils/my_axios";
import getThousand from "../../../utils/getThousand";

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: "auto!important",
    right: "auto!important",
  },
  backdrop: {
    opacity: "0.2!important"
  },
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
  },
  removeButton: {
    color: 'red',
    borderColor: 'red'
  },
}));

function DialogIndex({fetchRoute, open, onClose, geoDatas, maxRouteNumber}) {
  const classes = useStyles();
  const [newRouteNumber, setNewRouteNumber] = useState(1);
  const [routeNumbers, setRouteNumbers] = useState([]);
  const [add, setAdd] = useState(0);

  const handleSubmit = async () => {
    try {
      await changeRouteNumber();
    } catch (e) {
      alert('현재 경로와 변경될 경로가 같습니다');
    }
    onClose();
    fetchRoute();
  };

  const handleRemove = async () => {
    const url = "delivery/delete_routeD/";
    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      data: {routeD: geoDatas[0].id}
    };

    await axios.delete(url, config);
    onClose();
    fetchRoute();
  };

  const changeRouteNumber = async () => {
    const config = {headers: {Authorization: `Token ${localStorage.getItem('token')}`}};
    const url = "delivery/routeDManualUpdate/";
    const route = geoDatas.find(geoData => geoData.route_number !== newRouteNumber);
    const data = {
      route_m_id: route.route_m,
      to_route_number: newRouteNumber,
      from_route_number: route.route_number,
      current_route_index: route.route_index,
      is_duplicated: geoDatas.length > 1,
    };
    // eslint-disable-next-line no-return-await
    return await axios.post(url, data, config);
  };

  useEffect(() => {
    if (geoDatas[0]) {
      setNewRouteNumber(geoDatas[0].route_number);
    }

    const _routeNumbers = [];
    for (let i = 0; i < maxRouteNumber + add; i++) {
      _routeNumbers.push(i);
    }

    setRouteNumbers(_routeNumbers);
  }, [geoDatas, add]);

  useEffect(() => () => setAdd(0), [open]);

  const handleChange = (event) => {
    setNewRouteNumber(Number(event.target.value));
  };

  const tableRows = (geoData) => {
    const content = [];

    if (geoData.orders.length === 0) {
      content.push((
        <TableRow>
          <TableCell align="center">{geoData.route_number}</TableCell>
          <TableCell align="center">{geoData.route_index}</TableCell>
          <TableCell align="center">{geoData.customer_info.name}</TableCell>
          <TableCell align="center">{geoData.customer_info.address}</TableCell>
          <TableCell align="center">0원</TableCell>
        </TableRow>
      ));

      return content;
    }

    for (let i = 0; i < geoData.orders.length; i++) {
      content.push((
        <TableRow key={geoData.orders[i].id}>
          <TableCell align="center">{geoData.route_number}</TableCell>
          <TableCell align="center">{geoData.route_index}</TableCell>
          <TableCell align="center">{geoData.customer_info.name}</TableCell>
          <TableCell align="center">{geoData.customer_info.address}</TableCell>
          <TableCell align="center">{`${getThousand(geoData.orders[i].price)}원`}</TableCell>
        </TableRow>
      ));
    }
    return content;
  };

  return (
    <div>
      <Dialog
        BackdropProps={{className: classes.backdrop}}
        className={classes.root}
        maxWidth="lg"
        open={open}
        onClose={onClose}
      >
        <DialogContent>
          {geoDatas.slice(0, 1).map((geodata, index) => (
            <ListItem key={index}>
              <ListItemAvatar className={classes.firstListItemAvatar}>
                <>
                  <ListItemText
                    secondary="현재 경로"
                  />
                  <Avatar
                    classes={{root: classes.avatarRoot, img: classes.avatar}}
                    alt={`Avatar n°${geodata.route_index + 2}`}
                    src={`/images/makers/marker_${geodata.route_number}.png`}
                  />
                </>
              </ListItemAvatar>
              <FormControl className={classes.formControl}>
                <FormLabel component="legend">변경될 경로</FormLabel>
                <RadioGroup row value={newRouteNumber} onChange={handleChange}>
                  {routeNumbers.map(i => (
                    <FormControlLabel
                      key={i + 1}
                      value={i + 1}
                      control={<Radio/>}
                      label={(
                        <Avatar
                          classes={{img: classes.avatar}}
                          src={`/images/makers/marker_${i + 1}.png`}
                        />
                      )}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </ListItem>
          ))}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">코스번호</TableCell>
                <TableCell align="center">경로순서</TableCell>
                <TableCell align="center">주문자명</TableCell>
                <TableCell align="center">주소</TableCell>
                <TableCell align="center">금액</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {geoDatas.map((geoData, index) => (
                <Fragment key={index}>
                  {tableRows(geoData).map(content => content)}
                </Fragment>
              ))}
            </TableBody>
          </Table>

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="default" variant="outlined">
            닫기
          </Button>
          <Button onClick={handleSubmit} color="secondary" variant="outlined">
            확인
          </Button>
          <Button className={classes.removeButton} onClick={handleRemove} variant="outlined">
            삭제
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
