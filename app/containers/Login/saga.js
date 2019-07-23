import { takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import authService from '../../shared/service/auth';
import {
  FETCH_AUTH_DATA_REQ,
  fetchAuthUserFailure,
  fetchAuthUserSuccess,
  GET_USER_INFO_REQ,
  userInfoFailure,
  userInfoSuccess,
} from '../../shared/actions/current-user';

function* authenticate(action) {
  try {
    const authResponse = yield call(
      authService.authenticateUserApi,
      action.credentials,
    );
    if (authResponse.signInUserSession) {
      const { signInUserSession } = authResponse;
      yield put(fetchAuthUserSuccess(authResponse));
      localStorage.setItem('hmUser', JSON.stringify(signInUserSession));
      const userResponse = yield call(authService.getUserDetail);
      if (userResponse.Username) {
        yield put(
          userInfoSuccess(
            Object.assign(userResponse, { role: userResponse.role }),
          ),
        );
        yield put(push('/'));
      }
    }
    if (authResponse.status === 'error') {
      throw new Error(authResponse.message);
    }
  } catch (e) {
    yield put(fetchAuthUserFailure(e));
  }
}
function* getUserDetails() {
  try {
    const userResponse = yield call(authService.getUserDetail);
    if (userResponse.Username) {
      yield put(userInfoSuccess(userResponse));
    } else {
      throw userResponse.message;
    }
  } catch (e) {
    yield put(userInfoFailure(e));
  }
}
export default function* loginSaga() {
  yield takeLatest(FETCH_AUTH_DATA_REQ, authenticate);
  yield takeLatest(GET_USER_INFO_REQ, getUserDetails);
}
