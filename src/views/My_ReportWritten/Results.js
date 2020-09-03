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
import {useDispatch, useSelector} from "react-redux";
import useWindowDimensions from "../../components/WindowDimenstions";
import Index from "./Modal";
import getPerfectScrollbarHeight from "../../utils/getPerfectScrollbarHeight";
import LoadingBar from "../../components/MY_LoadingBar";
import getCurrency from "../../utils/getCurrency";
import axios from "../../utils/my_axios";
import {getTodoCount} from "../../actions";

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
  fontWeight: {
    fontWeight: 600
  },
  whiteSpaceNoWrap: {
    whiteSpace: 'nowrap'
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

function Results({
  className, fetchDocuments, documents, page, totalCount, setPage
}) {
  const [selectedDocument, setSelectedDocument] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const {height, width} = useWindowDimensions();
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();

  const rowsPerPage = 25;

  const props = {mobileInnerHeight: getPerfectScrollbarHeight(rowsPerPage, totalCount, 60)};
  const classes = useStyles(props);

  const handleChangePage = (event, page) => {
    setPage(page);
  };

  const handleTableClick = (id) => {
    const newDocument = documents.find(document => document.id === id);
    if (checkReadedAfterFinising(newDocument)) {
      newDocument.is_readed_after_finishing = true;
      const config = {
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      };
      axios.post(`ea/document_is_readed_update/${newDocument.id}`, {}, config)
        .then(response => dispatch(getTodoCount(session.token)));
    }

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

  const checkReadedAfterFinising = (document) => session.user.id === document.author_id && !document.is_readed_after_finishing && document.doc_status === "결재완료";

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
          title="결재 내역"
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
                    <TableCell className={classes.header}>배치번호</TableCell>
                    <TableCell className={classes.header}>사업장</TableCell>
                    <TableCell className={classes.header}>G/L일자</TableCell>
                    <TableCell className={classes.header}>제목</TableCell>
                    <TableCell className={classes.header}>금액</TableCell>
                    <TableCell className={classes.header}>기안일자</TableCell>
                    <TableCell className={classes.header}>기안부서</TableCell>
                    <TableCell className={classes.header}>기안자</TableCell>
                    <TableCell className={classes.header}>문서상태</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((document, i) => {
                    let highlighting = false;
                    if (checkReadedAfterFinising(document)) {
                      highlighting = true;
                    }

                    return (
                      <TableRow
                        className={classes.tableRows}
                        onClick={() => handleTableClick(document.id)}
                        hover
                        key={document.id}
                      >
                        <TableCell
                          align="center"
                          className={clsx(classes.whiteSpaceNoWrap, highlighting
                            ? classes.fontWeight : null)}
                        >
                          {document.id}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={clsx(classes.whiteSpaceNoWrap, highlighting
                            ? classes.fontWeight : null)}
                        >
                          {document.document_type}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={clsx(classes.whiteSpaceNoWrap, highlighting
                            ? classes.fontWeight : null)}
                        >
                          {document.batch_number}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={clsx(classes.whiteSpaceNoWrap, highlighting
                            ? classes.fontWeight : null)}
                        >
                          {document.invoices[0].RPCO}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={clsx(classes.whiteSpaceNoWrap, highlighting
                            ? classes.fontWeight : null)}
                        >
                          {document.invoices[0].RPDGJ}
                        </TableCell>
                        <TableCell className={clsx(classes.whiteSpaceNoWrap, highlighting
                          ? classes.fontWeight : null)}
                        >
                          {document.title}
                        </TableCell>
                        <TableCell className={clsx(classes.whiteSpaceNoWrap, highlighting
                          ? classes.fontWeight : null)}
                        >
                          {getCurrency(document.price)}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={clsx(classes.whiteSpaceNoWrap, highlighting
                            ? classes.fontWeight : null)}
                        >
                          {document.created}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={clsx(classes.whiteSpaceNoWrap, highlighting
                            ? classes.fontWeight : null)}
                        >
                          {document.department}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={clsx(classes.whiteSpaceNoWrap, highlighting
                            ? classes.fontWeight : null)}
                        >
                          {document.author}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={clsx(classes.whiteSpaceNoWrap, highlighting
                            ? classes.fontWeight : null)}
                        >
                          {document.doc_status}
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
      )}
    </div>
  );
}

Results.propTypes = {
  className: PropTypes.string,
  fetchDocuments: PropTypes.func,
  page: PropTypes.number,
  totalCount: PropTypes.number,
  setPage: PropTypes.func,
  documents: PropTypes.array
};

Results.defaultProps = {
  documents: []
};

export default Results;
