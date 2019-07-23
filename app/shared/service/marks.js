import { API } from 'aws-amplify';

const getChildMarks = args => {
  const init = {
    body: {
      child_id: parseInt(args[1]),
      clazz_id: parseInt(args[0]),
    },
  };
  return API.post('get_marks_for_child', '', init);
};
const getParentChildMarks = () => {
  const init = {
    body: {},
  };
  return API.post('get_marks_for_child', '', init);
};
const addUpdateMarks = data => {
  const init = {
    body: data,
  };
  return API.post('add_update_marks', '', init);
};
const getSemesterDetails = args => {
  const init = {
    body: {
      child_id: args[0],
      clazz_id: args[1],
    },
  };
  return API.post('get_studentsemesterdetails', '', init);
};
const marksService = { getChildMarks, addUpdateMarks, getParentChildMarks, getSemesterDetails };

export default marksService;
