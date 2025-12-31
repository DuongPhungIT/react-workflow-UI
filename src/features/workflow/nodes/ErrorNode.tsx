// Error Node Component - Error handling in workflow

import React from 'react';
import { NodeProps } from '@xyflow/react';
import BaseNode, { BaseNodeData } from './BaseNode';

export interface ErrorNodeData extends BaseNodeData {
  errorType?: 'catch' | 'throw' | 'retry' | 'fallback';
  errorMessage?: string;
}

const ErrorNode: React.FC<NodeProps<ErrorNodeData>> = (props) => {
  const { data } = props;
  const errorType = data.errorType || 'catch';
  const errorMessage = data.errorMessage;
  
  // Error icon (warning/error symbol)
  const errorIcon = (
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
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );

  // Error type labels
  const errorLabels: Record<string, string> = {
    catch: 'Catch Error',
    throw: 'Throw Error',
    retry: 'Retry',
    fallback: 'Fallback',
  };

  const nodeData: BaseNodeData = {
    ...data,
    label: data.label || 'Error Handler',
    subtitle: data.subtitle || errorLabels[errorType] || 'error',
    color: data.color || '#ef4444', // Red for errors
    icon: data.icon || errorIcon,
    status: errorType === 'throw' ? 'error' : 'warning',
    description: errorMessage,
  };

  return <BaseNode {...props} data={nodeData} />;
};

export default ErrorNode;


