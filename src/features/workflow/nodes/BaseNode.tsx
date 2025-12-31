// Base Node Component - Base component for all workflow nodes

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import './BaseNode.less';

export interface BaseNodeData {
  label: string;
  subtitle?: string;
  color?: string;
  icon?: React.ReactNode;
  status?: 'idle' | 'running' | 'success' | 'error' | 'warning';
  description?: string;
  fields?: Array<{ label: string; value: string }>;
  [key: string]: unknown;
}

export interface BaseNodeProps extends NodeProps {
  data: BaseNodeData;
}

const BaseNode: React.FC<BaseNodeProps> = ({ data, selected }) => {
  const nodeColor = data.color || '#3b82f6'; // Blue default
  const mainLabel = data.label || 'Node';
  const subtitle = data.subtitle;
  const status = data.status || 'idle';
  const fields = data.fields || [];

  // Default icon if not provided
  const defaultIcon = (
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

  return (
    <div 
      className={`base-node ${selected ? 'base-node--selected' : ''} base-node--${status}`}
    >
      {/* Input/Output Handles - Left side (single handle in center) */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-input"
        className="base-node__handle base-node__handle--left"
        style={{ 
          background: nodeColor,
          border: '3px solid #ffffff',
          width: '24px',
          height: '24px',
        }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-output"
        className="base-node__handle base-node__handle--left"
        style={{ 
          background: nodeColor,
          border: '3px solid #ffffff',
          width: '24px',
          height: '24px',
        }}
        isConnectable={true}
      />

      {/* Node Body */}
      <div className="base-node__body">
        {/* Header Section */}
        <div className="base-node__header">
          {/* Icon Container */}
          <div className="base-node__icon-container" style={{ backgroundColor: `${nodeColor}20` }}>
            <div className="base-node__icon" style={{ color: nodeColor }}>
              {data.icon || defaultIcon}
            </div>
          </div>

          {/* Title Section */}
          <div className="base-node__title-section">
            <div className="base-node__label">{mainLabel}</div>
            {subtitle && (
              <div className="base-node__subtitle">{subtitle}</div>
            )}
          </div>
        </div>

        {/* Separator */}
        {(fields.length > 0 || data.description) && (
          <div className="base-node__separator" />
        )}

        {/* Content Section */}
        {(fields.length > 0 || data.description) && (
          <div className="base-node__content">
            {/* Fields */}
            {fields.map((field, index) => (
              <div key={index} className="base-node__field">
                <span className="base-node__field-label">{field.label}:</span>
                <div className="base-node__field-value">{field.value}</div>
              </div>
            ))}

            {/* Description */}
            {data.description && (
              <div className="base-node__description">{data.description}</div>
            )}
          </div>
        )}
      </div>

      {/* Input/Output Handles - Right side (single handle in center) */}
      <Handle
        type="target"
        position={Position.Right}
        id="right-input"
        className="base-node__handle base-node__handle--right"
        style={{ 
          background: nodeColor,
          border: '3px solid #ffffff',
          width: '24px',
          height: '24px',
        }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-output"
        className="base-node__handle base-node__handle--right"
        style={{ 
          background: nodeColor,
          border: '3px solid #ffffff',
          width: '24px',
          height: '24px',
        }}
        isConnectable={true}
      />
    </div>
  );
};

export default BaseNode;

