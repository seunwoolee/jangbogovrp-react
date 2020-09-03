import React from 'react';
import { useParams } from 'react-router';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {List} from '@material-ui/core';
import ApproverGroupListItem from './ApproverGroupListItem';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.white
  },
  searchInput: {
    flexGrow: 1
  }
}));

function ApproverGroupList({ signGroups, className, setUsers, setReceivers, onClose }) {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}
    >
      <List disablePadding>
        {signGroups.map((signGroup, i) => (
          <ApproverGroupListItem
            onClose={onClose}
            setUsers={setUsers}
            setReceivers={setReceivers}
            signGroup={signGroup}
            divider={i < signGroups.length - 1}
            key={signGroup.id}
          />
        ))}
      </List>
    </div>
  );
}

ApproverGroupList.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  setUsers: PropTypes.func,
  setReceivers: PropTypes.func,
  signGroups: PropTypes.array.isRequired
};

export default ApproverGroupList;
