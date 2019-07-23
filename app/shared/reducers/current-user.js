import {
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_FAILURE,
  FETCH_AUTH_DATA_FAILURE,
  FETCH_AUTH_DATA_SUCCESS, FETCH_AUTH_DATA_REQ, LOGOUT,
} from '../actions/current-user';
export const INITIAL_STATE = {
  auth: {
    idToken: {
      payload: {
        'custom:role': 'anonymous',
      },
    },
  },
  userInfo: {},
  credentials: {
    username: '',
    password: '',
  },
  role: 'anonymous',
};

const currentUser = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_AUTH_DATA_REQ:
      return {
        ...state,
        credentials: action.credentials,
      };
    case GET_USER_INFO_SUCCESS:
      return {
        ...state,
        userInfo: action.data,
      };
    case FETCH_AUTH_DATA_SUCCESS:
      return {
        ...state,
        auth: action.data,
      };
    case FETCH_AUTH_DATA_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case LOGOUT:
      return INITIAL_STATE;
    case GET_USER_INFO_FAILURE:
      return state;
    default:
      return state;
  }
};

export default currentUser;
