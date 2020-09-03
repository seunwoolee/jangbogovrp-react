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
  name: '',
  startDate: moment().add(-3, 'month'),
  endDate: moment()
};

function ReportSign() {
  const classes = useStyles();
  const [inputDateValues, setInputDateValues] = useState({...initialValues});
  const [inputSearchContent, setInputSearchContent] = useState('');
  const [documents, setDocuments] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();

  // document.getElementById()

  // const initTmap = () => {
  // new Tmap.Map({
  //   div: 'map_div',
  //   width: '100%',
  //   height: '768px',
  //   transitionEffect: "resize",
  //   animation: true
  // });
  // };

  // const handleFilter = () => {
  // };
  //
  // const handleSearchContent = (event) => {
  //   setInputSearchContent(event.target.value);
  // };

  // const fetchDocuments = () => {
  //   const config = {
  //     headers: {Authorization: `Token ${localStorage.getItem('token')}`},
  //     params: {
  //       startDate: moment(inputDateValues.startDate).format('YYYY-MM-DD'),
  //       endDate: moment(inputDateValues.endDate).format('YYYY-MM-DD'),
  //       search: inputSearchContent
  //     }
  //   };
  //
  //   dispatch(isloading(true))
  //   axios.get(`ea/sign_document/`, config)
  //     .then((response) => {
  //       setDocuments(response.data);
  //       dispatch(isloading(false))
  //     })
  //     .catch(error => dispatch(isloading(false)));
  // };
  //
  // const handleSearch = () => {
  //   fetchDocuments();
  // };

  useEffect(() => {
    if (!(localStorage.getItem('token'))) {
      history.push('/auth/login');
    }
    // fetchDocuments();
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
        <div className="map_div" />

        {/*<Helmet*/}
        {/*  script={[*/}
        {/*    {*/}
        {/*      src: "https://api2.sktelecom.com/tmap/js?version=1&format=javascript&appKey=2d7149c9-1a4d-4a57-b2e0-c1a00589a69e",*/}
        {/*      type: "text/javascript"*/}
        {/*    }*/}
        {/*  ]}*/}
        {/*>*/}
        {/*</Helmet>*/}
        {/* <MY_SearchBar */}
        {/*  searchContent={inputSearchContent} */}
        {/*  setSearchContent={handleSearchContent} */}
        {/*  dateValues={inputDateValues} */}
        {/*  setDateValues={setInputDateValues} */}
        {/*  onFilter={handleFilter} */}
        {/*  onSearch={handleSearch} */}
        {/* /> */}
        {/* {documents && ( */}
        {/*  <Results */}
        {/*    className={classes.results} */}
        {/*    documents={documents} */}
        {/*    fetchDocuments={fetchDocuments} */}
        {/*  /> */}
        {/* )} */}
      </Container>
    </Page>
  );
}

export default ReportSign;
