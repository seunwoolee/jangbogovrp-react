import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Container} from '@material-ui/core';
import Page from 'src/components/Page';
import {useDispatch} from "react-redux";
import {useHistory, useLocation} from "react-router";
import moment from "moment";
import axios from "../../utils/my_axios";
import Header from './Header';
import Results from './Results';
import MY_SearchBar from "../../components/MY_SearchBar";
import {isloading} from "../../actions";
import CcResults from "./CcResult";

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
  startDate: moment().add(-15, 'day'),
  endDate: moment().add(10, 'day')
};

export const filterInitialValues = {
  batchNumber: '',
  company: '',
  user: '',
  department: '',
  docStatus: '',
  isNotReaded: false
};


function ReportWritten() {
  const classes = useStyles();
  const [headerText, setHeaderText] = useState('상신함');
  const [documents, setDocuments] = useState([]);
  const [inputDateValues, setInputDateValues] = useState({...initialValues});
  const [inputSearchContent, setInputSearchContent] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filterValues, setFilterValues] = useState({ ...filterInitialValues });

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleSearchContent = (event) => {
    setInputSearchContent(event.target.value);
  };

  const fetchDocuments = (isFilter = false) => {
    let paging = page + 1;

    if (isFilter) {
      paging = 1;
      setPage(0);
    }

    let url = `ea/written_document/?page=${paging}`;
    if (location.pathname === '/reportRejected') {
      url = `ea/rejected_document/?page=${paging}`;
      setHeaderText('반려함');
    } else if (location.pathname === '/reportApproved') {
      url = `ea/approved_document/?page=${paging}`;
      setHeaderText('기결함');
    } else if (location.pathname === '/reportCc') {
      url = `ea/cc_document/?page=${paging}`;
      setHeaderText('수신참조함');
    }

    let params = {
      startDate: moment(inputDateValues.startDate).format('YYYY-MM-DD'),
      endDate: moment(inputDateValues.endDate).format('YYYY-MM-DD'),
      search: inputSearchContent
    };

    if (filterValues.batchNumber) {
      params['batchNumber'] = filterValues.batchNumber;
    }

    if (filterValues.user) {
      params['user'] = filterValues.user;
    }

    if (filterValues.department) {
      params['department'] = filterValues.department;
    }

    if (filterValues.company) {
      params['company'] = filterValues.company;
    }

    if (filterValues.isNotReaded === true) {
      params['isNotReaded'] = true;
    }

    if (filterValues.docStatus) {
      params['docStatus'] = filterValues.docStatus;
    }

    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      params: params
    };

    dispatch(isloading(true));
    axios.get(url, config)
      .then((response) => {
        setTotalCount(response.data[response.data.length-1]['total_number']);
        response.data.pop();
        setDocuments(response.data);
        dispatch(isloading(false));
      })
      .catch(error => dispatch(isloading(false)));
  };

  useEffect(() => {
    if (!(localStorage.getItem('token'))) {
      history.push('/auth/login');
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [page]);

  return (
    <Page
      className={classes.root}
      title="상신함"
    >
      <Container maxWidth={false}>
        <Header headerText={headerText} />
        <MY_SearchBar
          setPage={setPage}
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          searchContent={inputSearchContent}
          setSearchContent={handleSearchContent}
          dateValues={inputDateValues}
          setDateValues={setInputDateValues}
          onSearch={fetchDocuments}
          detail
        />
        {documents && headerText === '수신참조함' ? (
          <CcResults
            fetchDocuments={fetchDocuments}
            page={page}
            totalCount={totalCount}
            setPage={setPage}
            className={classes.results}
            documents={documents}
          />
        ) : (
          <Results
            fetchDocuments={fetchDocuments}
            page={page}
            totalCount={totalCount}
            setPage={setPage}
            className={classes.results}
            documents={documents}
          />
        )}
      </Container>
    </Page>
  );
}

export default ReportWritten;
