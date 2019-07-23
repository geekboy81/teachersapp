/**
 *
 * GroupStudents
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import {
  Card,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
  withStyles,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FilledInput from '@material-ui/core/FilledInput';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import * as axios from 'axios';
import makeSelectGroupStudents from './selectors';
import reducer from './reducer';
import saga from './saga';
import { BACKEND_URL } from '../../config';
import moduleService from '../../shared/service/module';

const GreenRadio = withStyles({
  root: {
    color: '#3CC89C',
    '&$checked': {
      color: '#3CC89C',
    },
  },
  checked: {},
})(props => <Radio color="default" {...props} />);
const useStyles = makeStyles(theme => ({
  selectGroup: {
    minWidth: '70%',
  },
  paper: {
    // padding: '2px 4px',
    backgroundColor: '#EFEFEF',
    display: 'flex',
    alignItems: 'center',
    // width: 350,
    marginBottom: theme.spacing(3),
  },
  searchRoot: {
    padding: '2px 4px',
  },
  rdborder: {
    borderLeft: '2px solid #EFEFEF',
    textAlign: 'center',
    paddingLeft: theme.spacing(3),
  },
  xxfilter: {
    paddingLeft: '20px',
  },
  input: {
    margin: 0,
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
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(5),
    marginTop: theme.spacing(5),
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
    paddingRight: theme.spacing(3),
  },
  progressText: {
    paddingLeft: theme.spacing(1),
  },
  customProgress: {},
}));

export function GroupStudents(props) {
  useInjectReducer({ key: 'groupStudents', reducer });
  useInjectSaga({ key: 'groupStudents', saga });
  const classes = useStyles();
  const [values, setValues] = React.useState({
    search: '',
    markFilter: '',
    selectedGroup: {
      name: '',
    },
    module: {
      module: '',
    },
  });
  const { moduleId } = props.match.params;
  useEffect(() => {
    async function fetchModuleDetails() {
      const module = await moduleService.getModuleById(moduleId);
      return module;
    }
    fetchModuleDetails().then(resp => {
      const m = resp.message;
      const sGroup = Object.values(m.groups).filter(
        group =>
          group.name.toLowerCase() ===
          props.match.params.groupName.toLowerCase(),
      )[0];
      setValues({ ...values, module: m, selectedGroup: sGroup });
    });
  }, [moduleId]);
  const handleGoToStudentDetails = (id, ss) => {
    const studentName = `${ss.firstname} ${ss.lastname}`;
    props.history.push(`/groups/details/${moduleId}/${id}/${studentName}`);
  };
  return (
    <div>
      <Typography variant="h5" className={classes.title}>
        {values.module.modul}
      </Typography>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        className={classes.root}
      >
        <Grid item md={2} className={classes.searchContainer}>
          <FormControl variant="filled" className={classes.selectGroup}>
            <InputLabel htmlFor="filled-age-simple">Select Group</InputLabel>
            <Select
              className={classes.select}
              value={values.selectedGroup}
              onChange={e =>
                setValues({ ...values, selectedGroup: e.target.value })
              }
              input={
                <FilledInput
                  name="age"
                  id="filled-age-simple"
                  value={values.search}
                  onChange={e =>
                    setValues({ ...values, search: e.target.value })
                  }
                />
              }
            >
              <MenuItem value={{ name: '' }}>
                <em>All</em>
              </MenuItem>
              {values.module.groups &&
                Object.values(values.module.groups)
                  // .filter(g =>
                  //   g.name.toLowerCase().includes(values.search.toLowerCase()),
                  // )
                  .map(group => (
                    <MenuItem key={group.name} value={group}>
                      {group.name}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={3} className={classes.searchContainer}>
          <Paper className={classes.paper}>
            <InputBase
              className={classes.input}
              value={values.search}
              onChange={e => setValues({ ...values, search: e.target.value })}
              placeholder="Search by student name"
              inputProps={{ 'aria-label': 'Search Google Maps' }}
            />
            <IconButton className={classes.iconButton} aria-label="Search">
              <SearchIcon style={{ fontSize: '18px' }} />
            </IconButton>
          </Paper>
        </Grid>
        <Grid item md={5} className={classes.xxfilter}>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item md={3}>
              <Typography>Filter By</Typography>
            </Grid>
            <Grid item md={3}>
              <GreenRadio
                checked={values.markFilter === ''}
                value=""
                name="radio-button-demo"
                onChange={e =>
                  setValues({ ...values, markFilter: e.target.value })
                }
                inputProps={{ 'aria-label': 'E' }}
              />
              All
            </Grid>
            <Grid item md={3}>
              <GreenRadio
                checked={values.markFilter === 'MARKED'}
                value="MARKED"
                name="radio-button-demo"
                onChange={e =>
                  setValues({ ...values, markFilter: e.target.value })
                }
                inputProps={{ 'aria-label': 'E' }}
              />
              Marked
            </Grid>
            <Grid item md={3}>
              <GreenRadio
                checked={values.markFilter === 'UNMARKED'}
                value="UNMARKED"
                onChange={e =>
                  setValues({ ...values, markFilter: e.target.value })
                }
                name="radio-button-demo"
                inputProps={{ 'aria-label': 'E' }}
              />
              Unmarked
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.item} md={2}>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="baseline"
          >
            <Grid item style={{ paddingTop: '8px' }}>
              <Typography>
                Class status -{' '}
                {values.module.groups &&
                Object.values(values.module.groups)
                  .filter(g =>
                    g.name
                      .toLowerCase()
                      .includes(values.selectedGroup.name.toLowerCase()),
                  )
                  .reduce((acc, val) => acc + val.total, 0) > 0
                  ? values.module.groups &&
                    (Object.values(values.module.groups)
                      .filter(g =>
                        g.name
                          .toLowerCase()
                          .includes(values.selectedGroup.name.toLowerCase()),
                      )
                      .reduce((acc, val) => acc + val.marked, 0) /
                      (values.module.groups &&
                        Object.values(values.module.groups)
                          .filter(g =>
                            g.name
                              .toLowerCase()
                              .includes(
                                values.selectedGroup.name.toLowerCase(),
                              ),
                          )
                          .reduce((acc, val) => acc + val.total, 0))) *
                      100
                  : 0}
                % Marked
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.item} md={12}>
          <Card>
            <List className={classes.innerCard}>
              {values.module.groups &&
                Object.values(values.module.groups)
                  .filter(g =>
                    g.name
                      .toLowerCase()
                      .includes(values.selectedGroup.name.toLowerCase()),
                  )
                  .map(group =>
                    Object.values(group.childids)
                      .filter(
                        s =>
                          (s.firstname
                            .toLowerCase()
                            .includes(values.search.toLowerCase()) ||
                            s.lastname
                              .toLowerCase()
                              .includes(values.search.toLowerCase())) &&
                          s.status
                            .toLowerCase()
                            .includes(values.markFilter.toLowerCase()),
                      )
                      .map(student => (
                        <ListItem
                          component="li"
                          key={student.childid}
                          onClick={() =>
                            handleGoToStudentDetails(student.childid, student)
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>{student.firstname.substring(0, 1)}</Avatar>
                          </ListItemAvatar>
                          <ListItemText>
                            <Grid container>
                              <Grid item md={1}>
                                <Typography variant="subtitle1">
                                  {`${student.firstname} ${student.lastname}`}
                                </Typography>
                              </Grid>
                              <Grid item md={1}>
                                <Typography variant="subtitle2" color="error">
                                  {student.status === 'Not Found'
                                    ? 'pending'
                                    : student.status}
                                </Typography>
                              </Grid>
                            </Grid>
                          </ListItemText>
                          <Divider />
                        </ListItem>
                      )),
                  )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

GroupStudents.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  history: PropTypes.any,
  match: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  groupStudents: makeSelectGroupStudents(),
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

export default compose(withConnect)(GroupStudents);
