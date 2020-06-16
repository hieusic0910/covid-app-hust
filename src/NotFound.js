import React from 'react';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import { makeStyles } from '@material-ui/core/styles';

import biohazard from './biohazard.svg';

const useStyles = makeStyles(() => ({
  img: {
    height: '200px',
  },
  notFoundContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  notFoundText: {
    fontWeight: 'bold',
    marginTop: '32px',
  },
  root: {
    alignItems: 'center',
    backgroundColor: grey[100],
    display: 'flex',
    flexGrow: 1,
    height: '100vh',
    justifyContent: 'center',
    overflowY: 'auto',
    paddingBottom: '16px',
    paddingTop: '16px',
  },
}));

export default function NotFound() {
  const classes = useStyles();

  return (
    <article className={classes.root}>
      <div className={classes.notFoundContainer}>
        <img alt="Page not found" className={classes.img} src={biohazard} />
        <Typography
          className={classes.notFoundText}
          component="h1"
          variant="h3"
        >
          NOT FOUND
        </Typography>
      </div>
    </article>
  );
}
