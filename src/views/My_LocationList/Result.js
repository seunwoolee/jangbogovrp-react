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

export default function Result({locations}) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" className={classes.boldTableCell}>로케이션</TableCell>
            <TableCell align="center" className={classes.boldTableCell}>바코드</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {locations.map((delivery) => (
            <Fragment key={delivery.로케이션}>
              <TableRow className={classes.tableRows} hover>
                <TableCell align="center">{delivery.로케이션}</TableCell>
                <TableCell align="center">바코드예정</TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

Result.propTypes = {
  locations: PropTypes.array
};
