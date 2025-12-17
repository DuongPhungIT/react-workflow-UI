// App Layout component with header

import { Outlet, Link, useLocation } from 'react-router-dom';
import Button from '@/components/Button';
import './AppLayout.less';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isWorkflowPage = location.pathname.startsWith('/workflow');

  return (
    <div className="app-layout">
      <header className="app-layout__header">
        <div className="app-layout__container">
          <div className="app-layout__header-content">
            <div className="app-layout__header-left">
              <Link to="/" className="app-layout__logo">
                Workflow UI
              </Link>
            </div>
            <div className="app-layout__header-right">
              {isWorkflowPage && (
                <Link to="/">
                  <Button variant="outline" size="sm">
                    Back to List
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="app-layout__main">
        <div className="app-layout__container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;

