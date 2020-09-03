import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {
  Card,
  CardContent, Divider, Grid, Hidden,
  Typography,
} from '@material-ui/core';
import MY_erpDetailTable from "./MY_erpDetailTable";
import MY_InvoiceDetailCard_Attachment from "./MY_InvoiceDetailCard_Attachment";
import getSumInvoices from "../utils/getSumInvoices";
import moment from "moment";
import {isloading} from "../actions";
import axios from "../utils/my_axios";
import {useDispatch} from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import {INVOICETYPE} from "../views/My_ReportCreate";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import RotateRightIcon from "@material-ui/icons/RotateRight";
import Button from "@material-ui/core/Button";
import {Document, Page} from "react-pdf";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import MY_attachments from "./MY_attachments";


const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('lg')]: {
      maxWidth: '960px',
    },
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
    maxHeight: '90%',
    overflow: "scroll",
    position: 'fixed',
    right: 5,
    top: '5%',
    zIndex: 9999
  },
  header: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  },
}));

function MY_occurInvoicesCard({invoices, open, setOpen, className, cardClassName}) {
  const classes = useStyles();
  const [openAttachment, setOpenAttachment] = useState('none');
  const [selectedImgPath, setSelectedImgPath] = React.useState('');

  const handleClose = () => {
    setOpen('None');
  };

  const headerInvoice = invoices.find(invoice => invoice.RPSFX === '001' && invoice.RPSEQ === 1);

  return (
    <Card className={classes.root} style={{display: open}}>
      <CardHeader
        classes={{title: classes.header}}
        className={classes.header}
        title="발생전표"
        action={
          <Button onClick={handleClose} color="primary" variant="contained">닫기</Button>
        }
      >
      </CardHeader>
      <CardContent className={cardClassName} style={{cursor: 'default'}}>
        <div>
          <Typography variant="body2">배치번호</Typography>
          <Typography variant="h6">{headerInvoice.document.batch_number}</Typography>
        </div>
        <div>
          <Typography variant="body2">제목</Typography>
          <Typography variant="h6">{headerInvoice.document.title}</Typography>
        </div>
        <div>
          <Typography variant="body2">작성자</Typography>
          <Typography variant="h6">{headerInvoice.document.author}</Typography>
        </div>
        <div>
          <Typography variant="body2">결재상태</Typography>
          <Typography variant="h6">{headerInvoice.document.doc_status}</Typography>
        </div>
      </CardContent>
      <CardContent className={className}>
        <MY_erpDetailTable invoices={invoices}/>
        <MY_attachments
          openAttachment={openAttachment}
          setOpenAttachment={setOpenAttachment}
          setSelectedImgPath={setSelectedImgPath}
          selectedImgPath={selectedImgPath}
          attachments={headerInvoice.attachments}/>
      </CardContent>
    </Card>

  )
}

MY_occurInvoicesCard.propTypes = {
  className: PropTypes.string,
  cardClassName: PropTypes.string,
  invoices: PropTypes.array.isRequired,
  open: PropTypes.string,
  setOpen: PropTypes.func
};

export default MY_occurInvoicesCard;
