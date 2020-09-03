import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider } from '@material-ui/core';
import ControlToolbar from "./ControlToolbar";
import SignListTable from "./SignListTable";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.common.white
  }
}));

function ApproverGroupDetails({ selectedSignGroup, className, fetchSignGroup}) {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}
    >
      <ControlToolbar selectedSignGroup={selectedSignGroup} fetchSignGroup={fetchSignGroup} />
      <Divider />
      {selectedSignGroup ? <SignListTable signLists={selectedSignGroup.sign_lists} /> : null}
      <Divider />
    </div>
  );
}

ApproverGroupDetails.propTypes = {
  className: PropTypes.string,
  selectedSignGroup: PropTypes.array.isRequired,
  fetchSignGroup: PropTypes.func
};

export default ApproverGroupDetails;
