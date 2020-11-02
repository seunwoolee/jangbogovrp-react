import React, {Fragment, useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import axios from "../../../../utils/my_axios";
import getThousand from "../../../../utils/getThousand";

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: '100%',
    overflow: 'scroll',
    maxWidth: '100%'
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


function OrdersDialog({open, onClose, selectedOrders}) {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    async function fetchData() {
      const url = "customer/get_orders/";
      const orderIds = selectedOrders.map(order => order.order_id);
      const date = selectedOrders[0].date;
      let params = {order_ids: orderIds, date: date};
      const config = {
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
        params: params
      };

      const response = await axios.get(url, config);
      return response.data;
    }

    fetchData().then(orders => setOrders(orders));
  }, [])

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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">이름</TableCell>
                <TableCell align="center">제품명</TableCell>
                <TableCell align="center">가격</TableCell>
                <TableCell align="center">수량</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{order.name}</TableCell>
                  <TableCell align="center">{order.productName}</TableCell>
                  <TableCell align="center">{getThousand(order.price)}원</TableCell>
                  <TableCell align="center">{getThousand(order.count)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="default" variant={"outlined"}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

OrdersDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  selectedOrders: PropTypes.array
};

export default OrdersDialog;
