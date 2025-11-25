import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserAction, useUserRights } from '../helpers/user-right-helper';
import moment from 'moment';
import { clearStorage } from './storage-utils';

interface RouteGuardProps {
  children: ReactNode;
  formCode: string;
  redirectPath?: string;
  action: UserAction;
  onlyBaCa?: boolean;
}

const isTokenExpired = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return true;
debugger
    // exp is in seconds, compare with current UTC time in seconds
    const nowUtc = moment().utc().toDate().getTime() / 1000;
    return nowUtc >= exp;
  } catch {
    return true;
  }
};

const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  formCode,
  action,
  redirectPath = '/login' ,
  onlyBaCa = false
}) => {
const { hasRight } = useUserRights();

  const [checking, setChecking] = useState(true);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (isTokenExpired()) {
        await clearStorage();
        setRedirect(true);
        return;
      }
      setChecking(false);
    };

    run();
  }, []);

  if (redirect) return <Navigate to={redirectPath} replace />;
  if (checking) return null; // or loading spinner

  // After async check is done:
  if (!formCode && onlyBaCa) return <>{children}</>;

  const isAllowed = hasRight(formCode, action, onlyBaCa);

  return isAllowed ? <>{children}</> : <Navigate to={redirectPath} replace />;
};

export default RouteGuard;