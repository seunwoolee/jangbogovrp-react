import React, {Fragment, useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useLocation} from "react-router";
import MY_approverLine from "./MY_approverLine";
import axios from "../utils/my_axios";
import getInvoiceDetailCard from "../utils/getInvoiceDetailCard";
import Box from "@material-ui/core/Box";
import {isloading} from "../actions";
import {createGroupMaps, getRoute} from "../views/My_Route";
import {Grid, TableHead} from "@material-ui/core";
import getThousand from "../utils/getThousand";
import {makeStyles} from "@material-ui/styles";
import {getOrderPrice} from "../views/My_Route/Modal";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    pageBreakAfter: 'always',
    height: '29.7cm',
    width: '21cm'
  },
  tableCellContent: {
    width: '100px',
  },
  tableRow: {
    cursor: "pointer"
  }
}));

function MY_Print() {
  const classes = useStyles();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [geoDatas, setGeoDatas] = useState([]);
  const [mapGroups, setMapGroups] = useState([[]]);

  const fetchRoute = async () => {
    const routeM = params.get('routeM');
    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      params: {routeM: routeM}
    };

    const response = await getRoute("delivery/maps/", config);
    const maxRouteNumber = Math.max(...response.data.route_d.map(d => d.route_number));
    const _mapGroups = createGroupMaps(maxRouteNumber, response.data.route_d);
    setGeoDatas(response.data.route_d);
    setMapGroups(_mapGroups);
  };

  useEffect(() => {
    fetchRoute().then(() => window.print());
  }, []);

  return (
    <>
      {mapGroups.length > 0 ? (
        <>
          {mapGroups.map((mapGroup, index) => (
            <TableContainer className={classes.tableContainer} component={Paper}>
              <Typography variant="h3" component="h4">{index + 1}번</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell size={"small"} align={"center"}>No</TableCell>
                    <TableCell size={"small"} align={"center"}>주문자명</TableCell>
                    <TableCell size={"small"} align={"center"}>주소</TableCell>
                    <TableCell size={"small"} align={"center"}>금액</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mapGroup.sort((a, b) => a.route_index - b.route_index).map((row, index) => (
                    <Fragment key={row.route_index}>
                      <TableRow className={classes.tableRow}>
                        <TableCell align="center" size={"small"}>{row.route_index}</TableCell>
                        <TableCell align="center" size={"small"}>{row.customer_info.name}</TableCell>
                        <TableCell align="center" size={"small"}>{row.customer_info.address}</TableCell>
                        <TableCell align="center" size={"small"}>{getThousand(getOrderPrice(row.orders))}원</TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ))}
        </>
      ) : null}
    </>
  );
}

export default MY_Print;
