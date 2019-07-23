import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the parentChildren state domain
 */

const selectParentChildrenDomain = state =>
  state.parentChildren || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ParentChildren
 */

const makeSelectParentChildren = () =>
  createSelector(
    selectParentChildrenDomain,
    substate => substate,
  );

export default makeSelectParentChildren;
export { selectParentChildrenDomain };
