import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {
  Card,
  CardContent, Divider, Grid,
  Typography,
} from '@material-ui/core';
import MY_erpDetailTable from "./MY_erpDetailTable";
import MY_InvoiceDetailCard_Attachment from "./MY_InvoiceDetailCard_Attachment";
import getSumInvoices from "../utils/getSumInvoices";


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
  supplyName: {
    // width: 180,
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%'
    }
  },
  stats: {
    // width: 120,
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%'
    }
  },
  bigo: {
    // width: 330,
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%'
    }
  }
}));

function MY_InvoiceCard({
    invoices, className, attachments, handleAttachments, type,
    openAttachment, setOpenAttachment, selectedImgPath, setSelectedImgPath
}) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h5">
        총
        {' '}
        {invoices.filter(invoice => invoice.RPSFX === '001' && invoice.RPSEQ === 1).length}
        건 /
        {' '}
        {getSumInvoices(invoices)}
        원
      </Typography>

      {invoices.filter(invoice => invoice.RPSFX === '001' && invoice.RPSEQ === 1).map((invoice, i) => (
        <Card
          key={i}
          className={clsx(classes.root, className)}
        >
          <CardContent className={classes.content}>
            <div className={classes.supplyName}>
              <Typography variant="body2">배치번호/문서번호</Typography>
              <Typography variant="h6">{invoice.RPICU}/{invoice.RPDOC}</Typography>
            </div>
            <div className={classes.stats}>
              <Typography variant="body2">거래처명</Typography>
              <Typography variant="h6">{invoice.RPALPH}</Typography>
            </div>
            <div className={classes.bigo}>
              <Typography variant="body2">거래처코드/사업자번호</Typography>
              <Typography variant="h6">{invoice.RPAN8} / {invoice.RPTAX}</Typography>
            </div>
            <div className={classes.stats}>
              <Typography variant="body2">세금유형</Typography>
              <Typography variant="h6">{invoice.RPEXR1 || invoice.RPTXA1 ? invoice.RPEXR1 + ' / ' + invoice.RPTXA1 :
                <br/>}</Typography>
            </div>
          </CardContent>
          <CardContent className={classes.contentBottom}>
            <div className={classes.supplyName}>
              <Typography variant="body2">G/L일자/전표유형</Typography>
              <Typography variant="h6">{invoice.RPDGJ} / {invoice.RPDCT}</Typography>
            </div>
            <div className={classes.stats}>
              <Typography variant="body2">송장일자</Typography>
              <Typography variant="h6">{invoice.RPDSVJ}</Typography>
            </div>
            <div className={classes.bigo}>
              <Typography variant="body2">지급예정일</Typography>
              <Typography variant="h6">{invoice.RPDDJ}</Typography>
            </div>
            <div className={classes.bigo}>
              <Typography variant="body2">세금정보</Typography>
              <Typography variant="h6">{invoice.RPEXR1NM}</Typography>
            </div>
          </CardContent>
          <CardContent className={classes.erpDetailTable}>
            <MY_erpDetailTable invoices={invoices.filter(my_invoice => my_invoice.RPDOC === invoice.RPDOC)}/>
          </CardContent>
          <Divider/>
          <MY_InvoiceDetailCard_Attachment
            setSelectedImgPath={setSelectedImgPath}
            selectedImgPath={selectedImgPath}
            openAttachment={openAttachment}
            setOpenAttachment={setOpenAttachment}
            handleAttachments={handleAttachments}
            type={type}
            attachments={attachments}
            invoiceId={invoice.id}/>
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
