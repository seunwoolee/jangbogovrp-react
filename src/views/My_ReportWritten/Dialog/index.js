import React, {Fragment, useDebugValue, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import {Card, CardActions, CardContent, colors, Divider} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import PerfectScrollbar from "react-perfect-scrollbar";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Link as RouterLink} from "react-router-dom";
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import axios from "../../../utils/axios";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Collapse from "@material-ui/core/Collapse";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import CardHeader from "@material-ui/core/CardHeader";
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined';
import Input from "@material-ui/core/Input";
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles( (theme) => ({
  root: {
    minWidth: 300,
    overflow: 'auto',
    [theme.breakpoints.up('lg')]: {
      width: 500,
    },
    maxHeight: 700,
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
    padding: theme.spacing(1,0),
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
  }
}));

function ChooseDialog({ open, onClose, onSubmit }) {
  const classes = useStyles();
  const [users, setUsers] = React.useState([]);
  const [departmentUsers,setDepartmentUsers] = React.useState([]);
  const [allUsers,setAllUsers] = React.useState([]);
  const [checked, setChecked] = React.useState(-1);
  const [expanded, setExpanded] = React.useState(false);
  const [addUserType, setAddUserType] = React.useState(10);


  const handleChecked = (i) => {
    if(i === checked){
      return setChecked(-1);
    }
    setChecked(i);
  };

  const handleSubmit = () => {
    onSubmit(users);
  };

  const handleAddUserTypeChange = event => setAddUserType(event.target.value);

  const handleUserTypeChange = (event, userId) => {
      const newUsers = users.filter(user => user.id !== userId);
      const changedUser = users.find(user => user.id === userId);
      setUsers([...newUsers, changedUser].sort(sortUsers));
  };

  const handleAddButton = (userId) => {
    const newTypeUsers = typeUsers.filter(user => user.id !== userId);
    const newUser = typeUsers.find(user => user.id === userId);
    if(users.find(user => user.id === userId)){
      return alert('이미 등록되어 있습니다.');
    }
    setUsers([...users, newUser].sort(sortUsers));
    addUserType === 10 ? setDepartmentUsers(newTypeUsers) : setAllUsers(newTypeUsers);
  };

  const deleteUser = (index) => {
    const newUsers = users.filter(user => user.order !== index);
    setUsers(newUsers.sort(sortUsers));
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
    const exceptUsers = users.filter(user => user.order !== checked && user.order !== checked+1);
    const selectedUser = users.find( user => user.order === checked);
    const nextSelectedUser = users.find( user => user.order === checked+1);
    if(nextSelectedUser){
      const newUsers = [...exceptUsers,
        {...nextSelectedUser, order: nextSelectedUser.order-1},
        {...selectedUser, order: selectedUser.order+1}];
      setChecked(selectedUser.order+1);
      setUsers(newUsers.sort(sortUsers));
    }
  };

  const setUp = () => {
    const exceptUsers = users.filter(user => user.order !== checked && user.order !== checked-1);
    const selectedUser = users.find( user => user.order === checked);
    const prevSelectedUser = users.find( user => user.order === checked-1);
    if(prevSelectedUser){
      const newUsers = [...exceptUsers,
        {...prevSelectedUser, order: prevSelectedUser.order+1},
        {...selectedUser, order: selectedUser.order-1}];
      setChecked(selectedUser.order-1);
      setUsers(newUsers.sort(sortUsers));
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchUsers = () => {
      axios.get('/api/defaultUsers').then((response) => {
        if (mounted) {
          setUsers(response.data.users);
        }
      });
    };

    const fetchDepartmentUsers = () => {
      axios.get('/api/departmentUsers').then((response) => {
        if (mounted) {
          setDepartmentUsers(response.data.users);
        }
      });
    };

    const fetchAllUsers = () => {
      axios.get('/api/allUsers').then((response) => {
        if (mounted) {
          setAllUsers(response.data.users);
        }
      });
    };

    fetchUsers();
    fetchDepartmentUsers();
    fetchAllUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const typeUsers = addUserType === 10 ? departmentUsers : allUsers;

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <Card
        className={classes.root}
      >
        <Divider />
        <div className={classes.main}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item >
              <Typography variant="h4" component="h4">
                결재순서
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={setDown} className={classes.arrowIconButtom} aria-label="down-order">
                <ArrowDownwardRoundedIcon className={classes.personAddIncon} color="inherit" />
              </IconButton>
              <IconButton onClick={setUp} className={classes.arrowIconButtom} aria-label="up-order">
                <ArrowUpwardRoundedIcon className={classes.personAddIncon} color="inherit" />
              </IconButton>
              <IconButton onClick={() => setExpanded(true)} style={{paddingRight:3}} aria-label="add-user">
                <PersonAddIcon className={classes.personAddIncon} color="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        </div>
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <List disablePadding>
              {users.map((user, i) => (
                <Fragment key={user.id}>
                <FormControl className={classes.formControl}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue={user.signType}
                    onChange={(event) => handleUserTypeChange(event, user.id)}
                  >
                    <MenuItem value={10}>결재</MenuItem>
                    <MenuItem value={20}>합의</MenuItem>
                    <MenuItem value={30}>참조</MenuItem>
                  </Select>
                </FormControl>
                <ListItem
                  selected={user.order === checked}
                  button
                  onClick={() => handleChecked(user.order)}
                  className={classes.listItem}
                  disableGutters
                  divider={user.order < users.length - 1}
                  key={user.id}
                >
                <Avatar
                  alt="Profile image"
                  className={classes.avatar}
                  component={RouterLink}
                  src={user.avatar}
                  to="/profile/1/timeline"
                />
                <ListItemText
                  className={classes.listItemText}
                  primary={`${user.name} ${user.position}`}
                  secondary={user.common}
                >
                </ListItemText>
                <ListItemSecondaryAction classes={{root: classes.deleteUserButton}}>
                  <IconButton onClick={() => deleteUser(user.order)} aria-label="delete-user">
                    <CancelPresentationIcon fontSize="large"/>
                  </IconButton>
                </ListItemSecondaryAction>
                </ListItem>
                </Fragment>
              ))}
            </List>
          </PerfectScrollbar>
        </CardContent>
        <Divider/>
        <CardActions className={classes.actions}>
          <Button onClick={onClose}>
            취소
          </Button>
          <Button
            color="primary"
            onClick={handleSubmit}
            variant="contained"
          >
            완료
          </Button>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardHeader
            action={
              <IconButton onClick={() => setExpanded(false)} aria-label="settings">
                <ExpandLessOutlinedIcon fontSize="large"/>
              </IconButton>
            }
            title="결재자 추가" />
          <CardContent className={classes.content}>
              <List disablePadding>
                <ListItem className={classes.search}>
                  <Select
                    onChange={handleAddUserTypeChange}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue={addUserType}
                  >
                    <MenuItem value={10}>내부서</MenuItem>
                    <MenuItem value={20}>이름</MenuItem>
                  </Select>
                    <SearchIcon
                      className={classes.searchIcon}
                      color="inherit"
                    />
                    <Input
                      className={classes.searchInput}
                      disableUnderline
                      placeholder="Search people &amp; places"
                    />
                </ListItem>
                {typeUsers.map((user, i) => (
                    <ListItem
                      button
                      className={classes.listItem}
                      disableGutters
                      divider={user.order < users.length - 1}
                      key={user.id}
                    >
                      <Avatar
                        alt="Profile image"
                        className={classes.avatar}
                        component={RouterLink}
                        src={user.avatar}
                        to="/profile/1/timeline"
                      />
                      <ListItemText
                        className={classes.listItemText}
                        primary={`${user.name} ${user.position}`}
                        secondary={user.common}
                      >
                      </ListItemText>
                      <ListItemSecondaryAction classes={{root: classes.deleteUserButton}}>
                        <IconButton onClick={() => handleAddButton(user.id)} aria-label="add-user">
                          <AddCircleOutlineOutlinedIcon fontSize="large"/>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                ))}
              </List>
          </CardContent>
        </Collapse>
      </Card>
    </Dialog>
  );
}

ChooseDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ChooseDialog;
