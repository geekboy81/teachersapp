/*
 *
 * GroupDetails reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  LOAD_SCALES,
  LOAD_SCALES_SUCCESS,
  LOAD_SCALES_ERROR,
  LOAD_MODULE,
  LOAD_MODULE_SUCCESS,
  LOAD_MODULE_ERROR,
  LOAD_CHILD_MARKS,
  LOAD_CHILD_MARKS_SUCCESS,
  LOAD_CHILD_MARKS_ERROR,
  LOAD_MODULE_SKILLS_MARKS,
  CLONE_MODULE,
  CLONE_MODULE_SUCCESS,
  CLONE_MODULE_ERROR,
  LOAD_STUDENT_MARKS_DETAILS,
  LOAD_STUDENT_MARKS_DETAILS_SUCCESS,
  LOAD_STUDENT_MARKS_DETAILS_ERROR,
  GET_STUDENT_MARKS_DETAILS,
  GET_STUDENT_MARKS_DETAILS_SUCCESS,
  GET_STUDENT_MARKS_DETAILS_ERROR,
} from './constants';

export const initialState = {
  scales: [],
  error: false,
  loading: false,
  module: {},
  moduleId: 0,
  childId: 0,
  marks: [],
  toClone: {},
  studentMarksDetails: {
    module: {
      course_breakdown: {},
    },
    scales: [],
  },
  studentToGetMarksDetails: {
    sdModuleId: 0,
    sdChildId: 0,
  },
  studentSemesterDetails: {
    year: 0,
    slice: 0,
    module_detail: {
      years: 0,
      slices: 0,
    },
  },
  sModuleId: 0,
  sStudentId: 0,
};
/* eslint-disable default-case, no-param-reassign */
const groupDetailsReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case LOAD_SCALES:
        draft.loading = true;
        draft.error = false;
        break;
      case LOAD_SCALES_SUCCESS:
        draft.scales = action.scales;
        draft.loading = false;
        draft.error = false;
        break;
      case LOAD_SCALES_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
      case LOAD_MODULE:
        draft.loading = true;
        draft.error = false;
        draft.moduleId = action.moduleId;
        break;
      case LOAD_MODULE_SUCCESS:
        draft.module = action.module;
        draft.loading = false;
        draft.error = false;
        break;
      case LOAD_MODULE_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
      case LOAD_CHILD_MARKS:
        draft.loading = true;
        draft.error = false;
        draft.marks = initialState.marks;
        draft.moduleId = action.moduleId;
        draft.childId = action.childId;
        break;
      case LOAD_CHILD_MARKS_SUCCESS:
        draft.marks = action.marks;
        draft.loading = false;
        draft.error = false;
        break;
      case LOAD_CHILD_MARKS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
      case LOAD_MODULE_SKILLS_MARKS:
        draft.categories = action.categories;
        break;
      case CLONE_MODULE:
        draft.loading = true;
        draft.toClone = action.toClone;
        break;
      case CLONE_MODULE_SUCCESS:
        draft.loading = false;
        break;
      case CLONE_MODULE_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
      case LOAD_STUDENT_MARKS_DETAILS:
        draft.loading = true;
        draft.studentMarksDetails = initialState.studentMarksDetails;
        draft.studentToGetMarksDetails = Object.assign(
          {},
          action.studentToGetMarksDetails,
        );
        break;
      case LOAD_STUDENT_MARKS_DETAILS_SUCCESS:
        draft.loading = false;
        draft.studentMarksDetails = Object.assign(
          {},
          {
            module: action.studentMarksDetails.module,
            scales: action.studentMarksDetails.scales,
          },
        );
        break;
      case LOAD_STUDENT_MARKS_DETAILS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
      case GET_STUDENT_MARKS_DETAILS:
        draft.sModuleId = action.moduleId;
        draft.sStudentId = action.studentId;
        draft.studentSemesterDetails = initialState.studentSemesterDetails;
        draft.loading = true;
        break;
      case GET_STUDENT_MARKS_DETAILS_SUCCESS:
        draft.studentSemesterDetails = action.studentSemesterDetails;
        draft.loading = false;
        break;
      case GET_STUDENT_MARKS_DETAILS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default groupDetailsReducer;
