import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent, Divider, Grid,
  Typography,
} from '@material-ui/core';
import MY_InvoiceDetailCard_Attachment from "./MY_InvoiceDetailCard_Attachment";
import getSumInvoices from "../utils/getSumInvoices";
import MY_erpDetailTable_G from "./MY_erpDetailTable_G";


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
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%'
    }
  },
  stats: {
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
        {invoices.filter(invoice => invoice.RPSEQ === 1).length}
        건 /
        {' '}
        {getSumInvoices(invoices)}
        원
      </Typography>

      {invoices.filter(invoice => invoice.RPSEQ === 1).map((invoice, i) => (
        <Card
          key={i}
          className={clsx(classes.root, className)}
        >
        <CardContent className={classes.content}>
        </CardContent>
        <CardContent className={classes.contentBottom}>
          <div className={classes.bigo}>
            <Typography variant="body2">제목</Typography>
            <Typography variant="h6">{invoice.RPRMK}</Typography>
          </div>
          <div className={classes.supplyName}>
            <Typography variant="body2">배치번호/문서번호</Typography>
            <Typography variant="h6">{invoice.RPICU}/{invoice.RPDOC}</Typography>
          </div>
          <div className={classes.supplyName}>
            <Typography variant="body2">G/L일자</Typography>
            <Typography variant="h6">{invoice.RPDGJ}</Typography>
          </div>
          <div className={classes.stats}>
            <Typography variant="body2">전표유형</Typography>
            <Typography variant="h6">{invoice.RPDCT}</Typography>
          </div>
        </CardContent>
        <CardContent className={classes.erpDetailTable}>
          <MY_erpDetailTable_G invoices={invoices.filter(my_invoice =>  my_invoice.RPDOC === invoice.RPDOC)} />
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
