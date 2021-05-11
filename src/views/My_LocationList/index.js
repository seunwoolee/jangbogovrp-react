import React, {useState, useEffect, useCallback} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Container} from '@material-ui/core';
import Page from 'src/components/Page';
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useLocation} from "react-router";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import axios from "../../utils/my_axios";

import Header from './Header';
import {isloading} from "../../actions";
import LoadingBar from "../../components/MY_LoadingBar";
import LocationSearch from "../../components/LocationSearch";
import Result from "./Result";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));


function DeliveryList() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [locationData, setLocationData] = useState([]);
  const [productCode, setProductCode] = useState('8801007135113');

  const fetchOrderData = () => {
    dispatch(isloading(true));
    const url = "delivery/get_locations/";
    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      params: {
        product_code: productCode
      }
    };

    dispatch(isloading(true));
    axios.get(url, config)
      .then(res => {
        console.log(res);
        dispatch(isloading(false));
        setLocationData(res.data);
      })
      .catch(err => dispatch(isloading(false)));
  };

  useEffect(() => {
    if (!(localStorage.getItem('token'))) {
      history.push('/auth/login');
    }
    fetchOrderData();
  }, []);

  return (
    <Page
      className={classes.root}
      title="로케이션 검색"
    >

      <LoadingBar />

      <Container
        maxWidth={false}
        className={classes.container}
      >
        <Header />
        <LocationSearch productCode={productCode} setProductCode={setProductCode} onSearch={fetchOrderData} />
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Result locations={locationData} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default DeliveryList;
