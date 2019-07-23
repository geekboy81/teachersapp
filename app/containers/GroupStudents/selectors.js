import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the groupStudents state domain
 */

const selectGroupStudentsDomain = state => state.groupStudents || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by GroupStudents
 */

const makeSelectGroupStudents = () =>
  createSelector(
    selectGroupStudentsDomain,
    substate => substate,
  );

export default makeSelectGroupStudents;
export { selectGroupStudentsDomain };
