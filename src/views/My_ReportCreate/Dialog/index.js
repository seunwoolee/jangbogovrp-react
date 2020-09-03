import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import {blue} from '@material-ui/core/colors';
import {
  Card, CardActions, CardContent, colors, Divider
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import PerfectScrollbar from "react-perfect-scrollbar";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Collapse from "@material-ui/core/Collapse";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import CardHeader from "@material-ui/core/CardHeader";
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined';
import Input from "@material-ui/core/Input";
import GroupIcon from '@material-ui/icons/Group';
import SearchIcon from '@material-ui/icons/Search';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import axios from "../../../utils/my_axios";
import {avatar_URL} from "../../../my_config";
import {ApproverList} from "./ApproverList";
import ApproverGroupList from "./ApproverGroupList";
import ReceiverList from "./ReceiverList";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
    overflow: 'auto',
    [theme.breakpoints.up('lg')]: {
      width: 500,
    },
    maxHeight: 700,
  },
  groupRoot: {
    backgroundColor: 'red',
    height: '100%',
    cursor: 'pointer',
    display: 'flex',
    overflow: 'hidden',
  },
  groupList: {
    width: 300,
    flexBasis: 300,
    flexShrink: 0,
  },
  content: {
    paddingTop: 0
  },
  cardHeaderRoot: {
    backgroundColor: theme.palette.primary.main,
  },
  cardHeaderTitle: {
    color: theme.palette.primary.contrastText
  },
  main: {
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    justify: 'space-between'
  },
  search: {
    padding: theme.spacing(1, 0),
    display: 'flex',
    alignItems: 'center',
    justify: 'space-between'
  },
  personAddIncon: {
    fontSize: 40,
    color: theme.palette.text.secondary
  },
  searchInput: {
    marginLeft: theme.spacing(0),
    color: theme.palette.text.secondary,
    fontSize: '12px'
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
    height: 30,
    width: 30
  },
  listItem: {
    flexWrap: 'wrap'
  },
  formControl: {
    paddingRight: theme.spacing(1)
  },
  listItemText: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(4)
  },
  connectButton: {
    marginLeft: 'auto'
  },
  arrowIconButtom: {
    paddingRight: theme.spacing(1)
  },
  pendingButton: {
    marginLeft: 'auto',
    color: theme.palette.common.white,
    backgroundColor: colors.orange[600],
    '&:hover': {
      backgroundColor: colors.orange[900]
    }
  },
  connectedButton: {
    marginLeft: 'auto',
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  deleteUserButton: {
    right: 1
  },
  selectTypeButton: {
    left: 1
  },
  approverGroupList: {
    width: 300,
    flexBasis: 300,
    flexShrink: 0,
  },
}));

function ChooseDialog({open, onClose, onSubmit, invoiceType}) {
  const classes = useStyles();
  const [users, setUsers] = React.useState([]);
  const [receivers, setReceivers] = React.useState([]);
  const [departmentUsers, setDepartmentUsers] = React.useState([]);
  const [allUsers, setAllUsers] = React.useState([]);
  const [typeUsers, setTypeUsers] = React.useState([]);
  const [inputSearch, setInputSearch] = React.useState('');
  const [checked, setChecked] = React.useState(-1);
  const [expanded, setExpanded] = React.useState(false);
  const [addUserType, setAddUserType] = React.useState(10);
  const [openGroup, setOpenGroup] = React.useState(false);
  const [signGroups, setSignGroups] = useState([]);

  const handleChecked = (i) => {
    if (i === checked) {
      return setChecked(-1);
    }
    setChecked(i);
  };

  const handleSubmit = () => {
    onSubmit(users, receivers);
  };

  const handleAddUserTypeChange = event => setAddUserType(event.target.value);

  const handleUserTypeChange = (event, userId) => {
    const newUsers = users.filter(user => user.id !== userId);
    let changedUser = users.find(user => user.id === userId);
    changedUser.type = event.target.value;
    setUsers([...newUsers, changedUser].sort(sortUsers));
  };

  const handleAddButton = (userId) => {
    const newUser = typeUsers.find(user => user.id === userId);
    if (users.find(user => user.id === userId)) {
      return alert('이미 등록되어 있습니다.');
    }
    newUser.order = users.reduce((max, n) => Math.max(max, n.order) + 1, 0);
    setUsers([...users, newUser].sort(sortUsers));
  };

  const handleAddReceiverButton = (receiverId) => {
    const newUser = typeUsers.find(user => user.id === receiverId);
    if (receivers.find(receiver => receiver.id === receiverId)) {
      return alert('이미 등록되어 있습니다.');
    }
    setReceivers((prevState => [...prevState, {...newUser, type: 2}]));
  };

  const deleteUser = (index) => {
    const newUsers = users.filter(user => user.order !== index);
    const test = newUsers.map((user, i) => {
      user.order = i;
      return user;
    });
    setUsers(test.sort(sortUsers));
  };

  const sortUsers = (a, b) => {
    if (a.order > b.order) {
      return 1;
    }
    if (a.order < b.order) {
      return -1;
    }
    return 0;
  };

  const setDown = () => {
    if (checked === -1) {
      return;
    }

    const exceptUsers = users.filter(user => user.order !== checked && user.order !== checked + 1);
    const selectedUser = users.find(user => user.order === checked);
    const nextSelectedUser = users.find(user => user.order === checked + 1);
    if (nextSelectedUser) {
      const newUsers = [...exceptUsers,
        {...nextSelectedUser, order: nextSelectedUser.order - 1},
        {...selectedUser, order: selectedUser.order + 1}];
      setChecked(selectedUser.order + 1);
      setUsers(newUsers.sort(sortUsers));
    }
  };

  const setUp = () => {
    if (checked === -1) {
      return;
    }

    const exceptUsers = users.filter(user => user.order !== checked && user.order !== checked - 1);
    const selectedUser = users.find(user => user.order === checked);
    const prevSelectedUser = users.find(user => user.order === checked - 1);
    if (prevSelectedUser) {
      const newUsers = [...exceptUsers,
        {...prevSelectedUser, order: prevSelectedUser.order + 1},
        {...selectedUser, order: selectedUser.order - 1}];
      setChecked(selectedUser.order - 1);
      setUsers(newUsers.sort(sortUsers));
    }
  };

  useEffect(() => {
    const searchUsers = addUserType === 10 ? departmentUsers : allUsers
    if (inputSearch.length > 0) {
      return setTypeUsers(searchUsers.filter(user => user.name.includes(inputSearch)))
    }
    setTypeUsers(searchUsers)
  }, [inputSearch])

  useEffect(() => {
    setTypeUsers(addUserType === 10 ? departmentUsers : allUsers)
  }, [addUserType])

  useEffect(() => {
    let mounted = true;
    const headers = {Authorization: `Token ${localStorage.getItem('token')}`};
    const fetchUsers = () => {
      axios.get(`ea/get_defaultUsers/${invoiceType.toString()}`, {headers}).then(response => {
        if (mounted) {
          setUsers(response.data.filter(user => user.type !== '2'));
          setReceivers(response.data.filter(user => user.type === '2'));
        }
      });
    };

    const fetchDepartmentUsers = () => {
      axios.get(`ea/get_departmentUsers/`, {headers}).then(response => {
        // axios.get(`ea/get_departmentUsers/${session.user.department}`, {headers}).then(response => {
        if (mounted) {
          setDepartmentUsers(response.data);
          setTypeUsers(response.data);
        }
      });
    };

    const fetchAllUsers = () => {
      axios.get('ea/get_allUsers/', {headers}).then((response) => {
        if (mounted) {
          setAllUsers(response.data);
        }
      });
    };

    const fetchSignGroup = () => {
      const url = `ea/sign_group/`;
      axios.get(url, {headers}).then((response) => {
          setSignGroups(response.data);
      });
    };

    fetchUsers();
    fetchDepartmentUsers();
    fetchAllUsers();
    fetchSignGroup();

    return () => {
      mounted = false;
    };
  }, []);

  const handleClickOpen = () => {
    setOpenGroup(true);
  };

  const handleClose = () => {
    setOpenGroup(false);
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <Card
        className={classes.root}
      >
        <Divider/>
        <div className={classes.main}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="h4" component="h4">
                결재순서
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={setDown} className={classes.arrowIconButtom} aria-label="down-order">
                <ArrowDownwardRoundedIcon className={classes.personAddIncon} color="inherit"/>
              </IconButton>
              <IconButton onClick={setUp} className={classes.arrowIconButtom} aria-label="up-order">
                <ArrowUpwardRoundedIcon className={classes.personAddIncon} color="inherit"/>
              </IconButton>
              <IconButton onClick={() => setExpanded(true)} style={{paddingRight: 3}} aria-label="add-user">
                <PersonAddIcon className={classes.personAddIncon} color="inherit"/>
              </IconButton>
              <IconButton onClick={handleClickOpen} style={{paddingRight: 3}} aria-label="user-list">
                <GroupIcon className={classes.personAddIncon} color="inherit"/>
              </IconButton>
            </Grid>
          </Grid>
        </div>
        <Divider/>
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <List disablePadding>
              <ApproverList
                checked={checked}
                deleteUser={deleteUser}
                handleChecked={handleChecked}
                handleUserTypeChange={handleUserTypeChange}
                users={users}/>
            </List>
          </PerfectScrollbar>
        </CardContent>
        <CardContent className={classes.content}>
          <Typography variant="h5" component="h5">
            수신참조
          </Typography>
          <ReceiverList
            receivers={receivers}
            setReceivers={setReceivers}
          />
        </CardContent>
        <Divider/>
        <CardActions className={classes.actions}>
          <Button onClick={onClose}>
            취소
          </Button>
          <Button
            disabled={users.length < 1}
            color="primary"
            onClick={handleSubmit}
            variant="contained"
          >
            완료
          </Button>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardHeader
            action={(
              <IconButton onClick={() => setExpanded(false)} aria-label="settings">
                <ExpandLessOutlinedIcon fontSize="large"/>
              </IconButton>
            )}
            title="결재자 추가"
          />
          <CardContent className={classes.content}>
            <List disablePadding>
              <ListItem className={classes.search}>
                <Select
                  onChange={handleAddUserTypeChange}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={addUserType}
                >
                  <MenuItem value={10}>내부서</MenuItem>
                  <MenuItem value={20}>이름</MenuItem>
                </Select>
                <SearchIcon
                  className={classes.searchIcon}
                  color="inherit"
                />
                <Input
                  onChange={(e) => setInputSearch(e.target.value)}
                  value={inputSearch}
                  className={classes.searchInput}
                  disableUnderline
                  placeholder="이름 검색"
                />
              </ListItem>
              {typeUsers.map((user, i) => (
                <ListItem
                  button
                  className={classes.listItem}
                  disableGutters
                  divider
                  key={user.id}
                >
                  <Avatar
                    alt="Profile image"
                    className={classes.avatar}
                    src={`${avatar_URL}${user.avatar}`}
                  />
                  <ListItemText
                    className={classes.listItemText}
                    primary={`${user.name} ${user.position}`}
                    secondary={user.common}
                  />
                  <ListItemSecondaryAction classes={{root: classes.deleteUserButton}}>
                    <Tooltip title='결재추가'>
                      <IconButton onClick={() => handleAddButton(user.id)} aria-label="add-user">
                        <AddCircleOutlineOutlinedIcon fontSize="default"/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='수신참조추가'>
                    <IconButton onClick={() => handleAddReceiverButton(user.id)} aria-label="add-receiver">
                      <AddCircleIcon fontSize="default"/>
                    </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Collapse>
      </Card>

      <Dialog open={openGroup} onClose={handleClose} aria-labelledby="gruop-list">
        <ApproverGroupList
          onClose={handleClose}
          setUsers={setUsers}
          setReceivers={setReceivers}
          className={classes.approverGroupList}
          signGroups={signGroups}
        />
      </Dialog>
    </Dialog>
  );
}

ChooseDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  invoiceType: PropTypes.string.isRequired,
};

export default ChooseDialog;
