// Main App component

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import ErrorBoundary from './components/ErrorBoundary';
import Routes from './routes';
import './styles/index.less';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Routes />
      </ErrorBoundary>
    </Provider>
  );
};

export default App;

