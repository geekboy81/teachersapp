/**
 *
 * Asynchronously loads the component for SkillMarks
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
