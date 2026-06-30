import React from 'react';
import AppRoutes from 'routes/AppRoutes';
import 'styles/global.css';
import { AppThemeProvider } from 'app/providers/AppThemeProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from 'error/ErrorBoundary';

const App: React.FC = () => {
  return (
    <AppThemeProvider>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </AppThemeProvider>
  );
};

export default App;
