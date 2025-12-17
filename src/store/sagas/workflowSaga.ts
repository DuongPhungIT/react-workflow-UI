// Workflow saga

import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import {
  setWorkflowsLoading,
  setWorkflows,
  setWorkflowsError,
  addWorkflow,
  updateWorkflow,
  deleteWorkflow,
  setCurrentWorkflowLoading,
  setCurrentWorkflow,
  setCurrentWorkflowError,
  Workflow,
} from '../slices/workflowSlice';
import { get, post, put as putRequest, del } from '@/utils/api';
import { getMockWorkflows, getMockWorkflowById } from '@/mock/data';
import { sleep } from '@/utils';

function* fetchWorkflowsSaga() {
  try {
    yield put(setWorkflowsLoading('loading'));
    // Simulate API delay
    yield call(sleep, 500);
    // Use mock data instead of API call
    const mockData = getMockWorkflows();
    yield put(setWorkflows(mockData));
  } catch (error) {
    yield put(setWorkflowsError(error instanceof Error ? error.message : 'Failed to fetch workflows'));
  }
}

function* fetchWorkflowByIdSaga(action: { type: string; payload: string }) {
  try {
    yield put(setCurrentWorkflowLoading('loading'));
    // Simulate API delay - shorter for better UX
    yield call(sleep, 200);
    // Use mock data instead of API call
    const mockWorkflow = getMockWorkflowById(action.payload);
    if (mockWorkflow) {
      yield put(setCurrentWorkflow(mockWorkflow));
    } else {
      // If not found in mock data, try to find in current workflows list
      const state = yield select();
      const workflows = state.workflow.workflows.data;
      const workflow = workflows?.find((w: Workflow) => w.id === action.payload);
      if (workflow) {
        yield put(setCurrentWorkflow(workflow));
      } else {
        yield put(setCurrentWorkflowError('Workflow not found'));
      }
    }
  } catch (error) {
    yield put(setCurrentWorkflowError(error instanceof Error ? error.message : 'Failed to fetch workflow'));
  }
}

function* createWorkflowSaga(action: { type: string; payload: Partial<Workflow> }) {
  try {
    // Simulate API delay
    yield call(sleep, 300);
    // Create mock workflow
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: action.payload.name || 'New Workflow',
      description: action.payload.description,
      status: action.payload.status || 'draft',
      nodes: action.payload.nodes || [],
      connections: action.payload.connections || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    yield put(addWorkflow(newWorkflow));
    // Set as current workflow
    yield put(setCurrentWorkflow(newWorkflow));
  } catch (error) {
    console.error('Failed to create workflow:', error);
  }
}

function* updateWorkflowSaga(action: { type: string; payload: Workflow }) {
  try {
    // Simulate API delay
    yield call(sleep, 300);
    // Update workflow directly
    yield put(updateWorkflow(action.payload));
    // Update current workflow if it's the same
    const currentWorkflow = yield select((state: { workflow: { currentWorkflow: { data: Workflow | null } } }) => 
      state.workflow.currentWorkflow.data
    );
    if (currentWorkflow && currentWorkflow.id === action.payload.id) {
      yield put(setCurrentWorkflow(action.payload));
    }
  } catch (error) {
    console.error('Failed to update workflow:', error);
  }
}

function* deleteWorkflowSaga(action: { type: string; payload: string }) {
  try {
    // Simulate API delay
    yield call(sleep, 200);
    // Delete workflow
    yield put(deleteWorkflow(action.payload));
    // Clear current workflow if it's the deleted one
    const currentWorkflow = yield select((state: { workflow: { currentWorkflow: { data: Workflow | null } } }) => 
      state.workflow.currentWorkflow.data
    );
    if (currentWorkflow && currentWorkflow.id === action.payload) {
      yield put(setCurrentWorkflow(null));
    }
  } catch (error) {
    console.error('Failed to delete workflow:', error);
  }
}

export default function* workflowSaga() {
  yield takeLatest('workflow/fetchWorkflows', fetchWorkflowsSaga);
  yield takeEvery('workflow/fetchWorkflowById', fetchWorkflowByIdSaga);
  yield takeEvery('workflow/createWorkflow', createWorkflowSaga);
  yield takeEvery('workflow/updateWorkflow', updateWorkflowSaga);
  yield takeEvery('workflow/deleteWorkflow', deleteWorkflowSaga);
}

