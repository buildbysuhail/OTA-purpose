import { Navigate } from "react-router-dom";

import DashboardCRM from "../pages/dashboards/crm/crm";
import Login from "../pages/auth/Login";
import { lazy } from "react";
const Settings = lazy(() => import("../pages/settings/AllSettings/Settings"));
const Users = lazy(() => import("../pages/settings/userManagement/Users"));
// const Usertypes = lazy(()=>import("../pages/settings/userManagement/UserTypes"))
const authProtectedRoutes = [
  {
    path: "/dashboard",
    component: <DashboardCRM />,
    allowedFor: "SuperAdmin,Admin,Client",
  },
  // Settings
  { path: "/settings", component: Settings },
  { path: "/settings/preferences", component: Users },
  // { path: "/settings/preferencestype", component: Usertypes },
  // { path: "/settings/preferences/:id", component: PreferencesSection },
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
  { path: "/dashboard", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  // { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  // { path: "/forgot-password", component: <ForgetPasswordPage /> },
  // { path: "/reset-password", component: <PasswordReset /> },
  // { path: "/register", component: <Register /> },
  // { path: "/mailSend", component: <EmailSend /> },
  // { path: "/emailConfirmation", component: <ConfirmEmail /> },
  {
    path: "/",
    exact: true,
    component: <Navigate to="/login" />,
  },
];

export { authProtectedRoutes, publicRoutes };
