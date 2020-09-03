import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Modal,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Divider,
  Typography,
  TextField,
  Switch,
  Button, Table, TableBody, TableRow, TableCell, colors
} from '@material-ui/core';
import CustomerInfo from "./CustomerInfo";
import Label from "../../../components/Label";
import ProjectCard from "../../ProjectManagementList/ProjectCard";
import axios from "../../../utils/axios";

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 800,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

function WriteReportModal({
  open, onClose, customers, className, ...rest
}) {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchProjects = () => {
      axios.get('/api/projects').then((response) => {
        if (mounted) {
          setProjects(response.data.projects);
        }
      });
    };

    fetchProjects();

    return () => {
      mounted = false;
    };
  }, []);

  const handleFieldChange = (event) => {
    event.persist();
  };

  if (!open) {
    return null;
  }

  return (
    <Modal
      disableBackdropClick
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form>
          <CardHeader title="기안 작성" />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={12}
                xs={12}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>작성자</TableCell>
                      <TableCell>이승우</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>작성일자</TableCell>
                      <TableCell>2020-01-02</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="제목"
                  name="title"
                  onChange={handleFieldChange}
                  // value={customers[0].공급자명}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
              >
                <TextField
                  multiline
                  rows="3"
                  rowsMax="50"
                  fullWidth
                  label="내용"
                  name="title"
                  onChange={handleFieldChange}
                  // value={customers[0].비고}
                  variant="outlined"
                />
              </Grid>
              <Divider />
              <Grid
                item
                md={12}
                xs={12}
              >
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                  />
                ))}
              </Grid>
              <Grid item />
            </Grid>
          </CardContent>
          <Divider />
          <CardActions className={classes.actions}>
            <Button onClick={onClose}>
              Close
            </Button>
            <Button
              color="primary"
              onClick={onClose}
              variant="contained"
            >
              Save
            </Button>
          </CardActions>
        </form>
      </Card>
    </Modal>
  );
}

WriteReportModal.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

WriteReportModal.defaultProps = {
  open: false,
  onClose: () => {}
};

export default WriteReportModal;
