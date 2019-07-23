import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the studentReport state domain
 */

const selectStudentReportDomain = state => state.studentReport || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by StudentReport
 */

const makeSelectStudentReport = () =>
  createSelector(
    selectStudentReportDomain,
    substate => substate,
  );

export default makeSelectStudentReport;
export { selectStudentReportDomain };
