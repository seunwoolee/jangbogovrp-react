import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {makeStyles} from '@material-ui/styles';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
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
import BottomBar from "./BottomBar/BottomBar";
import useWindowDimensions from "../../components/WindowDimenstions";
import Index from "./Modal";
import getCurrency from "../../utils/getCurrency";
import MySnackbars from "../../components/MY_snackbar";
import getPerfectScrollbarHeight from "../../utils/getPerfectScrollbarHeight";
import {documents} from "../../mock";
import axios from "../../utils/my_axios";
import LoadingBar from "../../components/MY_LoadingBar";
import {getTodoCount, isloading} from "../../actions";

const useStyles = makeStyles((theme) => ({
  root: {},
  header: {
    fontWeight: 650,
    textAlign: 'center',
  },
  content: {
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
  mobileInner: props => ({
    minWidth: 500,
    height: props.mobileInnerHeight,
    whiteSpace: 'nowrap'
  }),
  nameCell: {
    fontColor: 'red',
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  },
  tableRow: {
    cursor: 'pointer'
  }
}));

function Results({className, documents, fetchDocuments, ...rest}) {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [openModal, setOpenModal] = useState(false);
  const {height, width} = useWindowDimensions();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();

  const startData = page * rowsPerPage;
  const endData = (page * rowsPerPage) + rowsPerPage;

  const props = { mobileInnerHeight: getPerfectScrollbarHeight(rowsPerPage, documents.length, 60)};
  const classes = useStyles(props);
  const dispalyedDocuments = documents.slice(startData, endData);

  useEffect(() => {
    setPage(0);
  }, [documents]);

  const handleSelectAll = (event) => {
    event.target.checked ? setSelectedDocuments(dispalyedDocuments) : setSelectedDocuments([]);
  };

  const handleSelectOne = (event, invoice) => {
    const selectedIndex = selectedDocuments.map(invoice => invoice.id).indexOf(invoice.id);
    let newSelectedInvocies = [];

    if (selectedIndex === -1) {
      newSelectedInvocies = newSelectedInvocies.concat(selectedDocuments, invoice);
    } else if (selectedIndex === 0) {
      newSelectedInvocies = newSelectedInvocies.concat(
        selectedDocuments.slice(1)
      );
    } else if (selectedIndex === selectedDocuments.length - 1) {
      newSelectedInvocies = newSelectedInvocies.concat(
        selectedDocuments.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedInvocies = newSelectedInvocies.concat(
        selectedDocuments.slice(0, selectedIndex),
        selectedDocuments.slice(selectedIndex + 1)
      );
    }
    setSelectedDocuments(newSelectedInvocies);
  };

  const handleChangePage = (event, page) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  const openReportModal = () => {
    setOpenModal(true);
  };


  const completeReportModal = (opinion: string, type: string) => {
    const headers = {Authorization: `Token ${session.token}`};
    const currentDocument = selectedDocuments[0];
    const data = {
      document_id: currentDocument.id,
      username: session.user.id,
      opinion,
      sign_type: type
    };
    dispatch(isloading(true));
    axios.post('ea/do_sign/', data, {headers})
      .then(response => {
        dispatch(getTodoCount(session.token));
        dispatch(isloading(false));
        setSnackbarOpen(true);
        setIsSuccess(true);
        const newDocuments = selectedDocuments.slice(1);
        if (newDocuments.length === 0) {
          setOpenModal(false);
          setSelectedDocuments(newDocuments);
          fetchDocuments();
          return;
        }
        setSelectedDocuments(newDocuments);
      })
      .catch(error => {
        dispatch(isloading(false));
        console.log(error)
      });
  };

  const closeReportModal = () => {
    setOpenModal(false);
  };

  const getClassName = () => width < 1024;

  const handleSnackbarOpen = (bool) => {
    setSnackbarOpen(bool);
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <LoadingBar />
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        {documents.length}
        {' '}
        Records found. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(documents.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader
          // action={<GenericMoreButton />}
          title="미결함"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={getClassName() ? classes.mobileInner : classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" padding="checkbox">
                      <Checkbox
                        checked={selectedDocuments.length === dispalyedDocuments.length}
                        color="primary"
                        indeterminate={
                          selectedDocuments.length > 0
                          && selectedDocuments.length < documents.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell className={classes.header}>결재번호</TableCell>
                    <TableCell className={classes.header}>전표수</TableCell>
                    <TableCell className={classes.header}>제목</TableCell>
                    <TableCell className={classes.header}>금액</TableCell>
                    <TableCell className={classes.header}>기안일자</TableCell>
                    <TableCell className={classes.header}>기안부서</TableCell>
                    <TableCell className={classes.header}>기안자</TableCell>
                    <TableCell className={classes.header}>문서상태</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dispalyedDocuments.map((document, i) => (
                    <TableRow
                      hover
                      key={document.id}
                      selected={selectedDocuments.map(document => document.id).indexOf(document.id) !== -1}
                    >
                      <TableCell align="center" padding="checkbox">
                        <Checkbox
                          checked={
                            selectedDocuments.map(document => document.id).indexOf(document.id) !== -1
                          }
                          color="primary"
                          onChange={(event) => handleSelectOne(event, document)}
                          value={selectedDocuments.map(document => document.id).indexOf(document.id) !== -1}
                        />
                      </TableCell>

                      <TableCell align="center" className={classes.whiteSpaceNoWrap}>{document.id}</TableCell>
                      <TableCell align="center" className={classes.whiteSpaceNoWrap}>{document.invoices_count}</TableCell>
                      <TableCell className={classes.whiteSpaceNoWrap}>{document.title}</TableCell>
                      <TableCell className={classes.whiteSpaceNoWrap}>{getCurrency(document.price)}</TableCell>
                      <TableCell align="center" className={classes.whiteSpaceNoWrap}>
                        {document.created}
                      </TableCell>
                      <TableCell align="center" className={classes.whiteSpaceNoWrap}>
                        {document.department}
                      </TableCell>
                      <TableCell align="center" className={classes.whiteSpaceNoWrap}>
                        {document.author}
                      </TableCell>
                      <TableCell align="center">{document.doc_status}</TableCell>
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
            count={documents.length}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardActions>
      </Card>
      <BottomBar
        fetchDocuments={fetchDocuments}
        onOpenModal={openReportModal}
        setSelectedDocuments={setSelectedDocuments}
        selectedDocuments={selectedDocuments} />
      {openModal && selectedDocuments.length
         && (
         <Index
           document={selectedDocuments[0]}
           invoices={selectedDocuments[0].invoices}
           onClose={closeReportModal}
           onComplete={completeReportModal}
           open={openModal}
         />
         )}
      {snackbarOpen
        ? <MySnackbars
          open={snackbarOpen}
          setOpen={handleSnackbarOpen}
          isSuccess={isSuccess}
          info={isSuccess ? "완료" : "에러 발생(전산팀 문의)"} />
        : null}
    </div>
  );
}

Results.propTypes = {
  className: PropTypes.string,
  documents: PropTypes.array,
  fetchDocuments: PropTypes.func
};

Results.defaultProps = {
  documents: []
};

export default Results;
