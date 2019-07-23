import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addModule state domain
 */

const selectAddModuleDomain = state => state.addModule || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddModule
 */

const makeSelectAddModule = () =>
  createSelector(
    selectAddModuleDomain,
    substate => substate,
  );
const makeSelectLoading = () =>
  createSelector(
    makeSelectAddModule,
    substate => substate.loading,
  );
export const makeSelectModuleId = () =>
    createSelector(
      selectAddModuleDomain,
      substate => substate.moduleId
    );
export default makeSelectAddModule;
export { selectAddModuleDomain, makeSelectLoading };
