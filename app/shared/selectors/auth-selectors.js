import { createSelector } from 'reselect';
import { INITIAL_STATE as initialState } from '../reducers/current-user';

/**
 * Direct selector to the currentUser state domain
 */

const selectCurrentUserDomain = state => state.currentUser || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Modules
 */

const makeSelectCurrentUser = () =>
  createSelector(
    selectCurrentUserDomain,
    substate => substate,
  );
const makeSelectRole = () =>
  createSelector(
    selectCurrentUserDomain,
    substate => substate.userInfo.role,
  );

export default makeSelectCurrentUser;
export { selectCurrentUserDomain, makeSelectRole };
