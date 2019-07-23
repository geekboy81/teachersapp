import * as axios from 'axios/index';
import { BACKEND_URL } from '../../config';

export const getModulesHighlightsAPI = headers =>
  axios.post(
    `${BACKEND_URL}/report/get/module-highlights`,
    {},
    {
      headers,
    },
  );
export const deleteModuleAPI = moduleId =>
  axios.post(
    `${BACKEND_URL}/report/delete/module`,
    {
      module_id: moduleId,
    },
    {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    },
  );
export const addModuleAPI = module =>
  axios.post(`${BACKEND_URL}/report/add/module`, module, {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  });
