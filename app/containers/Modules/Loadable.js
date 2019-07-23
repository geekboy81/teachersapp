/**
 *
 * Asynchronously loads the component for Modules
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
