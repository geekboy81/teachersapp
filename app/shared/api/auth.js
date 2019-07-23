import * as axios from 'axios/index';
import { BACKEND_URL } from '../../config';

export const authenticate = () =>
  axios.post(`${BACKEND_URL}/authenticate`, {
    username: 'admin@scolalabs.com',
    password: 'admin123',
  });
