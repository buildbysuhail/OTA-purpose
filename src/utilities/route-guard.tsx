import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { UserAction, useUserRights } from '../helpers/user-right-helper';

interface RouteGuardProps {
  children: ReactNode;
  formCode: string;
  redirectPath?: string;
  action: UserAction;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  formCode, 
  action, 
  redirectPath = '/login' 
}) => {
  const { hasRight } = useUserRights();
  
  // Early return if no formCode
  if (!formCode) {
    return <>{children}</>;
  }

  const isAllowed = hasRight(formCode, action);
  
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;