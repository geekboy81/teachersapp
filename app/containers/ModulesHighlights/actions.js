/*
 *
 * ModulesHighlights actions
 *
 */

import {
  DEFAULT_ACTION,
  LOAD_MODULES_HIGHLIGHTS,
  LOAD_MODULES_HIGHLIGHTS_ERROR,
  LOAD_MODULES_HIGHLIGHTS_SUCCESS,
  DELETE_MODULE,
  DELETE_MODULE_SUCCESS,
  DELETE_MODULE_ERROR, GET_STUDENT_MARKS_DETAILS, GET_STUDENT_MARKS_DETAILS_SUCCESS, GET_STUDENT_MARKS_DETAILS_ERROR,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function loadModulesHighLights() {
  return {
    type: LOAD_MODULES_HIGHLIGHTS,
  };
}

export function modulesHighLightsLoaded(resp) {
  return {
    type: LOAD_MODULES_HIGHLIGHTS_SUCCESS,
    highlights: resp,
  };
}

export function modulesHighlightsLoadingError(error) {
  return {
    type: LOAD_MODULES_HIGHLIGHTS_ERROR,
    error,
  };
}
export function deleteModule(moduleId) {
  return {
    type: DELETE_MODULE,
    moduleId,
  };
}
export function deleteModuleSucceded() {
  return {
    type: DELETE_MODULE_SUCCESS,
  };
};
export function deleteModuleError(error) {
  return {
    type: DELETE_MODULE_ERROR,
    error,
  };
}
