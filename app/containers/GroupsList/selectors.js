import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the groupsList state domain
 */

const selectGroupsListDomain = state => state.groupsList || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by GroupsList
 */

const makeSelectGroupsList = (props) =>
  createSelector(
    selectGroupsListDomain,
    substate => substate,
  );

export default makeSelectGroupsList;
export { selectGroupsListDomain };
