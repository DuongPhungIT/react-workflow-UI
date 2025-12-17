// Mock data for development and testing

import { Workflow, WorkflowNode, WorkflowConnection } from '@/store/slices/workflowSlice';

// Helper to create nodes with better spacing
const createNode = (
  id: string,
  type: string,
  label: string,
  x: number,
  y: number,
  extraData?: Record<string, unknown>
): WorkflowNode => ({
  id,
  type,
  position: { x, y },
  data: { label, type, ...extraData },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Helper to create connections
const createConnection = (
  id: string,
  source: string,
  target: string,
  sourceHandle?: string,
  targetHandle?: string
): WorkflowConnection => ({
  id,
  source,
  target,
  sourceHandle,
  targetHandle,
});

export const mockWorkflows: Workflow[] = [
  {
    id: 'workflow-1',
    name: 'Email Automation',
    description: 'Automatically send emails based on triggers and conditions',
    status: 'active',
    nodes: [
      createNode('node-1', 'trigger', 'New Email Received', 100, 200),
      createNode('node-2', 'action', 'Filter by Subject', 350, 200),
      createNode('node-3', 'condition', 'Check Priority', 600, 200),
      createNode('node-4', 'action', 'Send Auto Reply', 850, 150),
      createNode('node-5', 'action', 'Forward to Team', 850, 250),
    ],
    connections: [
      createConnection('conn-1', 'node-1', 'node-2'),
      createConnection('conn-2', 'node-2', 'node-3'),
      createConnection('conn-3', 'node-3', 'node-4', 'high'),
      createConnection('conn-4', 'node-3', 'node-5', 'low'),
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'workflow-2',
    name: 'Data Processing Pipeline',
    description: 'Process and transform data from multiple sources with validation',
    status: 'active',
    nodes: [
      createNode('node-6', 'trigger', 'File Upload', 100, 300),
      createNode('node-7', 'action', 'Parse CSV', 350, 250),
      createNode('node-8', 'action', 'Parse JSON', 350, 350),
      createNode('node-9', 'action', 'Validate Data', 600, 300),
      createNode('node-10', 'condition', 'Data Quality Check', 850, 300),
      createNode('node-11', 'action', 'Save to Database', 1100, 250),
      createNode('node-12', 'action', 'Send Alert', 1100, 350),
      createNode('node-13', 'action', 'Generate Report', 1100, 450),
    ],
    connections: [
      createConnection('conn-5', 'node-6', 'node-7'),
      createConnection('conn-6', 'node-6', 'node-8'),
      createConnection('conn-7', 'node-7', 'node-9'),
      createConnection('conn-8', 'node-8', 'node-9'),
      createConnection('conn-9', 'node-9', 'node-10'),
      createConnection('conn-10', 'node-10', 'node-11', 'pass'),
      createConnection('conn-11', 'node-10', 'node-12', 'fail'),
      createConnection('conn-12', 'node-11', 'node-13'),
    ],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'workflow-3',
    name: 'Social Media Scheduler',
    description: 'Schedule and publish posts to multiple social media platforms',
    status: 'paused',
    nodes: [
      createNode('node-14', 'trigger', 'Schedule Trigger', 100, 200),
      createNode('node-15', 'action', 'Get Post Content', 350, 200),
      createNode('node-16', 'action', 'Post to Twitter', 600, 100),
      createNode('node-17', 'action', 'Post to Facebook', 600, 200),
      createNode('node-18', 'action', 'Post to LinkedIn', 600, 300),
      createNode('node-19', 'action', 'Post to Instagram', 600, 400),
      createNode('node-20', 'action', 'Track Analytics', 850, 200),
    ],
    connections: [
      createConnection('conn-13', 'node-14', 'node-15'),
      createConnection('conn-14', 'node-15', 'node-16'),
      createConnection('conn-15', 'node-15', 'node-17'),
      createConnection('conn-16', 'node-15', 'node-18'),
      createConnection('conn-17', 'node-15', 'node-19'),
      createConnection('conn-18', 'node-16', 'node-20'),
      createConnection('conn-19', 'node-17', 'node-20'),
      createConnection('conn-20', 'node-18', 'node-20'),
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'workflow-4',
    name: 'Customer Onboarding',
    description: 'Automated customer onboarding process with email sequences',
    status: 'draft',
    nodes: [
      createNode('node-21', 'trigger', 'New Customer Signup', 100, 200),
      createNode('node-22', 'action', 'Create Account', 350, 200),
      createNode('node-23', 'action', 'Send Welcome Email', 600, 150),
      createNode('node-24', 'action', 'Setup Initial Data', 600, 250),
      createNode('node-25', 'action', 'Send Tutorial Email', 850, 150),
      createNode('node-26', 'action', 'Assign Support Agent', 850, 250),
    ],
    connections: [
      createConnection('conn-21', 'node-21', 'node-22'),
      createConnection('conn-22', 'node-22', 'node-23'),
      createConnection('conn-23', 'node-22', 'node-24'),
      createConnection('conn-24', 'node-23', 'node-25'),
      createConnection('conn-25', 'node-24', 'node-26'),
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'workflow-5',
    name: 'E-commerce Order Processing',
    description: 'Complete order processing workflow from payment to delivery',
    status: 'active',
    nodes: [
      createNode('node-27', 'trigger', 'New Order', 100, 300),
      createNode('node-28', 'action', 'Process Payment', 350, 300),
      createNode('node-29', 'condition', 'Payment Success?', 600, 300),
      createNode('node-30', 'action', 'Update Inventory', 850, 200),
      createNode('node-31', 'action', 'Send Order Confirmation', 850, 300),
      createNode('node-32', 'action', 'Notify Warehouse', 850, 400),
      createNode('node-33', 'action', 'Send Payment Failed Email', 850, 500),
      createNode('node-34', 'action', 'Generate Shipping Label', 1100, 200),
      createNode('node-35', 'action', 'Send Tracking Email', 1100, 300),
    ],
    connections: [
      createConnection('conn-26', 'node-27', 'node-28'),
      createConnection('conn-27', 'node-28', 'node-29'),
      createConnection('conn-28', 'node-29', 'node-30', 'yes'),
      createConnection('conn-29', 'node-29', 'node-31', 'yes'),
      createConnection('conn-30', 'node-29', 'node-32', 'yes'),
      createConnection('conn-31', 'node-29', 'node-33', 'no'),
      createConnection('conn-32', 'node-30', 'node-34'),
      createConnection('conn-33', 'node-31', 'node-35'),
      createConnection('conn-34', 'node-34', 'node-35'),
    ],
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'workflow-6',
    name: 'Lead Qualification System',
    description: 'Automatically qualify and route leads to appropriate sales teams',
    status: 'active',
    nodes: [
      createNode('node-36', 'trigger', 'New Lead Form Submission', 100, 250),
      createNode('node-37', 'action', 'Enrich Lead Data', 350, 250),
      createNode('node-38', 'condition', 'Company Size', 600, 250),
      createNode('node-39', 'action', 'Assign to Enterprise Team', 850, 150),
      createNode('node-40', 'action', 'Assign to SMB Team', 850, 250),
      createNode('node-41', 'action', 'Assign to Startup Team', 850, 350),
      createNode('node-42', 'action', 'Send Welcome Email', 1100, 250),
      createNode('node-43', 'action', 'Schedule Follow-up', 1100, 350),
    ],
    connections: [
      createConnection('conn-35', 'node-36', 'node-37'),
      createConnection('conn-36', 'node-37', 'node-38'),
      createConnection('conn-37', 'node-38', 'node-39', 'enterprise'),
      createConnection('conn-38', 'node-38', 'node-40', 'smb'),
      createConnection('conn-39', 'node-38', 'node-41', 'startup'),
      createConnection('conn-40', 'node-39', 'node-42'),
      createConnection('conn-41', 'node-40', 'node-42'),
      createConnection('conn-42', 'node-41', 'node-42'),
      createConnection('conn-43', 'node-42', 'node-43'),
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'workflow-7',
    name: 'Content Moderation',
    description: 'Automated content moderation with AI and human review',
    status: 'active',
    nodes: [
      createNode('node-44', 'trigger', 'New Content Submitted', 100, 300),
      createNode('node-45', 'action', 'AI Content Analysis', 350, 300),
      createNode('node-46', 'condition', 'AI Confidence Score', 600, 300),
      createNode('node-47', 'action', 'Auto Approve', 850, 200),
      createNode('node-48', 'action', 'Send to Human Review', 850, 300),
      createNode('node-49', 'action', 'Auto Reject', 850, 400),
      createNode('node-50', 'action', 'Publish Content', 1100, 200),
      createNode('node-51', 'action', 'Notify Moderator', 1100, 300),
      createNode('node-52', 'action', 'Notify Creator', 1100, 400),
    ],
    connections: [
      createConnection('conn-44', 'node-44', 'node-45'),
      createConnection('conn-45', 'node-45', 'node-46'),
      createConnection('conn-46', 'node-46', 'node-47', 'high'),
      createConnection('conn-47', 'node-46', 'node-48', 'medium'),
      createConnection('conn-48', 'node-46', 'node-49', 'low'),
      createConnection('conn-49', 'node-47', 'node-50'),
      createConnection('conn-50', 'node-48', 'node-51'),
      createConnection('conn-51', 'node-49', 'node-52'),
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'workflow-8',
    name: 'Invoice Generation',
    description: 'Automated invoice generation and payment tracking',
    status: 'draft',
    nodes: [
      createNode('node-53', 'trigger', 'Service Completed', 100, 200),
      createNode('node-54', 'action', 'Calculate Amount', 350, 200),
      createNode('node-55', 'action', 'Generate Invoice PDF', 600, 200),
      createNode('node-56', 'action', 'Send Invoice Email', 850, 200),
      createNode('node-57', 'action', 'Set Payment Reminder', 1100, 200),
    ],
    connections: [
      createConnection('conn-52', 'node-53', 'node-54'),
      createConnection('conn-53', 'node-54', 'node-55'),
      createConnection('conn-54', 'node-55', 'node-56'),
      createConnection('conn-55', 'node-56', 'node-57'),
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper function to get mock workflows
export const getMockWorkflows = (): Workflow[] => {
  return mockWorkflows;
};

// Helper function to get mock workflow by ID
export const getMockWorkflowById = (id: string): Workflow | undefined => {
  return mockWorkflows.find((workflow) => workflow.id === id);
};

// Helper function to get workflows by status
export const getMockWorkflowsByStatus = (status: Workflow['status']): Workflow[] => {
  return mockWorkflows.filter((workflow) => workflow.status === status);
};

// Helper function to search workflows
export const searchMockWorkflows = (query: string): Workflow[] => {
  const lowerQuery = query.toLowerCase();
  return mockWorkflows.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(lowerQuery) ||
      workflow.description?.toLowerCase().includes(lowerQuery)
  );
};
