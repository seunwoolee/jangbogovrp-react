import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Container} from '@material-ui/core';
import Page from 'src/components/Page';
import {useDispatch, useSelector} from "react-redux";
import axios from "../../utils/my_axios";
import Header from './Header';
import Results from './Results';
import moment from "moment";
import MY_SearchBar from "../../components/MY_CreateSearchBar";
import {useHistory, useLocation} from "react-router";
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
  startDate: moment().add(-2, 'month'),
  endDate: moment().add(+1, 'month')
};

export const INVOICETYPE = Object.freeze({
    채무발생: "채무발생",
    채무정리: "채무정리",
    채권발생: "채권발생",
    채권정리: "채권정리",
    일반전표: "일반전표"
});

function ReportCreate() {
  const classes = useStyles();
  const [invoices, setInvoices] = useState([]);
  const [invoiceType, setInvoiceType] = useState(INVOICETYPE.채무발생);
  const [inputDateValues, setInputDateValues] = useState({...initialValues});
  const [inputSearchContent, setInputSearchContent] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleSearchContent = (event) => {
    setInputSearchContent(event.target.value);
  };

  const fetchInvoices = (batchNumber = '', user = '', department = '') => {
    let url = `erp/voucher_list/`;

    if (location.pathname === '/reportWritePayment') {
      url = `erp/payment_list/`;
      setInvoiceType(INVOICETYPE.채무정리);
    } else if (location.pathname === '/reportWriteInvoice') {
      url = `erp/invoice_list/`;
      setInvoiceType(INVOICETYPE.채권발생);
    } else if (location.pathname === '/reportWriteReceipt') {
      url = `erp/receipt_list/`;
      setInvoiceType(INVOICETYPE.채권정리);
    } else if (location.pathname === '/reportWriteNacct') {
      url = `erp/nacct_list/`;
      setInvoiceType(INVOICETYPE.일반전표);
    }

    let params = {
      startDate: moment(inputDateValues.startDate).format('YYYY-MM-DD'),
      endDate: moment(inputDateValues.endDate).format('YYYY-MM-DD'),
      search: inputSearchContent
    };

    if (batchNumber) {
      params['batchNumber'] = batchNumber;
    }

    if (user) {
      params['user'] = user;
    }

    if (department) {
      params['department'] = department;
    }

    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      params: params
    };

    dispatch(isloading(true))
    axios.get(url, config)
      .then((response) => {
        dispatch(isloading(false))
        setInvoices(response.data);
      })
      .catch(error => dispatch(isloading(false)));
  };

  const handleSearch = (batchNumber, user, department) => {
    fetchInvoices(batchNumber, user, department);
  };

  useEffect(() => {
    if (!(localStorage.getItem('token'))) {
      history.push('/auth/login');
    }
    fetchInvoices();
  }, [location]);

  let headerInvoices = [];
  if (invoiceType === INVOICETYPE.채무발생 || invoiceType === INVOICETYPE.채권발생) {
    headerInvoices = invoices.filter(invoice => invoice.RPSFX === '001' && invoice.RPSEQ === 1);
  } else if (invoiceType === INVOICETYPE.채권정리) {
    let RPCKNU = 0;
    headerInvoices = invoices.filter(invoice => {
      if(invoice.RPCKNU !== RPCKNU){
        RPCKNU = invoice.RPCKNU;
        return true;
      }
      return false;
    });
  } else if (invoiceType === INVOICETYPE.일반전표){
    headerInvoices = invoices.filter(invoice => invoice.RPSEQ === 1);
  } else if (invoiceType === INVOICETYPE.채무정리){
    headerInvoices = invoices.filter(invoice => invoice.RPSEQ === 1);
  }

  return (
    <Page
      className={classes.root}
      title={"결재작성"}
    >
      <Container
        maxWidth={false}
        className={classes.container}
      >
        <Header />
        <MY_SearchBar
          searchContent={inputSearchContent}
          setSearchContent={handleSearchContent}
          dateValues={inputDateValues}
          setDateValues={setInputDateValues}
          onSearch={handleSearch}
          detail
        />
        {invoices && (
          <Results
            className={classes.results}
            invoices={headerInvoices}
            fetchInvoices={fetchInvoices}
            totalInvoices={invoices}
            invoiceType={invoiceType}
          />
        )}
      </Container>
    </Page>
  );
}

export default ReportCreate;
