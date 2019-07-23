import { API } from 'aws-amplify';

const getGroups = () => {
  const init = {};
  return API.post('get_groups_report', '', init);
};

const reportGroupService = { getGroups };

export default reportGroupService;
