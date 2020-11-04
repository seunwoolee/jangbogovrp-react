import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import {makeStyles} from "@material-ui/styles";
import PropTypes from "prop-types";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import {useDispatch, useSelector} from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";
import axios from "../utils/my_axios";
import {pushSave} from "../actions";
import {swRegistration} from "../registerServiceWorker";
import urlB64ToUint8Array from "../utils/urlB64ToUint8Array";
import MySnackbars from "./MY_snackbar";

const useStyles = makeStyles((theme) => ({
  dialogTitleRoot: {
    backgroundColor: theme.palette.primary.main,
  },
  alarm: {
    paddingTop: theme.spacing(2),
  },
  password: {
    paddingBottom: theme.spacing(2),
  },
  dialogTitleText: {
    fontSize: '16px',
    color: theme.palette.primary.contrastText
  }
}));

export default function ChangePasswordDialog({open, onClose}) {
  const classes = useStyles();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [info, setInfo] = useState("완료");
  const [notificationIcon, setNotificationIcon] = useState(0);
  const [inputNewPassword, setInputNewPassword] = useState('');
  const [inputNewPassword2, setInputNewPassword2] = useState('');
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const applicationServerPublicKey = 'BBvGTYHuHHla8VcJjlLFyFpBM6iU-uaSqw5Afqgi_EkB9ctCvMRMKThD4_VJj8j9XZh8QdZf9O9HSjPcjc6jIZE';
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  const headers = {Authorization: `Token ${localStorage.getItem('token')}`};

  const updateSubscriptionOnServer = (subscription) => {
    const data = {pushInfo: subscription};
    const axiosConfig = {headers};

    return axios.post('ea/create_push/', data, axiosConfig)
      .then(response => {
        setNotificationIcon(1);
        setIsSuccess(true);
        setInfo('알람 설정 완료');
        setSnackbarOpen(true);

        if (response.status === 201) {
          dispatch(pushSave({endpoint: subscription.endpoint}));
        }
      })
      .catch(error => {
        setIsSuccess(false);
        setInfo('실패(전산팀 문의)');
        setSnackbarOpen(true);
      });
  };

  const deleteSubscriptionOnServer = (subscription) => {
    const data = {endpoint: subscription.endpoint};
    const axiosConfig = {headers};

    return axios.post('ea/delete_push/', data, axiosConfig)
      .then(response => {
        setNotificationIcon(0);
        setIsSuccess(true);
        setInfo('알림 제거 완료');
        setSnackbarOpen(true);
      })
      .catch(error => {
        setIsSuccess(false);
        setInfo('실패(전산팀 문의)');
        setSnackbarOpen(true);
      });
  };

  const setPushSubscribe = () => {
    if (!('serviceWorker' in navigator)) {
      return;
    }
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    }).then(subscription => {
      notificationIcon === 0
        ? updateSubscriptionOnServer(subscription)
        : deleteSubscriptionOnServer(subscription);
    });
  };

  const checkSubscribe = () => {
    if (!('serviceWorker' in navigator)) {
      return;
    }
    if (swRegistration === null) {
      return;
    }
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    }).then(subscription => {
      const params = {endpoint: subscription.endpoint};
      const axiosConfig = {headers, params};

      axios.get('ea/check_push/', axiosConfig)
        .then(res => setNotificationIcon(1))
        .catch(err => setNotificationIcon(0));
    });
  };

  const checkServiceWorkerReloading = () => {
    if (!('serviceWorker' in navigator)) {
      return;
    }
    if (swRegistration === null) {
      return;
    }

    if (swRegistration.waiting) {
      swRegistration.waiting.postMessage('skipWaiting');
    }

    navigator.serviceWorker.addEventListener('controllerchange', () => {window.location.reload();}

    );
  }

  useEffect(() => {
    setTimeout(() => checkSubscribe(), 3000);
    setTimeout(() => checkServiceWorkerReloading(), 1500);
  }, []);

  const handleChangePassword = (event) => {
    setInputNewPassword(event.target.value);
  };

  const handleChangePassword2 = (event) => {
    setInputNewPassword2(event.target.value);
  };

  const handleSubmit = () => {
    if (!(inputNewPassword) || !(inputNewPassword2)) {
      setIsSuccess(false);
      setInfo('패스워드를 입력해주세요');
      setSnackbarOpen(true);
      return false;
    }

    if (inputNewPassword !== inputNewPassword2) {
      setIsSuccess(false);
      setInfo('동일한 패스워드를 입력해주세요');
      setSnackbarOpen(true);
      return false;
    }

    const headers = {Authorization: `Token ${session.token}`};
    const data = {new_password: inputNewPassword};
    axios.post('employee/change_password/', data, {headers})
      .then(response => {
        setIsSuccess(true);
        setInfo('변경 완료');
        setSnackbarOpen(true);
        setInputNewPassword('');
        setInputNewPassword2('');
        onClose();
      })
      .catch(error => {
        onClose();
        setIsSuccess(false);
        setInfo('에러 발생(네트워크 상태 확인)');
        setSnackbarOpen(true);
      });
  };

  const handleClose = () => {
    setInputNewPassword('');
    setInputNewPassword2('');
    onClose();
  };

  const notificationClickHandler = () => {
    setPushSubscribe();
  };

  const handleSnackbarOpen = (bool) => {
    setSnackbarOpen(bool);
  };

  return (
    <div>
      <Dialog fullWidth open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle classes={{root: classes.dialogTitleRoot}}>
          <Typography classes={{root: classes.dialogTitleText}}>패스워드 변경</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="신규패스워드"
            name="newPassword"
            onChange={handleChangePassword}
            value={inputNewPassword}
          />
        </DialogContent>
        <DialogContent className={classes.password}>
          <TextField
            fullWidth
            label="신규패스워드 확인"
            name="newPassword2"
            onChange={handleChangePassword2}
            value={inputNewPassword2}
          />
        </DialogContent>
        <Divider />
        <ListItem className={classes.alarm}>
          <ListItemIcon>
            <Button onClick={notificationClickHandler}>
              {notificationIcon === 0
                ? <NotificationsNoneIcon fontSize="large" />
                : <NotificationsActiveIcon fontSize="large" />}
            </Button>
          </ListItemIcon>
          <ListItemText
            primary="알림 설정"
          />
        </ListItem>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary" variant="contained">확인</Button>
          <Button onClick={handleClose} color="primary" variant="outlined">취소</Button>
        </DialogActions>
      </Dialog>
      {snackbarOpen
        ? (
          <MySnackbars
            open={snackbarOpen}
            setOpen={handleSnackbarOpen}
            isSuccess={isSuccess}
            info={info}
          />
        )
        : null}
    </div>
  );
}

ChangePasswordDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
