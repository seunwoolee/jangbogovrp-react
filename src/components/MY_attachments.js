import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import uuid from 'uuid/v1';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {makeStyles} from '@material-ui/styles';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  colors, Hidden, Card
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import bytesToSize from 'src/utils/bytesToSize';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import GetAppIcon from '@material-ui/icons/GetApp';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import {pdfjs, Document, Page} from 'react-pdf';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Draggable from 'react-draggable';
import Tooltip from "@material-ui/core/Tooltip";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import useTheme from "@material-ui/core/styles/useTheme";

import RotateRightIcon from '@material-ui/icons/RotateRight';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import {avatar_URL} from "../my_config";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Dialog from "@material-ui/core/Dialog";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles((theme) => ({
  root: {
    // position: "relative"
  },
  image: {
    width: 130
  },
  list: {
    maxHeight: 280
  },
  img: {
    maxWidth: '100%',
  },
  imgWrapper: {
    overflow: 'scroll',
    maxWidth: '100%',
  },
  dialogPaper: {
    margin: theme.spacing(1)
  },
  dialogRoot: {
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    '& .MuiDialog-container': {
      justifyContent: 'flex-end'
    },
  },
  dialogTitle: {
    padding: theme.spacing(1),
    cursor: 'move',
    backgroundColor: theme.palette.primary.main,
    '& h2': {
      color: theme.palette.primary.contrastText
    }
  },
  attachmentCard: {
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
  attachmentCardHeader: {
    padding: theme.spacing(1),
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  },
  actions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  }
}));


function MY_attachments({attachments, openAttachment, setOpenAttachment, selectedImgPath, setSelectedImgPath}) {
  const classes = useStyles();
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [rotate, setRotate] = React.useState(0);

  const rotateLeft = () => {
    setRotate(prev => prev - 90);
  };

  const rotateRight = () => {
    setRotate(prev => prev + 90);
  };

  const handleClickOpen = (imgPath) => {
    setOpenAttachment('block');
    setSelectedImgPath(`${avatar_URL}${imgPath}`);
  };

  const handleClose = () => {
    setOpenAttachment('None');
    setSelectedImgPath('');
    setPageNumber(1);
  };

  const onDocumentLoadSuccess = ({numPages}) => {
    setNumPages(numPages);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <div
      className={classes.root}
    >
      <>
        <PerfectScrollbar options={{suppressScrollX: true}}>
          <List className={classes.list}>
            {attachments.map((file, i) => (
              <Tooltip key={uuid()} disableHoverListener={!(file.isImg || file.isPdf)} title="미리보기">
                <ListItem
                  button={file.isImg || file.isPdf}
                  onClick={file.isImg || file.isPdf ? () => handleClickOpen(file.path) : null}
                  divider={i < attachments.length - 1}
                >
                  <ListItemIcon>
                    <FileCopyIcon/>
                  </ListItemIcon>
                  <ListItemText
                    primary={file.title}
                    primaryTypographyProps={{variant: 'h5'}}
                    secondary={bytesToSize(file.size)}
                  />
                  <ListItemSecondaryAction>
                    <a target="_blank" href={`${avatar_URL}${file.path}`}>
                      <Tooltip title="다운로드">
                        <IconButton>
                          <GetAppIcon/>
                        </IconButton>
                      </Tooltip>
                    </a>
                  </ListItemSecondaryAction>
                </ListItem>
              </Tooltip>
            ))}

          </List>
        </PerfectScrollbar>
      </>


      <Card className={classes.attachmentCard} style={{display: openAttachment}}>
        <CardHeader
          classes={{title: classes.attachmentCardHeader}}
          className={classes.attachmentCardHeader}
          title="첨부파일"
          action={
            <>
              <Hidden mdDown>
                <Tooltip title="이미지 좌 회전">
                  <IconButton style={{color: 'white', zIndex: 9999}} onClick={rotateLeft}>
                    <RotateLeftIcon style={{fontSize: "2rem"}} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="이미지 우 회전">
                  <IconButton style={{color: 'white', zIndex: 9999}} onClick={rotateRight}>
                    <RotateRightIcon style={{fontSize: "2rem"}} />
                  </IconButton>
                </Tooltip>
              </Hidden>
            <Button style={{zIndex: 9999}} onClick={handleClose} color="primary" variant="contained">닫기</Button>
            </>
          }
        >
        </CardHeader>
        <CardContent style={{transform: `rotate(${rotate}deg)`}}>
          {selectedImgPath.substr(selectedImgPath.length - 3).toLowerCase() !== 'pdf'
            ? (<div className={classes.imgWrapper}><img src={selectedImgPath} className={classes.img} alt="이미지"/></div>)
            : (
            <>
                <Document
                  options={{
                    cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
                    cMapPacked: true,
                  }}
                  file={selectedImgPath}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page width={fullScreen ? 900 : null} pageNumber={pageNumber} />
                </Document>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid>
                    <Button onClick={() => setPageNumber(prevPageNumber => prevPageNumber - 1)}>
                      <NavigateBeforeIcon />
                    </Button>
                  </Grid>
                  <Grid>
                    <Button onClick={() => setPageNumber(prevPageNumber => prevPageNumber + 1)}>
                      <NavigateNextIcon />
                    </Button>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid>
                    <p>
                      페이지
                      {' '}
                      {pageNumber}
                      {' '}
                      /
                      {numPages}
                    </p>
                  </Grid>
                </Grid>
            </>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

MY_attachments.propTypes = {
  attachments: PropTypes.array,
  openAttachment: PropTypes.string,
  setOpenAttachment: PropTypes.func,
  selectedImgPath: PropTypes.string,
  setSelectedImgPath: PropTypes.func,
};

export default MY_attachments;
