import React, {useEffect, useState} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import GenericMoreButton from 'src/components/GenericMoreButton';
import BottomBar from "./BottomBar";
import getShortBigo from "../../utils/getShortBigo";
import useWindowDimensions from "./WindowDimenstions";
import ReportModal from "./Modal/ReportModal";
// import WriteReportModal from "../CustomerManagementDetails/Summary/WriteReporttModal";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0
  },
  supplyCell: {
    fontFamily: 'GmarketSansBold',
  },
  inner: {
    minWidth: 700,
  },
  whiteSpaceNoWrap: {
    whiteSpace: 'nowrap'
  },
  mobileInner: {
    minWidth: 700,
    whiteSpace: 'nowrap'
  },
  nameCell: {
    fontColor: 'red',
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  }
}));

function Results({ className, customers, ...rest }) {

  const classes = useStyles();
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedCustomerDatas, setSelectedCustomerDatas] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [openModal, setOpenModal] = useState(false);
  const { height, width } = useWindowDimensions();

  const handleSelectAll = (event) => {
    const selectedCustomers = event.target.checked
      ? customers.map((customer) => customer.id)
      : [];

    setSelectedCustomers(selectedCustomers);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomers.indexOf(id);
    let newSelectedCustomers = [];

    if (selectedIndex === -1) {
      newSelectedCustomers = newSelectedCustomers.concat(selectedCustomers, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomers = newSelectedCustomers.concat(
        selectedCustomers.slice(1)
      );
    } else if (selectedIndex === selectedCustomers.length - 1) {
      newSelectedCustomers = newSelectedCustomers.concat(
        selectedCustomers.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedCustomers = newSelectedCustomers.concat(
        selectedCustomers.slice(0, selectedIndex),
        selectedCustomers.slice(selectedIndex + 1)
      );
    }
    setSelectedCustomers(newSelectedCustomers);
  };

  const handleChangePage = (event, page) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  // eslint-disable-next-line max-len
  const getSelectedCustomers = () => customers.filter(customer => selectedCustomers.includes(customer.id));

  const handleWriteReport = () => {
    setOpenModal(true);
  };

  const getClassName = () => width < 1024;

  useEffect(() => {
    setSelectedCustomerDatas(getSelectedCustomers());
  }, [openModal]);


  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        {customers.length}
        {' '}
        Records found. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(customers.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          action={<GenericMoreButton />}
          title="전표 내역"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={getClassName() ? classes.mobileInner : classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCustomers.length === customers.length}
                        color="primary"
                        indeterminate={
                          selectedCustomers.length > 0
                          && selectedCustomers.length < customers.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>공급자명</TableCell>
                    <TableCell>일자</TableCell>
                    <TableCell>총액</TableCell>
                    <TableCell>사용자</TableCell>
                    <TableCell>비고</TableCell>
                    <TableCell>배치번호</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.slice(0, rowsPerPage).map((customer) => (
                    <TableRow
                      hover
                      key={customer.id}
                      selected={selectedCustomers.indexOf(customer.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedCustomers.indexOf(customer.id) !== -1
                          }
                          color="primary"
                          onChange={(event) => handleSelectOne(event, customer.id)}
                          value={selectedCustomers.indexOf(customer.id) !== -1}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={clsx(classes.nameCell, classes.whiteSpaceNoWrap)}>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to="/management/customers/1"
                              variant="h6"
                            >
                              {customer.공급자명}
                            </Link>
                            <div>{customer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={classes.whiteSpaceNoWrap}>{customer.일자}</TableCell>
                      <TableCell className={classes.whiteSpaceNoWrap}>
                        {customer.통화}
                        {customer.총액}
                      </TableCell>
                      <TableCell className={classes.whiteSpaceNoWrap}>
                        <div className={classes.nameCell}>
                          <Avatar
                            className={classes.avatar}
                            src={customer.avatar}
                          />
                          {customer.사용자}
                        </div>
                      </TableCell>
                      <TableCell>{getShortBigo(width, customer.비고)}</TableCell>
                      <TableCell className={classes.whiteSpaceNoWrap}>
                        {customer.배치번호 + Math.floor(Math.random() * 70)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <CardActions className={classes.actions}>
          <TablePagination
            component="div"
            count={customers.length}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardActions>
      </Card>
      <BottomBar onWriteReport={handleWriteReport} selected={selectedCustomers} />
      <ReportModal
        customers={selectedCustomerDatas}
        onClose={() => setOpenModal(false)}
        open={openModal}
      />

    </div>
  );
}

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array
};

Results.defaultProps = {
  customers: []
};

export default Results;
