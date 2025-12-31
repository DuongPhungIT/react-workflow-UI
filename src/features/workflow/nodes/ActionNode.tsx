// Action Node Component - Performs actions in workflow

import React from 'react';
import { NodeProps } from '@xyflow/react';
import BaseNode, { BaseNodeData } from './BaseNode';

export interface ActionNodeData extends BaseNodeData {
  actionType?: 'http' | 'database' | 'email' | 'notification' | 'transform' | 'custom';
}

const ActionNode: React.FC<NodeProps<ActionNodeData>> = (props) => {
  const { data } = props;
  const actionType = data.actionType || 'custom';
  
  // Action icon
  const actionIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
  );

  // Action type labels
  const actionLabels: Record<string, string> = {
    http: 'HTTP',
    database: 'Database',
    email: 'Email',
    notification: 'Notification',
    transform: 'Transform',
    custom: 'Action',
  };

  const nodeData: BaseNodeData = {
    ...data,
    label: data.label || 'Action',
    subtitle: data.subtitle || actionLabels[actionType] || 'action',
    color: data.color || '#3b82f6', // Blue for actions
    icon: data.icon || actionIcon,
  };

  return <BaseNode {...props} data={nodeData} />;
};

export default ActionNode;


