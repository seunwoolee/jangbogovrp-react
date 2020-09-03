import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TagFacesIcon from '@material-ui/icons/TagFaces';
import Avatar from "@material-ui/core/Avatar";
import PropTypes from "prop-types";
import {ApproverList} from "./ApproverList";
import {avatar_URL} from "../../../my_config";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export default function ReceiverList({receivers, setReceivers}) {
  const classes = useStyles();

  const handleDelete = (receiverId) => () => {
    setReceivers((prevReceivers) => prevReceivers.filter((prevReceiver) => prevReceiver.id !== receiverId));
  };

  return (
    <Paper component="ul" className={classes.root}>
      {receivers.map((receiver) => {
        return (
          <li key={receiver.id}>
            <Chip
              avatar={<Avatar src={`${avatar_URL}${receiver.avatar}`} />}
              label={`${receiver.name} ${receiver.position}`}
              onDelete={handleDelete(receiver.id)}
              className={classes.chip}
            />
          </li>
        );
      })}
    </Paper>
  );
}

ReceiverList.propTypes = {
  receivers: PropTypes.array,
  setReceivers: PropTypes.func,
}
