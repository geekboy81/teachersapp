import { takeLatest, call, put } from 'redux-saga/effects';
import marksService from '../../shared/service/marks';
import { loadParentChildrenError, loadParentChildrenSuccess } from './actions';
import { LOAD_PARENT_CHILDREN } from './constants';

function* loadParentChildrenMarks() {
  try {
    const childrenResp = yield call(marksService.getParentChildMarks);
    if (childrenResp.status === 'error') {
      throw new Error(childrenResp.message);
    }
    yield put(loadParentChildrenSuccess(childrenResp.message));
  } catch (e) {
    yield put(loadParentChildrenError(e.message));
  }
}
export default function* parentChildrenSaga() {
  yield takeLatest(LOAD_PARENT_CHILDREN, loadParentChildrenMarks);
}
