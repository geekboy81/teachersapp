/*
 *
 * GroupDetails actions
 *
 */

import {
  DEFAULT_ACTION,
  LOAD_SCALES,
  LOAD_SCALES_ERROR,
  LOAD_SCALES_SUCCESS,
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
export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function loadScales() {
  return {
    type: LOAD_SCALES,
  };
}
export function loadScalesSuccess(scales) {
  return {
    type: LOAD_SCALES_SUCCESS,
    scales,
  };
}
export function loadScalesError(error) {
  return {
    type: LOAD_SCALES_ERROR,
    error,
  };
}
export function loadModule(moduleId) {
  return {
    type: LOAD_MODULE,
    moduleId,
  };
}
export function loadModuleSuccess(module) {
  return {
    type: LOAD_MODULE_SUCCESS,
    module,
  };
}
export function loadModuleError(error) {
  return {
    type: LOAD_MODULE_ERROR,
    error,
  };
}
export function loadChildMarks(moduleId, childId) {
  return {
    type: LOAD_CHILD_MARKS,
    moduleId,
    childId,
  };
}
export function loadChildMarksSuccess(marks) {
  return {
    type: LOAD_CHILD_MARKS_SUCCESS,
    marks,
  };
}
export function loadChildMarksError(error) {
  return {
    type: LOAD_CHILD_MARKS_ERROR,
    error,
  };
}
export function loadModuleSkillsMarks(categories) {
  return {
    type: LOAD_MODULE_SKILLS_MARKS,
    categories,
  };
}
export function cloneModule(toClone) {
  return {
    type: CLONE_MODULE,
    toClone,
  };
}
export function cloneModuleSuccess() {
  return {
    type: CLONE_MODULE_SUCCESS,
  };
}
export function cloneModuleError(error) {
  return {
    type: CLONE_MODULE_ERROR,
    error,
  };
}
export function loadStudentMarksDetails(sdModuleId, sdChildId) {
  return {
    type: LOAD_STUDENT_MARKS_DETAILS,
    studentToGetMarksDetails: {
      sdModuleId,
      sdChildId,
    },
  };
}
export function loadStudentMarksDetailsSuccess(studentMarksDetails) {
  return {
    type: LOAD_STUDENT_MARKS_DETAILS_SUCCESS,
    studentMarksDetails,
  };
}
export function loadStudentMarksDetailsError(error) {
  return {
    type: LOAD_STUDENT_MARKS_DETAILS_ERROR,
    error,
  };
}

export function getStudentMarksDetails(studentId, moduleId) {
  return {
    type: GET_STUDENT_MARKS_DETAILS,
    studentId,
    moduleId,
  };
}
export function getStudentMarksDetailsSuccess(studentSemesterDetails) {
  return {
    type: GET_STUDENT_MARKS_DETAILS_SUCCESS,
    studentSemesterDetails,
  };
};
export function getStudentMarksDetailsError(error) {
  return {
    type: GET_STUDENT_MARKS_DETAILS_ERROR,
    error,
  };
}
