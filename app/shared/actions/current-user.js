export const GET_USER_INFO_REQ = 'GET_USER_INFO_REQ';
export const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS';
export const GET_USER_INFO_FAILURE = 'GET_USER_INFO_FAILURE';

export const getUserInfoReq = () => ({
  type: GET_USER_INFO_REQ,
});
export const userInfoSuccess = data => ({
  type: GET_USER_INFO_SUCCESS,
  data,
});

export const userInfoFailure = error => ({
  type: GET_USER_INFO_FAILURE,
  error,
});

export const FETCH_AUTH_DATA_REQ = 'FETCH_AUTH_DATA_REQ';
export const FETCH_AUTH_DATA_SUCCESS = 'FETCH_AUTH_DATA_SUCCESS';
export const FETCH_AUTH_DATA_FAILURE = 'FETCH_AUTH_DATA_FAILURE';
export const LOGOUT = 'LOGOUT';

export const authenticate = credentials => ({
  type: FETCH_AUTH_DATA_REQ,
  credentials,
});
export const fetchAuthUserSuccess = data => ({
  type: FETCH_AUTH_DATA_SUCCESS,
  data,
});
export const fetchAuthUserFailure = error => ({
  type: FETCH_AUTH_DATA_FAILURE,
  error,
});
export const logout = () => ({
  type: LOGOUT,
});
export const ADD_GROUP = 'ADD_GROUP';
export const DELETE_GROUP = 'DELETE_GROUP';
export const UPDATE_GROUP = 'UPDATE_GROUP';

export const addGroup = data => ({
  type: ADD_GROUP,
  data,
});

export const updateGroup = data => ({
  type: UPDATE_GROUP,
  data,
});

export const deleteGroup = data => ({
  type: DELETE_GROUP,
  data,
});
