import { API } from 'aws-amplify';

const getStudentList = data => {
  const init = {
    body: {
      group: data,
    },
  };
  return API.post('get_students', '', init).then(res => res);
};

const addStudent = body => {
  const init = {
    body,
  };
  return API.post('add_students', '', init).then(res => res);
};
const editStudent = body => {
  const init = {
    body,
  };
  return API.post('edit_students', '', init).then(res => res);
};

const getChildById = body => {
  const init = {
    body,
  };
  return API.post('get_child_by_id', '', init).then(res => res);
};

const studentService = {
  getStudentList,
  addStudent,
  editStudent,
  getChildById,
};

export default studentService;
