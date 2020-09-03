import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {makeStyles} from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import GenericMoreButton from 'src/components/GenericMoreButton';
import {useDispatch, useSelector} from "react-redux";
import useWindowDimensions from "../../components/WindowDimenstions";
import Index from "./Modal";
import {documents} from '../../mock/my_documentsMock';
import getPerfectScrollbarHeight from "../../utils/getPerfectScrollbarHeight";
import LoadingBar from "../../components/MY_LoadingBar";
import getCurrency from "../../utils/getCurrency";
import moment from "moment";
import {getTodoCount, isloading} from "../../actions";
import axios from "../../utils/my_axios";

const useStyles = makeStyles((theme) => ({
  root: {},
  header: {
    fontWeight: 650,
    textAlign: 'center',
  },
  tableRows: {
    cursor: 'pointer'
  },
  content: {
    textAlign: 'center',
    padding: 0
  },
  supplyCell: {
    fontFamily: 'GmarketSansBold',
  },
  inner: {
    minWidth: 700,
  },
  whiteSpaceNoWrap: {
    whiteSpace: 'nowrap'
  },
  fontWeight: {
    fontWeight: 600
  },
  mobileInner: props => ({
    minWidth: 500,
    height: props.mobileInnerHeight,
    whiteSpace: 'nowrap'
  }),
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  },
  nameCell: {
    fontColor: 'red',
    display: 'flex',
    alignItems: 'center'
  },
}));

function CcResults({className, fetchDocuments, documents, page, totalCount, setPage}) {
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const [selectedDocument, setSelectedDocument] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const {height, width} = useWindowDimensions();
  const rowsPerPage = 25;

  const props = { mobileInnerHeight: getPerfectScrollbarHeight(rowsPerPage, totalCount, 60)};
  const classes = useStyles(props);

  const handleChangePage = (event, page) => {
    setPage(page);
  };

  const getCc = (document) => {
    return document.carbon_copys.find(cc => cc.receiver_id === session.user.id);
  };

  const getIsReaded = (document) => {
    return !getCc(document).is_readed;
  };

  const handleTableClick = (document) => {
    const cc = getCc(document);
    if(cc.is_readed === false){
      cc.is_readed = true;
      const config = {
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      };
      axios.post(`ea/cc_update/${cc.id}`, {}, config)
        .then(response =>  dispatch(getTodoCount(session.token)))
    }

    const newDocument = documents.find(my_document => my_document.id === document.id);
    setSelectedDocument(newDocument);
    setOpenModal(true);
  };


  const completeReportModal = () => {
    fetchDocuments();
    setOpenModal(false);
  };

  const closeReportModal = () => {
    setOpenModal(false);
  };

  const getClassName = () => width < 1024;

  return (
    <div
      className={clsx(classes.root, className)}
    >
      <LoadingBar />
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        {totalCount}
        {' '}
        Records found. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(totalCount / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          title="수신참조 내역"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={getClassName() ? classes.mobileInner : classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.header}>결재번호</TableCell>
                    <TableCell className={classes.header}>타입</TableCell>
                    <TableCell className={classes.header}>제목</TableCell>
                    <TableCell className={classes.header}>금액</TableCell>
                    <TableCell className={classes.header}>기안일자</TableCell>
                    <TableCell className={classes.header}>기안부서</TableCell>
                    <TableCell className={classes.header}>기안자</TableCell>
                    <TableCell className={classes.header}>문서상태</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((document, i) => (
                    <TableRow
                      className={classes.tableRows}
                      onClick={() => handleTableClick(document)}
                      hover
                      key={document.id}
                    >
                      <TableCell
                        align="center"
                        className={clsx(classes.whiteSpaceNoWrap, getIsReaded(document) ? classes.fontWeight : null)}>
                        {document.id}
                      </TableCell>
                      <TableCell
                        align="center"
                        className={clsx(classes.whiteSpaceNoWrap, getIsReaded(document) ? classes.fontWeight : null)}>
                        {document.document_type}
                      </TableCell>
                      <TableCell
                        className={clsx(classes.whiteSpaceNoWrap, getIsReaded(document) ? classes.fontWeight : null)}>
                        {document.title}
                      </TableCell>
                      <TableCell
                        className={clsx(classes.whiteSpaceNoWrap, getIsReaded(document) ? classes.fontWeight : null)}>
                        {getCurrency(document.price)}
                      </TableCell>
                      <TableCell
                        align="center"
                        className={clsx(classes.whiteSpaceNoWrap, getIsReaded(document) ? classes.fontWeight : null)}>
                        {document.created}
                      </TableCell>
                      <TableCell
                        align="center"
                        className={clsx(classes.whiteSpaceNoWrap, getIsReaded(document) ? classes.fontWeight : null)}>
                        {document.department}
                      </TableCell>
                      <TableCell
                        align="center"
                        className={clsx(classes.whiteSpaceNoWrap, getIsReaded(document) ? classes.fontWeight : null)}>
                        {document.author}
                      </TableCell>
                      <TableCell
                        align="center"
                        className={clsx(classes.whiteSpaceNoWrap, getIsReaded(document) ? classes.fontWeight : null)}
                      >
                        {document.doc_status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <CardActions className={classes.actions}>
          <TablePagination
            component="div"
            count={totalCount}
            onChangePage={handleChangePage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
          />
        </CardActions>
      </Card>
      {openModal
      && (
      <Index
        document={selectedDocument}
        invoices={selectedDocument.invoices}
        onClose={closeReportModal}
        onComplete={completeReportModal}
        open={openModal}
      />
      ) }
    </div>
  );
}

CcResults.propTypes = {
  className: PropTypes.string,
  fetchDocuments: PropTypes.func,
  page: PropTypes.number,
  totalCount: PropTypes.number,
  setPage: PropTypes.func,
  documents: PropTypes.array
};

CcResults.defaultProps = {
  documents: []
};

export default CcResults;
