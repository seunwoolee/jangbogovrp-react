import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import uuid from 'uuid/v1';
import { useDropzone } from 'react-dropzone';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  colors
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import bytesToSize from 'src/utils/bytesToSize';
import MySnackbars from "./MY_snackbar";
import Tooltip from "@material-ui/core/Tooltip";
import {setIn} from "immutable";


const useStyles = makeStyles((theme) => ({
  root: {},
  dropZone: {
    border: `1px dashed ${theme.palette.divider}`,
    padding: theme.spacing(1),
    outline: 'none',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: colors.grey[50],
      opacity: 0.5,
      cursor: 'pointer'
    }
  },
  dragActive: {
    backgroundColor: colors.grey[50],
    opacity: 0.5
  },
  image: {
    width: 70
  },
  info: {
    marginTop: theme.spacing(1)
  },
  list: {
    maxHeight: 140
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

function FilesDropzone({ invoiceId, attachments, handleAttachments, className }) {
  const classes = useStyles();
  const [invoiceAttachments, setInvoiceAttachments] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [info, setInfo] = useState("이미지, PDF 파일만 Upload 가능합니다.(10MB 미만)");
  let validation = true;

  const handleDrop = (acceptedFiles, rejectedFiles) => {
    if(rejectedFiles.length > 0){
      return setSnackbarOpen(true);
    }

    for(let i=0; i< acceptedFiles.length; i++){
      const fileName: Array = acceptedFiles[i].name.split('_');
      if(fileName.length !== 3){
        validation = false;
        setInfo("파일명을 규칙에 맞게 작성해주세요.")
        break;
      }

      if(!Number(fileName[2].slice(0,8))){
        validation = false;
        setInfo("마지막 일자를 숫자 8자리만 입력해주세요.")
        break;
      }
    }

    if(!validation){
      return setSnackbarOpen(true);
    }

    const newAttachments ={};
    newAttachments[invoiceId] = acceptedFiles;
    handleAttachments((prevFiles) => {
      const prevInvoiceAttachments: Array = prevFiles.filter(file => invoiceId in file)
      const prevOthersAttachments: Array = prevFiles.filter(file => !(invoiceId in file))
      if(prevInvoiceAttachments.length > 0) {
        newAttachments[invoiceId] = [...prevInvoiceAttachments[0][invoiceId], ...newAttachments[invoiceId]]
      }
      return [...prevOthersAttachments, newAttachments]
    });
  };


  useEffect(() => {
    const newAttachments: Array = attachments.filter(attachment => invoiceId in attachment)
    if(newAttachments.length > 0) {
      return setInvoiceAttachments(newAttachments[0][invoiceId])
    }
    setInvoiceAttachments(newAttachments)
  }, [attachments])

  const handleRemoveAll = (invoiceId) => {
    const othersAttachments: Array = attachments.filter(attachment => !(invoiceId in attachment))
    handleAttachments([...othersAttachments])
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/*, .pdf',
    maxSize: 10000000 // 10MB
  });

  const handleSnackbarOpen = (bool) => {
    setSnackbarOpen(bool);
  };

  return (
    <div
      className={clsx(classes.root, className)}
    >
      <Tooltip
        title={<>
                <Typography style={{fontSize: 13}} color="inherit">파일명 규칙: 첨부유형_회사명_일자(숫자 8자리)</Typography>
                  <em>{"ex)"}</em> {'세금계산서_승우전자_20200612'} {' '}
              </>}
      >
      <div
        className={clsx({
          [classes.dropZone]: true,
          [classes.dragActive]: isDragActive
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div>
          <img
            alt="Select file"
            className={classes.image}
            src="/images/undraw_add_file2_gvbb.svg"
          />
        </div>
        <div>
          <Typography
            gutterBottom
            variant="h4"
          >
            파일 선택
          </Typography>
          <Typography
            className={classes.info}
            color="textSecondary"
            variant="body1"
          >
            파일을 끌어다 올리거나 클릭하세요
          </Typography>
        </div>
      </div>
      </Tooltip>
      {invoiceAttachments.length > 0 && (
        <>
          <PerfectScrollbar options={{ suppressScrollX: true }}>
            <List className={classes.list}>
              {invoiceAttachments.map((file, i) => (
                <ListItem
                  divider={i < invoiceAttachments.length - 1}
                  key={uuid()}
                >
                  <ListItemIcon>
                    <FileCopyIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    primaryTypographyProps={{ variant: 'h5' }}
                    secondary={bytesToSize(file.size)}
                  />
                </ListItem>
              ))}
            </List>
          </PerfectScrollbar>
          <div className={classes.actions}>
            <Button
              color="secondary"
              variant="contained"
              onClick={()=>handleRemoveAll(invoiceId)}
              size="small"
            >
              모두 삭제
            </Button>
          </div>
        </>
      )}
      {snackbarOpen
        ? (
          <MySnackbars
            open={snackbarOpen}
            setOpen={handleSnackbarOpen}
            isSuccess={false}
            info={info}
          />
        ) : null}
    </div>
  );
}

FilesDropzone.propTypes = {
  invoiceId: PropTypes.string,
  attachments: PropTypes.array,
  handleAttachments: PropTypes.func,
  className: PropTypes.string
};

export default FilesDropzone;
