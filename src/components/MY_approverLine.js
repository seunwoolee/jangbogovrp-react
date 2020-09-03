import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import PropTypes from "prop-types";
import {documents} from "../mock/my_documentsMock";
import {signs} from "../mock/my_signsMock";
import Box from "@material-ui/core/Box";
import * as uuid from "uuid";


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.2)
  },
  header: {
    backgroundColor: '#eeeeee'
  },
  rejectedDateCell: {
    textDecoration: 'line-through',
    color: 'red'
  },
  gridCell: {
    fontWeight: 600,
    fontSize: '11px',
    width: '110px',
    borderBottom: '1px solid #a9a9a9',
    borderRight: '1px solid #a9a9a9',
  },
  gridCellBlank: {
    backgroundColor: 'white'
  },
  gridCellLeft: {
    borderLeft: '1px solid #a9a9a9'
  },
  gridCellTop: {
    borderTop: '1px solid #a9a9a9'
  },
  gridDateCell: {
    fontWeight: 600,
    fontSize: '7px',
    width: '110px',
    borderBottom: '1px solid #a9a9a9',
    borderRight: '1px solid #a9a9a9'
  },
  muiTableCell: {
    width: 'auto',
    '& .MuiTableCell-sizeSmall:last-child': {
      paddingRight: theme.spacing(0.2)
    }
  },
}));


export default function ApproverTable({signs}) {
  const classes = useStyles();

  const displayApproveType = (type: string) => {
    if (type === "0") {
      return "결재";
    }
    if (type === "1") {
      return "합의";
    }
  };

  const approvalRenderBlank = () => {
    return (
        <TableCell key={uuid()} className={clsx(classes.gridCell, classes.gridCellBlank, classes.gridCellTop, classes.gridCellLeft, classes.root)}><br /></TableCell>
    )
  };

  const agreementRenderBlank = () => {
    return (
        <TableCell key={uuid()} className={clsx(classes.gridCell, classes.gridCellBlank, classes.gridCellLeft, classes.root)}><br /></TableCell>
    )
  };

  const MINIMUMCELL = 5;
  const approvalUsers = signs.filter(sign => sign.type === "0")
  const agreementUsers = signs.filter(sign => sign.type === "1")

  let approvalUsersBlank = [];
  if(approvalUsers.length < MINIMUMCELL){
    for(let i=0; i < (MINIMUMCELL - approvalUsers.length); i++){
      approvalUsersBlank.push(i);
    }
  }

  let agreementUsersBlank = [];
  if(agreementUsers.length > 0 && agreementUsers.length < MINIMUMCELL){
    for(let i=0; i < (MINIMUMCELL - agreementUsers.length); i++){
      agreementUsersBlank.push(i);
    }
  }

  return (
    <>
      <Box display="flex" flexDirection="row-reverse">
        <Table size="small" aria-label="a dense table" className={classes.muiTableCell}>
          <TableHead className={classes.header}>
            <TableRow>
              {approvalUsersBlank.map( _ => approvalRenderBlank())}
              {approvalUsers.map(sign => (
                <TableCell key={uuid()}
                           align="center"
                           className={clsx(classes.gridCell, classes.gridCellTop, classes.gridCellLeft, classes.root)}>{sign.user.position}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {approvalUsersBlank.map( _ => approvalRenderBlank())}
              {approvalUsers.map(sign => (
                <TableCell key={uuid()} align="center" className={clsx(classes.gridCell, classes.gridCellLeft, classes.root)}>
                  {sign.user.name}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow>
              {approvalUsersBlank.map( _ => approvalRenderBlank())}
              {approvalUsers.map(sign => (
                <TableCell
                  key={uuid()}
                  align="center"
                  className={sign.result === '3'
                    ? clsx(classes.gridDateCell, classes.gridCellLeft, classes.rejectedDateCell, classes.root)
                    : clsx(classes.gridDateCell, classes.gridCellLeft, classes.root)}
                >
                  {sign.sign_date ? `${sign.sign_date.substring(0, 10)} ${sign.sign_date.substring(11, 16)}` : <br/>}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Box mt={0.2} display="flex" flexDirection="row-reverse">
        <Table size="small" aria-label="a dense table" className={classes.muiTableCell}>
          <TableHead className={classes.header}>
            <TableRow>
              {agreementUsersBlank.map( _ => agreementRenderBlank())}
              {agreementUsers.map(sign => (
                <TableCell key={uuid()} align="center" className={clsx(classes.gridCell, classes.root)}>{sign.user.position}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {agreementUsersBlank.map( _ => agreementRenderBlank())}
              {agreementUsers.map(sign => (
                <TableCell key={uuid()} align="center" className={clsx(classes.gridCell, classes.root)}>
                  {sign.user.name}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow>
              {agreementUsersBlank.map( _ => agreementRenderBlank())}
              {agreementUsers.map(sign => (
                <TableCell
                  key={uuid()}
                  align="center"
                  className={sign.result === '3'
                    ? clsx(classes.gridDateCell, classes.rejectedDateCell, classes.root)
                    : clsx(classes.gridDateCell, classes.root)}
                >
                  {sign.result === '3'
                    ? '(반려)'
                    : null}
                  {' '}
                  {sign.sign_date ? `${sign.sign_date.substring(0, 10)} ${sign.sign_date.substring(11, 16)}` : <br/>}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  );
}

ApproverTable.propTypes = {
  signs: PropTypes.array
};
