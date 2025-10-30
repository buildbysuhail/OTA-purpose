import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { UserAction, useUserRights } from '../helpers/user-right-helper';

interface RouteGuardProps {
  children: ReactNode;
  formCode: string;
  redirectPath?: string;
  action: UserAction;
  onlyBaCa?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  formCode, 
  action, 
  redirectPath = '/login' ,
  onlyBaCa = false
}) => {
  const { hasRight } = useUserRights();
    return <>{children}</>;
  // Early return if no formCode
  if (!formCode) {
    return <>{children}</>;
  }

  const isAllowed = hasRight(formCode, action,onlyBaCa);
  
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }


};

export default RouteGuard;