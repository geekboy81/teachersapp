/**
 *
 * SideBar
 *
 */

import React from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DraftsIcon from '@material-ui/icons/Drafts';
import SortIcon from '@material-ui/icons/Sort';
import WorkIcon from '@material-ui/icons/Work';
import CalendarIcon from '@material-ui/icons/EventNote';
import SchoolIcon from '@material-ui/icons/School';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
const drawerWidth = 68;
const useStyles = makeStyles(theme => ({
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
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  }, // theme.mixins.toolbar.
  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    marginTop: theme.spacing(7),
  },
  logo: {
    fontFamily: 'Horizon',
    color: '#212B9B',
    textAlign: 'center',
    margin: '2px',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(5),
    fontWeight: 'bolder',
    fontSize: '39px',
  },
  bolderTitle: {
    fontWeight: 'bolder',
  },
}));

function SideBar() {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Drawer
        className={styles.drawer}
        variant="permanent"
        classes={{
          paper: styles.drawerPaper,
        }}
        anchor="left"
      >
        <Typography variant="h5" className={styles.logo} color="primary">
          360
        </Typography>
        <List component="ul">
          <ListItem button component="div" style={{ marginTop: '15px' }}>
            <ListItemIcon>
              <SortIcon style={{ fontSize: '32px' }} />
            </ListItemIcon>
          </ListItem>
          <ListItem button component="div" style={{ marginTop: '15px' }}>
            <ListItemIcon>
              <DraftsIcon style={{ fontSize: '32px' }} />
            </ListItemIcon>
          </ListItem>
          <ListItem button component="div" style={{ marginTop: '15px' }}>
            <ListItemIcon>
              <WorkIcon style={{ fontSize: '32px' }} />
            </ListItemIcon>
          </ListItem>
          <ListItem button component="div" style={{ marginTop: '15px' }}>
            <ListItemIcon>
              <CalendarIcon style={{ fontSize: '32px' }} />
            </ListItemIcon>
          </ListItem>
          <ListItem button component="div" style={{ marginTop: '15px' }}>
            <ListItemIcon>
              <SchoolIcon style={{ fontSize: '32px' }} />
            </ListItemIcon>
          </ListItem>
          <Link to="/">
            <ListItem button component="div" style={{ marginTop: '15px' }}>
              <ListItemIcon>
                <ShowChartIcon style={{ fontSize: '32px' }} />
              </ListItemIcon>
            </ListItem>
          </Link>
        </List>
      </Drawer>
    </div>
  );
}

SideBar.propTypes = {};
export default SideBar;
