import { API } from 'aws-amplify';

const getScales = () => {
  const init = {};
  return API.post('get_scales', '', init);
};
const deleteScale = scaleId => {
  const init = {
    body: {
      scale_id: scaleId,
    },
  };
  return API.post('delete_scale', '', init);
};
const addScale = scale => {
  const init = {
    body: scale,
  };
  return API.post('add_scale', '', init);
};
const scaleService = { getScales, deleteScale, addScale };

export default scaleService;
