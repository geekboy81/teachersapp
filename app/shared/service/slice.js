import { API } from 'aws-amplify';

const addSlice = slice => {
  const init = {
    body: slice,
  };
  return API.post('add_slice', '', init);
};

const sliceService = { addSlice };

export default sliceService;
