/*
 *
 * GroupsList reducer
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
  error: false,
  loading: false,
  groups: [],
  course_breakdown: {},
  modul: '',
  slice_id: '',
  num_partitions: '',
  num_years: '',
  dates: {},
  group_ids: {},
  start_date: '',
  end_date: '',
};
//
/* eslint-disable default-case, no-param-reassign */
const groupsListReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case LOAD_GROUPS:
        draft.error = false;
        draft.loading = true;
        draft.groups = initialState.groups;
        break;
      case LOAD_GROUPS_SUCCESS:
        draft.error = false;
        draft.loading = false;
        draft.groups = action.groups;
        break;
      case LOAD_GROUPS_ERROR:
        draft.error = false;
        draft.loading = false;
        break;
    }
  });

export default groupsListReducer;
