import React, {useState, useEffect} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Link, Container
} from '@material-ui/core';
import axios from 'src/utils/axios';
import getInitials from 'src/utils/getInitials';
import {avatar_URL} from "../my_config";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
  },

}));

function MY_Tmap({className}) {
  const classes = useStyles();
  const [Tmap, _] = useState(window.Tmap);

  useEffect(() => {
    const map = new Tmap.Map({
      div: "myTmap",
      height: '750px',
      transitionEffect: "resize",
      animation: true
    });

    // const format = new Tmap.Format.GeoJSON({
    //   internalProjection: map.baseLayer.projection,
    //   externalProjection: new Tmap.Projection("EPSG:3857")
    // });

    const in_options4326 = {
      internalProjection: map.baseLayer.projection,
      externalProjection: new Tmap.Projection("EPSG:4326")
    };
    const in_options3857 = {
      internalProjection: map.baseLayer.projection,
      externalProjection: new Tmap.Projection("EPSG:3857")
    };
    const out_options = {
      internalProjection: map.baseLayer.projection,
      externalProjection: new Tmap.Projection("EPSG:3857")
    };

    const kmlOptionsIn = Tmap.Util.extend(
      {extractStyles: true}, in_options4326
    );

  }, []);

  return (<div className={classes.root} id="myTmap" />);
}

MY_Tmap.propTypes = {
  className: PropTypes.string
};

export default MY_Tmap;
