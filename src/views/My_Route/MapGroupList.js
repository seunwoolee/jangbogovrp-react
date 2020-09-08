import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from "prop-types";
import Result from "./Result";
import {Button, Card, CardHeader, colors, ListItemIcon} from "@material-ui/core";
import getThousand from "../../utils/getThousand";
import TableCell from "@material-ui/core/TableCell";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    width: '26px',
    height: '37px',
  },
  textSecondary: {
    fontWeight: 650,
    fontSize: '15px',
  },
}));

export default function MapGroupList({mapGroups}) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([1]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List dense className={classes.root}>
      {mapGroups.map((mapGroup, index) => {
        const labelId = `checkbox-list-secondary-label-${index}`;
        return (
          <Card key={index}>
            <CardHeader title={`${index + 1}번`}
                        action={<Button size={"small"} variant={"contained"} color={"primary"}>경로 재 설정</Button>}>
            </CardHeader>

            <ListItem>
              <ListItemIcon>
                <Checkbox
                  edge="end"
                  onChange={handleToggle(index)}
                  checked={checked.indexOf(index) !== -1}
                  inputProps={{'aria-labelledby': labelId}}
                />
              </ListItemIcon>
              <ListItemAvatar>
                <Avatar
                  classes={{img: classes.avatar}}
                  alt={`Avatar n°${index + 1}`}
                  src={`/images/makers/marker_${index}.png`}
                />
              </ListItemAvatar>
              <ListItemText classes={{secondary: classes.textSecondary}}
                            primary={`운행거리`}
                            secondary={(mapGroup.sum / 1000).toFixed(1) + 'km'}/>
              <ListItemText classes={{secondary: classes.textSecondary}}
                            primary={`배송건수`}
                            secondary={mapGroup.count + '건'}/>
              <ListItemText classes={{secondary: classes.textSecondary}}
                            primary={`배송금액`}
                            secondary={getThousand(mapGroup.deguestPay) + '원'}/>
            </ListItem>
          </Card>
        );
      })}
    </List>
  );
}

MapGroupList.propTypes = {
  mapGroups: PropTypes.array,
};
