/*
 *
 * AddModule actions
 *
 */

import {
  ADD_MODULE,
  DEFAULT_ACTION,
  LOAD_GROUPS,
  LOAD_GROUPS_ERROR,
  LOAD_GROUPS_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function loadGroups() {
  return {
    type: LOAD_GROUPS,
  };
}

export function groupsLoaded(resp) {
  return {
    type: LOAD_GROUPS_SUCCESS,
    groups: resp,
  };
}
export function addModuleAction(module) {
  return {
    type: ADD_MODULE,
    module,
  };
}
export function groupsLoadingError(error) {
  return {
    type: LOAD_GROUPS_ERROR,
    error,
  };
}
