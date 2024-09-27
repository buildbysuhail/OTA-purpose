import { FC, Fragment, lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
const AccountSettingsSecurity = lazy(() => import('../../../pages/account-settings/account-settings-security'));
const AccountSettingsPreference = lazy(() => import('../../../pages/account-settings/account-settings-preference'));
const WorkSpaceSettings = lazy(() => import('../../../pages/work-space/workspace-settings'));
const AccountSettingsSessions = lazy(() => import('../../../pages/account-settings/account-settings-sessions'));
const AccountSettingsProfile = lazy(() => import('../../../pages/account-settings/account-settings-profile'));
const WorkspaceSettingsMembers = lazy(() => import('../../../pages/work-space/workspace-settings-members'));
const WorkspaceSettingsSecurity = lazy(() => import('../../../pages/work-space/workspace-settings-security'));
const Settings = lazy(() => import('../../../pages/settings/AllSettings/Settings'));
const UserTypes = lazy(() => import('../../../pages/settings/userManagement/user-types'));
const CompanyProfile = lazy(() => import('../../../pages/settings/Administration/Company-Profile'));
const Branches = lazy(() => import('../../../pages/settings/Administration/Branches'));
const DeleteInactiveTransactions = lazy(() => import('../../../pages/settings/Administration/delete-inactive-transactions'));
const SystemCounters = lazy(() => import('../../../pages/settings/system/counters'));
const BankPosSettings = lazy(() => import('../../../pages/settings/Administration/bank-pos-settings'));
const SystemVoucher = lazy(() => import('../../../pages/settings/system/vouchers'));
const ImportExport = lazy(() => import('../../../pages/settings/system/import-export'));
const ResetDatabase = lazy(() => import('../../../pages/settings/system/reset-database'));
const Dashboard = lazy(() => import("../../../pages/dashboards/crm/crm"));
interface ContentProps { }
const loading = (
  <div className="w-full h-full bg-transparent flex items-center justify-center">
    <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
  </div>
);
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
          {/* <Route path="/user-management/users" element={<Users />} /> */}
          <Route path="/user-management/userstypes" element={<UserTypes/>} />

          {/* settings Administration */}
          <Route path="/administration/company-profile" element={<CompanyProfile/>} />
          <Route path="administration/branches" element={<Branches/>} />
          <Route path="administration/delete-inactive-transactions" element={<DeleteInactiveTransactions/>} />
          <Route path="administration/bank-pos-settings" element={<BankPosSettings/>} />
          {/* settings Systems */}
          <Route path="settings/system/counters" element={<SystemCounters/>} />
          <Route path="settings/system/vouchers" element={<SystemVoucher/>} />
          <Route path="settings/system/export-import" element={<ImportExport/>} />
          <Route path="settings/system/reset-database"element={<ResetDatabase/>} />
          
         
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

