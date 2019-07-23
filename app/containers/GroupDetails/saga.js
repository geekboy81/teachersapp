import { takeLatest, call, put, select, fork } from 'redux-saga/effects';
import {
  loadScalesSuccess,
  loadScalesError,
  loadModuleSuccess,
  loadModuleError,
  loadChildMarksSuccess,
  loadChildMarksError,
  cloneModuleError,
  cloneModuleSuccess,
  loadStudentMarksDetailsSuccess,
  loadStudentMarksDetailsError,
  getStudentMarksDetailsError,
  getStudentMarksDetailsSuccess,
} from './actions';
import { makeSelectModuleId, makeSelectChildId } from './selectors';
import {
  LOAD_SCALES,
  LOAD_MODULE,
  LOAD_CHILD_MARKS,
  CLONE_MODULE,
  LOAD_STUDENT_MARKS_DETAILS,
  GET_STUDENT_MARKS_DETAILS,
} from './constants';
import { addModuleAPI } from '../../shared/api';
import { loadModulesHighLights } from '../ModulesHighlights/actions';
import scaleService from '../../shared/service/scale';
import moduleService from '../../shared/service/module';
import marksService from '../../shared/service/marks';

export function* getModuleByIdSaga(moduleId) {
  try {
    const moduleResp = yield call(moduleService.getModuleById, moduleId);
    if (moduleResp) {
      yield put(loadModuleSuccess(moduleResp.message));
    }
  } catch (error) {
    yield put(loadModuleError(error));
  }
}
function* getStudentSemesterDetailsSaga(state) {
  const { moduleId, studentId } = state;
  try {
    const semesterDetailsResp = yield call(marksService.getSemesterDetails, [
      parseInt(moduleId),
      parseInt(studentId),
    ]);
    if (semesterDetailsResp.status === 'error') {
      throw new Error(semesterDetailsResp.data);
    }
    yield put(getStudentMarksDetailsSuccess(semesterDetailsResp.data));
  } catch (e) {
    yield put(getStudentMarksDetailsError(e.message));
  }
}
export function* getChildMarksByChildIdAndModuleIdSaga() {
  const moduleId = yield select(makeSelectModuleId());
  const childId = yield select(makeSelectChildId());
  try {
    const childMarksResp = yield call(marksService.getChildMarks, [
      moduleId,
      childId,
    ]);
    yield put(loadChildMarksSuccess(childMarksResp.message));
  } catch (error) {
    yield put(loadChildMarksError(error));
  }
}
export function* getScalesSaga() {
  try {
    const scalesResp = yield call(scaleService.getScales);
    yield put(loadScalesSuccess(scalesResp.message));
  } catch (err) {
    yield put(loadScalesError(err));
  }
}
export function* getModuleByIdGroupDetailsSaga() {
  const state = yield select(s => s.groupDetails);
  try {
    const moduleResp = yield call(moduleService.getModuleById, state.moduleId);
    if (moduleResp) {
      yield put(loadModuleSuccess(moduleResp.message));
    }
  } catch (error) {
    yield put(loadModuleError(error));
  }
}
export function* addModuleSaga(moduleToSave) {
  yield call(addModuleAPI, moduleToSave);
}
export function* cloneModule() {
  const state = yield select(s => s.groupDetails);
  try {
    const moduleResp = yield call(
      moduleService.getModuleById,
      state.toClone.module_id,
    );
    const moduleToSave = moduleResp.message;
    moduleToSave.modul = state.toClone.name;
    moduleToSave.module_name = state.toClone.name;
    moduleToSave.group_ids = JSON.parse(moduleToSave.group_ids);
    yield fork(addModuleSaga, moduleToSave);
    yield put(cloneModuleSuccess());
    yield put(loadModulesHighLights());
  } catch (e) {
    yield put(cloneModuleError(e));
  }
}
function* getStudentMarksDetails() {
  const state = yield select(s => s.groupDetails);
  const { studentToGetMarksDetails } = state;
  try {
    // yield fork(getScalesSaga);
    let moduleData = {};
    const scalesResp = yield call(scaleService.getScales);
    const moduleResp = yield call(
      moduleService.getModuleById,
      studentToGetMarksDetails.sdModuleId,
    );
    if (moduleResp) {
      moduleData = moduleResp.message;
    }
    // yield fork(getModuleByIdSaga, studentToGetMarksDetails.moduleId);
    yield put(
      loadStudentMarksDetailsSuccess({
        module: moduleData,
        scales: scalesResp.message,
      }),
    );
  } catch (e) {
    yield put(loadStudentMarksDetailsError(e));
  }
}
// Individual exports for testing
export default function* groupDetailsSaga() {
  yield takeLatest(LOAD_STUDENT_MARKS_DETAILS, getStudentMarksDetails);
  yield takeLatest(LOAD_SCALES, getScalesSaga);
  //   yield all([
  yield takeLatest(LOAD_MODULE, getModuleByIdGroupDetailsSaga);
  yield takeLatest(CLONE_MODULE, cloneModule);
  yield takeLatest(LOAD_CHILD_MARKS, getChildMarksByChildIdAndModuleIdSaga);
  yield takeLatest(GET_STUDENT_MARKS_DETAILS, getStudentSemesterDetailsSaga);
  // ]);
  // const forkedGetModuleByIdSaga = fork(getModuleByIdSaga, makeSelectModuleId);
  // yield takeLatest(LOAD_SCALES, loadModuleSkillsMarksSaga);
  // See example in containers/HomePage/saga.js
}
