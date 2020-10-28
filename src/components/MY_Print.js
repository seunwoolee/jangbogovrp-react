import React, {Fragment, useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useLocation} from "react-router";
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
    width: '120px',
  },
  tableRow: {
    '& td, th': {
      borderBottom: "2px solid gray",
      borderRight: "2px solid gray",
    }
  },
  tableHead: {
    backgroundColor: '#c1c1c1',
    '& tr': {
      height: '50px'
    },
    '& th': {
      fontWeight: 600
    },
  },
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
    fetchRoute().then(setTimeout(() => window.print(), 2500));
  }, []);

  const tableRows = (geoData) => {
    const content = [];
    for (let i = 0; i < geoData.orders.length; i++) {
      content.push((
        <TableRow key={geoData.orders[i].id} className={classes.tableRow}>
          <TableCell size={"small"} align="center">{geoData.route_index}</TableCell>
          <TableCell size={"small"} align="center">{geoData.customer_info.name}</TableCell>
          <TableCell size={"small"} align="center">{geoData.customer_info.address}</TableCell>
          <TableCell className={classes.tableCellContent} size={"small"}
                     align="center">{getThousand(geoData.orders[i].price) + '원'}</TableCell>
        </TableRow>
      ))
    }
    return content;
  }

  const getGroupPrice = (mapGroup) => {
    let price = 0;

    for (let i = 0; i < mapGroup.length; i++) {
      for (let j = 0; j < mapGroup[i].orders.length; j++) {
        price += mapGroup[i].orders[j].price;
      }
    }

    return (
      <TableRow key={price} className={classes.tableRow}>
        <TableCell colSpan={3} size={"small"} align="center">{'합계'}</TableCell>
        <TableCell size={"small"} align="center">{getThousand(price) + '원'}</TableCell>
      </TableRow>
    )

  }


  return (
    <>
      {mapGroups.length > 0 ? (
        <>
          {mapGroups.map((mapGroup, index) => (
            mapGroup.length > 0 ? (
              <TableContainer key={index} className={classes.tableContainer} component={Paper}>
                <Typography variant="h3" component="h4">{index + 1}번</Typography>
                <Table>
                  <TableHead className={classes.tableHead}>
                    <TableRow className={classes.tableRow}>
                      <TableCell size={"small"} align={"center"}>No</TableCell>
                      <TableCell size={"small"} align={"center"}>주문자명</TableCell>
                      <TableCell size={"small"} align={"center"}>주소</TableCell>
                      <TableCell size={"small"} align={"center"}>금액</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mapGroup.sort((a, b) => a.route_index - b.route_index).map((row, index) => (
                      <Fragment key={row.route_index}>
                        {tableRows(row).map(content => content)}
                      </Fragment>
                    ))}
                    {getGroupPrice(mapGroup)}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null
          ))}
        </>
      ) : null}
    </>
  );
}

export default MY_Print;
