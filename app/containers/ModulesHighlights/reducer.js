/*
 *
 * ModulesHighlights reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  LOAD_MODULES_HIGHLIGHTS,
  LOAD_MODULES_HIGHLIGHTS_ERROR,
  LOAD_MODULES_HIGHLIGHTS_SUCCESS,
  DELETE_MODULE,
  DELETE_MODULE_SUCCESS,
  DELETE_MODULE_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  deleting: false,
  error: false,
  highlights: [],
  moduleId: 0,
};

/* eslint-disable default-case, no-param-reassign */
const modulesHighlightsReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case LOAD_MODULES_HIGHLIGHTS:
        draft.loading = true;
        draft.error = false;
        draft.highlights = [];
        break;
      case LOAD_MODULES_HIGHLIGHTS_SUCCESS:
        draft.highlights = action.highlights !== '' ? action.highlights : [];
        draft.loading = false;
        break;
      case LOAD_MODULES_HIGHLIGHTS_ERROR:
        draft.highlights = [];
        draft.loading = false;
        draft.error = action.error;
        break;
      case DELETE_MODULE:
        draft.error = false;
        draft.deleting = true;
        draft.loading = true;
        draft.moduleId = action.moduleId;
        break;
      case DELETE_MODULE_SUCCESS:
        draft.error = false;
        draft.loading = false;
        draft.deleting = false;
        break;
      case DELETE_MODULE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.deleting = false;
        break;
    }
  });

export default modulesHighlightsReducer;
