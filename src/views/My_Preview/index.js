import React, {useState, useEffect, useCallback} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Container} from '@material-ui/core';
import Page from 'src/components/Page';
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useLocation} from "react-router";
import axios from "../../utils/my_axios";

import Header from './Header';
import {isloading} from "../../actions";
import MY_Tmap from "../../components/MY_Tmap";
import Grid from "@material-ui/core/Grid";
import Result from "./Result";
import LoadingBar from "../../components/MY_LoadingBar";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

function Preview() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [orderData, setOrderData] = useState([]);
  const [map, setMap] = useState(null);
  const [isAm, setIsAm] = useState(true);

  const fetchOrderData = () => {
    dispatch(isloading(true));
    const url = "customer/preview_order/";
    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      params: {isAm: isAm}
    };

    dispatch(isloading(true));
    axios.get(url, config)
      .then(res => {
        dispatch(isloading(false));
        setOrderData(res.data);
      })
      // eslint-disable-next-line no-unused-vars
      .catch(err => dispatch(isloading(false)));
  };

  useEffect(() => {
    if (!(localStorage.getItem('token'))) {
      history.push('/auth/login');
    }
    fetchOrderData();
  }, []);

  useEffect(() => {
    fetchOrderData();
  }, [isAm]);

  useEffect(() => {
    setMap(new window.Tmap.Map({
      div: "myTmap",
      height: '750px',
      transitionEffect: "resize",
      animation: true
    }));
  }, []);

  return (
    <Page
      className={classes.root}
      title="배송지역 미리보기"
    >

      <LoadingBar/>

      <Container
        maxWidth={false}
        className={classes.container}
      >
        <Header/>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={9}>
            {/* eslint-disable-next-line react/jsx-pascal-case */}
            <MY_Tmap orders={orderData} map={map}/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Result orders={orderData} map={map} isAm={isAm} setIsAm={setIsAm}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default Preview;
