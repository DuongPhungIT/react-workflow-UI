// Routes configuration

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './AppLayout';
import WorkflowList from '@/features/WorkflowList';
import WorkflowEditor from '@/features/WorkflowEditor';
import WorkflowBuilder from '@/features/WorkflowBuilder';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <WorkflowList />,
      },
      {
        path: 'workflow/:id',
        element: <WorkflowEditor />,
      },
      {
        path: 'workflow/new',
        element: <WorkflowEditor />,
      },
      {
        path: 'builder',
        element: <WorkflowBuilder />,
      },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}

