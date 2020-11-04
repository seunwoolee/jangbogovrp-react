import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Link
} from '@material-ui/core';
import axios from 'src/utils/axios';
import getInitials from 'src/utils/getInitials';
import {avatar_URL} from "../my_config";

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  date: {
    whiteSpace: 'nowrap'
  }
}));

function MY_opinion({ signs, className, ...rest }) {
  const classes = useStyles();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchCustomers = () => {
      axios.get('/api/dashboard/customer-activity').then(response => {
        if (mounted) {
          setCustomers(response.data.customers);
        }
      });
    }

    fetchCustomers();

    return () => {
      mounted = false;
    };
  }, []);


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader title="결재의견" />
      <Divider />
      <CardContent className={classes.content}>
        <List disablePadding>
          {signs.map((sign, i) => (
            <ListItem
              divider={i < customers.length - 1}
              key={sign.id}
            >
              <ListItemAvatar>
                <Avatar
                  alt="사진"
                  src={`${avatar_URL}${sign.user.avatar}`}
                >
                  {getInitials(sign.user.name)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                disableTypography
                primary={
                  <Typography
                    style={{fontWeight: 600}}
                    variant="h6"
                  >
                    {sign.user.name}
                  </Typography>
                }
                secondary={
                  <Typography style={{fontSize: '0.9rem', paddingRight: '0.3rem'}}  variant="body2">
                    {sign.comment}
                  </Typography>
                }
              />
              <Typography
                className={classes.date}
                variant="body2"
              >
                {moment(sign.created).fromNow()}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

MY_opinion.propTypes = {
  className: PropTypes.string,
  signs: PropTypes.array.isRequired
};

export default MY_opinion;
