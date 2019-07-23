/*
 *
 * AddModule reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  LOAD_GROUPS,
  LOAD_GROUPS_ERROR,
  LOAD_GROUPS_SUCCESS,
} from './constants';

export const initialState = {
  loading: false,
  error: false,
  groups: [],
};

/* eslint-disable default-case, no-param-reassign */
const addModuleReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case LOAD_GROUPS:
        draft.loading = true;
        draft.error = false;
        draft.groups = false;
        break;
      case LOAD_GROUPS_SUCCESS:
        draft.groups =
          action.groups && action.groups !== '' ? action.groups : [];
        draft.loading = false;
        break;
      case LOAD_GROUPS_ERROR:
        draft.groups = [];
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default addModuleReducer;
