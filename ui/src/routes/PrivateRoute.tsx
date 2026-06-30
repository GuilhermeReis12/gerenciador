import React from 'react';
import { Navigate } from 'react-router-dom';
import { AppShell } from 'components/layout/AppShell';
import { isAuthenticated } from 'utils/auth';

const PrivateRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell />;
};

export default PrivateRoute;
