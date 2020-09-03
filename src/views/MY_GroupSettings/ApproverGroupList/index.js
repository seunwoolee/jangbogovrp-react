import React from 'react';
import { useParams } from 'react-router';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Toolbar,
  Input,
  IconButton,
  Tooltip,
  Divider,
  List, Typography, Grid
} from '@material-ui/core';
import ApproverGroupListItem from './ApproverGroupListItem';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.white
  },
  searchInput: {
    flexGrow: 1
  }
}));

function ApproverGroupList({ signGroups, className, ...rest }) {
  const classes = useStyles();
  const params = useParams();
  const selectedSignGroup = Number(params.id);

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <List disablePadding>
        {signGroups.map((signGroup, i) => (
          <ApproverGroupListItem
            active={signGroup.id === selectedSignGroup}
            conversation={signGroup}
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
  signGroups: PropTypes.array.isRequired
};

export default ApproverGroupList;
