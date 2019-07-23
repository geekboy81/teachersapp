import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import {
  loadModulesHighLights,
  modulesHighLightsLoaded,
  modulesHighlightsLoadingError,
  deleteModuleError,
  deleteModuleSucceded,
} from './actions';
import { makeSelectModuleId } from './selectors';
import { LOAD_MODULES_HIGHLIGHTS, DELETE_MODULE } from './constants';
import moduleService from '../../shared/service/module';
// import * as Routes from '../../routes';

export function* modulesHighlights() {
  try {
    // Call our request helper (see 'utils/request')
    const modulesHighLights = yield call(moduleService.getModuleHighlights);
    yield put(modulesHighLightsLoaded(modulesHighLights.message));
  } catch (err) {
    yield put(modulesHighlightsLoadingError(err));
    // localStorage.clear();
    // yield put(push(Routes.LOGIN));
  }
}
export function* deleteModuleSaga() {
  try {
    const moduleId = yield select(makeSelectModuleId());
    const deleteResp = yield call(moduleService.deleteModule, moduleId);
    if (deleteResp.status === 'error') {
      throw new Error(deleteResp.message);
    }
    yield put(deleteModuleSucceded());
    yield put(loadModulesHighLights());
  } catch (err) {
    yield put(deleteModuleError(err.message));
  }
}
export default function* getModulesHighlights() {
  yield takeEvery(LOAD_MODULES_HIGHLIGHTS, modulesHighlights);
  yield takeLatest(DELETE_MODULE, deleteModuleSaga);
}
