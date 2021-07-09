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
import Tooltip from "@material-ui/core/Tooltip";
import {NavLink as RouterLink} from "react-router-dom";
import Button from "@material-ui/core/Button";
import getThousand from "../../utils/getThousand";
import MY_Tmap, {pr_3857, pr_4326} from "../../components/MY_Tmap";
import axios from "../../utils/my_axios";

const useStyles = makeStyles({
  root: {
    overflow: 'scroll',
    maxHeight: '750px'
  },
  tableRows: {
    cursor: "pointer"
  },
  boldTableCell: {
    fontWeight: 650
  },
  removeButton: {
    color: 'red',
    borderColor: 'red'
  },

});

export default function Result({deliveries, fetchOrderData}) {
  const classes = useStyles();
  const handleRemove = async (routeM) => {
    // eslint-disable-next-line no-restricted-globals,no-alert
    if (confirm("삭제 하시겠습니까?")) {
      const url = "delivery/delete_routeM/";
      const config = {
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
        data: {routeM}
      };

      await axios.delete(url, config);
      fetchOrderData();
    }
  };

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" className={classes.boldTableCell}>날짜</TableCell>
            <TableCell align="center" className={classes.boldTableCell}>오전/오후</TableCell>
            <TableCell align="center" className={classes.boldTableCell}>배송 지점 수</TableCell>
            <TableCell align="center" className={classes.boldTableCell}>총 가격</TableCell>
            <TableCell align="center" className={classes.boldTableCell}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveries.map((delivery) => (
            <Fragment key={delivery.id}>
              <TableRow className={classes.tableRows} hover>
                <TableCell
                  component={RouterLink}
                  to={`/route/${delivery.id}`}
                  align="center"
                >
                  {delivery.date}
                </TableCell>
                <TableCell component={RouterLink} to={`/route/${delivery.id}`} align="center">
                  {delivery.is_am ? '오전' : '오후'}
                  {' '}
                  {delivery.partial_seq > 0 ? delivery.partial_seq : ''}
                </TableCell>
                <TableCell component={RouterLink} to={`/route/${delivery.id}`} align="center">
                  {delivery.count_location}
                </TableCell>
                <TableCell component={RouterLink} to={`/route/${delivery.id}`} align="center">
                  {getThousand(delivery.price)}
                  원
                </TableCell>
                <TableCell align="center">
                  <Button className={classes.removeButton} onClick={() => handleRemove(delivery.id)} variant="outlined">
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

Result.propTypes = {
  deliveries: PropTypes.array,
  fetchOrderData: PropTypes.func
};
