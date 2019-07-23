import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the modules state domain
 */

const selectModulesDomain = state => state.modules || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Modules
 */

const makeSelectModules = () =>
  createSelector(
    selectModulesDomain,
    substate => substate,
  );

export default makeSelectModules;
export { selectModulesDomain };
