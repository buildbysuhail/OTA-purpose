import { FC, Fragment, lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import ApplicationSettings from '../../../pages/settings/system/application-settings';
import Templates from '../../../pages/InvoiceDesigner/Templates';
import Settings from '../../../pages/settings/AllSettings/Settings';
import Flex from '../../../pages/inventory/demo-flex';
import UserActionReport from '../../../pages/settings/system/user-action-report';
import Cash from '../../../pages/accounts/masters/reports/cash';
import ReportList from '../../ERPComponents/reports/reports-list';
import AccountPayableAgingReport from '../../../pages/accounts/masters/reports/account-payable-aging-report';
import AccountReceivableAgingReport from '../../../pages/accounts/masters/reports/account-receivable-aging-report';




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
const NotificationSettings = lazy(() => import('../../../pages/settings/system/notification-settings'));

// Inventory Starts

const InvTransaction = lazy(() => import("../../../pages/inventory/inv-transaction"));

// Inventory End
// Acc Starts
const AccountsMasters = lazy(() => import('../../../pages/accounts/masters/account-groups/account-group'));
const BankCards = lazy(() => import('../../../pages/accounts/masters/bank-cards/bank-cards'));
const AccountsLedger = lazy(() => import('../../../pages/accounts/masters/account-ledgers/account-ledger'));
const CostCenter = lazy(() => import('../../../pages/accounts/masters/cost centre/cost-centre'));
const BranchLedger = lazy(() => import('../../../pages/accounts/masters/branch ledger/branch-ledger'));
const PartyCategory = lazy(() => import('../../../pages/accounts/masters/account-party-category/party-category'));
const PrivilegeCard = lazy(() => import('../../../pages/accounts/masters/account-privilege-card/privilege-card'));
const CurrencyMaster = lazy(() => import('../../../pages/accounts/masters/currency-master/currency-master'));
const RevertBillModifications = lazy(() => import('../../../pages/settings/system/revert-bill-modifications'));
// Acc End

//integration 
const SmsIntegration = lazy(() => import('../../../pages/settings/Integration/sms-integration'));
const EmailIntegration = lazy(() => import('../../../pages/settings/Integration/email-integration'));
const WhatsappIntegration = lazy(() => import('../../../pages/settings/Integration/whatsapp-integration'));

interface ContentProps { }
const loading = (
  <div className="w-full h-full bg-transparent flex items-center justify-center">
    <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
  </div>
);
const Content: FC<ContentProps> = () => {

  const [myClass, setMyClass] = useState("");
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
        <Route path="/administration/branch" element={<BranchGrid />} />
        {/* settings Systems */}
        <Route path="/system/counters" element={<SystemCounters />} />
        <Route path="/system/vouchers" element={<SystemVoucher />} />
        <Route path="/system/financial-year" element={<FinancialYear />} />
        <Route path="/system/reminders" element={<Reminders />} />
        <Route path="/system/user-actions" element={<UserActionReport />} />
        <Route path="/system/application-settings" element={<ApplicationSettings />} />
        <Route path="/system/revert-bill-modifications" element={<RevertBillModifications />} />
        <Route path="/system/notification-settings" element={<NotificationSettings />} />
        <Route path="settings" element={<Settings />} />

        {/* Inventory Starts */}

        <Route path="sales/new" element={<InvTransaction />} />
        <Route path="vat-sales-invoice" element={<Flex />} />


        {/* Inventory End */}
        {/* Accounts Start */}
        {/* Masters */}
        <Route path="account-masters/account-group" element={<AccountsMasters />} />
        <Route path="account-masters/Bank-Cards" element={<BankCards />} />
        <Route path="account-masters/privilege-cards" element={<PrivilegeCard />} />
        <Route path="account-masters/account-ledger" element={<AccountsLedger />} />
        <Route path="account-masters/party-category" element={<PartyCategory />} />
        <Route path="/account-masters/currency-master" element={<CurrencyMaster />} />
        <Route path="/account-masters/cost-center" element={<CostCenter />} />
        <Route path="account-masters/branch-ledgers" element={<BranchLedger />} />
        {/* Accounts End */}
        

        {/* Integration Start */}
        <Route path="/integration/sms" element={<SmsIntegration />} />
        <Route path="/integration/whatsapp" element={<WhatsappIntegration/>} />
        <Route path="/integration/email" element={<EmailIntegration />} />
        {/* Integration End */}
      
        {/* Templates starts */}
        <Route path="/templates" element={<Templates />} />
        
        <Route path="/templates/invoice_designer/*"  element={<FullLayout />}/>
        
        {/* Templates ends */}

        {/* Reports */}
        <Route path="/reports" element={<ReportList />} />
          {/* Reports - Accounts */}
          <Route path="/accounts/cash" element={<Cash />} />
          <Route path="/accounts/payable_aging" element={<AccountPayableAgingReport/>} />     
          <Route path="/accounts/receivable_aging" element={<AccountReceivableAgingReport/>} />   
          <Route path="/accounts/payable_aging_skiptake" element={<AccountPayableAgingReport/>} />     
          <Route path="/accounts/receivable_aging_skiptake" element={<AccountReceivableAgingReport/>} />        
          {/* Reports - Accounts */}
        {/* Reports */}
        {/* <Route path="/*" element={<NotFound />} /> */}
      </Routes>
    </Suspense>
  );
}
export default Content;

