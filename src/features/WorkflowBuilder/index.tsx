// Workflow Builder component using React Flow

import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MarkerType,
} from '@xyflow/react';
import {
  ThunderboltOutlined,
  CodeOutlined,
  RobotOutlined,
  GlobalOutlined,
  BranchesOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import '@xyflow/react/dist/style.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setSelectedNode,
  updateCurrentWorkflowNodes,
  updateCurrentWorkflowConnections,
  updateCurrentWorkflowName,
  WorkflowNode,
  WorkflowConnection,
} from '@/store/slices/workflowSlice';
import Button from '@/components/Button';
import Card from '@/components/Card';
import NodeConfigurationSidebar from '@/components/NodeConfigurationSidebar';
import {
  TriggerNode,
  ActionNode,
  ConditionNode,
  DelayNode,
  LoopNode,
  ErrorNode,
} from '@/features/workflow/nodes';
import './styles.less';



const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// Generate random color for node (fallback - các node components mới đã có màu mặc định)
const generateRandomColor = (): string => {
  const colors = [
    '#a78bfa', // purple
    '#60a5fa', // blue
    '#34d399', // green
    '#fbbf24', // yellow
    '#fb7185', // pink
    '#818cf8', // indigo
    '#f59e0b', // amber
    '#10b981', // emerald
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Node types mapping - sử dụng các node components mới
const nodeTypes = {
  default: ActionNode, // Fallback to ActionNode
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
  loop: LoopNode,
  error: ErrorNode,
};

// Helper to determine node color consistently
const getNodeColor = (node: Node | WorkflowNode) => {
  const label = node.data?.label;
  const type = node.type;
  
  // Trigger is always Violet
  if (type === 'trigger' || label === 'Webhook') return '#8b5cf6';
  
  // Action types
  if (label === 'Output') return '#10b981';
  if (label === 'Script') return '#14b8a6';
  if (label === 'LLM') return '#ec4899';
  if (label === 'HTTP') return '#3b82f6';
  
  // Other types
  if (type === 'condition' || label === 'Switch') return '#f59e0b';
  if (type === 'delay') return '#8b5cf6';
  if (type === 'loop') return '#ec4899';
  if (type === 'error') return '#ef4444';
  
  // Fallback
  return (node.data?.color as string) || '#3b82f6';
};

const WorkflowBuilderContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentWorkflow, selectedNode } = useAppSelector((state) => state.workflow);
  const { fitView, getNode } = useReactFlow();
  const hasFittedView = useRef(false);
  const [selectedEdgeId, setSelectedEdgeId] = React.useState<string | null>(null);
  const [isLocked, setIsLocked] = React.useState<boolean>(false);
  const [showMiniMap, setShowMiniMap] = React.useState<boolean>(true);
  // Track node bắt đầu kéo connection
  const connectionStartNodeRef = useRef<string | null>(null);

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

  // Initialize with empty workflow
  useEffect(() => {
    if (!currentWorkflow.data) {
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
  }, [currentWorkflow.data, dispatch]);

  // Initialize with empty arrays, will be updated when workflow loads
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  
  // Keep nodes ref for debounced updates
  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  
  // Debounce timeout ref
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update edges when workflow loads
  useEffect(() => {
    if (currentWorkflow.data && currentWorkflow.loading === 'succeeded') {
      // Update nodes
      if (currentWorkflow.data.nodes && currentWorkflow.data.nodes.length > 0) {
        const newNodes = currentWorkflow.data.nodes.map((node) => ({
          id: node.id,
          type: node.type || 'default',
          position: node.position,
          data: {
            ...node.data,
            color: (node.data as { color?: string }).color || generateRandomColor(),
          },
          draggable: !isLocked,
          selectable: true,
        }));
        setNodes(newNodes);
      } else {
        setNodes([]);
      }

      // Update edges
      if (currentWorkflow.data.connections && currentWorkflow.data.connections.length > 0) {
        const newEdges = currentWorkflow.data.connections.map((conn) => {
          // Find source node to get color
          const sourceNode = currentWorkflow.data?.nodes?.find(n => n.id === conn.source);
          const edgeColor = sourceNode ? getNodeColor(sourceNode) : '#6b7280';
          
          return {
            id: conn.id,
            source: conn.source,
            target: conn.target,
            sourceHandle: conn.sourceHandle || undefined,
            targetHandle: conn.targetHandle || undefined,
            type: 'smoothstep',
            animated: true,
            style: { strokeWidth: 1.5, stroke: edgeColor },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: edgeColor,
            },
            selected: conn.id === selectedEdgeId,
          };
        });
        setEdges(newEdges);
      } else {
        setEdges([]);
      }
      
      // ... (fitView logic)
    }
  }, [currentWorkflow.data, currentWorkflow.loading, setNodes, setEdges, fitView, selectedEdgeId]);

  // Update nodes draggable state when lock changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        draggable: !isLocked,
      }))
    );
  }, [isLocked, setNodes]);

  // Sync nodes back to Redux store - debounced for smooth performance
  const handleNodesChange = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      // Don't allow changes if locked
      if (isLocked) {
        return;
      }
      
      onNodesChange(changes);
      // Only update Redux when drag ends, not during dragging
      if (Array.isArray(changes)) {
        const hasPositionChange = changes.some((change) => (change as { type?: string }).type === 'position');
        const hasDragEnd = changes.some((change) => (change as { type?: string; dragging?: boolean }).type === 'drag' && (change as { dragging?: boolean }).dragging === false);
        
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
    [onNodesChange, dispatch, isLocked]
  );
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      if (edgesUpdateTimeoutRef.current) {
        clearTimeout(edgesUpdateTimeoutRef.current);
      }
    };
  }, []);

  // Sync edges back to Redux store - debounced for performance
  const edgesUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleEdgesChange = useCallback(
    (changes: Parameters<typeof onEdgesChange>[0]) => {
      onEdgesChange(changes);
      // Debounce edge updates to avoid unnecessary Redux dispatches
      if (edgesUpdateTimeoutRef.current) {
        clearTimeout(edgesUpdateTimeoutRef.current);
      }
      edgesUpdateTimeoutRef.current = setTimeout(() => {
        const updatedConnections: WorkflowConnection[] = edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle || undefined,
          targetHandle: edge.targetHandle || undefined,
        }));
        dispatch(updateCurrentWorkflowConnections(updatedConnections));
      }, 200);
    },
    [edges, onEdgesChange, dispatch]
  );

  // Track khi bắt đầu kéo connection
  const onConnectStart = useCallback(
    (_event: MouseEvent | TouchEvent, params: { nodeId: string | null; handleId: string | null; handleType: string | null }) => {
      // Lưu node bắt đầu kéo
      connectionStartNodeRef.current = params.nodeId || null;
      console.log('Connection started from node:', params.nodeId, 'handle:', params.handleId);
    },
    []
  );

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      // Initialize variables immediately to avoid ReferenceError
      let finalSource = params.source;
      let finalTarget = params.target;
      let finalSourceHandle = params.sourceHandle;
      let finalTargetHandle = params.targetHandle;
      let edgeColor = '#6b7280';

      try {
        // Don't allow connections if locked
        if (isLocked) {
          return;
        }
        
        console.log('onConnect triggered:', params);

        // Đảm bảo source và target đúng - không đảo ngược
        if (!params.source || !params.target) {
          return; // Không tạo connection nếu thiếu source hoặc target
        }
        
        // Sử dụng node bắt đầu kéo để xác định đúng hướng
        // Note: connectionStartNodeRef is a ref, so .current is safe to access
        const startNodeId = connectionStartNodeRef.current;
        
        // Nếu có thông tin node bắt đầu kéo, sử dụng nó để xác định đúng hướng
        if (startNodeId) {
          // Node bắt đầu kéo phải là source (đầu ra)
          if (startNodeId === params.target) {
            // React Flow đã đảo ngược, cần swap lại
            finalSource = params.target;
            finalTarget = params.source;
            finalSourceHandle = params.targetHandle;
            finalTargetHandle = params.sourceHandle;
            
            console.log('Swapped connection based on start node');
          }
          
          // Reset sau khi sử dụng
          connectionStartNodeRef.current = null;
        } else {
          // Fallback: Kiểm tra handle type nếu không có thông tin node bắt đầu
          const sourceHandleId = params.sourceHandle || '';
          const targetHandleId = params.targetHandle || '';
          const sourceIsInput = sourceHandleId.includes('input');
          const targetIsOutput = targetHandleId.includes('output');
          
          // Nếu bị đảo ngược (source là input hoặc target là output)
          if (sourceIsInput || targetIsOutput) {
            // Swap lại
            finalSource = params.target;
            finalTarget = params.source;
            finalSourceHandle = params.targetHandle;
            finalTargetHandle = params.sourceHandle;
            
            console.log('Swapped connection based on handle types');
          }
        }
        
        // Tạo connection với hướng đúng
        const connection: Connection = {
          source: finalSource,
          target: finalTarget,
          sourceHandle: finalSourceHandle,
          targetHandle: finalTargetHandle,
        };

        // Get source node color for the edge
        // Use nodes state directly for safety
        if (finalSource) {
           const sourceNode = nodes.find(n => n.id === finalSource);
           if (sourceNode) {
             try {
               edgeColor = getNodeColor(sourceNode);
             } catch (err) {
               console.error('Error getting node color:', err);
             }
           }
        }
        
        console.log('Creating edge with color:', edgeColor);

        const newEdge = addEdge(
          {
            ...connection,
            type: 'smoothstep',
            animated: true,
            style: { strokeWidth: 1.5, stroke: edgeColor },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: edgeColor,
            },
          } as Edge,
          edges
        );
        
        setEdges(newEdge);
        
        const updatedConnections: WorkflowConnection[] = newEdge.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle || undefined,
          targetHandle: edge.targetHandle || undefined,
        }));
        
        dispatch(updateCurrentWorkflowConnections(updatedConnections));
      } catch (error) {
        console.error('Error in onConnect:', error);
      }
    },
    [edges, setEdges, dispatch, isLocked, nodes]
  );


  // Handle node selection
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedEdgeId(null); // Clear edge selection when node is clicked
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

  // Handle edge selection
  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setSelectedEdgeId(edge.id);
      dispatch(setSelectedNode(null)); // Clear node selection
    },
    [dispatch]
  );

  // Delete selected edge
  const handleDeleteEdge = useCallback(() => {
    if (!selectedEdgeId) return;

    const updatedEdges = edges.filter((edge) => edge.id !== selectedEdgeId);
    setEdges(updatedEdges.map((edge) => ({
      ...edge,
      selected: false,
    })));

    const updatedConnections: WorkflowConnection[] = updatedEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || undefined,
      targetHandle: edge.targetHandle || undefined,
    }));
    dispatch(updateCurrentWorkflowConnections(updatedConnections));
    setSelectedEdgeId(null);
  }, [selectedEdgeId, edges, setEdges, dispatch]);

  // Update edges selection when selectedEdgeId changes
  useEffect(() => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) => ({
        ...edge,
        selected: edge.id === selectedEdgeId,
      }))
    );
  }, [selectedEdgeId, setEdges]);

  // Handle keyboard delete key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedEdgeId) {
        event.preventDefault();
        handleDeleteEdge();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedEdgeId, handleDeleteEdge]);

  // Add new node
  const handleAddNode = useCallback((type: string) => {
    if (!currentWorkflow.data || isLocked) return;

    // Default colors và labels cho từng node type (sẽ được override bởi node components)

    // Map user-facing types to internal node types
    let nodeType = 'action';
    if (type === 'Webhook') nodeType = 'trigger';
    if (type === 'Switch') nodeType = 'condition'; 
    if (type === 'Script' || type === 'LLM' || type === 'HTTP' || type === 'Output') nodeType = 'action';

    // Default colors và labels cho từng node type (sẽ được override bởi node components)
    const nodeConfigs: Record<string, { label: string; color: string; subtitle: string; fields?: Array<{ label: string; value: string }> }> = {
      trigger: { 
        label: 'Start', 
        color: '#3b82f6', 
        subtitle: 'Webhook',
        fields: [{ label: 'Path', value: '/webhook/incoming' }]
      },
      action: { label: 'Action', color: '#3b82f6', subtitle: 'action' },
      condition: { label: 'Condition', color: '#f59e0b', subtitle: 'if/else' },
      delay: { label: 'Delay', color: '#8b5cf6', subtitle: 'wait 1s' },
      loop: { label: 'Loop', color: '#ec4899', subtitle: 'for loop' },
      error: { label: 'Error Handler', color: '#ef4444', subtitle: 'catch error' },
    };

    const config = nodeConfigs[nodeType] || nodeConfigs.action;

    const newNode: Node = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: { 
        label: type, 
        type: nodeType,
        subtitle: config.subtitle,
        color: config.color,
        ...(config.fields && { fields: config.fields }),
        ...(nodeType === 'trigger' && { triggerType: 'webhook', path: '/webhook/incoming' }),
      },
      draggable: true,
      selectable: true,
    };

    setNodes([...nodes, newNode]);

    const workflowNode: WorkflowNode = {
      id: newNode.id,
      type: nodeType,
      position: newNode.position,
      data: newNode.data as Record<string, unknown>,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNodes = [...(currentWorkflow.data.nodes || []), workflowNode];
    dispatch(updateCurrentWorkflowNodes(updatedNodes));
  }, [currentWorkflow.data, nodes, setNodes, dispatch, isLocked]);

  // Save workflow
  const handleSave = useCallback(() => {
    if (!currentWorkflow.data) return;
    
    dispatch({
      type: 'workflow/updateWorkflow',
      payload: currentWorkflow.data,
    });
    
    // Navigate to workflow list after save
    navigate('/');
  }, [currentWorkflow.data, dispatch, navigate]);

  // Delete selected node


  // Update node // Add new node
  const handleUpdateNode = useCallback((updatedNode: WorkflowNode) => {
    if (!currentWorkflow.data) return;

    // Update in Redux store
    const updatedNodes = currentWorkflow.data.nodes.map((node) =>
      node.id === updatedNode.id ? updatedNode : node
    );
    dispatch(updateCurrentWorkflowNodes(updatedNodes));
    dispatch(setSelectedNode(updatedNode));

    // Update React Flow nodes
    setNodes((nds) =>
      nds.map((node) =>
        node.id === updatedNode.id
          ? {
              ...node,
              type: updatedNode.type,
              data: updatedNode.data,
            }
          : node
      )
    );
  }, [currentWorkflow.data, dispatch, setNodes]);

  // Close sidebar
  const handleCloseSidebar = useCallback(() => {
    dispatch(setSelectedNode(null));
  }, [dispatch]);

  if (!currentWorkflow.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card>
          <div className="text-center">
            <p className="text-gray-500 mb-4">Initializing workflow builder...</p>
          </div>
        </Card>
      </div>
    );
  }

  console.log('nodes====', nodes);

  return (
    <div className="workflow-builder">
      <div className="workflow-builder__header">
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
              className="workflow-builder__title-input"
            />
          ) : (
            <h2 
              onClick={() => setIsEditingName(true)} 
              className="workflow-builder__title cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2"
              title="Click to edit"
            >
              {currentWorkflow.data?.name || 'Build New Workflow'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </h2>
          )}
          <p className="workflow-builder__description">Create your workflow by adding nodes and connecting them</p>
        </div>
        <div className="workflow-builder__actions">
          {selectedEdgeId && (
            <Button onClick={handleDeleteEdge} size="sm" variant="danger">
              Delete Connection
            </Button>
          )}
          <Button onClick={handleSave} size="sm" variant="primary">
            Save Workflow
          </Button>
        </div>
      </div>

      <div className="workflow-builder__body">
        <div className="workflow-builder__canvas">
          <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={() => {
            setSelectedEdgeId(null);
            dispatch(setSelectedNode(null));
          }}
          // @ts-expect-error - NodeTypes compatibility with custom node components
          nodeTypes={nodeTypes}
          nodesDraggable={!isLocked}
          nodesConnectable={!isLocked}
          edgesFocusable={true}
          defaultEdgeOptions={{ 
            type: 'smoothstep', 
            animated: true,
            style: { strokeWidth: 1.5, stroke: '#6b7280' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#6b7280',
            }
          }}
          connectionLineStyle={{ strokeWidth: 1, stroke: '#6b7280' }}
          snapToGrid={true}
          snapGrid={[20, 20]}
          minZoom={0.2}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          {/* @ts-expect-error - Background variant type mismatch in @xyflow/react */}
          <Background variant="dots" gap={20} size={1} />
          <Controls onInteractiveChange={() => {
            setIsLocked((prev) => {
              const newState = !prev;
              return newState;
            });
          }}/>
          <Panel position="top-right" className="workflow-builder__panel">
            <div className="workflow-builder__info">
              <span>Nodes: {nodes.length}</span>
              <span>Connections: {edges.length}</span>
              <div style={{ width: 1, height: 16, backgroundColor: 'var(--border-primary)', margin: '0 0.5rem' }} />
              <button 
                onClick={() => setShowMiniMap(!showMiniMap)}
                title={showMiniMap ? "Hide MiniMap" : "Show MiniMap"}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                {showMiniMap ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
          </Panel>
          {showMiniMap && (
            <MiniMap 
              nodeColor={(node) => {
                if (node.type === 'trigger') return '#10b981';
                if (node.type === 'condition') return '#f59e0b';
                return '#3b82f6';
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          )}
          </ReactFlow>
          
          {/* Floating action buttons - Horizontal List */}
          <div className="workflow-builder__floating-actions">
            {[
              { type: 'Webhook', icon: <ThunderboltOutlined />, title: 'Add Webhook', color: '#8b5cf6' },
              { type: 'Script', icon: <CodeOutlined />, title: 'Add Script', color: '#14b8a6' },
              { type: 'LLM', icon: <RobotOutlined />, title: 'Add LLM', color: '#ec4899' },
              { type: 'HTTP', icon: <GlobalOutlined />, title: 'Add HTTP Request', color: '#3b82f6' },
              { type: 'Switch', icon: <BranchesOutlined />, title: 'Add Switch', color: '#f59e0b' },
              { type: 'Output', icon: <ExportOutlined />, title: 'Add Output', color: '#10b981' },
            ].map((item) => (
              <div key={item.type} className="workflow-builder__action-item" title={item.title}>
                <button
                  className="workflow-builder__action-btn"
                  onClick={() => handleAddNode(item.type)}
                  type="button"
                  style={{ 
                    borderColor: 'var(--border-primary)', 
                    color: item.color 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = item.color;
                    e.currentTarget.style.backgroundColor = `${item.color}10`; // 10% opacity
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                  }}
                >
                  {item.icon}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Node Configuration Sidebar */}
        {selectedNode && (
          <NodeConfigurationSidebar
            node={selectedNode}
            onClose={handleCloseSidebar}
            onUpdate={handleUpdateNode}
          />
        )}
      </div>
    </div>
  );
};

const WorkflowBuilder: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderContent />
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;

