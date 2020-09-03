import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    maxHeight: '100%'
  },
  table: {
    minWidth: 650,
  },
  inner: {
    padding: theme.spacing(2)
  }
}));


function SignListTable({signLists, className}) {
  const classes = useStyles();

  const getSignType = (type) => {
    if(type === "0") {
      return "결재"
    } else if(type ==='1') {
      return "합의"
    } else {
      return "수신참조"
    }
  }

  return (
    <div
      className={clsx(classes.root, className)}
    >
      <PerfectScrollbar>
        <div className={classes.inner}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{fontWeight: 600, backgroundColor: '#e0e0e0'}} align="center">순서</TableCell>
                  <TableCell style={{fontWeight: 600, backgroundColor: '#e0e0e0'}} align="center">결재종류</TableCell>
                  <TableCell style={{fontWeight: 600, backgroundColor: '#e0e0e0'}} align="center">부서</TableCell>
                  <TableCell style={{fontWeight: 600, backgroundColor: '#e0e0e0'}} align="center">직책</TableCell>
                  <TableCell style={{fontWeight: 600, backgroundColor: '#e0e0e0'}} align="center">이름</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {signLists.map((signList) => (
                  <TableRow key={signList.id}>
                    <TableCell align="center" component="th" scope="row">
                      {signList.order+1}
                    </TableCell>
                    <TableCell align="center">{getSignType(signList.type)}</TableCell>
                    <TableCell align="center">{signList.department}</TableCell>
                    <TableCell align="center">{signList.position}</TableCell>
                    <TableCell align="center">{signList.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </PerfectScrollbar>
    </div>
  );
}

SignListTable.propTypes = {
  className: PropTypes.string,
  signLists: PropTypes.array.isRequired
};

export default SignListTable;
