/**
 *
 * AddModule
 *
 */

import React, { Fragment, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import moment from 'moment';

import injectSaga, { useInjectSaga } from 'utils/injectSaga';
import injectReducer, { useInjectReducer } from 'utils/injectReducer';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import SearchIcon from '@material-ui/icons/Search';
import DoneIcon from '@material-ui/icons/Done';
import InputBase from '@material-ui/core/InputBase';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import withStyles from '@material-ui/core/styles/withStyles';
import TableBody from '@material-ui/core/TableBody';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import DialogTitle from '@material-ui/core/DialogTitle';
// import PropTypes from 'prop-types';
import * as PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import GradeInput from '../../components/GradeInput';
import TextListWithAttachments from '../../components/TextListWithAttachments';
import makeSelectAddModule, { makeSelectLoading } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { loadModule, loadScales } from '../GroupDetails/actions';
import groupDetailsSaga from '../GroupDetails/saga';
import groupDetailsReducer from '../GroupDetails/reducer';
import makeSelectGroupDetails from '../GroupDetails/selectors';
import groupsListSaga from '../GroupsList/saga';
import groupsListReducer from '../GroupsList/reducer';
import makeSelectGroupsList from '../GroupsList/selectors';
import { loadGroups } from '../GroupsList/actions';
import { AddModuleStyles } from './style';
import moduleService from '../../shared/service/module';
import scaleService from '../../shared/service/scale';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: 'transparent',
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const useStyles = makeStyles(theme => AddModuleStyles(theme));

export function AddModule(props) {
  useInjectReducer({ key: 'addModule', reducer });
  useInjectSaga({ key: 'addModule', saga });
  const {
    getModule,
    match,
    history,
    groupDetails,
    loadScalesAction,
    loadGroupsAction,
    groupsList,
  } = props;
  const [errorFeedback, setErrorFeedback] = React.useState({
    open: false,
    message: '',
  });

  const classes = useStyles();
  const { moduleId } = match.params;
  const { module } = groupDetails;
  useEffect(() => {
    if (moduleId && moduleId > 0) {
      getModule(moduleId);
    }
    loadScalesAction();
    loadGroupsAction();
  }, [moduleId]);
  useEffect(() => {
    let generatedCategories = [];
    let moduleName = '';
    let numOfYears = 0;
    let numOfPartitions = 0;
    let moduleDates = [];
    let generatedGroups = [];

    if (module && groupDetails.scales && groupDetails.module.course_breakdown) {
      if (moduleId && moduleId > 0) {
        const categories = groupDetails.module.course_breakdown;
        moduleName = module.modul;
        numOfYears = groupDetails.module.years;
        numOfPartitions = groupDetails.module.slices;
        moduleDates = []; // Object.values(groupDetails.module.dates);
        if (categories.num_partitions) {
          delete categories.num_partitions;
        }
        if (categories.num_years) {
          delete categories.num_years;
        }
        generatedCategories = Object.entries(categories).map((v, i) => {
          const category = {};
          try {
            const scale = groupDetails.scales.filter(
              s => parseInt(s.id) === parseInt(v[1].scale_id),
            )[0];
            category.name = v[0];
            category.skills = Object.keys(v[1].breakdown).map(child => ({
              name: child,
              mark: v[1].breakdown[child],
            }));
            if (scale) {
              category.grade = scale;
              category.scale = scale;
              category.scale_id = scale.id;
              category.selectedId = scale.id;
            }
          } catch (e) {}
          return category;
        });
        generatedGroups = Object.entries(groupDetails.module.groups).map(
          value => Object.assign(value[1], { id: parseInt(value[0]) }),
        );
      }
    }
    setValues({
      ...values,
      module_name: moduleName,
      scales: groupDetails.scales,
      groups: generatedGroups,
      num_years: numOfYears,
      num_partitions: numOfPartitions,
      dates: moduleDates,
      categories: [...generatedCategories],
    });
  }, [groupDetails]);
  useEffect(() => {
    if (groupsList.groups) {
      setValues({ ...values, api: groupsList.groups });
    }
  }, [props.groupsList]);
  const [values, setValues] = React.useState({
    skillTitle: '',
    name: '',
    scaleName: '',
    scaleId: '',
    age: '',
    date: '',
    multiline: 'Controlled',
    currency: 'EUR',
    assignTeacherDialogIsOpened: false,
    teachers: [],
    isAddCategoryDialogOpened: false,
    newCategoryName: '',
    grades: [],
    scales: [],
    groups: [],
    num_partitions: '',
    num_years: '',
    isNumOfYearsDialogOpened: false,
    isNumOfPartitionsDialogOpened: false,
    dates: [],
    api: [],
    module_name: '',
    searchGroupText: '',
    categories: [],
    scaleToDelete: {},
    deleteScaleDialogOpen: false,
  });
  const handleAssignNewGroup = group => {
    const { groups } = values;
    groups.push(group);
    setValues({ ...values, groups });
  };
  const handleUnassignGroup = group => {
    const { groups } = values;
    groups.splice(groups.indexOf(group), 1);
    setValues({ ...values, groups });
  };
  const handleAddCategory = () => {
    const { categories } = values;
    if (values.newCategoryName && values.newCategoryName !== '') {
      categories.push({ name: values.newCategoryName, skills: [] });
      setValues({
        ...values,
        newCategoryName: '',
        categories,
        isAddCategoryDialogOpened: false,
      });
    }
  };
  const handlePartitionsNumChanged = e => {
    let dates = [];
    const num = e.target.value;
    dates = Array.from({ length: num });
    for (let index = 0; index < dates.length; index++) {
      const element = {
        start_date: moment(new Date()).add(index, 's'),
        end_date: moment(new Date()).add(index, 's'),
      };
      dates[index] = element;
    }
    setValues({ ...values, num_partitions: num, dates });
  };
  const handleNumberOfYearsClose = () => {
    setValues({ ...values, isNumOfYearsDialogOpened: false });
  };
  const handleOpenNumberOfYearsDialog = () => {
    setValues({ ...values, isNumOfYearsDialogOpened: true, num_years: '' });
  };
  const handleNumberOfPartitionsClose = () => {
    setValues({ ...values, isNumOfPartitionsDialogOpened: false });
  };
  const handleNumberOfPartitionsCloseKeyPress = e => {
    if (e.key === 'Enter') {
      handleNumberOfPartitionsClose();
    }
  };
  const handleNumberOfYearsCloseKeyPress = e => {
    if (e.key === 'Enter') {
      setValues({ ...values, num_years: e.target.value });
      handleNumberOfYearsClose();
    }
  };
  const handleOpenNumberOfPartitionsDialog = () => {
    setValues({
      ...values,
      isNumOfPartitionsDialogOpened: true,
      num_partitions: '',
    });
  };
  const onGradeAdded = grade => {
    const { grades } = values;
    grades.push(grade);
    setValues({ ...values, grades });
  };
  const onGradeDeleted = grades => {
    setValues({ ...values, grades });
  };
  const handleOnScaleEdit = grades => {
    setValues({ ...values, grades });
  };
  const handleAddSkill = category => {
    const { categories } = values;
    // const index = categories.indexOf(category);
    categories[categories.indexOf(category)] = category;
    setValues({ ...values, categories });
  };
  const onDeleteCategory = category => {
    const { categories } = values;
    categories.splice(categories.indexOf(category), 1);
    setValues({ ...values, categories });
  };
  const handleSelectedScaleChanged = category => {
    const { categories } = values;
    // const index = categories.indexOf(category);
    categories[categories.indexOf(category)] = category;
    setValues({ ...values, categories });
  };
  const handleDeleteSkill = category => {
    const { categories } = values;
    // const index = categories.indexOf(category);
    categories[categories.indexOf(category)] = category;
    setValues({ ...values, categories });
  };
  const onEditSkill = category => {
    const { categories } = values;
    // const index = categories.indexOf(category);
    categories[categories.indexOf(category)] = category;
    setValues({ ...values, categories });
  };
  const handleNewCategoryClose = () => {
    setValues({ ...values, isAddCategoryDialogOpened: false });
  };
  const handleOpenNewCategoryDialog = () => {
    setValues({ ...values, isAddCategoryDialogOpened: true });
  };
  const handleAddCategoryDialogInput = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCategory();
    }
  };
  function handleAssignTeacher() {
    setValues({ ...values, assignTeacherDialogIsOpened: true });
  }

  function handleClose() {
    setValues({ ...values, assignTeacherDialogIsOpened: false });
  }
  async function handleDone() {
    const { groups, grades, module_name, categories } = values;
    const groupsIds = groups.map(v => v.id);
    const allScales = {};
    const courseBreakdown = {};
    grades.forEach(grade => {
      allScales[grade.mark] = grade.description;
    });
    let hasError = false;
    categories.forEach(category => {
      const skills = {};
      category.skills.forEach(skill => {
        skills[skill.name] = skill.mark;
      });
      courseBreakdown[category.name] = { breakdown: {}, scale_id: 0 };
      courseBreakdown[category.name].breakdown = skills;
      courseBreakdown[category.name].scale_id = category.selectedId;
      if (
        Object.values(courseBreakdown[category.name].breakdown).length > 0 &&
        !category.selectedId > 0
      ) {
        hasError = true;
      } else if (
        Object.values(courseBreakdown[category.name].breakdown).length <= 0 &&
        !category.selectedId > 0
      ) {
        courseBreakdown[category.name].scale_id =
          props.groupDetails.scales[0].id;
      }
    });
    if (hasError) {
      setErrorFeedback({
        ...errorFeedback,
        open: true,
        message: 'Please, select Scale if you added skills to category',
      });
      return;
    }
    const moduleToSave = {
      status: 1,
      group_ids: groupsIds,
      module_name,
      course_breakdown: courseBreakdown,
      years: values.num_years,
      slices: values.num_partitions,
    };
    try {
      const addModuleResp = await moduleService.addModule(moduleToSave);
      if (addModuleResp.status === 'error') {
        throw new Error(addModuleResp.message);
      }
      if (
        moduleId &&
        moduleId > 0 &&
        addModuleResp.message ===
          'Only slice will be updated for this module as this module has marks assigned to it'
      ) {
        setErrorFeedback({
          ...errorFeedback,
          open: true,
          message: addModuleResp.message,
        });
        setTimeout(() => {
          history.push('/');
        }, 3000);
      } else {
        history.push('/');
      }
    } catch (e) {
      setErrorFeedback({
        ...errorFeedback,
        open: true,
        message: e.message,
      });
    }
  }
  async function handleDeleteScaleConfirmed() {
    const { scaleToDelete } = values;
    try {
      const deleteScaleResp = await scaleService.deleteScale(scaleToDelete.id);
      if (
        deleteScaleResp.message ===
        'Scale id cannot be deleted as it is already being used by a module.'
      ) {
        setErrorFeedback({
          open: true,
          message:
            'This Scale is being used by other modules, hence cannot be deleted. Please remove from all modules to delete it ',
        });
      } else {
        if (deleteScaleResp.status === 'error') {
          throw new Error(deleteScaleResp.message);
        }
        loadScalesAction();
      }
      setValues({ ...values, deleteScaleDialogOpen: false });
    } catch (err) {
      setErrorFeedback({
        open: true,
        message: err.message,
      });
    }
  }
  function handleCancelDeleteScaleDialog() {
    setValues({ ...values, deleteScaleDialogOpen: false });
  }
  function handleOnDeleteScale(scale) {
    setValues({ ...values, deleteScaleDialogOpen: true, scaleToDelete: scale });
  }
  function handleEditScale(scale) {
    setValues({
      ...values,
      scaleName: scale.name,
      scaleId: scale.id,
      grades: Object.entries(scale.grades).map(value => ({
        mark: value[0],
        description: value[1],
      })),
    });
  }
  function handleCancel() {
    history.push('/');
  }
  async function handleOnSaveScale() {
    const { grades, scaleId } = values;
    const scale = {
      name: values.scaleName,
      grades: {},
      scale_id: scaleId,
      id: scaleId,
    };
    grades.forEach(grade => {
      scale.grades[grade.mark] = grade.description;
    });

    try {
      const scaleResp = await scaleService.addScale(scale);
      if (scaleResp.status === 'error') {
        let message = '';
        if (scaleResp.message.includes('Duplicate ')) {
          message = 'thre is already saved scale with the same name.';
        } else {
          const { message } = scaleResp;
        }
        throw new Error(message);
      }
      const response = await scaleService.getScales();
      setValues({
        ...values,
        scales: response.message,
        grades: [],
        scaleName: '',
      });
    } catch (e) {
      setErrorFeedback({
        open: true,
        message: e.message,
      });
    }
  }
  return (
    <div>
      <Helmet>
        <title>Add Module</title>
        <meta name="description" content="Description of Add Module" />
      </Helmet>
      <div className={classes.root}>
        <Typography variant="h6" className={classes.topTitle}>
          New Module
        </Typography>
        <form className={classes.container} noValidate autoComplete="off">
          <Grid container direction="row" justify="space-between">
            <Grid item md={5} xs={12}>
              <Grid container direction="column">
                <Paper
                  style={{
                    backgroundColor: '#CECECE',
                    padding: '8px',
                    paddingLeft: '15px',
                  }}
                  className={classes.inputFullWidth}
                >
                  <InputBase
                    autoFocus
                    label="Dense"
                    className={classes.fw}
                    value={values.module_name}
                    onChange={e =>
                      setValues({ ...values, module_name: e.target.value })
                    }
                    placeholder="Module Name"
                  />
                </Paper>
              </Grid>
              <Grid item>
                <Button
                  variant="text"
                  color="primary"
                  className={classes.button}
                  style={{ marginTop: '25px' }}
                  onClick={handleOpenNewCategoryDialog}
                >
                  <AddIcon className={classes.leftIcon} />
                  Add Category
                </Button>
              </Grid>
            </Grid>
            <Grid item md={6} xs={12}>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="h6">Scales</Typography>
                </Grid>
                <Grid item>
                  <Typography className={classes.subTitle} variant="subtitle2">
                    Saved Scales
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container direction="row">
                    {values.scales &&
                      values.scales.map(scale => (
                        <Grid
                          item
                          key={scale.name}
                          style={{ marginBottom: '5px' }}
                        >
                          <Chip
                            className={classes.badges}
                            variant="outlined"
                            color="secondary"
                            label={scale.name}
                            onDelete={() => handleOnDeleteScale(scale)}
                            onClick={() => handleEditScale(scale)}
                          />
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={5} xs={12}>
              <Grid container>
                {values.categories && values.categories.length > 0 ? (
                  values.categories.map((category, catIndex) => (
                    <Grid item md={12} key={category.name}>
                      <TextListWithAttachments
                        title={category.name}
                        subTitle="Category"
                        onAddSkill={handleAddSkill}
                        onDeleteSkill={handleDeleteSkill}
                        onEditSkill={onEditSkill}
                        onCategoryScaleChanged={handleSelectedScaleChanged}
                        onDeleteCategory={onDeleteCategory}
                        textFieldValue={values.skillTitle}
                        category={category}
                        grades={values.scales}
                      />
                    </Grid>
                  ))
                ) : (
                  <Fragment />
                )}
              </Grid>
            </Grid>
            <Grid item md={6} xs={12}>
              <Grid container>
                <Grid item md={12}>
                  <TextField
                    style={{ width: '100%', marginBottom: '10px' }}
                    label="Scale Title"
                    onChange={e =>
                      setValues({ ...values, scaleName: e.target.value })
                    }
                    value={values.scaleName}
                  />
                </Grid>
                <Grid item md={12}>
                  <GradeInput
                    onSaveScale={handleOnSaveScale}
                    onDelete={onGradeDeleted}
                    grades={values.grades}
                    onGradeAdded={onGradeAdded}
                    onScaleEdit={handleOnScaleEdit}
                  />
                </Grid>
                <Grid item md={12}>
                  <Grid item md={12} xs={12} style={{ marginTop: '-20px' }}>
                    <Grid item md={12}>
                      <Typography variant="h5">Assessment Timeline</Typography>
                    </Grid>
                    <Grid
                      item
                      md={12}
                      style={{ paddingTop: '20px', marginBottom: '20px' }}
                    >
                      <Grid container>
                        <Grid item md={2} className={classes.markContainer}>
                          <Paper className={classes.mark}>
                            <Grid
                              container
                              direction="column"
                              justify="center"
                              alignItems="center"
                              style={{ height: '100%' }}
                            >
                              <Grid item>
                                <Button onClick={handleOpenNumberOfYearsDialog}>
                                  {values.num_years}
                                </Button>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                        <Grid item md={3}>
                          <Grid
                            container
                            direction="column"
                            alignItems="center"
                            justify="center"
                            style={{ paddingTop: '8px' }}
                          >
                            <Grid item md={12}>
                              <Typography variant="subtitle2">
                                # of Years
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={2} className={classes.markContainer}>
                          <Paper className={classes.mark}>
                            <Grid
                              container
                              direction="column"
                              justify="center"
                              alignItems="center"
                              style={{ height: '100%' }}
                            >
                              <Grid item>
                                <Button
                                  onClick={handleOpenNumberOfPartitionsDialog}
                                >
                                  {values.num_partitions}
                                </Button>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                        <Grid item md={3}>
                          <Grid
                            container
                            direction="column"
                            alignItems="center"
                            justify="center"
                            style={{ paddingTop: '8px' }}
                          >
                            <Grid item md={12}>
                              <Typography variant="subtitle2">
                                # of Semesters
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container direction="row">
                      <Grid item md={12}>
                        <Typography variant="h5">Assigned Groups</Typography>
                      </Grid>
                      <Grid item md={12}>
                        <Grid
                          container
                          direction="row"
                          justify="flex-start"
                          style={{ marginTop: '15px' }}
                        >
                          <Grid item md={2}>
                            <IconButton onClick={handleAssignTeacher}>
                              <AddIcon />
                            </IconButton>
                          </Grid>
                          {values.groups.map(group => (
                            <Grid item md={1} key={group.id}>
                              <Tooltip title={group.name}>
                                <Avatar>{group.name.substring(0, 1)}</Avatar>
                              </Tooltip>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={5} xs={12} />
            </Grid>
            <Grid container justify="flex-end" style={{ marginTop: '50px' }}>
              <Grid item md={1}>
                <Button onClick={handleCancel}>Cancel</Button>
              </Grid>
              <Grid item md={1}>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  onClick={handleDone}
                >
                  Done
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </div>
      <Dialog
        className={classes.teachersDialog}
        disableBackdropClick
        disableEscapeKeyDown
        open={values.assignTeacherDialogIsOpened}
        fullWidth
        // onClose={handleClose}
      >
        <DialogContent>
          <form className={classes.container}>
            <Grid container direction="row">
              <Grid item md={9} className={classes.searchContainer}>
                <TextField
                  className={classes.input}
                  placeholder="Search By Name"
                  value={values.searchGroupText}
                  onChange={e =>
                    setValues({ ...values, searchGroupText: e.target.value })
                  }
                />
                <IconButton className={classes.iconButton} aria-label="Search">
                  <SearchIcon />
                </IconButton>
              </Grid>
              <Grid item md={12}>
                <div className={classes.demo}>
                  <List>
                    {values.api &&
                      (values.searchGroupText !== ''
                        ? values.api.filter(group =>
                          group.name
                              .toLowerCase()
                            .includes(values.searchGroupText.toLowerCase()),
                        )
                        : values.api
                      ).map(group => (
                        <ListItem key={group.id}>
                          <ListItemAvatar>
                            <Avatar>{group.name.substring(0, 1)}</Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={group.name} />
                          <ListItemSecondaryAction>
                            {!values.groups.some(
                              el => el.name === group.name,
                            ) ? (
                                <IconButton
                                  edge="end"
                                  aria-label="Delete"
                                  onClick={() => handleAssignNewGroup(group)}
                                >
                                  <AddIcon />
                                </IconButton>
                              ) : (
                                <IconButton
                                  edge="end"
                                  aria-label="Added"
                                  onClick={() => handleUnassignGroup(group)}
                                >
                                  <CheckIcon />
                                </IconButton>
                              )}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                  </List>
                </div>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      {/*  ============================ */}
      <Dialog
        open={values.isAddCategoryDialogOpened}
        onClose={handleNewCategoryClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add new Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="new-category-name"
            label="Enter Category Name"
            type="text"
            fullWidth
            onKeyPress={e => handleAddCategoryDialogInput(e)}
            value={values.newCategoryName}
            onChange={e =>
              setValues({ ...values, newCategoryName: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewCategoryClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCategory} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={values.isNumOfYearsDialogOpened}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="new-category-namex"
            label="Enter Number of years"
            type="number"
            fullWidth
            value={values.num_years}
            onChange={e => setValues({ ...values, num_years: e.target.value })}
            onKeyPress={e => handleNumberOfYearsCloseKeyPress(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNumberOfYearsClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNumberOfYearsClose} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/*  ----------------- */}
      <Dialog
        open={values.isNumOfPartitionsDialogOpened}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="new-category-partitions"
            label="Enter Number of Partitions"
            type="number"
            fullWidth
            style={{ height: '100%' }}
            value={values.num_partitions}
            onChange={e => handlePartitionsNumChanged(e)}
            onKeyPress={e => handleNumberOfPartitionsCloseKeyPress(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNumberOfPartitionsClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNumberOfPartitionsClose} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="md"
        aria-labelledby="confirmation-dialog-title"
        open={values.deleteScaleDialogOpen}
      >
        <DialogTitle id="confirmation-dialog-title">
          Are you sure you want to delete this scale ?
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="caption">{values.scaleToDelete.name}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDeleteScaleDialog} color="primary">
            Cancel
          </Button>
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDeleteScaleConfirmed}
            >
              Delete
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={errorFeedback.open}
        autoHideDuration={6000}
        onClose={() => setErrorFeedback({ ...errorFeedback, open: false })}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{errorFeedback.message}</span>}
        action={[
          <Button
            key="undo"
            color="secondary"
            size="small"
            onClick={() => setErrorFeedback({ ...errorFeedback, open: false })}
          >
            Hide
          </Button>,
        ]}
      />
    </div>
  );
}

AddModule.propTypes = {
  // dispatch: PropTypes.func.isRequired,7
  // groups: PropTypes.any,
  onDone: PropTypes.func,
  history: PropTypes.any,
  match: PropTypes.any,
  getModule: PropTypes.func,
  loadScalesAction: PropTypes.func,
  addModule: PropTypes.any,
  groupDetails: PropTypes.any,
  groupsList: PropTypes.any,
  loadGroupsAction: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  addModule: makeSelectAddModule(),
  loading: makeSelectLoading(),
  groupDetails: makeSelectGroupDetails(),
  groupsList: makeSelectGroupsList(),
});

function mapDispatchToProps(dispatch) {
  return {
    getModule: moduleId => {
      dispatch(loadModule(moduleId));
    },
    loadScalesAction: () => {
      dispatch(loadScales());
    },
    loadGroupsAction: () => {
      dispatch(loadGroups());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withGroupDetailsSaga = injectSaga({
  key: 'groupDetails',
  saga: groupDetailsSaga,
});
const withGrouseInjectReducer = injectReducer({
  key: 'groupDetails',
  reducer: groupDetailsReducer,
});

const withGroupListSaga = injectSaga({
  key: 'groupsList',
  saga: groupsListSaga,
});
const withGroupListInjectReducer = injectReducer({
  key: 'groupsList',
  reducer: groupsListReducer,
});
export default compose(
  withGrouseInjectReducer,
  withGroupDetailsSaga,
  withGroupListInjectReducer,
  withGroupListSaga,
  withConnect,
)(AddModule);
