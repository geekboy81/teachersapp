import axios from 'axios';


export function axiosConfiguration(AUTH_TOKEN) {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}/api`;
  axios.defaults.baseURL = baseUrl;
  // axios.defaults.headers.common.Authorization = AUTH_TOKEN;
}

