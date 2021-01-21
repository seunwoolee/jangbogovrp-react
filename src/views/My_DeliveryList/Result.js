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
import Tooltip from "@material-ui/core/Tooltip";
import {NavLink as RouterLink} from "react-router-dom";
import getThousand from "../../utils/getThousand";

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
  }
});


export default function Result({deliveries}) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" className={classes.boldTableCell}>날짜</TableCell>
            <TableCell align="center" className={classes.boldTableCell}>오전/오후</TableCell>
            <TableCell align="center" className={classes.boldTableCell}>배송 지점 수</TableCell>
            <TableCell align="center" className={classes.boldTableCell}>총 가격</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveries.map((delivery) => (
            <Fragment key={delivery.id}>
              <Tooltip title="경로보기">
              <TableRow component={RouterLink} to={"/route/" + delivery.id} className={classes.tableRows} hover>
                <TableCell align="center">{delivery.date}</TableCell>
                <TableCell align="center">{delivery.is_am ? '오전' : '오후'}</TableCell>
                <TableCell align="center">{delivery.count_location}</TableCell>
                <TableCell align="center">{getThousand(delivery.price)}원</TableCell>
              </TableRow>
              </Tooltip>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

Result.propTypes = {
  deliveries: PropTypes.array
};
