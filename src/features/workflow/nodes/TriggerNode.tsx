// Trigger Node Component - Starting point of workflow

import React from 'react';
import { NodeProps, Node } from '@xyflow/react';
import BaseNode, { BaseNodeData } from './BaseNode';

export interface TriggerNodeData extends BaseNodeData {
  triggerType?: 'manual' | 'schedule' | 'webhook' | 'event' | 'api';
  path?: string;
  method?: string;
}

const TriggerNode: React.FC<NodeProps<Node<TriggerNodeData>>> = (props) => {
  const data = props.data as TriggerNodeData;
  const triggerType = data.triggerType || 'manual';
  const path = data.path;
  const method = data.method;
  
  // Trigger icon - lightning bolt
  const triggerIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );

  // Trigger type labels
  const triggerLabels: Record<string, string> = {
    manual: 'Manual',
    schedule: 'Scheduled',
    webhook: 'Webhook',
    event: 'Event',
    api: 'API',
  };

  // Build fields array
  const fields: Array<{ label: string; value: string }> = [];
  if (path) {
    fields.push({ label: 'Path', value: path });
  }
  if (method) {
    fields.push({ label: 'Method', value: method });
  }

  const nodeData: BaseNodeData = {
    ...data,
    label: data.label || 'Start',
    subtitle: data.subtitle || triggerLabels[triggerType] || 'Trigger',
    color: '#8b5cf6', // Violet for triggers
    icon: data.icon || triggerIcon,
    fields: fields.length > 0 ? fields : data.fields,
    handles: 'source',
  };

  return <BaseNode {...props} data={nodeData} />;
};

export default TriggerNode;

