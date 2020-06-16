import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import SiteLinks from './SiteLinks';
import StatTotals from './StatTotals';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

import logo from './logo.svg';

SiteNavigation.propTypes = {
  isDrawerOpen: PropTypes.bool.isRequired,
  toggleDrawerHandler: PropTypes.func.isRequired,
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

const drawerBgColor = grey[900];
const drawerWidth = '240px';
const logoHeight = '24px';

const useStyles = makeStyles((theme) => ({
  drawer: {
    zIndex: `${theme.zIndex.drawer + 1000} !important`,
  },

  drawerLogo: {
    height: logoHeight,
    margin: '16px 0 32px 0',
  },

  drawerPaper: {
    backgroundColor: drawerBgColor,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
    padding: '16px 0',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    whiteSpace: 'nowrap',
    width: drawerWidth,
    zIndex: theme.zIndex.drawer + 1001,
  },

  lastUpdated: {
    color: grey[100],
    fontSize: '12px',
    marginTop: '24px',
    paddingLeft: '16px',
  },

  root: {
    [theme.breakpoints.up('md')]: {
      flexShrink: 0,
      width: drawerWidth,
    },
  },
}));

export const useSiteNavigation = () => {
  const isMediumBreakpoint = useMediaQuery('(min-width: 960px)');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const _toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Fix bug when user opens sidebar on a small screen and then enlarges the browser window
  useEffect(() => {
    isMediumBreakpoint && isDrawerOpen && setIsDrawerOpen(false);
  }, [isDrawerOpen, isMediumBreakpoint, setIsDrawerOpen]);

  return {
    isDrawerOpen,
    toggleDrawerHandler: _toggleDrawer,
  };
};

export default function SiteNavigation({
  isDrawerOpen,
  toggleDrawerHandler,
  totals,
}) {
  const classes = useStyles();

  const lastUpdatedContent = (
    <Typography className={classes.lastUpdated}>
      {totals.updated
        ? `Cập nhần lần cuối: ${moment(totals.updated).format('DD/MM/YYYY')},
                ${moment(totals.updated).format('h:mmA')}`
        : 'Đang cập nhật'}
    </Typography>
  );

  return (
    <nav aria-label="site navigation" className={classes.root}>
      <Hidden mdUp implementation="css">
        <SwipeableDrawer
          classes={{
            paper: classes.drawerPaper,
            root: classes.drawer,
          }}
          ModalProps={{
            keepMounted: true, // Used for better performance on mobile
          }}
          onClose={toggleDrawerHandler}
          onOpen={toggleDrawerHandler}
          open={isDrawerOpen}
          variant="temporary"
        >
          <SiteLinks />
          <StatTotals totals={totals} />
          {lastUpdatedContent}
        </SwipeableDrawer>
      </Hidden>

      <Hidden smDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          open
          variant="permanent"
        >
          <img alt="COVID-19" className={classes.drawerLogo} src={logo} />
          <SiteLinks />
          <StatTotals totals={totals} />
          {lastUpdatedContent}
        </Drawer>
      </Hidden>
    </nav>
  );
}
