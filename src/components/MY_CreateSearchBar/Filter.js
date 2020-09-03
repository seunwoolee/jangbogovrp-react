import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Chip,
  Collapse,
  Divider,
  Drawer,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  drawer: {
    width: 420,
    maxWidth: '100%'
  },
  header: {
    padding: theme.spacing(2, 1),
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'space-between'
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  content: {
    padding: theme.spacing(0, 3),
    flexGrow: 1
  },
  contentSection: {
    padding: theme.spacing(2, 0)
  },
  contentSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },
  contentSectionContent: {},
  formGroup: {
    padding: theme.spacing(2, 0)
  },
  fieldGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  field: {
    marginTop: 0,
    marginBottom: 0
  },
  flexGrow: {
    flexGrow: 1
  },
  addButton: {
    marginLeft: theme.spacing(1)
  },
  tags: {
    marginTop: theme.spacing(1)
  },
  minAmount: {
    marginRight: theme.spacing(3)
  },
  maxAmount: {
    marginLeft: theme.spacing(3)
  },
  radioGroup: {},
  actions: {
    padding: theme.spacing(3),
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  }
}));

const initialValues = {
  batchNumber: '',
  user: '',
  department: '',
};

function Filter({
  open,
  onClose,
  onFilter,
  className,
  values,
  setValues,
  ...rest
}) {
  const classes = useStyles();
  const [expandCustomer, setExpandCustomer] = useState(true);

  const handleClear = () => {
    setValues({ ...initialValues });
  };

  const handleFieldChange = (event, field, value) => {
    if (event) {
      event.persist();
    }

    setValues((prevValues) => ({
      ...prevValues,
      [field]: value
    }));
  };

  const handleToggleCustomer = () => {
    setExpandCustomer((prevExpandCustomer) => !prevExpandCustomer);
  };

  const handleConfirm = () => {
    onClose();
    onFilter();
  };

  return (
    <Drawer
      anchor="right"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant="temporary"
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
        // onSubmit={handleSubmit}
      >
        <div className={classes.header}>
          <Button
            onClick={onClose}
            size="small"
          >
            <CloseIcon className={classes.buttonIcon} />
            닫기
          </Button>
        </div>
        <div className={classes.content}>
          <div className={classes.contentSection}>
            <div
              className={classes.contentSectionHeader}
              onClick={handleToggleCustomer}
            >
              <Typography variant="h5">상세검색</Typography>
              {expandCustomer ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />
            <Collapse in={expandCustomer}>
              <div className={classes.contentSectionContent}>
                <div className={classes.contentSectionContent}>
                  <div className={classes.formGroup}>
                    <TextField
                      type={"number"}
                      className={classes.field}
                      fullWidth
                      label="배치번호"
                      margin="dense"
                      name="batchNumber"
                      onChange={(event) => handleFieldChange(
                        event,
                        'batchNumber',
                        event.target.value
                      )}
                      value={values.batchNumber}
                      variant="outlined"
                    />
                  </div>
                  <div className={classes.formGroup}>
                    <TextField
                      className={classes.field}
                      fullWidth
                      label="기안자"
                      margin="dense"
                      name="user"
                      onChange={(event) => handleFieldChange(
                        event,
                        'user',
                        event.target.value
                      )}
                      value={values.user}
                      variant="outlined"
                    />
                  </div>
                  <div className={classes.formGroup}>
                    <TextField
                      className={classes.field}
                      fullWidth
                      label="기안부서"
                      margin="dense"
                      name="department"
                      onChange={(event) => handleFieldChange(
                        event,
                        'department',
                        event.target.value
                      )}
                      value={values.department}
                      variant="outlined"
                    />
                  </div>
                </div>
              </div>
            </Collapse>
          </div>
        </div>
        <div className={classes.actions}>
          <Button
            fullWidth
            onClick={handleClear}
            variant="contained"
          >
            <DeleteIcon className={classes.buttonIcon} />
            초기화
          </Button>
          <Button
            color="primary"
            fullWidth
            type="submit"
            variant="contained"
            onClick={handleConfirm}
          >
            확인
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

Filter.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default Filter;
