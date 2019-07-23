import { API } from 'aws-amplify';

const getParentList = data => {
  const init = {
    body: {
      group: data,
    },
  };
  return API.post('get_users', '', init).then(res => res);
};

const lastLogin = () => API.get('get_lastlogin', '', '').then(res => res);

const addParent = body => {
  const init = {
    body,
  };
  return API.post('add_users', '', init).then(res => res);
};
const addParentDB = body => {
  const init = {
    body,
  };
  return API.post('add_users_db', '', init).then(res => res);
};

const editParent = body => {
  const init = {
    body,
  };
  return API.post('edit_users', '', init).then(res => res);
};
const deleteParent = body => {
  const init = {
    body,
  };
  return API.post('delete_users', '', init).then(res => res);
};

const deleteParentDB = body => {
  const init = {
    body,
  };
  return API.post('delete_users_db', '', init).then(res => res);
};

const getUserDetailByID = body => {
  const init = {
    body,
  };
  return API.post('get_user_detail', '', init).then(res => res);
};

const findUserChildAndSpouse = body => {
  const init = {
    body,
  };
  return API.post('get_user_child_spouse', '', init).then(res => res);
};

const sendInvitation = body => {
  const init = {
    body,
  };
  return API.post('send_invitation', '', init).then(res => res);
};

const sendInvitationMark = body => {
  const init = {
    body,
  };
  return API.post('send_invitation_mark', '', init).then(res => res);
};

const parentService = {
  getParentList,
  addParent,
  addParentDB,
  editParent,
  deleteParent,
  deleteParentDB,
  lastLogin,
  getUserDetailByID,
  findUserChildAndSpouse,
  sendInvitation,
  sendInvitationMark,
};

export default parentService;
