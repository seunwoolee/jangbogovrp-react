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

const useStyles = makeStyles({
  root: {
    overflow: 'scroll',
    maxHeight: '750px'
  },
  tableRows: {
    cursor: "pointer"
  },
});


export default function CustomerTable({orders, map}) {
  const classes = useStyles();

  const moveTo = (lon, lat) => {
        map.setCenter(new window.Tmap.LonLat(lon, lat).transform(pr_4326, pr_3857), 16);
  }


  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">번호</TableCell>
            <TableCell align="center">주문번호</TableCell>
            <TableCell align="center">주소</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <Fragment key={order.id}>
              <TableRow>
                <TableCell colSpan={3}>
                  고객명 : {order.name}
                </TableCell>
              </TableRow>

              <TableRow className={classes.tableRows} hover onClick={() => moveTo(order.lon, order.lat)}>
                <TableCell align="center">
                  {order.id}
                </TableCell>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.address}</TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CustomerTable.propTypes = {
  orders: PropTypes.array,
  map: PropTypes.object,
};
