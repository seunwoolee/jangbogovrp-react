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
import LoadingBar from "../../components/MY_LoadingBar";
import moment from "moment";
import Result from "./Result";
import MY_SearchBar from "../../components/MY_DeliverySearchBar";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const initialValues = {
  startDate: moment().add(-10, 'days'),
  endDate: moment().add(+1, 'month')
};

function DeliveryList() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [deliveryData, setDeliveryData] = useState([]);
  const [inputDateValues, setInputDateValues] = useState({...initialValues});
  const [isAm, setIsAm] = useState(true);

  const fetchOrderData = () => {
    dispatch(isloading(true));
    const url = "delivery/deliveries/";
    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      params: {
      startDate: moment(inputDateValues.startDate).format('YYYY-MM-DD'),
      endDate: moment(inputDateValues.endDate).format('YYYY-MM-DD'),
      isAm: isAm
    }
    };

    dispatch(isloading(true));
    axios.get(url, config)
      .then(res => {
        dispatch(isloading(false));
        setDeliveryData(res.data);
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
      title="배송지역 미리보기"
    >

      <LoadingBar />

      <Container
        maxWidth={false}
        className={classes.container}
      >
        <Header />
        <MY_SearchBar dateValues={inputDateValues} setDateValues={setInputDateValues} onSearch={fetchOrderData}/>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Result deliveries={deliveryData} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default DeliveryList;
