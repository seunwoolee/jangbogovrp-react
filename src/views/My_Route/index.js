import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Container} from '@material-ui/core';
import Page from 'src/components/Page';
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router";
import axios from "../../utils/my_axios";

import Header from './Header';
import {isloading} from "../../actions";
import Grid from "@material-ui/core/Grid";
import Result from "./Result";
import LoadingBar from "../../components/MY_LoadingBar";
import MY_Tmap, {drawStartMaker} from "./MY_Tmap";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

export const createGroupMaps = (maxRouteNumber, routeds) => {
  const newMapGroups = [];

  for (let i = 0; i < maxRouteNumber; i++) {
    newMapGroups.push([]);
  }

  for (let i = 0; i < routeds.length; i++) {
    newMapGroups[routeds[i].route_number - 1].push(routeds[i]);
  }

  return newMapGroups;
}

export const getRoute = async (url, config) => {
  return await axios.get(url, config)
}

function MY_Route() {
  const classes = useStyles();
  const history = useHistory();
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const param = useParams();
  const [map, setMap] = useState(null);
  const [geoDatas, setGeoDatas] = useState([]);
  const [groupMarkers, setGroupMarkers] = useState([]);
  const [groupLines, setGroupLines] = useState([]);
  const [mapGroups, setMapGroups] = useState([[]]);

  const fetchRoute = async () => {
    const routeM = param.id;
    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      params: {routeM: routeM}
    };

    dispatch(isloading(true));
    const response = await getRoute("delivery/maps/", config);
    dispatch(isloading(false));

    // const maxRouteNumber = Math.max(...response.data.route_d.map(d => d.route_number));
    const newMapGroups = createGroupMaps(20, response.data.route_d); // TODO 하드코딩

    setGeoDatas(response.data.route_d);
    setMapGroups(newMapGroups);

  };

  useEffect(() => {
    if (!(localStorage.getItem('token'))) {
      history.push('/auth/login');
    }

    fetchRoute();
  }, []);

  useEffect(() => {
    if (session.user.latitude && !map) {
      setMap(new window.Tmapv2.Map("myTmap", {
        center: new window.Tmapv2.LatLng(session.user.latitude, session.user.longitude),
        height: '750px',
        transitionEffect: "resize",
        animation: true,
        zoom: 12
      }));
    }
  }, [session]);


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
            <MY_Tmap
              fetchRoute={fetchRoute}
              geoDatas={geoDatas}
              groupGeoDatas={mapGroups}
              groupMarkers={groupMarkers}
              setGroupMarkers={setGroupMarkers}
              groupLines={groupLines}
              setGroupLines={setGroupLines}
              map={map}/>
          </Grid>
          <Grid item xs={12} lg={3}>
            {groupMarkers.length > 1 ? <Result
              fetchRoute={fetchRoute}
              mapGroups={mapGroups}
              groupLines={groupLines}
              groupMarkers={groupMarkers}
              map={map}/> : null}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default MY_Route;
