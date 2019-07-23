import * as axios from 'axios/index';
import { BACKEND_URL } from '../../config';

export const fetchAllScalesAPI = () =>
  axios.post(
    `${BACKEND_URL}/report/get/scales`,
    {},
    {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    },
  );
