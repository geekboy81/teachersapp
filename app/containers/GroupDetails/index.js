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
import {
  Box, Grid, makeStyles,
  Typography,
} from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import * as PropTypes from 'prop-types';

import deepPurple from '@material-ui/core/colors/deepPurple';
import greyPurple from '@material-ui/core/colors/grey';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';

import Snackbar from '@material-ui/core/Snackbar';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import SkillMarks from '../../components/SkillMarks';
import marksService from '../../shared/service/marks';
import CategoryCommentAndPhotos from '../../components/CategoryCommentAndPhotos';
import PrintableDocument from '../../components/PrintableDocument';
import reducer from './reducer';
import saga from './saga';
import {
  loadModule,
  loadScales,
  loadChildMarks,
  loadStudentMarksDetails,
  getStudentMarksDetails,
} from './actions';

import makeSelectGroupDetails, { makeModuleSkillsMarks } from './selectors';

import SemesterSelection from '../../components/SemesterSelection';

import {
  SEMESTER_STATUS,
  SEMESTER_STATUS_COLORS,
  getSemesterStatus,
  getStatusCode,
} from 'shared/semester';

const ACTION_TYPES = {
  revert: 'revert',
  complete: 'complete',
  publish: 'publish',
};

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
  optionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 1rem 0 2rem',
    borderTop: '1px solid lightgrey',
  },
  optionGroup: {
    display: 'flex',
  },
  optionButton: {
    marginRight: '0.5rem',
  },
  compelteHeader: {
    color: 'white',
    backgroundColor: SEMESTER_STATUS_COLORS[SEMESTER_STATUS.complete],
  },
  inProgressHeader: {
    color: 'white',
    backgroundColor: SEMESTER_STATUS_COLORS[SEMESTER_STATUS.progress],
  },
  publishedHeader: {
    color: 'white',
    backgroundColor: SEMESTER_STATUS_COLORS[SEMESTER_STATUS.published],
  },
  commentsBox: {
    display: 'flex',
    alignItems: 'flex-end',
  },
}));


export function GroupDetails({
  match,
  groupDetails,
  history,
  role,
  onLoadStudentMarksDetails,
  onGetSemesterDetails,
  onLoadChildMarks,
}) {
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

  const [sliceSelDlg, setSliceSelDlg] = React.useState(false);
  const [selectedSlices, setSelectedSlices] = React.useState([]);

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
  const [semesterComments, setSemesterComments] = React.useState({});
  const [semesterGoals, setSemesterGoals] = React.useState({});

  const [preview, setPreview] = React.useState({
    open: false,
    data: {},
  });

  // NOTE: New states to mark for multiple semesters 2019.7.21
  const [allMarks, setAllMarks] = React.useState({});
  const [actionType, setActionType] = React.useState({
    action: 'done',
    status: 1,
    message: '',
    shouldGoback: false,
  });

  const { moduleId, childId, studentName } = match.params;

  useEffect(() => {
    onLoadStudentMarksDetails(moduleId, childId);
    onGetSemesterDetails(moduleId, childId);
    onLoadChildMarks(moduleId, childId);
  }, [moduleId, childId]);

  const handleOnStudentGradesChanged = grades => setStudentGrades(grades);

  const getMark = (year, slice, category, skill) => {
    const { marks } = groupDetails;

    const markDetail = marks.find(info => (
      info.year === year &&
      info.slice === slice
    ));

    return (
      markDetail &&
      markDetail['marks'] &&
      markDetail['marks'][category] &&
      markDetail['marks'][category]['breakdown'] &&
      markDetail['marks'][category]['breakdown'][skill]
    );
  }

  const generateInitialMarks = () => {
    const { marks } = groupDetails;

    const generatedAllMarks = marks.reduce((result, markInfo) => (Object.assign(result, {
      [markInfo.year * 100 + markInfo.slice]: {
        year: markInfo.year,
        slice: markInfo.slice,
        marks: markInfo.marks,
      }
    })), {})


    return generatedAllMarks;
  }

  useEffect(() => {
    let semesters = [];
    const categories = [];
    const studentScales = [];

    const {
      studentMarksDetails,
      studentSemesterDetails,
    } = groupDetails;

    const allYears = studentMarksDetails.module.years;
    const allSlices = studentMarksDetails.module.slices;

    const currentYear = studentSemesterDetails.year;
    const currentSlice = studentSemesterDetails.slice;

    const isBreakDownHasSkills = Object.values(
      studentMarksDetails.module.course_breakdown,
    ).some(v => Object.values(v.breakdown).length > 0);

    const allMarks = generateInitialMarks();
    setAllMarks(allMarks);

    if (
      isBreakDownHasSkills &&
      studentMarksDetails.module.course_breakdown
    ) {
      semesters = Array.from({ length: allYears }).map(
        (year, yearIndex) =>
          Array.from({ length: allSlices }).map(
            (_, index) => {
              const isCurrent =
                yearIndex === parseInt(currentYear, 10) - 1 &&
                index === parseInt(currentSlice, 10) - 1;

              const currentSemesterStatus = getSemesterStatus(
                groupDetails.studentMarksDetails.module,
                childId,
                yearIndex+1,
                index+1,
              );

              let className = classes.notCurrentSemesterHeader;
              if (isCurrent) {
                className = classes.currentSemesterHeader;
              } else if (currentSemesterStatus == SEMESTER_STATUS.complete) {
                className = classes.compelteHeader;
              } else if (currentSemesterStatus == SEMESTER_STATUS.progress) {
                className = classes.inProgressHeader;
              } else if (currentSemesterStatus == SEMESTER_STATUS.published) {
                className = classes.publishedHeader;
              } else if (
                currentSemesterStatus == SEMESTER_STATUS.progress
              ) {
                className = classes.notCurrentSemesterHeader;
              }

              return {
                isCurrent,
                className,
                marksClassName: isCurrent
                  ? classes.currentSemesterContainer
                  : classes.notCurrentSemesterContainer,
              };
            },
          ),
      );

      // eslint-disable-next-line camelcase
      const { course_breakdown } = studentMarksDetails.module;

      // eslint-disable-next-line camelcase
      if (course_breakdown) {
        Object.entries(course_breakdown).map(([categoryName, value]) => {
          let scale = { grades: [] };
          scale = search(
            'id',
            value.scale_id,
            studentMarksDetails.scales,
          );

          if (!search('id', scale.id, studentScales)) {
            studentScales.push(scale);
          }

          const category = {
            name: categoryName,
            skills: [],
            scale,
            scale_id: value.scale_id,
          };

          category.skills = Object.keys(value.breakdown);
          category.grid = category.skills.map((skill) => {
            const g1 = Object.keys(scale.grades).map(mark => ({
              mark,
              is_selected: false,
            }));

            return {
              skill,
              years: semesters.map((semestersOfYears, yearIndex) => ({
                yearIndex,
                semesters: semestersOfYears.map((s, sliceIndex) => ({
                  ...s,
                  category: categoryName,
                  skill,
                  mark: getMark(yearIndex + 1, sliceIndex + 1, categoryName, skill),
                  year: yearIndex + 1,
                  slice: sliceIndex + 1,
                })),
                ref: React.createRef(),
              })),
            };
          });
          categories.push(category);
        });
      }
      // --------------------------
      // --------------------------

      setValues({
        ...values,
        semesters,
        categories,
        studentScales,
      });

      setNoMarksMode(false);
    } else {
      // eslint-disable-next-line camelcase
      const { course_breakdown } = studentMarksDetails.module;
      let categoriesListTemp = [];
      // eslint-disable-next-line camelcase
      if (course_breakdown) {
        categoriesListTemp = Object.keys(course_breakdown).map(key => ({
          name: key,
        }));
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
    setFinalMarks({ ...finalMarks });
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

  const emptyOperationWithComments = (category, comment) => {
    const {
      studentSemesterDetails,
    } = groupDetails;

    const year = studentSemesterDetails.year;
    const slice = studentSemesterDetails.slice;

    const adjustedMarks = (allMarks[year * 100 + slice] || { marks: {}}).marks;

    // NOTE: Refelct user's selection on marks
    if (!adjustedMarks[category.name]) {
      adjustedMarks[category.name] = {};
    }

    if (!adjustedMarks[category.name]['comment']) {
      adjustedMarks[category.name]['comment'] = ['[]', '[]']
    }

    // New for multiple semesters 2019.7.21
    const marks = {
      [year * 100 + slice]: {
        year,
        slice,
        marks: adjustedMarks,
      },
    };

    setAllMarks({ ...allMarks, ...marks });
  }

  const handleCommentChange = (category, comment) => {
    emptyOperationWithComments(category, comment);

    setSemesterComments({
      ...semesterComments,
      ...{
        [category.name]: comment,
      },
    });
  };

  const handleGoalsChange = (category, comment) => {
    emptyOperationWithComments(category, comment)

    setSemesterGoals({
      ...semesterGoals,
      ...{
        [category.name]: comment,
      },
    });
  }

  const addCommentsToMarks = (marks, year, slice) => {
    const {
      studentSemesterDetails,
    } = groupDetails;

    const currentYear = studentSemesterDetails.year;
    const currentSlice = studentSemesterDetails.slice;

    if (
      year != currentYear ||
      slice != currentSlice
    ) {
      return marks;
    }

    const tempMarks = Object.assign({}, marks);

    // Add comments
    const commentAdjustedMarks = Object.keys(semesterComments).reduce((result, categoryName) => {
      const comment = semesterComments[categoryName];

      if (!result[categoryName]) {
        result[categoryName] = {}
      }

      if (!result[categoryName]['comment']) {
        result[categoryName]['comment'] = ['[]', '[]']
      }

      const comments = JSON.parse(result[categoryName]['comment'][0]);
      result[categoryName]['comment'][0] = JSON.stringify(comments.concat(comment));

      return result;
    }, tempMarks);


    // Add goal
    const goalAdjustedMarks = Object.keys(semesterGoals).reduce((result, categoryName) => {
      const goal = semesterGoals[categoryName];

      if (!result[categoryName]) {
        result[categoryName] = {}
      }

      if (!result[categoryName]['comment']) {
        result[categoryName]['comment'] = ['[]', '[]']
      }

      const goals = JSON.parse(result[categoryName]['comment'][1]);

      result[categoryName]['comment'][1] = JSON.stringify(goals.concat(goal));

      return result;
    }, commentAdjustedMarks);


    return goalAdjustedMarks;
  }

  // commentIndex - 0: comment, 1: goal
  const getCommentsFromCategory = (category, commentIndex) => {
    const { marks } = groupDetails;

    const allComments = marks
      .reduce((result, record) => (
        record['marks'][category.name]
          ? result.concat([record['marks'][category.name]['comment'] || ['[]', '[]']])
          : result
      ), [])
      .reduce((result, record) => (
        result.concat(JSON.parse(record[commentIndex]))
      ), []);

    return allComments;
  }

  const handleMultipleSemesterSelection = (selectedSemesters) => {
    setSliceSelDlg(false);

    if (selectedSemesters) {
      updateMarks(selectedSemesters);
    }
  }

  const handleChangeMark = (
    grades,
    categoryIndex,
    gIndex,
    mark,
    year,
    slice,
    selected,
  ) => {
    const category = values.categories[categoryIndex];

    const adjustedMarks = (allMarks[year * 100 + slice] || { marks: {}}).marks;

    // NOTE: Refelct user's selection on marks
    if (!adjustedMarks[category.name]) {
      adjustedMarks[category.name] = {};
    }

    adjustedMarks[category.name].scale_id = category.scale_id;

    if (!adjustedMarks[category.name].breakdown) {
      adjustedMarks[category.name].breakdown = {};
    }

    if (selected) {
      adjustedMarks[category.name].breakdown[category.grid[gIndex].skill] = mark.mark;
    } else {
      delete adjustedMarks[category.name].breakdown[category.grid[gIndex].skill];
    }

    // New for multiple semesters 2019.7.21
    const marks = {
      [year * 100 + slice]: {
        year,
        slice,
        marks: adjustedMarks,
      },
    };

    setAllMarks({ ...allMarks, ...marks });
    setFinalMarks({ ...finalMarks });
    setStudentGrades(grades);
  };

  const handleBack = () => {
    history.goBack();
  };

  const handlePreview = () => {
    setPreview({ open: true, data: {} });
  };

  const updateMarks = async (selectedSemesters=[]) => {
    const { status, message, shouldGoback } = actionType;

    const promises = Object.values(allMarks).map(async (markInfo) => {
      const statusCode = selectedSemesters.some(item => (
        item.year = markInfo.year &&
        item.slice == markInfo.slice
      ))
        ? status
        : getStatusCode(getSemesterStatus(
            groupDetails.studentMarksDetails.module,
            childId,
            markInfo.year,
            markInfo.slice,
          ));


      const req = {
        marks: markInfo.marks,
        clazz_id: parseInt(moduleId, 10),
        child_id: parseInt(childId, 10),
        status: statusCode,
        slice: markInfo.slice,
        year: markInfo.year,
      };

      try {
        const updateMarkResp = await marksService.addUpdateMarks(req);
        return updateMarkResp;
      } catch (e) {
        setErrorFeedback({
          ...errorFeedback,
          open: true,
          message: e.message,
        });
      }

      return null;
    });

    const result = await Promise.all(promises);

    if (result.every(item => item && item.status === 'success')) {
      setErrorFeedback({
        ...errorFeedback,
        open: true,
        message,
      });

      if (shouldGoback) {
        setTimeout(() => {
          history.goBack();
        }, 1500);
      }
    } else {
      // throw new Error('Error occured in fetching data');
    }
  }

  const handleDone = async () => {
    const promises = Object.values(allMarks).map(async (markInfo) => {
      const statusCode = getStatusCode(getSemesterStatus(
        groupDetails.studentMarksDetails.module,
        childId,
        markInfo.year,
        markInfo.slice,
      ));

      const req = {
        marks: addCommentsToMarks(markInfo.marks, markInfo.year, markInfo.slice),
        clazz_id: parseInt(moduleId, 10),
        child_id: parseInt(childId, 10),
        status: statusCode,
        slice: markInfo.slice,
        year: markInfo.year,
      };

      try {
        const updateMarkResp = await marksService.addUpdateMarks(req);
        return updateMarkResp;
      } catch (e) {
        setErrorFeedback({
          ...errorFeedback,
          open: true,
          message: e.message,
        });
      }

      return null;
    });

    const result = await Promise.all(promises);

    if (result.every(item => item && item.status === 'success')) {
      setErrorFeedback({
        ...errorFeedback,
        open: true,
        message: 'Student marks has been saved successfully !',
      });

      setTimeout(() => {
        history.goBack();
      }, 1500);
    } else {
      // throw new Error('Error occured in fetching data');
    }
  };

  const handleRevert = () => {
    setSliceSelDlg(true);
    setActionType({
      action: ACTION_TYPES.revert,
      status: 1,
      message: 'Student marks has been saved successfully !',
      shouldGoback: true,
    });
  }

  const handleComplete = () => {
    setSliceSelDlg(true);
    setActionType({
      action: ACTION_TYPES.revert,
      status: 2,
      message: 'Student marks has been saved successfully !',
      shouldGoback: true,
    });
  }

  const renderLoading = () => (
    <Grid container justify="center" alignItems="center">
      <Grid item={12} style={{ marginTop: '150px' }}>
        <CircularProgress size={48} className={classes.buttonProgress} />
      </Grid>
    </Grid>
  );

  const renderPrintDlg = () => (
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
        <Button
          onClick={() => setPreview({ ...preview, open: false })}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => setPreview({ ...preview, open: false })}
          color="primary"
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderSnackBar = () => (
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
  );

  const renderOperationBtns = () => (
    <div className={classes.optionButtons}>
      <div className={classes.optionGroup}>
        <div className={classes.optionButton}>
          <Button onClick={handleBack}>Back</Button>
        </div>
        <div className={classes.optionButton}>
          <Button color="primary" onClick={handlePreview} variant="contained">
            Preview
          </Button>
        </div>
        <div className={classes.optionButton}>
          {role === 'admin' && (
            <Button color="secondary" variant="contained" onClick={handleRevert}>
              Revert
            </Button>
          )}
        </div>
      </div>
      <div className={classes.optionGroup}>
        <div className={classes.optionButton}>
          <Button color="primary" onClick={handleDone} variant="contained">
            Save
          </Button>
        </div>
        <div className={classes.optionButton}>
          <Button color="primary" variant="contained" onClick={handleComplete}>
            Complete
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () =>
    groupDetails &&
    !groupDetails.loading && (
      <div>
        <Typography variant="h5" className={classes.title}>
          {groupDetails.studentMarksDetails.module &&
            groupDetails.studentMarksDetails.module.modul}
        </Typography>

        <Typography variant="h5" className={classes.title}>
          {studentName}
        </Typography>

        {noMarksMode ? (
          <div>
            {categoriesList.map(category => (
              <Grid container>
                <Grid item md={6} className={classes.commentsBox}>
                  <CategoryCommentAndPhotos
                    category={category}
                    categoryComments={getCommentsFromCategory(category, 0)}
                    config={{ hideCategoryName: false }}
                    module={groupDetails.studentMarksDetails.module}
                    onCommentChange={c => handleCommentChange(category, c)}
                    key={category.name}
                    label="Comment"
                  />
                </Grid>
                <Grid item md={6} className={classes.commentsBox}>
                  <CategoryCommentAndPhotos
                    category={category}
                    categoryComments={getCommentsFromCategory(category, 1)}
                    config={{ hideCategoryName: true }}
                    module={groupDetails.studentMarksDetails.module}
                    onCommentChange={c => handleGoalsChange(category, c)}
                    key={category.name}
                    label="Goal"
                  />
                </Grid>
              </Grid>
            ))}
          </div>
        ) : (
          <div>
            {values.categories &&
              values.categories.map((catx, categoryIndex) => (
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
                    borderRadius={5}
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
                          childId={childId}
                          currentMarks={groupDetails.marks[0]}
                          semesters={values.semesters}
                          semesterDetails={groupDetails.studentSemesterDetails}
                          category={catx}
                          module={groupDetails.studentMarksDetails.module}
                          categoryIndex={categoryIndex}
                          onHandleChangeMark={(
                            grades,
                            gIndex,
                            mark,
                            year,
                            slice,
                            selected,
                          ) =>
                            handleChangeMark(
                              grades,
                              categoryIndex,
                              gIndex,
                              mark,
                              year,
                              slice,
                              selected,
                            )
                          }
                          handleCommentChange={(category, comment) =>
                            handleCommentChange(category, comment)
                          }
                          handleGoalsChange={(category, comment) =>
                            handleGoalsChange(category, comment)
                          }
                          handlePhotosChange={(category, photo) =>
                            handlePhotosListChange(category, photo)
                          }
                          generateMarksGrid={catx.grid}
                          handleOnStudentGradesChanged={
                            handleOnStudentGradesChanged
                          }
                          studentGrades={studentGrades}
                          role={role}
                          categoryComments={getCommentsFromCategory(catx, 0)}
                          categoryGoals={getCommentsFromCategory(catx, 1)}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </div>
              ))}
          </div>
        )}

        {values.studentScales.length > 0 && (
          <Grid
            item
            className={classes.item}
            md={12}
            style={{ marginTop: '25px' }}
          >
            <Grid container>
              <Grid item md={12} style={{ marginBottom: '20px' }}>
                <Typography variant="h5">Scales</Typography>
              </Grid>
              <Grid item md={12}>
                {values.studentScales.map(scale => (
                  <div>
                    <Grid item md={12}>
                      <Typography variant="h5">{scale.name}</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      {Object.entries(scale.grades).map(([key, value]) => (
                        <List>
                          <ListItemText key={key + value}>
                            {`${key}- ${value}`}
                          </ListItemText>
                        </List>
                      ))}
                    </Grid>
                  </div>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}

        {renderOperationBtns()}
      </div>
    );

  return (
    <div>
      {groupDetails.loading ? renderLoading() : renderMainContent()}
      {renderPrintDlg()}
      {renderSnackBar()}
      {sliceSelDlg &&
        <SemesterSelection
          setSelectedSlices={setSelectedSlices}
          handleClose={handleMultipleSemesterSelection}
          years={groupDetails.studentMarksDetails.module.years}
          slices={groupDetails.studentMarksDetails.module.slices}
        />
      }
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
    getModule: moduleId => {
      dispatch(loadModule(moduleId));
    },
    onLoadScales: () => {
      dispatch(loadScales());
    },
    onLoadChildMarks: (moduleId, childId) => {
      dispatch(loadChildMarks(moduleId, childId));
    },
    onLoadStudentMarksDetails: (moduleId, childId) => {
      dispatch(loadStudentMarksDetails(moduleId, childId));
    },
    onGetSemesterDetails: (moduleId, childId) => {
      dispatch(getStudentMarksDetails(moduleId, childId));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(GroupDetails);
