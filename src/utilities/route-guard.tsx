import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { UserAction, useUserRights } from '../helpers/user-right-helper';

interface RouteGuardProps {
  children: ReactNode;
  formCode: string;
  redirectPath?: string;
  action: UserAction;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, formCode, action, redirectPath = '/login' }) => {
  const {hasRight} = useUserRights();
  
  if (formCode != undefined) {
    const isAllowed = hasRight(formCode,action)
    if(isAllowed != true)
    {
      return <Navigate to={redirectPath} replace />;
    }
    
  }
  return <>{children}</>;
};

export default RouteGuard;