// Node Configuration Sidebar component

import React, { useState, useCallback } from 'react';
import { WorkflowNode } from '@/store/slices/workflowSlice';
import Input from '@/components/Input';
import Button from '@/components/Button';
import './styles.less';

interface NodeConfigurationSidebarProps {
  node: WorkflowNode | null;
  onClose: () => void;
  onUpdate?: (node: WorkflowNode) => void;
}

const NodeConfigurationSidebar: React.FC<NodeConfigurationSidebarProps> = ({
  node,
  onClose,
  onUpdate,
}) => {
  const [displayName, setDisplayName] = useState<string>('');
  const [logicType, setLogicType] = useState<string>('');
  const [scriptPath, setScriptPath] = useState<string>('');
  const [inputsJson, setInputsJson] = useState<string>('');

  // Update form when node changes
  React.useEffect(() => {
    if (node) {
      const nodeData = node.data as Record<string, unknown>;
      setDisplayName((nodeData.label as string) || '');
      setLogicType((nodeData.type as string) || 'action');
      
      // Get script path from various possible fields
      const path = (nodeData.path as string) || 
                   (nodeData.scriptPath as string) || 
                   (nodeData.fields?.find((f: { label: string; value: string }) => f.label === 'Path')?.value) ||
                   '';
      setScriptPath(path);
      
      // Get inputs JSON
      const inputs = nodeData.inputs || nodeData.inputsJson || '{}';
      setInputsJson(typeof inputs === 'string' ? inputs : JSON.stringify(inputs, null, 2));
    }
  }, [node]);

  const handleSave = useCallback(() => {
    if (!node || !onUpdate) return;

    try {
      // Parse inputs JSON
      let parsedInputs = {};
      try {
        parsedInputs = JSON.parse(inputsJson);
      } catch {
        // If invalid JSON, keep as string
        parsedInputs = inputsJson;
      }

      const updatedNode: WorkflowNode = {
        ...node,
        data: {
          ...node.data,
          label: displayName,
          type: logicType,
          scriptPath: scriptPath,
          path: scriptPath,
          inputs: parsedInputs,
          inputsJson: inputsJson,
          updatedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };

      onUpdate(updatedNode);
    } catch (error) {
      console.error('Error updating node:', error);
    }
  }, [node, displayName, logicType, scriptPath, inputsJson, onUpdate]);

  if (!node) {
    return null;
  }

  const nodeData = node.data as Record<string, unknown>;
  const nodeType = node.type || 'action';

  // Map node types to display names
  const logicTypeOptions = [
    { value: 'trigger', label: 'Trigger' },
    { value: 'action', label: 'Action Script' },
    { value: 'condition', label: 'Condition' },
    { value: 'delay', label: 'Delay' },
    { value: 'loop', label: 'Loop' },
    { value: 'error', label: 'Error Handler' },
  ];

  return (
    <div className="node-config-sidebar">
      <div className="node-config-sidebar__header">
        <h3 className="node-config-sidebar__title">Configuration</h3>
        <button
          className="node-config-sidebar__close-btn"
          onClick={onClose}
          type="button"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="node-config-sidebar__content">
        <div className="node-config-sidebar__field">
          <Input
            label="ID"
            value={node.id}
            readOnly
            disabled
            helperText="Node identifier (read-only)"
          />
        </div>

        <div className="node-config-sidebar__field">
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name"
          />
        </div>

        <div className="node-config-sidebar__field">
          <label className="node-config-sidebar__label">Logic Type</label>
          <select
            className="node-config-sidebar__select"
            value={logicType}
            onChange={(e) => setLogicType(e.target.value)}
          >
            {logicTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {(nodeType === 'action' || nodeType === 'trigger' || scriptPath) && (
          <div className="node-config-sidebar__field">
            <Input
              label="Script Path"
              value={scriptPath}
              onChange={(e) => setScriptPath(e.target.value)}
              placeholder="f/kcc/analyze_sentiment"
              helperText="Path to the Windmill script"
            />
          </div>
        )}

        <div className="node-config-sidebar__field">
          <label className="node-config-sidebar__label">Inputs (JSON)</label>
          <textarea
            className="node-config-sidebar__textarea"
            value={inputsJson}
            onChange={(e) => setInputsJson(e.target.value)}
            placeholder='{"text": "{{start.body.message}}"}'
            rows={8}
          />
          <a
            href="#"
            className="node-config-sidebar__link"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Open inputs definition modal
            }}
          >
            Define inputs for this node
          </a>
        </div>

        {/* Additional node-specific fields */}
        {nodeData.fields && Array.isArray(nodeData.fields) && nodeData.fields.length > 0 && (
          <div className="node-config-sidebar__section">
            <h4 className="node-config-sidebar__section-title">Additional Fields</h4>
            {nodeData.fields.map((field: { label: string; value: string }, index: number) => (
              <div key={index} className="node-config-sidebar__field">
                <Input
                  label={field.label}
                  value={field.value}
                  readOnly
                  disabled
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="node-config-sidebar__footer">
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          fullWidth
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default NodeConfigurationSidebar;

