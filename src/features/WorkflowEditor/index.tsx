// Workflow Editor component using React Flow

import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setSelectedNode,
  updateCurrentWorkflowNodes,
  updateCurrentWorkflowConnections,
  updateCurrentWorkflowName,
  setCurrentWorkflow,
  WorkflowNode,
  WorkflowConnection,
} from '@/store/slices/workflowSlice';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import Card from '@/components/Card';
import './styles.less';

// Custom Node Component
const CustomNode: React.FC<{ data: { label: string; type: string }; type?: string }> = ({ data, type }) => {
  const nodeType = type || data.type || 'default';
  
  const getTypeClass = (t: string) => {
    if (t === 'trigger') return 'workflow-node__type--trigger';
    if (t === 'condition') return 'workflow-node__type--condition';
    return 'workflow-node__type--action';
  };
  
  return (
    <div className="workflow-node">
      {/* Input Handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#0284c7' }}
      />
      
      <div className="workflow-node__header">
        <span className={`workflow-node__type ${getTypeClass(nodeType)}`}>{nodeType}</span>
      </div>
      <div className="workflow-node__content">
        <div className="workflow-node__label">{data.label || 'Node'}</div>
      </div>
      
      {/* Output Handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#0284c7' }}
      />
    </div>
  );
};

const nodeTypes = {
  default: CustomNode,
  action: CustomNode,
  trigger: CustomNode,
  condition: CustomNode,
};

const WorkflowEditorContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentWorkflow } = useAppSelector((state) => state.workflow);
  const { fitView } = useReactFlow();
  const hasFittedView = useRef(false);

  // Load workflow when ID changes
  useEffect(() => {
    if (id && id !== 'new') {
      dispatch({ type: 'workflow/fetchWorkflowById', payload: id });
      hasFittedView.current = false;
    } else if (id === 'new') {
      // Create new workflow
      dispatch({
        type: 'workflow/createWorkflow',
        payload: {
          name: 'New Workflow',
          status: 'draft',
          nodes: [],
          connections: [],
        },
      });
    }
  }, [id, dispatch]);

  // Initialize with empty arrays, will be updated when workflow loads
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Keep nodes ref for debounced updates
  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  
  // Debounce timeout ref
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Workflow name editing state
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [tempName, setTempName] = React.useState('');

  useEffect(() => {
    if (currentWorkflow.data?.name) {
      setTempName(currentWorkflow.data.name);
    }
  }, [currentWorkflow.data?.name]);

  const handleNameSave = () => {
    if (tempName.trim()) {
      dispatch(updateCurrentWorkflowName(tempName.trim()));
    } else if (currentWorkflow.data?.name) {
      setTempName(currentWorkflow.data.name);
    }
    setIsEditingName(false);
  };

  // Update nodes and edges when workflow loads
  useEffect(() => {
    if (currentWorkflow.data && currentWorkflow.loading === 'succeeded') {
      // Update nodes
      if (currentWorkflow.data.nodes && currentWorkflow.data.nodes.length > 0) {
        const newNodes = currentWorkflow.data.nodes.map((node) => ({
          id: node.id,
          type: node.type || 'default',
          position: node.position,
          data: node.data,
          draggable: true,
          selectable: true,
        }));
        setNodes(newNodes);
      } else {
        setNodes([]);
      }

      // Update edges
      if (currentWorkflow.data.connections && currentWorkflow.data.connections.length > 0) {
        const newEdges = currentWorkflow.data.connections.map((conn) => ({
          id: conn.id,
          source: conn.source,
          target: conn.target,
          sourceHandle: conn.sourceHandle || undefined,
          targetHandle: conn.targetHandle || undefined,
          type: 'smoothstep',
          animated: true,
          style: { strokeWidth: 2.5 },
        }));
        setEdges(newEdges);
      } else {
        setEdges([]);
      }
      
      // Fit view after nodes are loaded
      if (!hasFittedView.current && currentWorkflow.data.nodes && currentWorkflow.data.nodes.length > 0) {
        setTimeout(() => {
          fitView({ duration: 400, padding: 0.2 });
          hasFittedView.current = true;
        }, 300);
      }
    }
  }, [currentWorkflow.data, currentWorkflow.loading, setNodes, setEdges, fitView]);

  // Sync nodes back to Redux store - debounced for smooth performance
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      // Only update Redux when drag ends, not during dragging
      if (Array.isArray(changes)) {
        const hasPositionChange = changes.some((change: any) => change.type === 'position');
        const hasDragEnd = changes.some((change: any) => change.type === 'drag' && change.dragging === false);
        
        if (hasPositionChange || hasDragEnd) {
          if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
          }
          // Update immediately when drag ends, debounce during drag
          const delay = hasDragEnd ? 0 : 300;
          updateTimeoutRef.current = setTimeout(() => {
            const workflowNodes: WorkflowNode[] = nodesRef.current.map((node) => ({
              id: node.id,
              type: (node.type as string) || 'default',
              position: node.position,
              data: node.data as Record<string, unknown>,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }));
            dispatch(updateCurrentWorkflowNodes(workflowNodes));
          }, delay);
        }
      }
    },
    [onNodesChange, dispatch]
  );
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Sync edges back to Redux store
  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
      const updatedConnections: WorkflowConnection[] = edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle || undefined,
        targetHandle: edge.targetHandle || undefined,
      }));
      dispatch(updateCurrentWorkflowConnections(updatedConnections));
    },
    [edges, onEdgesChange, dispatch]
  );

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = addEdge(params, edges);
      setEdges(newEdge);
      const updatedConnections: WorkflowConnection[] = newEdge.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle || undefined,
        targetHandle: edge.targetHandle || undefined,
      }));
      dispatch(updateCurrentWorkflowConnections(updatedConnections));
    },
    [edges, setEdges, dispatch]
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const workflowNode: WorkflowNode = {
        id: node.id,
        type: (node.type as string) || 'default',
        position: node.position,
        data: node.data as Record<string, unknown>,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(setSelectedNode(workflowNode));
    },
    [dispatch]
  );

  // Add new node
  const handleAddNode = useCallback(() => {
    if (!currentWorkflow.data) return;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'action',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: { label: 'New Node', type: 'action' },
    };

    setNodes([...nodes, newNode]);

    const workflowNode: WorkflowNode = {
      id: newNode.id,
      type: 'action',
      position: newNode.position,
      data: newNode.data as Record<string, unknown>,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNodes = [...(currentWorkflow.data.nodes || []), workflowNode];
    dispatch(updateCurrentWorkflowNodes(updatedNodes));
  }, [currentWorkflow.data, nodes, setNodes, dispatch]);

  // Show loading state
  if (currentWorkflow.loading === 'loading') {
    return (
      <div className="workflow-editor workflow-editor--loading">
        <div className="workflow-editor__header">
          <h2>Loading...</h2>
        </div>
        <div className="flex items-center justify-center h-full">
          <Loading text="Loading workflow..." size="lg" />
        </div>
      </div>
    );
  }

  // Show error state
  if (currentWorkflow.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card>
          <div className="text-center">
            <p className="text-red-600 mb-4">{currentWorkflow.error}</p>
            <Button onClick={() => navigate('/')} variant="primary">
              Back to List
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show empty state
  if (!currentWorkflow.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card>
          <div className="text-center">
            <p className="text-gray-500 mb-4">No workflow found</p>
            <Button onClick={() => navigate('/')} variant="primary">
              Back to List
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="workflow-editor">
      <div className="workflow-editor__header">
        <div>
          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSave();
                if (e.key === 'Escape') {
                  setTempName(currentWorkflow.data?.name || '');
                  setIsEditingName(false);
                }
              }}
              autoFocus
              className="workflow-editor__title-input"
            />
          ) : (
            <h2
              onClick={() => setIsEditingName(true)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              title="Click to edit"
            >
              {currentWorkflow.data.name}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem', opacity: 0.5 }}>
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </h2>
          )}
          {currentWorkflow.data.description && (
            <p className="workflow-editor__description">{currentWorkflow.data.description}</p>
          )}
        </div>
        <div className="workflow-editor__actions">
          <Button onClick={handleAddNode} size="sm">
            Add Node
          </Button>
        </div>
      </div>

      <div className="workflow-editor__canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{ 
            type: 'smoothstep', 
            animated: true,
            style: { strokeWidth: 2.5 }
          }}
          connectionLineStyle={{ strokeWidth: 2.5, stroke: '#0284c7' }}
          snapToGrid={true}
          snapGrid={[20, 20]}
          minZoom={0.2}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Background variant="dots" gap={20} size={1} />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              if (node.type === 'trigger') return '#10b981';
              if (node.type === 'condition') return '#f59e0b';
              return '#3b82f6';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
          <Panel position="top-right" className="workflow-editor__panel">
            <div className="workflow-editor__info">
              <span>Nodes: {nodes.length}</span>
              <span>Connections: {edges.length}</span>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

const WorkflowEditor: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent />
    </ReactFlowProvider>
  );
};

export default WorkflowEditor;

