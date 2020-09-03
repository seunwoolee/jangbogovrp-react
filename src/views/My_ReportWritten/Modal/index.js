import React, {useState} from 'react';
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
  Button, Table, TableBody, TableRow, TableCell
} from '@material-ui/core';
import IconButton from "@material-ui/core/IconButton";
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import {useDispatch, useSelector} from "react-redux";
import MY_approverLine from "../../../components/MY_approverLine";
import MY_opinion from "../../../components/MY_opinion";
import getInvoiceDetailCard from "../../../utils/getInvoiceDetailCard";
import axios from "../../../utils/my_axios";
import {getErpTodoCount, getTodoCount, isloading, pushSave} from "../../../actions";
import LoadingBar from "../../../components/MY_LoadingBar";

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
    [theme.breakpoints.up('lg')]: {
      paddingLeft: theme.spacing(2),
      width: '100%',
      backgroundColor: 'transparent'
    },
    maxHeight: '100%',
    maxWidth: '100%'
  },
  innerDiv: {
    maxHeight: '100%',
    overflowY: "scroll",
    [theme.breakpoints.up('lg')]: {
      width: '900px',
      backgroundColor: 'white'
    }
  },
  tableCellTitle: {
    textAlign: 'center',
    width: '50px',
    backgroundColor: '#eeeeee'
  },
  tableCellContent: {
    width: '100px',
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
  iconColor: {
    color: 'white'
  },
  actions: {
    justifyContent: 'flex-end'
  },
  approverGrid: {
    paddingBottom: theme.spacing(2)
  }
}));

function Index({
  open, onClose, onComplete, document, invoices
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session);
  const [detailCardType, setDetailCardType] = useState('read');
  const [inputAttachments, setInputAttachments] = useState(document.attachments);
  const [typeIcon, setTypeIcon] = useState(0);

  const handleAttachments = (attachments: Array) => {
    setInputAttachments(attachments);
  };

  const invoiceDetailCard = getInvoiceDetailCard(document.document_type, invoices, inputAttachments,
    detailCardType, handleAttachments);

  const printDocument = () => {
    window.open(
      `/reportPrint?documentId=${document.id}`,
      "_blank",
      "width=700,height=700"
    );
  };

  const changeDetailCardMode = () => {
    setTypeIcon(1);
    setDetailCardType('write');
  };

  const uploadNewAttachment = () => {
    const headers = {Authorization: `Token ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data'};
    const axiosConfig = {headers};
    const url = 'ea/add_attachment/';
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
    formData.append('document_id', document.id);

    filesArray.map(file => formData.append('files', file));
    invoiceArray.map(invoiceId => formData.append('invoices', invoiceId));
    filesCountArray.map(fileCount => formData.append('counts', fileCount));
    dispatch(isloading(true));
    axios.post(url, formData, axiosConfig)
      .then(response => {
        dispatch(isloading(false));
        setInputAttachments([]);
        response.status === 201 ? onComplete(true) : onComplete(false);
      })
      .catch(error => {
        dispatch(isloading(false));
        setInputAttachments([]);
        onComplete(false);
      });
  };

  return (
    <>
      <Modal
        disableBackdropClick
        onClose={onClose}
        open={open}
      >
        <Card
          className={classes.root}
        >
          <div className={classes.innerDiv}>
            <CardHeader
              classes={{root: classes.cardHeaderRoot, title: classes.cardHeaderTitle}}
              title="상신문서"
              action={(
                <>
                  <IconButton style={{color: 'white'}} onClick={printDocument} aria-label="print">
                    <PrintOutlinedIcon />
                  </IconButton>
                  {document.author_id === session.user.id ? (
                    <>
                      {typeIcon === 0 ? (
                        <IconButton className={classes.iconColor} onClick={changeDetailCardMode} aria-label="addAttachment">
                          <AddToPhotosIcon />
                        </IconButton>
                      ) : (
                        <IconButton className={classes.iconColor} onClick={uploadNewAttachment} aria-label="uploadAttachment">
                          <CloudUploadIcon />
                        </IconButton>
                      )}
                    </>
                  ) : null}
                  <Button
                    onClick={onClose}
                    color="primary"
                    variant="contained"
                  >
                    닫기
                  </Button>
                </>
                )}
            />
            <Divider />
            <CardContent>
              <Grid
                className={classes.approverGrid}
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
              >
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <MY_approverLine signs={document.signs} />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TableContainer component={Paper}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className={classes.tableCellTitle}>작성자</TableCell>
                          <TableCell className={classes.tableCellContent}>{document.author}</TableCell>
                          <TableCell className={classes.tableCellTitle}>작성일자</TableCell>
                          <TableCell className={classes.tableCellContent}>{document.created}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tableCellTitle}>제목</TableCell>
                          <TableCell>{document.title}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Divider />
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  {invoiceDetailCard}
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <MY_opinion signs={document.signs.filter(sign => sign.comment !== null)} />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions className={classes.actions}>
              <Button
                color="primary"
                variant="contained"
                onClick={onClose}
              >
                닫기
              </Button>
            </CardActions>
          </div>

          <LoadingBar />

        </Card>
      </Modal>
    </>
  );
}

Index.propTypes = {
  className: PropTypes.string,
  document: PropTypes.object,
  invoices: PropTypes.array,
  onClose: PropTypes.func,
  onComplete: PropTypes.func,
  open: PropTypes.bool
};

Index.defaultProps = {
  open: false,
};

export default Index;
