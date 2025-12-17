// Root saga

import { all, fork } from 'redux-saga/effects';
import appSaga from './sagas/appSaga';
import workflowSaga from './sagas/workflowSaga';

export default function* rootSaga() {
  yield all([fork(appSaga), fork(workflowSaga)]);
}

