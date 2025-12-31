// Root reducer

import { combineReducers } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import workflowReducer from './slices/workflowSlice';

const rootReducer = combineReducers({
  app: appReducer,
  workflow: workflowReducer,
});

export default rootReducer;


