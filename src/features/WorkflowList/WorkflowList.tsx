// Workflow List component

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import { Workflow } from '@/store/slices/workflowSlice';
import { cn } from '@/utils/classNames';
import './WorkflowList.less';

const WorkflowList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { workflows } = useAppSelector((state) => state.workflow);

  useEffect(() => {
    // Dispatch action to fetch workflows
    dispatch({ type: 'workflow/fetchWorkflows' });
  }, [dispatch]);

  const handleSelectWorkflow = (workflow: Workflow) => {
    navigate(`/workflow/${workflow.id}`);
  };

  if (workflows.loading === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading text="Loading workflows..." />
      </div>
    );
  }

  if (workflows.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card>
          <p className="text-red-600">{workflows.error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="workflow-list">
      <div className="workflow-list__header">
        <div>
          <h1>Workflows</h1>
          <p>Manage your automation workflows</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/builder')}
        >
          Create New Workflow
        </Button>
      </div>

      <div className="workflow-list__grid">
        {workflows.data?.map((workflow) => (
          <Card
            key={workflow.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleSelectWorkflow(workflow)}
          >
            <div className="workflow-list__card">
              <h3>{workflow.name}</h3>
              {workflow.description && <p>{workflow.description}</p>}
              <div className="workflow-list__card-footer">
                <span
                  className={cn(
                    'status-badge',
                    `status-badge--${workflow.status}`
                  )}
                >
                  {workflow.status}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectWorkflow(workflow);
                  }}
                >
                  Open
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {(!workflows.data || workflows.data.length === 0) && (
          <Card className="workflow-list__empty">
            <p>No workflows found</p>
            <Button
              className="mt-4"
              onClick={() =>
                dispatch({
                  type: 'workflow/createWorkflow',
                  payload: { name: 'New Workflow' },
                })
              }
            >
              Create Workflow
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkflowList;

