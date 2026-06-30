import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useCapabilities } from '../hooks/useCapabilities';

type CapabilityRouteProps = {
  check: (capabilities: ReturnType<typeof useCapabilities>['capabilities']) => boolean;
  redirectTo?: string;
};

const CapabilityRoute: React.FC<CapabilityRouteProps> = ({ check, redirectTo = '/home' }) => {
  const { capabilities, loading } = useCapabilities();

  if (loading) {
    return null;
  }

  if (!check(capabilities)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default CapabilityRoute;
