import { Auth, API } from 'aws-amplify';

const authenticateUserApi = credentials =>
  Auth.signIn(credentials.username, credentials.password);

const getUserDetail = () =>
  API.get('get_user_info', '', '')
    .then(response => response)
    .catch(error => error);

const resetPassword = user => {
  const init = {
    body: {
      user,
    },
  };
  return API.post('reset_password', '', init)
    .then(res => res)
    .catch(error => error);
};

const authService = { authenticateUserApi, getUserDetail, resetPassword };

export default authService;
