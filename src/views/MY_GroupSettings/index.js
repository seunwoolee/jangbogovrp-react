import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import axios from "../../utils/my_axios";
import Page from 'src/components/Page';
import ApproverGroupDetails from "./ApproverGroupDetails";
import ApproverGroupList from "./ApproverGroupList";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    '@media (max-width: 863px)': {
      '& $conversationList, & $conversationDetails': {
        flexBasis: '100%',
        width: '100%',
        maxWidth: 'none',
        flexShrink: '0',
        transform: 'translateX(0)'
      }
    }
  },
  openConversion: {
    '@media (max-width: 863px)': {
      '& $conversationList, & $conversationDetails': {
        transform: 'translateX(-100%)'
      }
    }
  },
  approverGroupList: {
    width: 300,
    flexBasis: 300,
    flexShrink: 0,
    '@media (min-width: 864px)': {
      borderRight: `1px solid ${theme.palette.divider}`
    }
  },
  approverGroupDetails: {
    flexGrow: 1
  },
  conversationPlaceholder: {
    flexGrow: 1
  }
}));

function Chat() {
  const classes = useStyles();
  const params = useParams();
  const [signGroups, setSignGroups] = useState([]);

  const fetchSignGroup = () => {
    const url = `ea/sign_group/`;
    const config = { headers: {Authorization: `Token ${localStorage.getItem('token')}`} };
    axios.get(url, config).then((response) => {
        setSignGroups(response.data);
    });
  };

  useEffect(() => {
    fetchSignGroup();
  }, []);

  let selectedSignGroup;

  if (params.id) {
    selectedSignGroup = signGroups.find(
      (c) => c.id === Number(params.id)
    );
  }

  return (
    <Page
      className={clsx({
        [classes.root]: true,
        [classes.openConversion]: selectedSignGroup
      })}
      title="결재라인설정"
    >
      <ApproverGroupList
        className={classes.approverGroupList}
        signGroups={signGroups}
      />
      <ApproverGroupDetails
        fetchSignGroup={fetchSignGroup}
        className={classes.approverGroupDetails}
        selectedSignGroup={selectedSignGroup}
      />
    </Page>
  );
}

export default Chat;
