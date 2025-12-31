// Action Node Component - Performs actions in workflow

import React from 'react';
import { NodeProps, Node } from '@xyflow/react';
import { 
  CodeOutlined, 
  RobotOutlined, 
  GlobalOutlined, 
  ExportOutlined
} from '@ant-design/icons';
import BaseNode, { BaseNodeData } from './BaseNode';

export interface ActionNodeData extends BaseNodeData {
  actionType?: 'http' | 'database' | 'email' | 'notification' | 'transform' | 'custom';
}

const ActionNode: React.FC<NodeProps<Node<ActionNodeData>>> = (props) => {
  const data = props.data as ActionNodeData;
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

  // Get node configuration based on label
  const getNodeConfig = () => {
    const label = data.label;
    
    if (label === 'Output') {
      return {
        color: '#10b981', // Emerald
        handles: 'target' as const,
        icon: <ExportOutlined style={{ fontSize: '18px' }} />,
      };
    }
    
    if (label === 'Script') {
      return {
        color: '#14b8a6', // Teal
        handles: 'both' as const,
        icon: <CodeOutlined style={{ fontSize: '18px' }} />,
      };
    }
    
    if (label === 'LLM') {
      return {
        color: '#ec4899', // Pink
        handles: 'both' as const,
        icon: <RobotOutlined style={{ fontSize: '18px' }} />,
      };
    }
    
    if (label === 'HTTP') {
      return {
        color: '#3b82f6', // Blue
        handles: 'both' as const,
        icon: <GlobalOutlined style={{ fontSize: '18px' }} />,
      };
    }

    return {
      color: '#3b82f6',
      handles: 'both' as const,
      icon: actionIcon,
    };
  };

  const config = getNodeConfig();

  const nodeData: BaseNodeData = {
    ...(data as BaseNodeData),
    label: data.label || 'Action',
    subtitle: data.subtitle || actionLabels[actionType] || 'action',
    color: config.color,
    icon: data.icon || config.icon,
    handles: config.handles,
  };

  return <BaseNode {...props} data={nodeData} />;
};

export default ActionNode;
