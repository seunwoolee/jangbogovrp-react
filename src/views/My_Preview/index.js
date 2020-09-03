import React, {useState, useEffect, useCallback} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Container} from '@material-ui/core';
import Page from 'src/components/Page';
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {useHistory, useLocation} from "react-router";
import Helmet from "react-helmet";
import axios from "../../utils/my_axios";
import Header from './Header';
import Results from './Results';
import MY_SearchBar from "../../components/MY_CreateSearchBar";
import {isloading} from "../../actions";
import MY_Tmap from "../../components/MY_Tmap";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

function ReportSign() {
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    if (!(localStorage.getItem('token'))) {
      history.push('/auth/login');
    }
  }, []);


  return (
    <Page
      className={classes.root}
      title="미결함"
    >
      <Container
        maxWidth={false}
        className={classes.container}
      >
        <Header />
        {/* eslint-disable-next-line react/jsx-pascal-case */}
        <MY_Tmap />
      </Container>
    </Page>
  );
}

export default ReportSign;
