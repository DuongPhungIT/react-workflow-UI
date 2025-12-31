// Condition Node Component - Conditional logic in workflow

import React from 'react';
import { NodeProps } from '@xyflow/react';
import BaseNode, { BaseNodeData } from './BaseNode';

export interface ConditionNodeData extends BaseNodeData {
  conditionType?: 'if' | 'switch' | 'compare' | 'validate' | 'filter';
}

const ConditionNode: React.FC<NodeProps<ConditionNodeData>> = (props) => {
  const { data } = props;
  const conditionType = data.conditionType || 'if';
  
  // Condition icon (decision diamond)
  const conditionIcon = (
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
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );

  // Condition type labels
  const conditionLabels: Record<string, string> = {
    if: 'If/Else',
    switch: 'Switch',
    compare: 'Compare',
    validate: 'Validate',
    filter: 'Filter',
  };

  const nodeData: BaseNodeData = {
    ...data,
    label: data.label || 'Condition',
    subtitle: data.subtitle || conditionLabels[conditionType] || 'condition',
    color: data.color || '#f59e0b', // Amber for conditions
    icon: data.icon || conditionIcon,
  };

  return <BaseNode {...props} data={nodeData} />;
};

export default ConditionNode;


