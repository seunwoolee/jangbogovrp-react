import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import Card from "@material-ui/core/Card";
import {Button, CardActions, colors} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  thumb: {
    width: 150,
    height: 150,
    padding: 4,
  },
  thumbOverlay: {
    opacity: 0.1,
  },
  btn: {
    fontWeight: 600,
    backgroundColor: colors.red[600]
  },
  img: {
    display: 'block',
    width: 'auto',
    height: '100%',
  },
  cards: {
    position: 'relative',
  },
  overlays: {
    position: 'absolute',
    top: '20px',
    left: '20px',
  },
  actions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  }
}));

export default function MyDropzone(props) {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const [showbtn, setShowbtn] = useState('');
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const handleBtn = (key) => {
    setShowbtn(key);
  };

  const checkShowBtn = key => key === showbtn;

  const thumbs = files.map(file => (
      <Grid
        key={file.name}
        item
        md={2}
        xs={6}
      >
        <Card
          onMouseEnter={() =>handleBtn(file.name)}
          onMouseLeave={() => handleBtn('')}
          className={classes.cards}>
          <div
            className={checkShowBtn(file.name) ? clsx(classes.thumb, classes.thumbOverlay) : classes.thumb}
            key={file.name}>
            <img
              src={file.preview}
              className={classes.img}
              alt="ddd"/>
          </div>
          <div className={classes.overlays}>
            {checkShowBtn(file.name) ? (
              <Button
                onClick={()=>alert()}
                className={classes.btn}
                // color={colors.red[600]}
                variant="contained"
                size="small"
              >
                삭제
              </Button>
            ) : null}
          </div>
        </Card>
      </Grid>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        spacing={1}
      >
        {thumbs}
      </Grid>
    </section>
  );
}
