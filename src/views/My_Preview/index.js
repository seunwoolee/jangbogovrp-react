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
import Result from "./Result";
import LoadingBar from "../../components/MY_LoadingBar";
import MY_Tmap, {startLat, startLon} from "./MY_Tmap";

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
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState(null);
  const [isAm, setIsAm] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const fetchOrderData = () => {
    dispatch(isloading(true));
    const url = "customer/preview_order/";
    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      params: {isAm, today: moment().format('YYYY-MM-DD')}
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

    setMap(new window.Tmapv2.Map("myTmap", {
      center: new window.Tmapv2.LatLng(startLat, startLon),
      height: '750px',
      transitionEffect: "resize",
      animation: true,
      zoom: 12
    }));

    fetchOrderData();
  }, []);

  useEffect(() => {
    fetchOrderData();
  }, [isAm]);

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
        <Header
          isAm={isAm}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
        <Grid container spacing={1}>
          <Grid item xs={12} lg={9}>
            {/* eslint-disable-next-line react/jsx-pascal-case */}
            <MY_Tmap fetchOrderData={fetchOrderData} orders={orderData} map={map} markers={markers} setMarkers={setMarkers}/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Result orders={orderData} fetchOrderData={fetchOrderData} map={map} isAm={isAm} setIsAm={setIsAm}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default Preview;
