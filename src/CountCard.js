import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { makeStyles } from '@material-ui/core/styles';
import CountUp from 'react-countup';
import numeral from 'numeral';

CountCard.propTypes = {
  children: PropTypes.node,
  count: PropTypes.number.isRequired,
  countColor: PropTypes.oneOf([red[500], yellow[500], green[400], grey[100]]),
  prevCount: PropTypes.number.isRequired,
  title: PropTypes.node.isRequired,
};

const useStyles = makeStyles({
  content: {
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '16px',
    '&:last-child': {
      paddingBottom: 0,
    },
  },
  count: {
    fontWeight: 'bold',
  },
  pos: {
    marginBottom: '12px',
  },
  root: {
    backgroundColor: 'transparent',
    border: 0,
    boxShadow: 'none',
    width: '100%',
    '&:first-child > *': {
      paddingTop: 0,
    },
  },
});

export default function CountCard({
  children,
  count,
  countColor,
  prevCount,
  title,
}) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        {title}

        <Typography
          className={classes.count}
          component="h2"
          style={{ color: countColor }}
          variant="h4"
        >
          <CountUp
            duration={1.5}
            end={count}
            formattingFn={number => numeral(number).format('0,0')}
            start={prevCount}
          />
        </Typography>

        {children}
      </CardContent>
    </Card>
  );
}
