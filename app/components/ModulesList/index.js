/**
 *
 * ModulesList
 *
 */

import React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import * as Routes from '../../routes';
import ModuleCard from '../ModuleCard';
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  title: {
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(6),
    marginLeft: theme.spacing(3),
    fontSize: '28px',
  },
  item: {
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));
function ModulesList(props) {
  const classes = useStyles();
  const handleAddModule = () => {
    props.history.push(Routes.ADD_MODULE_ROUTE);
  };
  const handleDisplayGroupDetails = () => {
    props.history.push(Routes.GROUPS_LIST);
  };
  return (
    <div>
      <Typography variant="h5" className={classes.title}>
        Add Progress Report
      </Typography>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        className={classes.root}
      >
        <Grid item className={classes.item}>
          <ModuleCard cardType="addModule" handle={handleAddModule} />
        </Grid>
        <Grid item className={classes.item}>
          <ModuleCard handleDisplayGroupDetails={handleDisplayGroupDetails} />
        </Grid>
        <Grid item className={classes.item}>
          <ModuleCard handleDisplayGroupDetails={handleDisplayGroupDetails} />
        </Grid>
        <Grid item className={classes.item}>
          <ModuleCard handleDisplayGroupDetails={handleDisplayGroupDetails} />
        </Grid>
        <Grid item className={classes.item}>
          <ModuleCard handleDisplayGroupDetails={handleDisplayGroupDetails} />
        </Grid>
      </Grid>
    </div>
  );
}

ModulesList.propTypes = {
  history: PropTypes.any,
};

export default ModulesList;
