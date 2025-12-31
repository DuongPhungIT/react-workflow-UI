// Loop Node Component - Iteration/loop logic in workflow

import React from 'react';
import { NodeProps } from '@xyflow/react';
import BaseNode, { BaseNodeData } from './BaseNode';

export interface LoopNodeData extends BaseNodeData {
  loopType?: 'for' | 'while' | 'foreach' | 'repeat';
  iterations?: number;
}

const LoopNode: React.FC<NodeProps<LoopNodeData>> = (props) => {
  const { data } = props;
  const loopType = data.loopType || 'for';
  const iterations = data.iterations;
  
  // Loop icon (circular arrows)
  const loopIcon = (
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
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
    </svg>
  );

  // Loop type labels
  const loopLabels: Record<string, string> = {
    for: iterations ? `For ${iterations}` : 'For Loop',
    while: 'While Loop',
    foreach: 'For Each',
    repeat: 'Repeat',
  };

  const nodeData: BaseNodeData = {
    ...data,
    label: data.label || 'Loop',
    subtitle: data.subtitle || loopLabels[loopType] || 'loop',
    color: data.color || '#ec4899', // Pink for loops
    icon: data.icon || loopIcon,
    description: iterations ? `${iterations} iterations` : undefined,
  };

  return <BaseNode {...props} data={nodeData} />;
};

export default LoopNode;


