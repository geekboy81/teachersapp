import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the groupDetails state domain
 */

const selectGroupDetailsDomain = state => state.groupDetails || initialState;
const detailsSelector = state =>
  state.groupDetails || initialState.groupDetails;
const getModuleSkillsMarks = state => {
  const categories = [];
  try {
    if (state) {
      const { studentMarksDetails } = state.studentMarksDetails;
      // const { module, scales } = studentMarksDetails;
      const { scales } = studentMarksDetails;
      const { module } = studentMarksDetails;

      const { course_breakdown } = module;
      try {
        delete course_breakdown.num_partitions;
        delete course_breakdown.num_years;
        delete course_breakdown.group_ids;
        delete course_breakdown.start_date;
        delete course_breakdown.end_date;
        delete course_breakdown.dates;
      } catch (e) {}
      if (state.studentMarksDetails.module.course_breakdown) {
        Object.entries(course_breakdown).map(([key, value]) => {
          let scale = { grades: [] };
          if (
            scales.filter(
              s => parseInt(s.id) === parseInt(value.scale_id),
            )[0] !== undefined
          ) {
            scale = scales.filter(
              s => parseInt(s.id) === parseInt(value.scale_id),
            )[0];
          }
          const category = { name: key, skills: [], scale };
          category.skills = Object.keys(value.breakdown);
          categories.push(category);
        });
      }
      return categories;
    }
    return [];
  } catch (err) {
    return [];
  }
};
const getChildFullName = state => {
  let childName = { name: '', isSet: false };
  try {
    const { module } = state;
    const student = Object.values(module.groups).map(
      group =>
        Object.values(group.childids).filter(child => child.childid === 132)[0],
    )[1];
    if (student && !isSet) {
      childName = {
        name: `${student.firstname} ${student.lastname}`,
        isSet: true,
      };
    }
  } catch (err) {
    childName = 'err';
  }
  return childName;
};
/**
 * Other specific selectors
 */

/**
 * Default selector used by GroupDetails
 */

const makeSelectGroupDetails = () =>
  createSelector(
    selectGroupDetailsDomain,
    substate => substate,
  );
export const makeSelectModuleId = () =>
  createSelector(
    selectGroupDetailsDomain,
    substate => substate.moduleId,
  );
export const makeSelectChildId = () =>
  createSelector(
    selectGroupDetailsDomain,
    substate => substate.childId,
  );
export const makeSelectModuleMarks = () =>
  createSelector(selectGroupDetailsDomain);
export const makeModuleSkillsMarks = () =>
  createSelector(
    detailsSelector,
    getModuleSkillsMarks,
  );
export const makeChildFullName = () =>
  createSelector(
    detailsSelector,
    getChildFullName,
  );
export default makeSelectGroupDetails;
export { selectGroupDetailsDomain };
