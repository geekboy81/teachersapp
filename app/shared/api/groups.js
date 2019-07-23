import * as axios from 'axios/index';
import { BACKEND_URL } from '../../config';

export const fetchAllGroupsAPI = () =>
  axios.post(
    `${BACKEND_URL}/report/get/groups`,
    {},
    {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    },
  );
