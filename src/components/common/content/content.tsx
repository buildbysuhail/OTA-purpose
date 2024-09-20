import { FC, Fragment, lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import AccountSettingsSecurity from '../../../pages/account-settings/account-settings-security';
import AccountSettingsPreference from '../../../pages/account-settings/account-settings-preference';
import WorkSpaceSettings from '../../../pages/work-space/workspace-settings';
import AccountSettingsSessions from '../../../pages/account-settings/account-settings-sessions';
import AccountSettingsProfile from '../../../pages/account-settings/account-settings-profile';
import WorkspaceSettingsMembers from '../../../pages/work-space/workspace-settings-members';
import WorkspaceSettingsSecurity from '../../../pages/work-space/workspace-settings-security';
import Users from '../../../pages/settings/userManagement/Users';
import Settings from '../../../pages/settings/AllSettings/Settings';
import UserTypes from '../../../pages/settings/userManagement/UserTypes';

interface ContentProps { }
const loading = (
  <div className="w-full h-full bg-transparent flex items-center justify-center">
    <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
  </div>
);
const Dashboard = lazy(() => import("../../../pages/dashboards/crm/crm"));
const Content: FC<ContentProps> = () => {
  
  return (
    <Suspense fallback={loading}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile/avatar" element={<AccountSettingsProfile />} />
          <Route path="/profile/basic-information" element={<AccountSettingsProfile />} />
          <Route path="/profile/email-address" element={<AccountSettingsProfile />} />
          <Route path="/profile/phone-number" element={<AccountSettingsProfile />} />
          <Route path="/security/password" element={<AccountSettingsSecurity />} />
          <Route path="/preferences/theme" element={<AccountSettingsPreference />} />
          <Route path="/preferences/language" element={<AccountSettingsPreference />} />
          <Route path="/preferences/system-preferences" element={<AccountSettingsPreference />} />
          <Route path="/sessions" element={<AccountSettingsSessions />} />

          <Route path="/profile/workspace-logo" element={<WorkSpaceSettings />} />
          <Route path="/profile/workspace-basic-information" element={<WorkSpaceSettings />} />
          <Route path="/profile/primary-email" element={<WorkSpaceSettings />} />
          <Route path="/profile/business-number" element={<WorkSpaceSettings />} />
          <Route path="/security/deleteWorkspace" element={<WorkspaceSettingsSecurity />} />
          <Route path="/members" element={<WorkspaceSettingsMembers />} />
          {/* settings user */}
          <Route path="/user-management/users" element={<Users />} />
          {/* <Route path="/settings/#/user-management/userstypes" element={<UserTypes/>} /> */}
          <Route path="settings" element={<Settings />} />
          {/* {routes.map((route, idx) => {
            if (route.path) {
              return <Route key={idx} path={route.path} element={<route.component />} />;
            }
          })} */}

          {/* <Route path="/*" element={<NotFound />} /> */}
        </Routes>
      </Suspense>
  );
}
export default Content;

