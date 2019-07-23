/*
 *
 * ParentChildren actions
 *
 */

import {
  DEFAULT_ACTION,
  LOAD_PARENT_CHILDREN,
  LOAD_PARENT_CHILDREN_ERROR,
  LOAD_PARENT_CHILDREN_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function loadParentChildren() {
  return {
    type: LOAD_PARENT_CHILDREN,
  };
}
export function loadParentChildrenSuccess(children) {
  return {
    type: LOAD_PARENT_CHILDREN_SUCCESS,
    children,
  };
}
export function loadParentChildrenError(error) {
  return {
    type: LOAD_PARENT_CHILDREN_ERROR,
    error,
  };
}
