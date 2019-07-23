import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the modulesHighlights state domain
 */

const selectModulesHighlightsDomain = state =>
  state.modulesHighlights || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ModulesHighlights
 */

const makeSelectModulesHighlights = () =>
  createSelector(
    selectModulesHighlightsDomain,
    substate => substate,
  );
const makeSelectLoading = () =>
  createSelector(
    selectModulesHighlightsDomain,
    substate => substate.loading,
  );

export const makeSelectModuleId = () =>
    createSelector(
      selectModulesHighlightsDomain,
      substate => substate.moduleId
    );
export default makeSelectModulesHighlights;
export { selectModulesHighlightsDomain, makeSelectLoading };
