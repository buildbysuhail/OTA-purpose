import { Navigate } from "react-router-dom";

import DashboardCRM from "../pages/dashboards/crm/crm";
import Login from "../pages/auth/Login";


const authProtectedRoutes = [
  { path: "/app/dashboard", component: <DashboardCRM />, allowedFor:'SuperAdmin,Admin,Client' },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/app/dashboard" />,
  },
  { path: "*", component: <Navigate to="/app/dashboard" /> },
  { path: "/dashboard", component: <Navigate to="/app/dashboard" /> },
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