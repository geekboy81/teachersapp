import * as axios from 'axios/index';
import { BACKEND_URL } from '../../config';


export const publishSemesters = (moduleId, childId) =>
  axios.post(
    `${BACKEND_URL}/report/update/status`,
    {
        clazz_id: moduleId,
        child_id: childId,
    },
    {
      headers: {
        Authorization: localStorage.getItem('hmUser'),
      },
    },
  );
