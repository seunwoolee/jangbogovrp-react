import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {
  Modal,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Divider,
  TextField,
  Button, Table, TableBody, TableRow, TableCell
} from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import ChooseDialog from '../Dialog';
import axios from "../../../utils/my_axios";
import {getErpTodoCount, getTodoCount, isloading} from "../../../actions";
import LoadingBar from "../../../components/MY_LoadingBar";
import getInvoiceDetailCard from "../../../utils/getInvoiceDetailCard";

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 820,
    height: 820,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  cardContent: {
    paddingTop: theme.spacing(1)
  },
  cardHeaderRoot: {
    backgroundColor: theme.palette.primary.main,
  },
  cardHeaderTitle: {
    color: theme.palette.primary.contrastText
  },
  tableCellTitle: {
    textAlign: 'center',
    width: '50px',
    backgroundColor: '#eeeeee'
  },
  tableCellContent: {
    width: '100px',
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

function Index({
  open, onClose, onComplete, invoices, className, invoiceType, setSnackbarsOpen, setIsSuccess, setInfo
}) {
  const classes = useStyles();
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();

  const inputTitleRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [inputAttachments, setInputAttachments] = useState([]);

  const handleAttachments = (attachments: Array) => {
    setInputAttachments(attachments);
  };

  const handleClickOpen = () => {
    if (inputTitleRef.current.value.length === 0) {
      setSnackbarsOpen(true);
      setIsSuccess(false);
      setInfo("제목을 입력해주세요");
      return;
    }
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = (users: Array, receivers: Array) => {
    const headers = {Authorization: `Token ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data'};
    const axiosConfig = {headers};
    const url = 'ea/create_document/';
    const invoiceArray: Array = [];
    const filesArray: Array = [];
    const filesCountArray: Array = [];

    for(const invoice in invoices) {
      const invoice_id: string = invoices[invoice].id;
      invoiceArray.push(invoice_id);
      let invoiceFiles: Array = null;

      const invoiceAttachments = inputAttachments.filter(inputAttachment => invoice_id in inputAttachment);

      if (invoiceAttachments.length > 0) {
        invoiceFiles = invoiceAttachments[0][invoice_id];
      }

      if (invoiceFiles) {
        filesArray.push(...invoiceFiles);
        filesCountArray.push(invoiceFiles.length);
      } else {
        filesCountArray.push(0);
      }
    }

    const formData = new FormData();
    formData.append('batch_number', invoices[0].RPICU);
    formData.append('document_type', invoiceType.toString());
    formData.append('author', session.user.id);
    formData.append('title', inputTitleRef.current.value);
    formData.append('approvers', JSON.stringify(users));
    formData.append('receivers', JSON.stringify(receivers));

    filesArray.map(file => formData.append('files', file));
    invoiceArray.map(invoiceId => formData.append('invoices', invoiceId));
    filesCountArray.map(fileCount => formData.append('counts', fileCount));
    dispatch(isloading(true));
    axios.post(url, formData, axiosConfig)
      .then(response => {
        dispatch(isloading(false));
        setOpenDialog(false);
        inputTitleRef.current.value = '';
        setInputAttachments([]);
        dispatch(getTodoCount(session.token));
        dispatch(getErpTodoCount(localStorage.getItem('token')));
        response.status === 201 ? onComplete(true) : onComplete(false);
      })
      .catch(error => {
        dispatch(isloading(false));
        setOpenDialog(false);
        inputTitleRef.current.value = '';
        setInputAttachments([]);
        onComplete(false);
      });
  };

  const invoiceDetailCard = getInvoiceDetailCard(invoiceType, invoices, inputAttachments, 'write', handleAttachments);

  return (
    <>
      <Modal
        disableBackdropClick
        onClose={onClose}
        open={open}
      >
        <Card
          className={clsx(classes.root, className)}
        >
          <form>
            <CardHeader
              classes={{root: classes.cardHeaderRoot, title: classes.cardHeaderTitle}}
              title="기안 작성"
            />
            <Divider />
            <CardContent>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className={classes.tableCellTitle}>작성자</TableCell>
                        <TableCell className={classes.tableCellContent}>{session.user.name}</TableCell>
                        <TableCell className={classes.tableCellTitle}>작성일자</TableCell>
                        <TableCell className={classes.tableCellContent}>{new Date().toISOString().slice(0, 10)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    inputRef={inputTitleRef}
                    fullWidth
                    label="제목"
                    name="title"
                    variant="outlined"
                  />
                </Grid>
                <Divider />
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  {invoiceDetailCard}
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions className={classes.actions}>
              <Button onClick={onClose}>
                닫기
              </Button>
              <Button
                color="primary"
                onClick={handleClickOpen}
                variant="contained"
              >
                결재요청
              </Button>
            </CardActions>
          </form>

          <LoadingBar />

        </Card>
      </Modal>
      <ChooseDialog
        open={openDialog}
        onClose={handleClose}
        onSubmit={handleSubmit}
        invoiceType={invoiceType}
      />
    </>
  );
}

Index.propTypes = {
  className: PropTypes.string,
  invoiceType: PropTypes.string,
  invoices: PropTypes.array,
  onClose: PropTypes.func,
  onComplete: PropTypes.func,
  open: PropTypes.bool,
  setSnackbarsOpen: PropTypes.func,
  setIsSuccess: PropTypes.func,
  setInfo: PropTypes.func
};


export default Index;
