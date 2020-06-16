import React from 'react';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@material-ui/icons/Dashboard';
import InfoIcon from '@material-ui/icons/Info';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PublicIcon from '@material-ui/icons/Public';
import blueGrey from '@material-ui/core/colors/blueGrey';
import grey from '@material-ui/core/colors/grey';
import { makeStyles } from '@material-ui/core/styles';

import { paths } from './App';

const linkColor = grey[100];
const useStyles = makeStyles(() => ({
  link: {
    color: linkColor,
    display: 'block',
    textDecoration: 'none',
    '&:focus': {
      textDecoration: 'none',
    },
    '&:hover': {
      textDecoration: 'none',
    },
  },

  linkActive: {
    backgroundColor: blueGrey[900],
  },

  linkIcon: {
    color: linkColor,
  },

  root: {
    padding: 0,
  },
}));

export default function SiteLinks() {
  const classes = useStyles();

  const links = [
    {
      icon: <PublicIcon className={classes.linkIcon} />,
      isSiteLink: true,
      text: paths.map.name,
      to: paths.map.path,
    },
    {
      icon: <DashboardIcon className={classes.linkIcon} />,
      isSiteLink: true,
      text: paths.dashboard.name,
      to: paths.dashboard.path,
    },
    {
      icon: <InfoIcon className={classes.linkIcon} />,
      isSiteLink: false,
      text: 'About',
      to: 'https://hieutrandev.netlify.app/',
    },
  ];

  return (
    <List classes={{ root: classes.root }}>
      {links.map(({ icon, isSiteLink, text, to }) => {
        const linkContent = (
          <ListItem button>
            <ListItemIcon className={classes.linkIcon}>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        );

        return isSiteLink ? (
          <NavLink
            activeClassName={classes.linkActive}
            className={classes.link}
            exact
            key={to}
            to={to}
          >
            {linkContent}
          </NavLink>
        ) : (
          <Link
            className={classes.link}
            href={to}
            key={to}
            rel="noopener noreferrer"
            target="_blank"
          >
            {linkContent}
          </Link>
        );
      })}
    </List>
  );
}
