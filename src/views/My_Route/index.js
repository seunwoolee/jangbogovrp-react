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

function MY_Route() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const param = useParams();

  // const [mapGroups, setMapGroups] = useState([]);
  const [map, setMap] = useState(null);
  const [geoDatas, setGeoDatas] = useState([]);

  const fetchRoute = async () => {
    const url = "delivery/maps/";
    const routeM = param.id;
    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      params: {routeM: routeM}
    };

    dispatch(isloading(true));
    const response = await getRoute(url, config);
    dispatch(isloading(false));

    if (response.status === 200) {
      setGeoDatas(response.data.route_d);
    }
  };

  const getRoute = async (url, config) => {
    return await axios.get(url, config)
  }

  useEffect(() => {
    if (!(localStorage.getItem('token'))) {
      history.push('/auth/login');
    }
    fetchRoute();
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
  // console.log(mapGroups);

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
            <MY_Tmap geoDatas={geoDatas} map={map}/>
          </Grid>
          {/*<Grid item xs={12} lg={3}>*/}
          {/*  <Result mapGroups={mapGroups} map={map}/>*/}
          {/*</Grid>*/}
        </Grid>
      </Container>
    </Page>
  );
}

export default MY_Route;
