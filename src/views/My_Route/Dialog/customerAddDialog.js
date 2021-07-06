import React, {Fragment, useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes, {object} from "prop-types";
import ListItem from "@material-ui/core/ListItem";
import {makeStyles} from "@material-ui/core/styles";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from "@material-ui/core/FormControl";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import {
  Card, CardContent, CardHeader, Grid, ListItemIcon, TextField
} from "@material-ui/core";
import clsx from "clsx";
import moment from "moment";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import globalAxios from "axios";
import axios from "../../../utils/my_axios";
import getThousand from "../../../utils/getThousand";
import CustomDate from "../../../components/CustomDate";
import {isloading} from "../../../actions";
import {APIKEY} from "../../../my_config";

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: "auto!important",
    right: "auto!important",
  },
  backdrop: {
    opacity: "0.2!important"
  },
  avatarRoot: {
    width: "auto"
  },
  avatar: {
    width: '26px',
    height: '37px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  fieldGroup: {
    width: '400px',
    display: 'flex',
    alignItems: 'center'
  },
  searchButton: {
    backgroundColor: theme.palette.common.white,
    marginLeft: theme.spacing(2)
  },
  textSecondary: {
    fontWeight: 650,
    fontSize: '15px',
  },
  firstListItemAvatar: {
    marginRight: theme.spacing(6)
  },

}));

function CustomerAddDialog({fetchRoute, open, onClose, routeM}) {
  const classes = useStyles();
  const [customerCode, setCustomerCode] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newRouteNumber, setNewRouteNumber] = useState(1);

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      return;
    }

    const data = {
      routeM,
      routeNumber: newRouteNumber,
      customerCode
    };
    const headers = {Authorization: `Token ${localStorage.getItem('token')}`};

    const response = await axios.post('delivery/add_routeD/', data, {headers});
    onClose();
    fetchRoute();
  };

  const handleCustomerCodeChange = (event) => {
    setCustomerCode(event.target.value);
  };

  const handleRouteNumberChange = (event) => {
    setNewRouteNumber(Number(event.target.value));
  };

  const searchCustomer = async () => {
    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      params: {customerCode}
    };
    try {
      const response = await axios.get(`customer/get_customer/`, config);
      setSelectedCustomer(response.data);
      setNewRouteNumber(response.data.CourseNum);
    } catch (e) {
      console.log(e);
    }
  };

  const handleButtonEnter = (e) => {
    if (e.which === 13) {
      searchCustomer();
    }
  };

  useEffect(() => {
    setCustomerCode('');
    setSelectedCustomer(null);
  }, [open]);

  const routeNumbers = [];
  for (let i = 0; i < 25; i++) { // TODO 하드코딩
    routeNumbers.push(i);
  }

  return (
    <div>
      <Dialog
        BackdropProps={{className: classes.backdrop}}
        className={classes.root}
        maxWidth="lg"
        open={open}
        onClose={onClose}
      >
        <DialogContent>
          <Grid
            container
            spacing={3}
          >
            <Grid item xs={12} md={4}>
              <div className={classes.fieldGroup}>
                <TextField
                  onKeyPress={handleButtonEnter}
                  className={classes.dateField}
                  label="고객코드"
                  name="customerCode"
                  onChange={handleCustomerCodeChange}
                  value={customerCode}
                  variant="outlined"
                />
                <Button
                  className={classes.searchButton}
                  onClick={searchCustomer}
                  size="large"
                  variant="contained"
                >
                  검색
                </Button>
              </div>
            </Grid>
          </Grid>
          {selectedCustomer ? (
            <>
              <ListItem>
                <ListItemText
                  classes={{secondary: classes.textSecondary}}
                  primary="이름"
                  secondary={selectedCustomer.CCorpName}
                />
                <ListItemText
                  classes={{secondary: classes.textSecondary}}
                  primary="주소"
                  secondary={selectedCustomer.Address1}
                />
              </ListItem>
              <Divider/>
              <ListItem>
                <ListItemAvatar className={classes.firstListItemAvatar}>
                  <>
                    <ListItemText
                      secondary="현재 경로"
                    />
                    <Avatar
                      classes={{root: classes.avatarRoot, img: classes.avatar}}
                      alt={`Avatar n°${selectedCustomer.CourseNum}`}
                      src={`/images/makers/marker_${selectedCustomer.CourseNum}.png`}
                    />
                  </>
                </ListItemAvatar>
                <FormControl className={classes.formControl}>
                  <FormLabel component="legend">변경될 경로</FormLabel>
                  <RadioGroup row value={newRouteNumber} onChange={handleRouteNumberChange}>
                    {routeNumbers.map(i => (
                      <FormControlLabel
                        key={i + 1}
                        value={i + 1}
                        control={<Radio/>}
                        label={(
                          <Avatar
                            classes={{img: classes.avatar}}
                            src={`/images/makers/marker_${i + 1}.png`}
                          />
                        )}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </ListItem>
            </>
          ) : (
            <ListItem>
              <ListItemText
                classes={{secondary: classes.textSecondary}}
                primary="결과"
                secondary={'고객코드를 확인해주세요'}
              />
            </ListItem>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="default" variant="outlined">
            닫기
          </Button>
          <Button onClick={handleSubmit} color="secondary" variant="outlined">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

CustomerAddDialog.propTypes = {
  fetchRoute: PropTypes.func,
  open: PropTypes.bool,
  routeM: PropTypes.number,
  onClose: PropTypes.func,
  maxRouteNumber: PropTypes.number
};

export default CustomerAddDialog;
