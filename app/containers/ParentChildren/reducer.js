/*
 *
 * ParentChildren reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  LOAD_PARENT_CHILDREN,
  LOAD_PARENT_CHILDREN_ERROR,
  LOAD_PARENT_CHILDREN_SUCCESS,
} from './constants';

export const initialState = {
  loading: false,
  error: false,
  children: [],
};

/* eslint-disable default-case, no-param-reassign */
const parentChildrenReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case LOAD_PARENT_CHILDREN:
        draft.loading = true;
        draft.error = false;
        break;
      case LOAD_PARENT_CHILDREN_SUCCESS:
        draft.loading = false;
        draft.error = false;
        draft.children = action.children;
        break;
      case LOAD_PARENT_CHILDREN_ERROR:
        draft.loading = false;
        draft.error = action.error;
        draft.children = [];
        break;
    }
  });

export default parentChildrenReducer;
