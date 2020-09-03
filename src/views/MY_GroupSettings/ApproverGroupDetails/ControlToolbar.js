import React, {useRef, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {
  Card,
  IconButton,
  Toolbar,
  Tooltip,
} from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import RemoveCircleTwoToneIcon from '@material-ui/icons/RemoveCircleTwoTone';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import {INVOICETYPE} from "../../My_ReportCreate";
import ChooseDialog from "../../My_ReportCreate/Dialog";
import Input from "@material-ui/core/Input";
import MySnackbars from "../../../components/MY_snackbar";
import {isloading} from "../../../actions";
import axios from "../../../utils/my_axios";
import {useDispatch} from "react-redux";
import LoadingBar from "../../../components/MY_LoadingBar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.white
  },
  backButton: {
    marginRight: theme.spacing(2),
    '@media (min-width: 864px)': {
      display: 'none'
    }
  },
  user: {
    flexShrink: 0,
    flexGrow: 1
  },
  activity: {
    display: 'flex',
    alignItems: 'center'
  },
  statusBullet: {
    marginRight: theme.spacing(1)
  },
  search: {
    height: 42,
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'center',
    flexBasis: 300,
    marginLeft: 'auto',
    [theme.breakpoints.down('sm')]: {
      flex: '1 1 auto'
    }
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.icon
  },
  searchInput: {
    flexGrow: 1
  }
}));

function ControlToolbar({className, selectedSignGroup, fetchSignGroup}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [info, setInfo] = useState("완료");
  const [groupName, setGroupName] = useState('');
  const headers = {Authorization: `Token ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data'};
  const axiosConfig = {headers};

  const handleSnackbarOpen = (bool) => {
    setSnackbarOpen(bool);
  };

  const handleDialogOpen = () => {
    if(groupName.length === 0){
      setSnackbarOpen(true);
      setInfo('그룹이름을 입력해주세요');
      setIsSuccess(false);
      return;
    }
    setOpen(true);
  };

  const handleDeleteGroup = () => {
    if(window.confirm('선택된 결재그룹을 삭제 하시겠습니까?')){
      const url = 'ea/delete_sign_group/' + selectedSignGroup.id;
      axios.delete(url, axiosConfig)
        .then(response => changeStateAfterAxios('완료', true))
        .catch(error => changeStateAfterAxios('에러발생', false))
    }
  };

  const changeStateAfterAxios = (info: string, isSuccess: boolean) => {
    dispatch(isloading(false));
    setSnackbarOpen(true);
    setInfo(info);
    setIsSuccess(isSuccess);
    setGroupName('');
    fetchSignGroup();
  }

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleSubmit = (users: Array, receivers: Array) => {
    const url = 'ea/create_sign_group/';
    const formData = new FormData();

    formData.append('approvers', JSON.stringify(users));
    formData.append('receivers', JSON.stringify(receivers));
    formData.append('groupName', groupName);
    dispatch(isloading(true));
    axios.post(url, formData, axiosConfig)
      .then(response => {
        changeStateAfterAxios('완료', true);
        handleDialogClose();
      })
      .catch(error => {
        changeStateAfterAxios('동일한 그룹 이름이 있습니다.', false);
        handleDialogClose();
      });
  };


  return (
    <>
    <Toolbar
      className={clsx(classes.root, className)}
    >
      <Tooltip title="Back">
        <IconButton
          className={classes.backButton}
          component={RouterLink}
          edge="start"
          to="/chat"
        >
          <KeyboardBackspaceIcon/>
        </IconButton>
      </Tooltip>
      <div className={classes.user}>
        <Input
          onChange={(event => {setGroupName(event.target.value)})}
          value={groupName}
          disableUnderline
          placeholder="그룹이름"
        />
      </div>
      <div>
        <Tooltip title="신규등록">
          <IconButton onClick={handleDialogOpen}>
            <AddCircleTwoToneIcon/>
          </IconButton>
        </Tooltip>
        {selectedSignGroup ? (
        <>
        <Tooltip title="삭제">
          <IconButton onClick={handleDeleteGroup}>
            <RemoveCircleTwoToneIcon/>
          </IconButton>
        </Tooltip>
        </>
        ) : null}
      </div>
    </Toolbar>

      <ChooseDialog
        open={open}
        onClose={handleDialogClose}
        onSubmit={handleSubmit}
        invoiceType={INVOICETYPE.채무발생}
      />

      {snackbarOpen
        ? (
          <MySnackbars
            open={snackbarOpen}
            setOpen={handleSnackbarOpen}
            isSuccess={isSuccess}
            info={info}
          />
        ) : null}

      <LoadingBar />

    </>
  );
}

ControlToolbar.propTypes = {
  className: PropTypes.string,
  selectedSignGroup: PropTypes.object,
  fetchSignGroup: PropTypes.func
};

export default ControlToolbar;
