import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import logo from './logo.svg';
import SiteNavigation, { useSiteNavigation } from './SiteNavigation';

PageTemplate.propTypes = {
  children: PropTypes.node.isRequired,
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

const appBarHeight = '60px';
const logoHeight = '24px';

export const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: blueGrey[900],
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    minHeight: appBarHeight,
    position: 'fixed',
    top: 'auto',
  },

  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'hidden',
  },

  menuButton: {
    marginRight: '36px',
  },

  menuButtonHidden: {
    display: 'none',
  },

  root: {
    display: 'flex',
  },

  toolbar: {
    paddingRight: 24, // Keep right padding when drawer closed
  },

  toolbarLogo: {
    height: logoHeight,
    marginLeft: 'auto',
  },
}));

export default function PageTemplate({ children, totals }) {
  const classes = useStyles();
  const siteNavigationProps = useSiteNavigation();

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Hidden mdUp>
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              aria-label="open drawer"
              className={clsx(
                classes.menuButton,
                siteNavigationProps.isDrawerOpen && classes.menuButtonHidden,
              )}
              color="inherit"
              edge="start"
              onClick={siteNavigationProps.toggleDrawerHandler}
            >
              <MenuIcon />
            </IconButton>

            <img alt="COVID-19" className={classes.toolbarLogo} src={logo} />
          </Toolbar>
        </AppBar>
      </Hidden>

      <SiteNavigation {...siteNavigationProps} totals={totals} />

      <main className={classes.content}>{children}</main>
    </div>
  );
}
