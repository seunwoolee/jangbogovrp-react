import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {Grid, Typography} from '@material-ui/core';
import Button from "@material-ui/core/Button";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import Index from "./Modal/index";
import MySnackbars from "../../components/MY_snackbar";

const useStyles = makeStyles(() => ({
  root: {}
}));

function Header({isAm, openModal, setOpenModal, selectedMarkers, setSelectedMarkers}) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [info, setInfo] = useState("완료");
  const classes = useStyles();

  const closeModal = () => {
    setOpenModal(false);
  };

  const opensModal = () => {
    setOpenModal(true);
  };

  const completeModal = (isSuccess: boolean, info: string) => {
    if (isSuccess) {
      setIsSuccess(true);
      setInfo(info);
    } else {
      setIsSuccess(false);
      setInfo(info);
    }
    setSnackbarOpen(true);
  };

  return (
    <div
      className={clsx(classes.root)}
    >
      <Grid
        alignItems="flex-end"
        container
        justify="space-between"
        spacing={3}
      >
        <Grid item>
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            자동배차 및 미리보기
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
            <Button
              onClick={opensModal}
              variant="contained"
              color="secondary"
              startIcon={<LocalShippingIcon/>}
            >
              배차시작하기
            </Button>
          </Typography>
        </Grid>
      </Grid>

      {openModal ? (
        <Index
          isAm={isAm}
          onClose={closeModal}
          onComplete={completeModal}
          open={openModal}
          setSnackbarsOpen={setSnackbarOpen}
          setIsSuccess={setIsSuccess}
          setInfo={setInfo}
          selectedMarkers={selectedMarkers}
          setSelectedMarkers={setSelectedMarkers}
        />
      ) : null}

      {snackbarOpen
        ? (
          <MySnackbars
            open={snackbarOpen}
            setOpen={setSnackbarOpen}
            isSuccess={isSuccess}
            info={info}
          />
        ) : null}
    </div>
  );
}

Header.propTypes = {
  isAm: PropTypes.bool,
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  selectedMarkers: PropTypes.array,
  setSelectedMarkers: PropTypes.func,
};

export default Header;
