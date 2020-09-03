import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import {makeStyles} from "@material-ui/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
  rejectBtn: {
    backgroundColor: '#ff6966',
  }
}));

export default function FormDialog({
  open, onClose, onApprove, onReject
}) {
  const classes = useStyles();
  const [inputOpinion, setInputOpinion] = useState('');

  const handleChangeOpinion = (event) => {
    setInputOpinion(event.target.value);
  };

  return (
    <div>
      <Dialog fullWidth open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogContent>
          <TextField
            multiline
            rowsMax="10"
            fullWidth
            label="결재의견"
            name="opinion"
            onChange={handleChangeOpinion}
            value={inputOpinion}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onApprove(inputOpinion)} color="primary" variant="contained">
            결재
          </Button>
          <Button onClick={() => onReject(inputOpinion)} className={classes.rejectBtn} variant="contained">
            반려
          </Button>
          <Button onClick={onClose} color="primary" variant="outlined">
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

FormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
};
