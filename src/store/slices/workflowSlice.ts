// Workflow slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AsyncState, BaseEntity } from '@/types';

export interface WorkflowNode extends BaseEntity {
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
  connections?: WorkflowConnection[];
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Workflow extends BaseEntity {
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  status: 'draft' | 'active' | 'paused' | 'archived';
}

interface WorkflowState {
  workflows: AsyncState<Workflow[]>;
  currentWorkflow: AsyncState<Workflow | null>;
  selectedNode: WorkflowNode | null;
}

const initialState: WorkflowState = {
  workflows: {
    data: null,
    loading: 'idle',
    error: null,
  },
  currentWorkflow: {
    data: null,
    loading: 'idle',
    error: null,
  },
  selectedNode: null,
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    // Workflows list
    setWorkflowsLoading: (state, action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>) => {
      state.workflows.loading = action.payload;
    },
    setWorkflows: (state, action: PayloadAction<Workflow[]>) => {
      state.workflows.data = action.payload;
      state.workflows.loading = 'succeeded';
      state.workflows.error = null;
    },
    setWorkflowsError: (state, action: PayloadAction<string>) => {
      state.workflows.error = action.payload;
      state.workflows.loading = 'failed';
    },
    addWorkflow: (state, action: PayloadAction<Workflow>) => {
      if (state.workflows.data) {
        state.workflows.data = [...state.workflows.data, action.payload];
      }
    },
    updateWorkflow: (state, action: PayloadAction<Workflow>) => {
      if (state.workflows.data) {
        state.workflows.data = state.workflows.data.map((w) =>
          w.id === action.payload.id ? action.payload : w
        );
      }
    },
    deleteWorkflow: (state, action: PayloadAction<string>) => {
      if (state.workflows.data) {
        state.workflows.data = state.workflows.data.filter((w) => w.id !== action.payload);
      }
    },
    // Current workflow
    setCurrentWorkflowLoading: (state, action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>) => {
      state.currentWorkflow.loading = action.payload;
    },
    setCurrentWorkflow: (state, action: PayloadAction<Workflow | null>) => {
      state.currentWorkflow.data = action.payload;
      state.currentWorkflow.loading = 'succeeded';
      state.currentWorkflow.error = null;
    },
    setCurrentWorkflowError: (state, action: PayloadAction<string>) => {
      state.currentWorkflow.error = action.payload;
      state.currentWorkflow.loading = 'failed';
    },
    updateCurrentWorkflowNodes: (state, action: PayloadAction<WorkflowNode[]>) => {
      if (state.currentWorkflow.data) {
        state.currentWorkflow.data.nodes = action.payload;
      }
    },
    updateCurrentWorkflowConnections: (state, action: PayloadAction<WorkflowConnection[]>) => {
      if (state.currentWorkflow.data) {
        state.currentWorkflow.data.connections = action.payload;
      }
    },
    updateCurrentWorkflowName: (state, action: PayloadAction<string>) => {
      if (state.currentWorkflow.data) {
        state.currentWorkflow.data.name = action.payload;
      }
    },
    // Selected node
    setSelectedNode: (state, action: PayloadAction<WorkflowNode | null>) => {
      state.selectedNode = action.payload;
    },
  },
});

export const {
  setWorkflowsLoading,
  setWorkflows,
  setWorkflowsError,
  addWorkflow,
  updateWorkflow,
  deleteWorkflow,
  setCurrentWorkflowLoading,
  setCurrentWorkflow,
  setCurrentWorkflowError,
  updateCurrentWorkflowNodes,
  updateCurrentWorkflowConnections,
  updateCurrentWorkflowName,
  setSelectedNode,
} = workflowSlice.actions;

export default workflowSlice.reducer;


