import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { paths } from './App';
import CountCard from './CountCard';

StatTotals.propTypes = {
  totals: PropTypes.shape({
    active: PropTypes.number,
    cases: PropTypes.number,
    deaths: PropTypes.number,
    prevActive: PropTypes.number,
    prevCases: PropTypes.number,
    prevDeaths: PropTypes.number,
    prevRecovered: PropTypes.number,
    recovered: PropTypes.number,
  }).isRequired,
};

const useStyles = makeStyles((theme) => ({
  countTitle: {
    color: grey[200],
    fontSize: '14px',
    marginBottom: '-2px',
  },

  totals: {
    marginTop: 'auto',
  },

  [theme.breakpoints.up('md')]: {
    totals: {
      transform: 'translateX(0)',
      transitionDuration: theme.transitions.duration.standard,
      transitionProperty: 'height, margin, transform, opacity',
      transitionTimingFunction: theme.transitions.easing.easeInOut,
      height: 'auto',
      opacity: 1,
      paddingLeft: '12px',
    },

    totalsHide: {
      height: 0,
      marginBottom: 0,
      opacity: 0,
      transform: 'translateX(-50px)',
      transitionProperty: 'height, transform',
    },
  },
}));

export default function StatTotals({ totals }) {
  const classes = useStyles();

  const renderedTotals = [
    {
      count: totals.active,
      countColor: red[500],
      id: 'total--active',
      prevCount: totals.prevActive,
      title: 'Số ca hiện tại',
    },
    {
      count: totals.deaths,
      countColor: yellow[500],
      id: 'total--deaths',
      prevCount: totals.prevDeaths,
      title: 'Tử vong',
    },
    {
      count: totals.recovered,
      countColor: green[400],
      id: 'total--recovered',
      prevCount: totals.prevRecovered,
      title: 'Hồi phục',
    },
    {
      count: totals.cases,
      countColor: grey[100],
      id: 'total--cases',
      prevCount: totals.prevCases,
      title: 'Tổng số ca ',
    },
  ];
  const { pathname } = useLocation();

  return (
    <section
      className={clsx(
        classes.totals,
        pathname === paths.dashboard.path && classes.totalsHide,
      )}
    >
      {renderedTotals.map(({ id, title, ...data }) => (
        <CountCard
          key={id}
          title={
            <Typography className={classes.countTitle} gutterBottom>
              {title}
            </Typography>
          }
          {...data}
        />
      ))}
    </section>
  );
}
