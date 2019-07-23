import { API } from 'aws-amplify';

const getModuleHighlights = () => {
  const init = {};
  return API.post('get_module_highlights', '', init);
};
const deleteModule = moduleId => {
  const init = {
    body: {
      module_id: moduleId,
    },
  };
  return API.post('delete_module', '', init);
};
const addModule = module => {
  const init = {
    body: module,
  };
  return API.post('add_module', '', init);
};
const getModuleById = moduleId => {
  const init = {
    body: {
      module_id: moduleId,
    },
  };
  return API.post('get_module_details', '', init);
};

const moduleService = {
  getModuleHighlights,
  deleteModule,
  getModuleById,
  addModule,
};

export default moduleService;
