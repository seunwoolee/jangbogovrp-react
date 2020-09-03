import React, {useEffect} from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import {AxiosResponse} from "axios";
import {isloading, login} from "../actions";

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 900,
    color: '#fff',
  },
}));

export default function LoadingBar() {
  const classes = useStyles();
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();

  return (
    <div>
      <Backdrop
        className={classes.backdrop}
        open={session.isLoading}
        // onClick={()=>dispatch(isloading(false))}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
