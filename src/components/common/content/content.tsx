import { FC, Fragment, lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import ApplicationSettings from '../../../pages/settings/system/application-settings';
import Templates from '../../../pages/InvoiceDesigner/Templates';
import Settings from '../../../pages/settings/AllSettings/Settings';
import Flex from '../../../pages/inventory/demo-flex';


const AccountSettingsSecurity = lazy(() => import('../../../pages/account-settings/account-settings-security'));
const AccountSettingsPreference = lazy(() => import('../../../pages/account-settings/account-settings-preference'));
const WorkSpaceSettings = lazy(() => import('../../../pages/work-space/workspace-settings'));
const AccountSettingsSessions = lazy(() => import('../../../pages/account-settings/account-settings-sessions'));
const AccountSettingsProfile = lazy(() => import('../../../pages/account-settings/account-settings-profile'));
const WorkspaceSettingsMembers = lazy(() => import('../../../pages/work-space/workspace-settings-members'));
const WorkspaceSettingsSecurity = lazy(() => import('../../../pages/work-space/workspace-settings-security'));
const UserTypes = lazy(() => import('../../../pages/settings/userManagement/user-types'));
const Users = lazy(() => import('../../../pages/settings/userManagement/Users'));
const SystemCounters = lazy(() => import('../../../pages/settings/system/counters'));
const SystemVoucher = lazy(() => import('../../../pages/settings/system/vouchers'));
const FinancialYear = lazy(() => import('../../../pages/settings/system/financial-year'));
const Dashboard = lazy(() => import("../../../pages/dashboards/crm/crm"));
const Reminders = lazy(() => import("../../../pages/settings/system/remainder"));
const InvoiceDesigner = lazy(() => import("../../../pages/InvoiceDesigner/InvoiceDesigner"));
const BranchGrid = lazy(() => import("../../../pages/settings/Administration/branch"));


// Inventory Starts

const InvTransaction = lazy(() => import("../../../pages/inventory/inv-transaction"));

// Inventory End
// Acc Starts
const AccountsMasters = lazy(() => import('../../../pages/accounts/masters/account-groups/account-group'));
const AccountsLedger = lazy(() => import('../../../pages/accounts/masters/account-ledgers/account-ledger'));
const CostCenter = lazy(() => import('../../../pages/accounts/masters/cost center/cost-center'));
// Acc End
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
        <Route path="/user-management/users" element={<Users />} />
        <Route path="/user-management/userstypes" element={<UserTypes />} />
        {/* settings Administer*/}
        <Route path="/administration/branch" element={<BranchGrid/>} />
        {/* settings Systems */}
        <Route path="/system/counters" element={<SystemCounters />} />
        <Route path="/system/vouchers" element={<SystemVoucher />} />
        <Route path="/system/financial-year" element={<FinancialYear />} />
        <Route path="/system/reminders" element={<Reminders />} />
        <Route path="/system/application-settings" element={<ApplicationSettings />} />
        <Route path="settings" element={<Settings />} />

        {/* Inventory Starts */}

        <Route path="sales/new" element={<InvTransaction />} />
        <Route path="vat-sales-invoice" element={<Flex />} />


        {/* Inventory End */}
        {/* Accounts Start */}
        {/* Masters */}
        <Route path="account-masters/account-group" element={<AccountsMasters />} />
        {/* Ledger */}
        <Route path="account-masters/account-ledger" element={<AccountsLedger />} />
        {/* cost center */}
        <Route path="account-masters/cost-center" element={<CostCenter />} />
        {/* Accounts End */}
        {/* Templates starts */}
        <Route path="/templates" element={<Templates />} />
        <Route path="/settings/invoice_designer/:id" element={<InvoiceDesigner />} />
        {/* Templates ends */}

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

