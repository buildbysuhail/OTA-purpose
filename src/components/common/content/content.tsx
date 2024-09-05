import { FC, Fragment, lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import AccountSettings from '../../../pages/account-settings/account-settings';
import AccountSettingsSecurity from '../../../pages/account-settings/account-settings-security';
import AccountSettingsPreference from '../../../pages/account-settings/account-settings-preference';
import WorkSpaceSettings from '../../../pages/work-space/workspace-settings';

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
          <Route path="/account-settings/profile/avatar" element={<AccountSettings />} />
          <Route path="/account-settings/profile/basic-information" element={<AccountSettings />} />
          <Route path="/account-settings/profile/email-address" element={<AccountSettings />} />
          <Route path="/account-settings/profile/phone-number" element={<AccountSettings />} />
          <Route path="/account-settings/security/password" element={<AccountSettingsSecurity />} />
          <Route path="/account-settings/preferences/theme" element={<AccountSettingsPreference />} />
          <Route path="/account-settings/preferences/language" element={<AccountSettingsPreference />} />
          <Route path="/account-settings/preferences/system-preferences" element={<AccountSettingsPreference />} />

          <Route path="/workspace-settings/profile/workspace-logo" element={<WorkSpaceSettings />} />
          <Route path="/workspace-settings/profile/workspace-basic-information" element={<WorkSpaceSettings />} />
          <Route path="/workspace-settings/profile/primary-email" element={<WorkSpaceSettings />} />
          <Route path="/workspace-settings/profile/business-number" element={<WorkSpaceSettings />} />
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

