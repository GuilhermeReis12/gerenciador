import React from 'react';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';
import DefaultColorTheme from './Themes/ColorTheme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './error/ErrorBoundary';

const App: React.FC = () => {
  return (
    <DefaultColorTheme>
      <div className="App">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
        <ToastContainer />
      </div>
    </DefaultColorTheme>
  );
};

export default App;
