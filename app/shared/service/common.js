import { API } from 'aws-amplify';

const searchUser = data => {
  const init = {
    body: {
      searchstring: data,
    },
  };
  return API.post('search_user', '', init).then(users =>
    users.map(user => user.Username),
  );
};

const commonService = { searchUser };

export default commonService;
