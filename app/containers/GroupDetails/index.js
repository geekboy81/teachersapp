/**
 *
 * GroupDetails
 *
 */

import React, { useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import * as PropTypes from 'prop-types';
import makeSelectGroupDetails, { makeSelectScales, makeModuleSkillsMarks, makeChildFullName } from './selectors';
import reducer from './reducer';
import saga from './saga';
import {loadModule, loadScales, loadChildMarks, loadStudentMarksDetails, getStudentMarksDetails} from './actions';
import moment from 'moment';
import deepPurple from '@material-ui/core/colors/deepPurple';
import greyPurple from '@material-ui/core/colors/grey';
import SkillMarks from '../../components/SkillMarks';
import CategoryCommentAndPhotos from '../../components/CategoryCommentAndPhotos';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import marksService from '../../shared/service/marks';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/core/SvgIcon/SvgIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import PrintableDocument from '../../components/PrintableDocument';
import Snackbar from "@material-ui/core/Snackbar";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    paddingTop: theme.spacing(2),
    // border: '1px solid gray',
  },
  title: {
    marginBottom: theme.spacing(5),
    marginTop: theme.spacing(5),
    marginLeft: theme.spacing(2),
    fontSize: '28px',
  },
  subTitle: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
  item: {
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  itemx: {
    // marginLeft: theme.spacing(3),
  },
  rowContainer: {
    // marginLeft: theme.spacing(3),
  },
  table: {},
  tableTitle: {
    textAlign: 'center',
    paddingBottom: theme.spacing(1),
  },
  seprator: {
    color: 'gray',
  },
  subTableTitle: {
    textAlign: 'center',
    paddingTop: theme.spacing(0),
    marginTop: -theme.spacing(1),
  },
  innerSelectedSemester: {
    padding: theme.spacing(2),
  },
  row: {
    paddingTop: '15px',
    paddingBottom: '15px',
  },
  currentSemesterHeader: {
    color: 'white',
    backgroundColor: deepPurple[500],
  },
  notCurrentSemesterHeader: {},
  currentSemesterContainer: {
    color: 'black',
    backgroundColor: greyPurple[200],
  },
  notCurrentSemesterContainer: {},
}));
export function GroupDetails({ match, groupDetails, getModule,
                               history, role,
                               onLoadStudentMarksDetails,
                               onGetSemesterDetails,
  onLoadChildMarks, onLoadScales, onCategories, childFullName }) {
  useInjectReducer({ key: 'groupDetails', reducer });
  useInjectSaga({ key: 'groupDetails', saga });
  const classes = useStyles();
  const search = (key, value, inputArray) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < inputArray.length; i++) {
      if (inputArray[i][key] === value) {
        return inputArray[i];
      }
    }
  };
  const [errorFeedback, setErrorFeedback] = React.useState({
    open: false,
    message: '',
  });
  const [values, setValues] = React.useState({
    categories: [],
    studentMarks: [],
    scaleIndex: 0,
    moduleId: 0,
    semesters: [],
    studentScales: [],
    module: {
      module: '',
    },
  });
  const [noMarksMode, setNoMarksMode] = React.useState(false);
  const [categoriesList, setCategoriesList] = React.useState([]);
  const [studentGrades, setStudentGrades] = React.useState([]);
  const [finalMarks, setFinalMarks] = React.useState({});
  const [preview, setPreview] = React.useState({
    open: false,
    data: {},
  });
  const { moduleId, childId, studentName } = match.params;
  useEffect(() => {
    onLoadStudentMarksDetails(moduleId, childId);
    onGetSemesterDetails(moduleId, childId);
    onLoadChildMarks(moduleId, childId);
  }, [moduleId, childId]);
  const { studentMarksDetails, studentSemesterDetails } = groupDetails;
  const handleOnStudentGradesChanged = grades => setStudentGrades(grades);
  useEffect(() => {
    let semesters = [];
    const categories = [];
    let isBreakDownHasSkills = false;
    const studentScales = [];
    Object.values(groupDetails.studentMarksDetails.module.course_breakdown).forEach( (v) => {
      if (Object.values(v.breakdown).length > 0) {
        isBreakDownHasSkills = true;
      }
    });
    if (isBreakDownHasSkills && groupDetails.studentMarksDetails.module.course_breakdown) {
      semesters = Array.from({ length: studentMarksDetails.module.years })
        .map((year, yearIndex) => {
          return Array.from({ length: studentMarksDetails.module.slices })
            .map((i, index) => {
                const is_current = (yearIndex === (parseInt(studentSemesterDetails.year) -1 ) && index === (parseInt(studentSemesterDetails.slice) - 1));
                return {
                  is_current,
                  className: (is_current) ? classes.currentSemesterHeader : classes.notCurrentSemesterHeader,
                  marksClassName: (is_current) ? classes.currentSemesterContainer : classes.notCurrentSemesterContainer,
                };
              }
            )
        });
      const { course_breakdown } = groupDetails.studentMarksDetails.module;
      if (course_breakdown) {
        Object.entries(course_breakdown).map(([key, value]) => {
          let scale = { grades: [] };
          scale = search('id', value.scale_id, groupDetails.studentMarksDetails.scales);
          if (!search('id', scale.id, studentScales)) {
            studentScales.push(scale);
          }
          const category = { name: key, skills: [], scale: scale, scale_id:  value.scale_id };
          category.skills = Object.keys(value.breakdown);
          category.grid = category.skills.map(skill => {
            const g1 = Object.keys(scale.grades).map(mark => ({
              mark,
              is_selected: false,
            }));
            return {
              skill,
              years: semesters.map((semestersOfYears, yearIndex) => (
                {
                  yearIndex,
                  semesters: semestersOfYears.map(s => s),
                  ref: React.createRef(),
                })),
            }
          });
          categories.push(category);
        });
      }
      // --------------------------
      // --------------------------
      setValues({ ...values, semesters, categories, studentScales });
      setNoMarksMode(false);
    } else {
      // eslint-disable-next-line camelcase
      const { course_breakdown } = groupDetails.studentMarksDetails.module;
      let categoriesListTemp = [];
      // eslint-disable-next-line camelcase
      if (course_breakdown) {
        categoriesListTemp = Object.keys(course_breakdown).map(key => ({ name: key }));
      }
      setNoMarksMode(true);
      setCategoriesList(categoriesListTemp);
    }
  }, [groupDetails]);
  const handlePhotosListChange = (category, photo) => {
    if (!finalMarks[category.name]) {
      finalMarks[category.name] = {};
    }
    finalMarks[category.name].photos = photo;
    setFinalMarks({...finalMarks});
  };
  const handleOnCommentOnlyMode = (category, comment) => {
    if (!finalMarks[category.name]) {
      finalMarks[category.name] = {};
    }
    if (!finalMarks[category.name].comments) {
      finalMarks[category.name].comments = [];
    }
    finalMarks[category.name].comments[0] = comment;
  };
  const handleCommentChange = (category, comment) => {
    if (!finalMarks[category.name]) {
      finalMarks[category.name] = {};
    }
    // if (finalMarks[category.name].comment) {
    //   finalMarks[category.name].comment = [];
    // }
    finalMarks[category.name].comment = comment;
    setFinalMarks({...finalMarks});
  };
    const handleChangeMark = (grades, categoryIndex, gIndex, mark) => {
      console.info('XXXXXXXXXX');
    if (!finalMarks[values.categories[categoryIndex].name]) {
      finalMarks[values.categories[categoryIndex].name] = {};
    }
    finalMarks[values.categories[categoryIndex].name].scale_id = values.categories[categoryIndex].scale_id;
    if (!finalMarks[values.categories[categoryIndex].name].breakdown) {
      finalMarks[values.categories[categoryIndex].name].breakdown = {};
    }
    finalMarks[values.categories[categoryIndex].name].breakdown[values.categories[categoryIndex].grid[gIndex].skill] = mark.mark;
    setFinalMarks({...finalMarks});
    setStudentGrades(grades);
  };
  const handleBack = () => {
    history.goBack();
  };
  const handlePreview = () => {
    setPreview({ open: true, data: {} });
  };

  const handlePublishToAdmin = async () => {
    let marks = {};
    if (groupDetails.marks[0] && groupDetails.marks[0].marks) {
      marks = groupDetails.marks[0].marks;
    }
    const req = {
      marks,
      clazz_id: parseInt(moduleId),
      child_id: parseInt(childId),
      status: 3,
      slice: groupDetails.studentSemesterDetails.slice,
      year: groupDetails.studentSemesterDetails.year,
    };
    const updateMarkResp = await marksService.addUpdateMarks(req);
    if (updateMarkResp.status === 'success') {
      setErrorFeedback({
        ...errorFeedback,
        open: true,
        message: 'Student marks has been published to the admin successfully !',
      });
    } else {
      setErrorFeedback({
        ...errorFeedback,
        open: true,
        message: updateMarkResp.message,
      });
    }
  };
  const handlePublishToParents = async () => {
    let marks = {};
    if (groupDetails.marks[0] && groupDetails.marks[0].marks) {
      marks = groupDetails.marks[0].marks;
    }
    const req = {
      marks,
      clazz_id: parseInt(moduleId),
      child_id: parseInt(childId),
      status: 4,
      slice: groupDetails.studentSemesterDetails.slice,
      year: groupDetails.studentSemesterDetails.year,
    };
    try {
      const updateMarkResp = await marksService.addUpdateMarks(req);
      if (updateMarkResp.status === 'success') {
        setErrorFeedback({
          ...errorFeedback,
          open: true,
          message: 'Student marks has been published to there parents successfully !',
        });
      } else {
        throw new Error(updateMarkResp.message);
      }
    } catch (e) {
      setErrorFeedback({
        ...errorFeedback,
        open: true,
        message: e.message,
      });
    }
  };
  const handleDone = async () => {
    const req = {
      marks: finalMarks,
      clazz_id: parseInt(moduleId),
      child_id: parseInt(childId),
      status: 2,
      slice: groupDetails.studentSemesterDetails.slice,
      year: groupDetails.studentSemesterDetails.year,
    };
    try {
      const updateMarkResp = await marksService.addUpdateMarks(req);
      if (updateMarkResp.status === 'success') {
        setErrorFeedback({
          ...errorFeedback,
          open: true,
          message: 'Student marks has been saved successfully !',
        });
      } else {
        throw new Error(updateMarkResp.message);
      }
    } catch (e) {
      setErrorFeedback({
        ...errorFeedback,
        open: true,
        message: e.message,
      });
    }
  };
  return (
  <div>
    {groupDetails.loading ?
        <Grid container justify="center" alignItems="center">
          <Grid item={12} style={{ marginTop: '150px' }}>
            <CircularProgress size={48} className={classes.buttonProgress}/>
          </Grid>
        </Grid>:
      <div>
        {groupDetails && !groupDetails.loading &&
        <div>
          <Typography variant="h5" className={classes.title}>
            {groupDetails.studentMarksDetails.module && groupDetails.studentMarksDetails.module.modul}
          </Typography>
          <Typography variant="h5" className={classes.title}>
            {studentName}
          </Typography>
          {noMarksMode ? <div>
              {categoriesList.map(category => <CategoryCommentAndPhotos
                category={category}
                currentMarks={groupDetails.marks[0]}
                config={{ hideCategoryName: false }}
                module={groupDetails.studentMarksDetails.module}
                onCommentChange={c => handleOnCommentOnlyMode(category, c)}
                key={category.name}/>)}
            </div> :
            <div>
              {values.categories && values.categories.map((catx, categoryIndex) =>
                <div key={catx.name}>
                  <Grid container>
                    <Grid item md={12}>
                      <Typography variant="h5" className={classes.subTitle}>
                        {catx.name}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box
                    boxShadow={2}
                    borderRadius={15}
                    style={{ marginLeft: '15px', marginRight: '15px' }}
                  >
                    <Grid
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="flex-start"
                      className={classes.root}
                    >
                      <Grid item className={classes.itemx} md={12}>
                        <SkillMarks
                          currentMarks={groupDetails.marks[0]}
                          semesters={values.semesters}
                          semesterDetails={groupDetails.studentSemesterDetails}
                          category={catx}
                          module={groupDetails.studentMarksDetails.module}
                          categoryIndex={categoryIndex}
                          onHandleChangeMark={(grades, gIndex, mark) => handleChangeMark(grades, categoryIndex, gIndex, mark)}
                          handleCommentChange={(category, comment) => handleCommentChange(category, comment)}
                          handlePhotosChange={(category, photo) => handlePhotosListChange(category, photo)}
                          generateMarksGrid={catx.grid}
                          handleOnStudentGradesChanged={handleOnStudentGradesChanged}
                          studentGrades={studentGrades}
                          role={role}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </div>)
              }
            </div>
          }
            {values.studentScales.length > 0 &&
            <Grid item className={classes.item} md={12} style={{ marginTop: '25px' }}>
              <Grid container>
                <Grid item md={12} style={{ marginBottom: '20px' }}>
                  <Typography variant="h5">Scales</Typography>
                </Grid>
                <Grid item md={12}>
                  {values.studentScales.map(scale => <div>
                      <Grid item md={12}>
                        <Typography variant="h5">{scale.name}</Typography>
                      </Grid>
                    <Grid item md={6}>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      {Object.entries(scale.grades).map( ([key, value]) =>
                        <List>
                          <ListItemText key={key + value}>
                            {`${key}- ${value}`}
                          </ListItemText>
                        </List>
                      )}
                    </Grid>
                    </div>
                  )}
                </Grid>
              </Grid>
            </Grid>}

          <Grid container justify="flex-end">
            <Grid item style={{ marginRight: '5px' }}>
              <Button onClick={handleBack}>Back</Button>
            </Grid>
            <Grid item style={{ marginRight: '5px' }}>
              <Button color="primary" onClick={handlePreview} variant="contained">Preview</Button>
            </Grid>
            <Grid item style={{ marginRight: '5px' }}>
              <Button color="primary" onClick={handleDone} variant="contained">Save</Button>
            </Grid>
            <Grid item>
              {role === 'admin' ?
                <Button color="primary" variant="contained" onClick={handlePublishToParents}>
                  Publish to Parents
                </Button> :
                <Button color="primary" variant="contained" onClick={handlePublishToAdmin}>
                  Publish to admin
                </Button>
              }
            </Grid>
          </Grid>
        </div>
        }
      </div>
    }
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={preview.open}
      fullWidth
      fullScreen

    >
      <DialogContent>
        <PDFViewer style={{ width: '100%', height: '100%' }}>
          <PrintableDocument />
        </PDFViewer>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPreview({...preview, open: false})} color="primary">
          Cancel
        </Button>
        <Button onClick={() => setPreview({...preview, open: false})} color="primary">
          Ok
        </Button>
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

GroupDetails.propTypes = {
  history: PropTypes.any,
  match: PropTypes.any,
  groupDetails: PropTypes.any,
  getModule: PropTypes.func,
  onLoadScales: PropTypes.func,
  onLoadChildMarks: PropTypes.func,
  onCategories: PropTypes.any,
  onLoadStudentMarksDetails: PropTypes.func,
  onGetSemesterDetails: PropTypes.func,
  role: PropTypes.any,
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  groupDetails: makeSelectGroupDetails(),
  onCategories: makeModuleSkillsMarks(),
});

function mapDispatchToProps(dispatch) {
  return {
    getModule: moduleId => { dispatch(loadModule(moduleId)); },
    onLoadScales: () => { dispatch(loadScales()); },
    onLoadChildMarks: (moduleId, childId) => { dispatch(loadChildMarks(moduleId, childId)); },
    onLoadStudentMarksDetails: (moduleId, childId) => { dispatch(loadStudentMarksDetails(moduleId, childId)) },
    onGetSemesterDetails: (moduleId, childId) => { dispatch(getStudentMarksDetails(moduleId, childId)) }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(GroupDetails);
