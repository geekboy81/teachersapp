import { call, put, takeLatest } from 'redux-saga/effects';
import { loadGroupsError, loadGroupsSuccess } from './actions';
import { LOAD_GROUPS } from './constants';
import reportGroupService from '../../shared/service/reportGroup';

export function* groupsSaga() {
  const groups = yield call(reportGroupService.getGroups);
  try {
    yield put(loadGroupsSuccess(groups.message));
  } catch (e) {
    yield put(loadGroupsError(e));
  }
}
// Individual exports for testing
export default function* groupsListSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(LOAD_GROUPS, groupsSaga);
}
