import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Container} from '@material-ui/core';
import Page from 'src/components/Page';
import {useDispatch} from "react-redux";
import {useHistory, useParams} from "react-router";
import axios from "../../utils/my_axios";

import Header from './Header';
import {isloading} from "../../actions";
import Grid from "@material-ui/core/Grid";
import Result from "./Result";
import LoadingBar from "../../components/MY_LoadingBar";
import MY_Tmap from "./MY_Tmap";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

function Route() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [mapGroups, setMapGroups] = useState([]);
  const [map, setMap] = useState(null);
  const [geoDatas, setGeoDatas] = useState([]);

  const fetchOrderData = () => {
    dispatch(isloading(true));
    const url = "core/create_route/";
    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
    };

    dispatch(isloading(true));
    axios.get(url, config)
      .then(res => {
        dispatch(isloading(false));
        setGeoDatas(res.data);
        debugger;
        return res.data;
      })
      .catch(err => dispatch(isloading(false)));
  };

  const getMaps = async (config) => {
    return await axios.get("delivery/maps/", config)
  }

  useEffect(() => {
    if (!(localStorage.getItem('token'))) {
      history.push('/auth/login');
    }
    fetchOrderData();
  }, []);

  useEffect(() => {
    setMap(new window.Tmap.Map({
      div: "myTmap",
      height: '750px',
      transitionEffect: "resize",
      animation: true
    }));
  }, []);

  console.log(geoDatas);

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
            <MY_Tmap geoDatas={geoDatas} map={map}/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Result mapGroups={mapGroups} map={map}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default Route;
