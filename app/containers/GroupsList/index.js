/**
 *
 * GroupsList
 *
 */

import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import * as axios from 'axios';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography,
  withStyles,
} from '@material-ui/core';

import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Avatar from '@material-ui/core/Avatar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';

import saga from './saga';
import reducer from './reducer';
import makeSelectGroupsList from './selectors';
import { BACKEND_URL } from '../../config';
import moduleService from '../../shared/service/module';
import { SEMESTER_STATUS } from 'shared/semester';

const ColorLinearProgress = withStyles({
  barColorPrimary: {
    backgroundColor: '#3CC89C',
  },
})(LinearProgress);

const useStyles = makeStyles(theme => ({
  searchRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
    backgroundColor: '#EFEFEF',
    color: 'black',
    marginBottom: theme.spacing(3),
  },
  input: {
    marginLeft: 8,
    flex: 1,
    color: 'black',
  },
  iconButton: {
    padding: 10,
    color: 'black',
  },
  root: {
    display: 'flex',
    marginLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(6),
    marginLeft: theme.spacing(2),
  },
  progressRoot: {
    flexGrow: 1,
    maxWidth: 180,
    paddingTop: theme.spacing(0.5),
  },
  item: {
    marginBottom: theme.spacing(3),
  },
  innerCard: {
    paddingLeft: theme.spacing(3),
  },
  progressText: {
    paddingLeft: theme.spacing(1),
  },
  customProgress: {},
}));

export function GroupsList(props) {
  useInjectReducer({ key: 'groupsList', reducer });
  useInjectSaga({ key: 'groupsList', saga });
  const classes = useStyles();
  const [values, setValues] = React.useState({
    search: '',
    module: {
      modul: '',
      module: '',
    },
  });
  const handleViewStudents = (moduleId, groupName) => {
    props.history.push(`/groups/students/${moduleId}/${groupName}`);
  };
  const { moduleId } = props.match.params;
  useEffect(() => {
    async function fetchModuleDetails() {
      const module = await moduleService.getModuleById(parseInt(moduleId));
      return module;
    }
    fetchModuleDetails().then(resp => {
      console.log(resp);
      setValues({ ...values, module: resp.message });
    });
  }, [moduleId]);
  return (
    <div>
      <Typography variant="h5" className={classes.title}>
        {values.module.modul}
      </Typography>
      <Typography variant="subtitle2" className={classes.title}>
        All Groups
      </Typography>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        className={classes.root}
      >
        <Grid item md={12} className={classes.searchContainer}>
          <Paper className={classes.searchRoot}>
            <InputBase
              className={classes.input}
              placeholder="Search"
              value={values.search}
              onChange={e => setValues({ ...values, search: e.target.value })}
              inputProps={{ 'aria-label': 'Search Google Maps' }}
            />
            <IconButton className={classes.iconButton} aria-label="Search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
        <Grid item className={classes.item} md={12}>
          <Card>
            <List className={classes.innerCard}>
              {values.module.groups &&
                Object.values(values.module.groups)
                  .filter(g => g.name.toLowerCase().includes(values.search.toLowerCase()))
                  .map(( group => (
                      <div key={group.name}>
                        <ListItem component="li" key={group} onClick={() => handleViewStudents(moduleId, group.name)}>
                          <ListItemAvatar>
                            <Avatar>{group.name.substring(0, 1)}</Avatar>
                          </ListItemAvatar>
                          <ListItemText>
                            <Grid container>
                              <Grid item md={3}>
                                <Typography variant="subtitle1">{group.name}</Typography>
                              </Grid>
                              <Grid item md={2}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary">
                                  {group.total} students
                                </Typography>
                              </Grid>
                              <Grid item md={5}>
                                <Grid
                                  container
                                  direction="row"
                                  justify="center"
                                  alignItems="center"
                                >
                                  <Grid item className={classes.progressRoot} md={6}>
                                    <ColorLinearProgress
                                      variant="determinate"
                                      value={(group.total <= 0 ? 0: ((group.childids.reduce((a,b) => (
                                        b.status === SEMESTER_STATUS.progress ||
                                        b.status === SEMESTER_STATUS.complete ||
                                        b.status === SEMESTER_STATUS.published
                                       ) ? a + 1 : a, 0) / group.total) * 100)).toFixed(2) }
                                      className={classes.customProgress}
                                    />
                                  </Grid>
                                  <Grid item md={6} className={classes.progressText}>
                                    <Typography>
                                      {(group.total <= 0 ? 0: ((group.childids.reduce((a,b) => (
                                        b.status === SEMESTER_STATUS.progress ||
                                        b.status === SEMESTER_STATUS.complete ||
                                        b.status === SEMESTER_STATUS.published
                                      ) ? a + 1 : a, 0) / group.total) * 100)).toFixed(2)}% Marked
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </ListItemText>
                          <ListItemSecondaryAction>
                            <Button onClick={() => handleViewStudents(moduleId, group.name)} color="primary">
                              View Students
                            </Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                      </div>
                    ))
                  )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

GroupsList.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  history: PropTypes.any,
  match: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  groupsList: makeSelectGroupsList(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(GroupsList);
