import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {
  Modal,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Divider,
  Button, Table, TableBody, TableRow, TableCell, Typography
} from '@material-ui/core';
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import MY_approverLine from "../../../components/MY_approverLine";
import FormDialog from "../Dialog";
import MY_opinion from "../../../components/MY_opinion";
import getInvoiceDetailCard from "../../../utils/getInvoiceDetailCard";
import Tooltip from "@material-ui/core/Tooltip";

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
    [theme.breakpoints.up('lg')]: {
      width: '100px'
    },
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
  actions: {
    justifyContent: 'flex-end'
  },
  approverGrid: {
    paddingBottom: theme.spacing(2)
  },
}));

function Index({ open, onClose, onComplete, document, invoices, className }) {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleApprove = (opinion: string) => {
    onComplete(opinion, '승인');
    handleClose();
  };

  const handleReject = (opinion: string) => {
    onComplete(opinion, '반려');
    handleClose();
  };

  const handleKeyPress = (event) => {
    if (event.key === '1') {
      onComplete('', '승인');
    }
  };

  let invoiceDetailCard = getInvoiceDetailCard(document.document_type, invoices, document.attachments);

  return (
    <>
      <Modal
        onKeyPress={handleKeyPress}
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
              title="미결함"
              action={(
                <>
                <Tooltip
                  title={<><Typography style={{fontSize: 13}} color="inherit">키보드 1 누르면 결재가 됩니다.</Typography></>}
                >
                <Button
                  onClick={handleClickOpen}
                  color="primary"
                  variant="contained"
                >
                  결재
                </Button>
                </Tooltip>
                <Button
                  style={{backgroundColor: '#2962ff'}}
                  variant="contained"
                  onClick={onClose}
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
                          <TableCell className={classes.tableCellTitle}>작성일</TableCell>
                          <TableCell className={classes.tableCellContent}>{document.created}</TableCell>
                        </TableRow>
                        <TableRow>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tableCellTitle}>제목</TableCell>
                          <TableCell>{document.title}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tableCellTitle}>수신참조</TableCell>
                          <TableCell>{document.carbon_copys.map(cc => cc.receiver_name).join(', ')}</TableCell>
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
                  <MY_opinion signs={document.signs.filter(sign => sign.comment !== null)}/>
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

          <FormDialog
            open={openDialog}
            onClose={handleClose}
            onApprove={handleApprove}
            onReject={handleReject} />
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
