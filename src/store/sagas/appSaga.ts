// App saga

import { call, put, takeEvery } from 'redux-saga/effects';
import {
  setNotificationsLoading,
  setNotifications,
  setNotificationsError,
} from '../slices/appSlice';
import { get } from '@/utils/api';

function* fetchNotificationsSaga() {
  try {
    yield put(setNotificationsLoading('loading'));
    const response: { data: unknown[] } = yield call(get, '/notifications');
    yield put(setNotifications(response.data));
  } catch (error) {
    yield put(setNotificationsError(error instanceof Error ? error.message : 'Failed to fetch notifications'));
  }
}

export default function* appSaga() {
  yield takeEvery('app/fetchNotifications', fetchNotificationsSaga);
}


