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
import getThousand from "../../../utils/getThousand";
import FormControl from "@material-ui/core/FormControl";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import axios from "../../../utils/my_axios";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

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
  }
}));


function DialogIndex({fetchOrderData, open, onClose, order, geoDatas, maxRouteNumber}) {
  const classes = useStyles();
  const [newCourseNumber, setNewCourseNumber] = useState(1);
  const [courseNumbers, setCourseNumbers] = useState([]);
  const [add, setAdd] = useState(0);

  const handleSubmit = async () => {
    await changeCourseNumber();
    onClose();
    fetchOrderData();
  }

  const changeCourseNumber = async () => {
    const config = {headers: {Authorization: `Token ${localStorage.getItem('token')}`}};
    const url = "customer/update_course_number/";
    const data = {
      guest_id: order.guestId,
      to_course_number: newCourseNumber,
    };
    return await axios.patch(url, data, config)

  }

  useEffect(()=> {
    const _routeNumbers = []
    for (let i = 0; i < maxRouteNumber + add; i++) {
      _routeNumbers.push(i);
    }

    setCourseNumbers(_routeNumbers);
  }, [])

  const handleChange = (event) => {
    setNewCourseNumber(Number(event.target.value));
  }

  return (
    <div>
      <Dialog
        BackdropProps={{className: classes.backdrop}}
        className={classes.root}
        maxWidth={"lg"}
        open={open}
        onClose={onClose}
      >
        <DialogContent>
            <ListItem>
              <ListItemAvatar className={classes.firstListItemAvatar}>
                <>
                  <ListItemText
                    secondary={`현재 경로`}
                  />
                  <Avatar
                    classes={{root: classes.avatarRoot, img: classes.avatar}}
                    alt={`Avatar n°${order.courseNumber}`}
                    src={`/images/makers/marker_${order.courseNumber}.png`}
                  />
                </>
              </ListItemAvatar>
              <FormControl className={classes.formControl}>
                <FormLabel component="legend">변경될 경로</FormLabel>
                <RadioGroup row value={newCourseNumber} onChange={handleChange}>
                  {courseNumbers.map(i => (
                    <FormControlLabel
                      key={i + 1}
                      value={i + 1}
                      control={<Radio/>}
                      label={
                        <Avatar classes={{img: classes.avatar}}
                                src={`/images/makers/marker_${i + 1}.png`}/>}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </ListItem>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">코스번호</TableCell>
                <TableCell align="center">주문자명</TableCell>
                <TableCell align="center">주소</TableCell>
                <TableCell align="center">금액</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">{order.courseNumber}</TableCell>
                <TableCell align="center">{order.name}</TableCell>
                <TableCell align="center">{order.address}</TableCell>
                <TableCell align="center">{getThousand(order.pay)}</TableCell>
              </TableRow>
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
  fetchOrderData: PropTypes.func,
  open: PropTypes.bool,
  geoDatas: PropTypes.array,
  order: PropTypes.object,
  onClose: PropTypes.func,
  maxRouteNumber: PropTypes.number
};

export default DialogIndex;
