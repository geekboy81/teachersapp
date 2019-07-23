import { API } from 'aws-amplify';

const getGroupList = () => API.get('get_groups', '', {}).then(res => res);

const addGroup = body => {
  const init = {
    body,
  };
  return API.post('add_group', '', init).then(res => res);
};

const updateGroup = body => {
  const init = {
    body,
  };
  return API.post('update_group', '', init).then(res => res);
};

const deleteGroup = body => {
  const init = {
    body,
  };
  return API.post('delete_group', '', init).then(res => res);
};

const addGroupsStudentsAdd = body => {
  const init = {
    body,
  };
  return API.post('add_groups_students_add', '', init).then(res => res);
};

const childGroupDelete = body => {
  const init = {
    body,
  };
  return API.post('child_group_delete', '', init).then(res => res);
};

const groupService = {
  getGroupList,
  addGroup,
  updateGroup,
  deleteGroup,
  addGroupsStudentsAdd,
  childGroupDelete,
};

export default groupService;
