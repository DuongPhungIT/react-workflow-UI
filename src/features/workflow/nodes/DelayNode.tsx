// Delay Node Component - Adds delay/wait in workflow

import React from 'react';
import { NodeProps } from '@xyflow/react';
import BaseNode, { BaseNodeData } from './BaseNode';

export interface DelayNodeData extends BaseNodeData {
  delayType?: 'fixed' | 'dynamic' | 'until' | 'schedule';
  duration?: string;
}

const DelayNode: React.FC<NodeProps<DelayNodeData>> = (props) => {
  const { data } = props;
  const delayType = data.delayType || 'fixed';
  const duration = data.duration || '1s';
  
  // Delay icon (clock)
  const delayIcon = (
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );

  // Delay type labels
  const delayLabels: Record<string, string> = {
    fixed: `Wait ${duration}`,
    dynamic: 'Dynamic Wait',
    until: 'Wait Until',
    schedule: 'Scheduled',
  };

  const nodeData: BaseNodeData = {
    ...data,
    label: data.label || 'Delay',
    subtitle: data.subtitle || delayLabels[delayType] || 'delay',
    color: data.color || '#8b5cf6', // Purple for delays
    icon: data.icon || delayIcon,
    description: delayType === 'fixed' ? `Duration: ${duration}` : undefined,
  };

  return <BaseNode {...props} data={nodeData} />;
};

export default DelayNode;


