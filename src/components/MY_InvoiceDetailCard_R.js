import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent, Divider, Grid,
  Typography,
} from '@material-ui/core';
import MY_erpDetailTable from "./MY_erpDetailTable";
import MY_InvoiceDetailCard_Attachment from "./MY_InvoiceDetailCard_Attachment";
import getSumInvoices from "../utils/getSumInvoices";
import {isloading} from "../actions";
import axios from "../utils/my_axios";
import MY_occurInvoicesCard from "./MY_occurInvoicesCard";
import {useDispatch} from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import MY_erpDetailTable_R from "./MY_erpDetailTable_R";


const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3)
  },
  content: {
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(0.1),
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexWrap: 'wrap'
    },
  },
  contentBottom: {
    padding: theme.spacing(1),
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #000000',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexWrap: 'wrap'
    },
  },
  erpDetailTable: {
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexWrap: 'wrap'
    }
  },
  infoColumn: {
    // width: 180,
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%'
    }
  },
}));


function MY_InvoiceCard({
  invoices, className, attachments, handleAttachments, type,
  openAttachment, setOpenAttachment, selectedImgPath, setSelectedImgPath
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [occurInvoices, setOccurInvoices] = useState([]);
  const [open, setOpen] = useState('none');

  const getOccurInvoices = (invoice) => {
    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      params: {
        RPDOC: invoice.RPDOCM,
        RPCO: invoice.RPCO,
      }
    };

    dispatch(isloading(true))
    axios.get(`ea/get_occur_invoices/`, config)
      .then((response) => {
        setOccurInvoices(response.data);
        setOpen('block');
        dispatch(isloading(false));
      })
      .catch(error => dispatch(isloading(false)));
  }

  let RPCKNU = 0;
  const headerInvoices = invoices.filter(invoice => {
    if(invoice.RPCKNU !== RPCKNU){
      RPCKNU = invoice.RPCKNU;
      return true;
    }
    return false;
  });

  return (
    <>
      <Typography variant="h5">
        총
        {' '}
        {headerInvoices.length}
        건 /
        {' '}
        {getSumInvoices(invoices)}
        원
      </Typography>

      {occurInvoices.length > 0 ? (
      <MY_occurInvoicesCard
        open={open}
        setOpen={setOpen}
        invoices={occurInvoices}
        className={classes.erpDetailTable}
        cardClassName={classes.content}
      />
      ): null}

      {headerInvoices.map((invoice, i) => (
        <Card
          key={i}
          className={clsx(classes.root, className)}
        >
        {/*<CardContent className={classes.content} onClick={()=>getOccurInvoices(invoice)}>*/}
        <CardContent className={classes.content}>
          <div className={classes.infoColumn}>
            <Typography variant="body2">배치번호/입금번호</Typography>
            <Typography variant="h6">{invoice.RPICU}/{invoice.RPDOC}</Typography>
          </div>
          <div className={classes.infoColumn}>
            <Typography variant="body2">거래처명</Typography>
            <Typography variant="h6">{invoice.RPALPH}</Typography>
          </div>
          <div className={classes.infoColumn}>
            <Typography variant="body2">거래처코드/사업자번호</Typography>
            <Typography variant="h6">{invoice.RPAN8} / {invoice.RPTAX}</Typography>
          </div>
        </CardContent>
        <CardContent className={classes.contentBottom}>
          <div className={classes.infoColumn}>
            <Typography variant="body2">G/L일자/전표유형</Typography>
            <Typography variant="h6">{invoice.RPDGJ} / {invoice.RPDCT}</Typography>
          </div>
          <div className={classes.infoColumn}>
            <Typography variant="body2">만기일</Typography>
            <Typography variant="h6">{invoice.RPVLDT}</Typography>
          </div>
          <div className={classes.infoColumn}>
            <Typography variant="body2">입금번호</Typography>
            <Typography variant="h6">{invoice.RPCKNU}</Typography>
          </div>
        </CardContent>
        <CardContent className={classes.erpDetailTable}>
          <MY_erpDetailTable_R invoices={invoices.filter(my_invoice => my_invoice.RPCKNU === invoice.RPCKNU)} onGetOccurInvoices={getOccurInvoices}/>
        </CardContent>
        <Divider />
          <MY_InvoiceDetailCard_Attachment
            setSelectedImgPath={setSelectedImgPath}
            selectedImgPath={selectedImgPath}
            openAttachment={openAttachment}
            setOpenAttachment={setOpenAttachment}
            handleAttachments={handleAttachments}
            type={type}
            attachments={attachments}
            invoiceId={invoice.id} />
        </Card>
      ))}
    </>
  )
}

MY_InvoiceCard.propTypes = {
  className: PropTypes.string,
  invoices: PropTypes.array.isRequired,
  attachments: PropTypes.array,
  handleAttachments: PropTypes.func,
  type: PropTypes.string.isRequired,
  openAttachment: PropTypes.bool,
  setOpenAttachment: PropTypes.func,
  selectedImgPath: PropTypes.string,
  setSelectedImgPath: PropTypes.func,
};

export default MY_InvoiceCard;
