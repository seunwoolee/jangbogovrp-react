import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Drawer, Grid, Typography, Button, Hidden
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import MyDialog from "./Dialog";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  button: {
    fontFamily: 'GmarketSansBold',
    fontSize: '1rem'
  }
}));

function BottomBar({
  selectedDocuments,
  setSelectedDocuments,
  className,
  onOpenModal,
  fetchDocuments,
  ...rest
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles();
  const open = selectedDocuments.length > 0;

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      PaperProps={{ elevation: 1 }}
      variant="persistent"
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Grid
          alignItems="center"
          container
          spacing={2}
        >
          <Hidden smDown>
            <Grid
              item
              md={3}
            >
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {selectedDocuments.length}
                {' '}
                선택됨
              </Typography>
            </Grid>
          </Hidden>
          <Grid
            item
            md={6}
            xs={12}
          >
            <div className={classes.actions}>
              <Button onClick={onOpenModal} className={classes.button}>
                <CheckIcon className={classes.buttonIcon} />
                결재
              </Button>
              <Button onClick={handleOpenDialog} className={classes.button}>
                <DoneAllIcon className={classes.buttonIcon} />
                일괄 결재
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
      <MyDialog
        fetchDocuments={fetchDocuments}
        selectedDocuments={selectedDocuments}
        setSelectedDocuments={setSelectedDocuments}
        open={openDialog}
        onCloseDialog={handleCloseDialog} />
    </Drawer>
  );
}

BottomBar.propTypes = {
  className: PropTypes.string,
  onOpenModal: PropTypes.func,
  selectedDocuments: PropTypes.array.isRequired,
  setSelectedDocuments: PropTypes.func.isRequired,
  fetchDocuments: PropTypes.func.isRequired
};

export default BottomBar;
