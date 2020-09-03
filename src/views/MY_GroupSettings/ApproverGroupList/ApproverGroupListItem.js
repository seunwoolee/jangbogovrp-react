import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  colors
} from '@material-ui/core';
import Label from 'src/components/Label';

const useStyles = makeStyles((theme) => ({
  active: {
    boxShadow: `inset 4px 0px 0px ${theme.palette.primary.main}`,
    backgroundColor: colors.grey[50]
  },
  avatar: {
    height: 40,
    width: 40
  },
  details: {
    marginLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  unread: {
    marginTop: 2,
    padding: 2,
    height: 18,
    minWidth: 18
  }
}));

function ApproverGroupListItem({
  active, conversation, className, ...rest
}) {
  const classes = useStyles();

  return (
    <ListItem
      {...rest}
      button
      className={clsx(
        {
          [classes.active]: active
        },
        className
      )}
      component={RouterLink}
      to={`/chat/${conversation.id}`}
    >
      <ListItemText
        primary={conversation.name}
        primaryTypographyProps={{
          noWrap: true,
          variant: 'h6'
        }}
      />
    </ListItem>
  );
}

ApproverGroupListItem.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  conversation: PropTypes.object.isRequired
};

export default ApproverGroupListItem;
