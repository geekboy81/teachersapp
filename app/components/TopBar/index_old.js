/**
 *
 * TopBar
 *
 */
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ChatIcon from '@material-ui/icons/ChatBubble';
import AlertIcon from '@material-ui/icons/Notifications';
import Avatar from '@material-ui/core/Avatar';
import * as PropTypes from 'prop-types';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

const drawerWidth = 68;
const useStyles = makeStyles(theme => ({
  icon: {
    marginTop: theme.spacing(1),
    color: '#212B9B',
  },
  title: {
    paddingTop: theme.spacing(1),
    fontSize: '28px',
  },
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: {
    backgroundColor: 'white',
    color: theme.palette.text.primary,
  }, // theme.mixins.toolbar.
  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    marginTop: theme.spacing(7),
  },
  logo: {
    color: '#',
    textAlign: 'center',
    margin: '2px',
    fontWeight: 'bolder',
  },
  bolderTitle: {
    fontWeight: 'bolder',
  },
}));

function TopBar({ onLogout }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h6" noWrap className={classes.title}>
                Welcome <span className={classes.bolderTitle}>Alicia</span>
              </Typography>
            </Grid>
            <Grid item>
              <Grid container>
                <Grid item md={4}>
                  <IconButton
                    edge="end"
                    aria-label="Menu"
                    className={classes.icon}
                  >
                    <ChatIcon />
                  </IconButton>
                </Grid>
                <Grid item md={4}>
                  <IconButton
                    edge="end"
                    aria-label="Menu"
                    className={classes.icon}
                  >
                    <AlertIcon />
                  </IconButton>
                </Grid>
                <Grid item md={4}>
                  <IconButton
                    edge="end"
                    aria-label="Menu"
                    onClick={() => onLogout()}
                  >
                    <Avatar />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}

TopBar.propTypes = {
  onLogout: PropTypes.func,
};

export default TopBar;
