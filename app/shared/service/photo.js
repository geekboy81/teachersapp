import { API } from 'aws-amplify';

const getPhotos = data => {
  const init = {
    body: data,
    headers: {},
  };
  return API.post('get_photos', '', init).then(res => res);
};

const photoService = { getPhotos };

export default photoService;
