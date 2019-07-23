import { takeLatest, put, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import {
  GET_USER_INFO_REQ,
  LOGOUT,
  userInfoFailure,
  userInfoSuccess,
} from '../../shared/actions/current-user';
import { LOGIN } from '../../routes';
import authService from '../../shared/service/auth';

function* userInfoSaga() {
  try {
    const userResponse = yield call(authService.getUserDetail);
    if (userResponse.Username) {
      yield put(
        userInfoSuccess(
          Object.assign(userResponse, { role: userResponse.role }),
        ),
      );
      yield put(push('/'));
    }
    if (userResponse.status === 'error') {
      throw new Error(userResponse.message);
    }
  } catch (e) {
    yield put(userInfoFailure(e.message));
  }
}
function* logoutSaga() {
  localStorage.clear();
  yield put(push(LOGIN));
}
// Individual exports for testing
export default function* modulesSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(GET_USER_INFO_REQ, userInfoSaga);
}
