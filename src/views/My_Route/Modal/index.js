import React, {Fragment, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {
  Modal,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Divider,
  Button, Table, TableBody, TableRow, TableCell, TableHead
} from '@material-ui/core';
import getThousand from "../../../utils/getThousand";
import OrdersDialog from "./Dialog";
import DriverDialog from "../DriverDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 1200,
    maxHeight: '100%',
    overflow: 'scroll',
    maxWidth: '100%'
  },
  cardContent: {
    paddingTop: theme.spacing(1)
  },
  cardHeaderRoot: {
    backgroundColor: theme.palette.primary.main,
  },
  cardHeaderTitle: {
    color: theme.palette.primary.contrastText
  },
  tableCellTitle: {
    textAlign: 'center',
    width: '50px',
    backgroundColor: '#eeeeee'
  },
  tableCellContent: {
    width: '100px',
  },
  actions: {
    justifyContent: 'flex-end'
  },
  tableRow: {
    cursor: "pointer"
  }
}));

export const getOrderPrice = (orders) => {
  let totalPrice = 0;
  for (let i = 0; i < orders.length; i++) {
    totalPrice += orders[i].price;
  }
  return totalPrice;
}

function Index({open, onClose, className, mapGroup, reDraw}) {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [driverDialogOpen, setDriverDialogOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState(null);

  const handleClicked = (row) => {
    setDialogOpen(true);
    setSelectedOrders(row.orders);
  }

  const handleClosed = () => {
    setDialogOpen(false);
  }

  const handleDriverClosed = () => {
    setDriverDialogOpen(false);
  }

  return (
    <>
      <Modal
        onClose={onClose}
        open={open}
      >
        <Card
          className={clsx(classes.root, className)}
        >
          <form>
            <CardHeader
              classes={{root: classes.cardHeaderRoot, title: classes.cardHeaderTitle}}
              title="배송 내역"
              action={(
                <Button
                  onClick={() => setDriverDialogOpen(true)}
                  className={classes.cardHeaderTitle}>기사배정</Button>
              )}
            />
            <Divider />
            <CardContent>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>경로순서</TableCell>
                        <TableCell>주문자명</TableCell>
                        <TableCell>주소</TableCell>
                        <TableCell>금액</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mapGroup.sort((a, b) => a.route_index - b.route_index).map((row, index) => (
                        <Fragment key={row.route_index}>
                          <TableRow className={classes.tableRow} hover
                                    onClick={() => handleClicked(row)}>
                            <TableCell align="center">{row.route_index}</TableCell>
                            <TableCell align="center">{row.customer_info.name}</TableCell>
                            <TableCell align="center">{row.customer_info.address}</TableCell>
                            <TableCell align="center">{getThousand(getOrderPrice(row.orders))}원</TableCell>
                          </TableRow>
                        </Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </CardContent>
            <Divider/>
            <CardActions className={classes.actions}>
              <Button onClick={onClose}>
                닫기
              </Button>
            </CardActions>
          </form>
        </Card>
      </Modal>

      {dialogOpen ? <OrdersDialog open={dialogOpen} onClose={handleClosed} selectedOrders={selectedOrders} /> : null}
      {driverDialogOpen ? <DriverDialog
        reDraw={reDraw}
        open={driverDialogOpen}
        onClose={handleDriverClosed}
        routeD={mapGroup.find(map => map.route_index === 1)} /> : null}
    </>
  );
}

Index.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  reDraw: PropTypes.func,
  open: PropTypes.bool,
  mapGroup: PropTypes.array
};


export default Index;
