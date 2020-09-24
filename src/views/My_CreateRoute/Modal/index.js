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
import Tooltip from "@material-ui/core/Tooltip";
import {NavLink as RouterLink} from "react-router-dom";
import getThousand from "../../../utils/getThousand";

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 1200,
    // height: 820,
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
  }
}));

function Index({open, onClose, className, orders}) {
  const classes = useStyles();
  // debugger;
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
            />
            <Divider/>
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
                      {orders.map((order) => (
                        <Fragment key={order.vr_seq}>
                          <TableRow>
                            <TableCell align="center">{order.vr_vehicleNoIndex}</TableCell>
                            <TableCell align="center">{order.vr_deguestName}</TableCell>
                            <TableCell align="center">{order.vr_Juso}</TableCell>
                            <TableCell align="center">{getThousand(order.vr_deguestPay)}원</TableCell>
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
    </>
  );
}

Index.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};


export default Index;
