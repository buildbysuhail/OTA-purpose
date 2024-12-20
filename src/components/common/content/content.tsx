import { FC, lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ApplicationSettings from "../../../pages/settings/system/application-settings";
import ApplicationSettingsNew from "../../../pages/settings/system/application-settings-new";
import ApplicationSettingsVirtual from "../../../pages/settings/system/app-new/application-settings-virtual";
import Templates from "../../../pages/InvoiceDesigner/Templates";
import Settings from "../../../pages/settings/AllSettings/Settings";
import UserActionReport from "../../../pages/settings/system/user-action-report";
import ReportList from "../../ERPComponents/reports/reports-list";
import AccountPayableAgingReport from "../../../pages/accounts/reports/account-payable-aging-report";
import AccountReceivableAgingReport from "../../../pages/accounts/reports/account-receivable-aging-report";
import TemplateDesignerLayout from "../layout/template-designer-layout";

import LedgerReport from "../../../pages/accounts/reports/ledger-report";
import CashBookSummary from "../../../pages/accounts/reports/cashBook/cash-book-summary";
import DayBookDetailed from "../../../pages/accounts/reports/dayBook/day-book-detailed";
import DayBookSummary from "../../../pages/accounts/reports/dayBook/dayBookSummary/day-book-summary";
import PaymentReport from "../../../pages/accounts/reports/payment-report";
import CollectionReport from "../../../pages/accounts/reports/collection-report";
import TransactionReport from "../../../pages/accounts/reports/transaction-report";
import AccountsHistoryReport from "../../../pages/accounts/reports/transactionHistory/accountsHistory/accounts-history-report";
import DailySummary from "../../../pages/accounts/reports/dailySummary/dailySummary/daily-summary";
import BillwiseProfit from "../../../pages/accounts/reports/billwise-profit/billwise-profit";
import PartySummaryBasicInfo from "../../../pages/accounts/reports/partywise-summary/party-summary-basic-info";
import OutstandingAccountPayableReport from "../../../pages/accounts/reports/outStandingReports/outstanding-account-payable-report";
import OutstandingAccountReceivableReport from "../../../pages/accounts/reports/outStandingReports/outstanding-account-receivable-report";
import OutstandingAccountPayableAgingReport from "../../../pages/accounts/reports/outStandingReportsAging/outstanding-account-payable-aging-report";
import OutstandingAccountReceivableAgingReport from "../../../pages/accounts/reports/outStandingReportsAging/outstanding-account-receivable-aging-report";
import TrialBalance from "../../../pages/accounts/reports/trialBalance/trial-balance";
import BalanceSheet from "../../../pages/accounts/reports/balanceSheet/balace-sheet";
import InventoryHistoryReport from "../../../pages/accounts/reports/transactionHistory/InventoryHistory/inventory-history-report";
import BillwiseProfitGlobal from "../../../pages/accounts/reports/billwise-profit/billwise-profit-global";

const AccountSettingsSecurity = lazy(
  () => import("../../../pages/account-settings/account-settings-security")
);
const AccountSettingsPreference = lazy(
  () => import("../../../pages/account-settings/account-settings-preference")
);
const WorkSpaceSettings = lazy(
  () => import("../../../pages/work-space/workspace-settings")
);
const AccountSettingsSessions = lazy(
  () => import("../../../pages/account-settings/account-settings-sessions")
);
const AccountSettingsProfile = lazy(
  () => import("../../../pages/account-settings/account-settings-profile")
);
const WorkspaceSettingsMembers = lazy(
  () => import("../../../pages/work-space/workspace-settings-members")
);
const WorkspaceSettingsSecurity = lazy(
  () => import("../../../pages/work-space/workspace-settings-security")
);
const UserTypes = lazy(
  () => import("../../../pages/settings/userManagement/user-types")
);
const Users = lazy(
  () => import("../../../pages/settings/userManagement/Users")
);
const SystemCounters = lazy(
  () => import("../../../pages/settings/system/counters")
);
const SystemVoucher = lazy(
  () => import("../../../pages/settings/system/vouchers")
);
const FinancialYear = lazy(
  () => import("../../../pages/settings/system/financial-year")
);
const Dashboard = lazy(() => import("../../../pages/dashboards/crm/crm"));
const Reminders = lazy(
  () => import("../../../pages/settings/system/remainder")
);
const BranchGrid = lazy(
  () => import("../../../pages/settings/Administration/branch")
);
const NotificationSettings = lazy(
  () => import("../../../pages/settings/system/notification-settings")
);
const CounterSettings = lazy(
  () => import("../../../pages/settings/system/counter-settings")
);

// Inventory Starts

const InvTransactionMobile = lazy(
  () => import("../../../pages/inventory/inv-transaction-mobile")
);

// Inventory End
// Acc Starts
const AccountsMasters = lazy(
  () => import("../../../pages/accounts/masters/account-groups/account-group")
);
const BankCards = lazy(
  () => import("../../../pages/accounts/masters/bank-cards/bank-cards")
);
const Upi = lazy(() => import("../../../pages/accounts/masters/upi/upi"));
const AccountsLedger = lazy(
  () => import("../../../pages/accounts/masters/account-ledgers/account-ledger")
);
const CostCenter = lazy(
  () => import("../../../pages/accounts/masters/cost centre/cost-centre")
);
const BranchLedger = lazy(
  () => import("../../../pages/accounts/masters/branch ledger/branch-ledger")
);
const PartyCategory = lazy(
  () =>
    import(
      "../../../pages/accounts/masters/account-party-category/party-category"
    )
);
const PrivilegeCard = lazy(
  () =>
    import(
      "../../../pages/accounts/masters/account-privilege-card/privilege-card"
    )
);
const CurrencyMaster = lazy(
  () =>
    import("../../../pages/accounts/masters/currency-master/currency-master")
);
const RevertBillModifications = lazy(
  () => import("../../../pages/settings/system/revert-bill-modifications")
);
const ChartOfAccounts = lazy(
  () =>
    import(
      "../../../pages/accounts/masters/chart-of-accounts/chart-of-accounts"
    )
);
const Customers = lazy(
  () => import("../../../pages/accounts/masters/parties/customers")
);
const Suppliers = lazy(
  () => import("../../../pages/accounts/masters/parties/suppliers")
);
const CustomerSupplierLedger = lazy(
  () =>
    import(
      "../../../pages/accounts/masters/customer/supplier/ledger/customer-supplier-ledger"
    )
);
// Acc End

//side menu account
const AccTransactionMobile = lazy(
  () => import("../../../pages/accounts/transactions/acc-transaction-mobile")
);
//integration
const SmsIntegration = lazy(
  () => import("../../../pages/settings/Integration/sms-integration")
);
const EmailIntegration = lazy(
  () => import("../../../pages/settings/Integration/email-integration")
);
const WhatsappIntegration = lazy(
  () => import("../../../pages/settings/Integration/whatsapp-integration")
);
const Test = lazy(() => import("../../../pages/test"));
// const AccountGroupTypeTest = lazy(() => import('../../../pages/accountgrouptest'));
const TotalSummary = lazy(() => import("../../../pages/total-summary"));

// Inventory Masters
const ProductGroup = lazy(
  () => import("../../../pages/inventory/masters/product-group/product-group")
);
const ProductCategory = lazy(
  () =>
    import("../../../pages/inventory/masters/product-category/product-category")
);
const Brands = lazy(
  () => import("../../../pages/inventory/masters/brands/brands")
);
const PriceCategory = lazy(
  () => import("../../../pages/inventory/masters/price-category/price-category")
);
const UnitOfMeasure = lazy(
  () =>
    import("../../../pages/inventory/masters/unit-of-meassure/unit-of-measure")
);
const Vehicles = lazy(
  () => import("../../../pages/inventory/masters/vehicles/vehicles")
);
const WareHouse = lazy(
  () => import("../../../pages/inventory/masters/warehouse/warehouse")
);
const TaxCategory = lazy(
  () => import("../../../pages/inventory/masters/tax-category/tax-category")
);
const SalesmanRoute = lazy(
  () => import("../../../pages/inventory/masters/salesman-route/salesman-route")
);
const Schemes = lazy(
  () => import("../../../pages/inventory/masters/schemes/schemes")
);
const SalesRoute = lazy(
  () => import("../../../pages/inventory/masters/sales-route/sales-route")
);
const Section = lazy(
  () => import("../../../pages/inventory/masters/section/section")
);
const GroupCategory = lazy(
  () => import("../../../pages/inventory/masters/group-category/group-category")
);
const SpecialSchemes = lazy(
  () =>
    import("../../../pages/inventory/masters/special-schemes/special-schemes")
);
const ListedProductPrices = lazy(
  () =>
    import(
      "../../../pages/inventory/masters/listed-product-prices/listed-product-prices"
    )
);

//transaction
const PostDatedCheques = lazy(
  () => import("../../../pages/accounts/transactions/acc-post-dated-cheques")
);

// Inventory Reports
import PurchaseSummaryReport from "../../../pages/inventory/reports/purchase-summary-report/purchase-summary-report";
import PurchaseRegisterReport from "../../../pages/inventory/reports/purchase-register-report/purchase-register-report";
import PartyWiseReport from "../../../pages/inventory/reports/party-wise-report/party-wise-report";
import AccTransaction from "../../../pages/accounts/transactions/acc-transaction";
import GstrReport from "../../../pages/inventory/reports/GSTR1Filter/gstr-report";
import DailySummaryGlobal from "../../../pages/accounts/reports/dailySummary/daily-summary-global";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Countries } from "../../../redux/slices/user-session/reducer";
import ProfitAndLossReport from "../../../pages/accounts/reports/profitAndLoss/profit-and-loss-report";
import CashSummary from "../../../pages/accounts/reports/cashSummary/cash-summary";
import CashSummaryLedgerwise from "../../../pages/accounts/reports/cashSummary/cash-summary-ledgerwise";
import TrialBalancePeriodwiseReportFilter from "../../../pages/accounts/reports/trialBalance/trial-balance-report-filter-periodwise";
import TrialBalancePeriodwise from "../../../pages/accounts/reports/trialBalance/trial-balance-detailed";
import ProfitAndLossDetailedReport from "../../../pages/accounts/reports/profitAndLoss/profit-and-loss-report-detailed";
import BalancesheetVertical from "../../../pages/accounts/reports/balanceSheet/balancesheet-vertical";
import RouteGuard from "../../../utilities/route-guard";
import { UserAction } from "../../../helpers/user-right-helper";
import { transactionRoutes } from "./transaction-routes";
import AccTransactionFormContainer from "../../../pages/accounts/transactions/acc-transaction-container";

const PriceList = lazy(
  () =>
    import(
      "../../../pages/inventory/reports/price-list/price-list-report"
    )
);
const StockLedger = lazy(
  () =>
    import(
      "../../../pages/inventory/reports/stock-ledger/stock-ledger-report"
    )
);
const DailyBalanceAmount = lazy(
  () =>
    import(
      "../../../pages/inventory/reports/daily-balance/daily-balance-report"
    )
);
const OpeningStock = lazy(
  () =>
    import(
      "../../../pages/inventory/reports/opening-stock/opening-stock-report"
    )
);
const StockFlow = lazy(
  () =>
    import(
      "../../../pages/inventory/reports/stock-flow/stock-flow-report"
    )
);
const TransactionAnalysisReport = lazy(
  () =>
    import(
      "../../../pages/inventory/reports/transaction-analysis-report/transaction-analysis-report"
    )
);

interface ContentProps {}
const loading = (
  <div className="w-full h-full bg-transparent flex items-center justify-center">
    <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
  </div>
);
const Content: FC<ContentProps> = () => {
  const [myClass, setMyClass] = useState("");
  const userSession = useSelector((state: RootState) => state.UserSession);
  return (
    <Suspense fallback={loading}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile/avatar" element={<AccountSettingsProfile />} />
        <Route
          path="/profile/basic-information"
          element={<AccountSettingsProfile />}
        />
        <Route
          path="/profile/email-address"
          element={<AccountSettingsProfile />}
        />
        <Route
          path="/profile/phone-number"
          element={<AccountSettingsProfile />}
        />
        <Route
          path="/security/password"
          element={<AccountSettingsSecurity />}
        />
        <Route
          path="/preferences/theme"
          element={<AccountSettingsPreference />}
        />
        <Route
          path="/preferences/language"
          element={<AccountSettingsPreference />}
        />
        <Route
          path="/preferences/system-preferences"
          element={<AccountSettingsPreference />}
        />
        <Route path="/sessions" element={<AccountSettingsSessions />} />

        <Route path="/profile/workspace-logo" element={<WorkSpaceSettings />} />
        <Route
          path="/profile/workspace-basic-information"
          element={<WorkSpaceSettings />}
        />
        <Route path="/profile/primary-email" element={<WorkSpaceSettings />} />
        <Route
          path="/profile/business-number"
          element={<WorkSpaceSettings />}
        />
        <Route
          path="/security/deleteWorkspace"
          element={<WorkspaceSettingsSecurity />}
        />
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
        <Route
          path="/system/application-settings"
          element={<ApplicationSettingsVirtual />}
        />
        <Route
          path="/system/revert-bill-modifications"
          element={<RevertBillModifications />}
        />
        <Route
          path="/system/notification-settings"
          element={<NotificationSettings />}
        />
        <Route path="/system/counter-settings" element={<CounterSettings />} />
        <Route path="settings" element={<Settings />} />

        {/* Integration Start */}
        <Route path="/integration/sms" element={<SmsIntegration />} />
        <Route path="/integration/whatsapp" element={<WhatsappIntegration />} />
        <Route path="/integration/email" element={<EmailIntegration />} />
        <Route path="/integration/test" element={<Test />} />
        {/* <Route path="/integration/account_group_test" element={<AccountGroupTypeTest />} /> */}
        <Route path="/integration/total-summary" element={<TotalSummary />} />
        {/* Integration End */}

        {/* Templates starts */}
        <Route path="/templates" element={<Templates />} />

        <Route
          path="/templates/invoice_designer/*"
          element={<TemplateDesignerLayout />}
        />

        {/* Templates ends */}
        {/* Inventory Starts */}

        <Route path="sales/new" element={<InvTransactionMobile />} />

        {/* Inventory End */}
        {/* Accounts Start */}
        {/* Accounts Masters */}
        <Route
          path="account-masters/account-group"
          element={<AccountsMasters />}
        />
        <Route path="account-masters/Bank-Cards" element={<BankCards />} />
        <Route path="account-masters/upi" element={<Upi />} />
        <Route
          path="account-masters/privilege-cards"
          element={<PrivilegeCard />}
        />
        <Route
          path="account-masters/account-ledger"
          element={<AccountsLedger />}
        />
        <Route
          path="account-masters/party-category"
          element={<PartyCategory />}
        />
        <Route
          path="/account-masters/currency-master"
          element={<CurrencyMaster />}
        />
        <Route path="/account-masters/cost-center" element={<CostCenter />} />
        <Route
          path="account-masters/branch-ledgers"
          element={<BranchLedger />}
        />
        <Route
          path="account-masters/chart-of-accounts"
          element={<ChartOfAccounts />}
        />
        <Route path="account-masters/suppliers" element={<Suppliers />} />
        <Route path="account-masters/customers" element={<Customers />} />
        <Route
          path="/account-masters/customer-supplier-ledger"
          element={<CustomerSupplierLedger />}
        />
        {/* Accounts Masters End */}

        {/* Accounts Transaction */}
        {/* <Route
            key={index}
            path={route.path}
            element={
              <RouteGuard formCode={route.formCode} action={route.action}>
                <AccTransaction
                  voucherType={route.voucherType}
                  transactionType={route.transactionType}
                  formCode={route.formCodeAcc}
                  voucherPrefix={route.voucherPrefix}
                  formType={route.formType}
                  title={route.title}
                  drCr={route.drCr}
                  voucherNo={route.voucherNo}
                />
              </RouteGuard>
            }
          /> */}
        {transactionRoutes.map((route, index) => (
          <>
            <Route
              key={index}
              path={`/accounts/transactions/${route.transactionType}`}
              element={
                <RouteGuard formCode={route.formCode} action={route.action}>
                  <AccTransactionFormContainer
                    voucherType={route.voucherType}
                    transactionType={route.transactionType}
                    formCode={route.formCode}
                    voucherPrefix={""}
                    formType={route.formType}
                    title={route.title}
                    drCr={route.drCr}
                    voucherNo={0}
                  />
                </RouteGuard>
              }
            />
            <Route
              key={index}
              path={`/accounts/transactions/${route.transactionType}/:voucherNo`}
              element={
                <RouteGuard formCode={route.formCode} action={route.action}>
                  <AccTransactionFormContainer
                    voucherType={route.voucherType}
                    transactionType={route.transactionType}
                    formCode={route.formCode}
                    voucherPrefix={""}
                    formType={route.formType}
                    title={route.title}
                    drCr={route.drCr}
                    voucherNo={0}
                  />
                </RouteGuard>
              }
            />
          </>
        ))}
        <Route
          path="accounts/transactions/post-dated-cheques"
          element={<PostDatedCheques />}
        />

        {/* Accounts Masters End */}

        {/* Reports */}
        <Route path="/reports" element={<ReportList />} />
        {/* Reports - Accounts */}
        <Route path="/accounts/ledger_report" element={<LedgerReport />} />
        <Route path="/accounts/cash_book" element={<CashBookSummary />} />
        <Route
          path="/accounts/day_book_detailed"
          element={<DayBookDetailed />}
        />
        <Route path="/accounts/day_book_summary" element={<DayBookSummary />} />
        <Route path="/accounts/payment_report" element={<PaymentReport />} />
        <Route
          path="/accounts/collection_report"
          element={<CollectionReport />}
        />
        <Route path="/accounts/cash_summary" element={<CashSummary />} />
        <Route
          path="/accounts/cash_summary_ledgerwise"
          element={<CashSummaryLedgerwise />}
        />
        <Route
          path="/accounts/transaction_report"
          element={<TransactionReport />}
        />
        <Route
          path="/accounts/transaction_history_accounts"
          element={<AccountsHistoryReport />}
        />
        <Route
          path="/accounts/transaction_history_inventory"
          element={<InventoryHistoryReport />}
        />
        <Route
          path="/accounts/daily_summary_report"
          element={
            userSession.countryId === Countries.India ? (
              <DailySummaryGlobal />
            ) : (
              <DailySummary />
            )
          }
        />
        <Route
          path="/accounts/billwise_profit"
          element={
            userSession.countryId === Countries.India ? (
              <BillwiseProfitGlobal />
            ) : (
              <BillwiseProfit />
            )
          }
        />
        <Route
          path="/accounts/partywise_summary"
          element={<PartySummaryBasicInfo />}
        />
        <Route
          path="/accounts/outstanding_payable"
          element={<OutstandingAccountPayableReport />}
        />
        <Route
          path="/accounts/outstanding_receivable"
          element={<OutstandingAccountReceivableReport />}
        />
        <Route
          path="/accounts/outstanding_aging_payable"
          element={<OutstandingAccountPayableAgingReport />}
        />
        <Route
          path="/accounts/outstanding_aging_receivable"
          element={<OutstandingAccountReceivableAgingReport />}
        />
        <Route path="/accounts/trial_balance" element={<TrialBalance />} />
        <Route
          path="/accounts/trial_balance_period_wise"
          element={<TrialBalancePeriodwise />}
        />
        <Route
          path="/accounts/profit_and_loss"
          element={<ProfitAndLossReport />}
        />
        <Route
          path="/accounts/profit_and_loss_detailed"
          element={<ProfitAndLossDetailedReport />}
        />
        <Route path="/accounts/balance_sheet" element={<BalanceSheet />} />
        <Route
          path="/accounts/balance_sheet_vertical"
          element={<BalancesheetVertical />}
        />
        <Route
          path="/accounts/payable_aging"
          element={<AccountPayableAgingReport />}
        />
        <Route
          path="/accounts/receivable_aging"
          element={<AccountReceivableAgingReport />}
        />
        {/* Reports - Accounts */}

        {/* Reports - Inventory */}
        <Route
          path="/inventory/purchase_summary_report"
          element={<PurchaseSummaryReport />}
        />
        <Route
          path="/inventory/purchase_register_report"
          element={<PurchaseRegisterReport />}
        />
        <Route
          path="/inventory/party_wise_report"
          element={<PartyWiseReport />}
        />
        <Route path="/inventory/price_list_report" element={<PriceList />} />
        <Route
          path="/inventory/stock_ledger_report"
          element={<StockLedger />}
        />
        <Route
          path="/inventory/daily_balance_report"
          element={<DailyBalanceAmount />}
        />
        <Route
          path="/inventory/opening_stock_report"
          element={<OpeningStock />}
        />
        <Route path="/inventory/stock_flow_report" element={<StockFlow />} />
        <Route
          path="/inventory/transaction_analysis_report"
          element={<TransactionAnalysisReport />}
        />

        {/* Reports - Tax*/}
        {/* <Route path="/inventory/purchase_summary_report" element={<PurchaseSummaryReport />} /> */}
        {/* Reports */}
        {/* <Route path="/*" element={<NotFound />} /> */}

        {/* side menu */}
        {/* <Route path="cash-payments" element={<AccTransactionMobile />} /> */}

        {/* Inventory Masters */}
        <Route
          path="/inventory-masters/product-group"
          element={<ProductGroup />}
        />
        <Route
          path="/inventory-masters/product-category"
          element={<ProductCategory />}
        />
        <Route path="/inventory-masters/brands" element={<Brands />} />
        <Route
          path="/inventory-masters/price-category"
          element={<PriceCategory />}
        />
        <Route
          path="/inventory-masters/unit-of-measure"
          element={<UnitOfMeasure />}
        />
        <Route path="/inventory-masters/vehicles" element={<Vehicles />} />
        <Route path="/inventory-masters/warehouse" element={<WareHouse />} />
        <Route
          path="/inventory-masters/tax-category"
          element={<TaxCategory />}
        />
        <Route
          path="/inventory-masters/salesman-route"
          element={<SalesmanRoute />}
        />
        <Route path="/inventory-masters/section" element={<Section />} />
        <Route path="/inventory-masters/schemes" element={<Schemes />} />
        <Route path="/inventory-masters/sales-route" element={<SalesRoute />} />
        <Route
          path="/inventory-masters/group-category"
          element={<GroupCategory />}
        />
        <Route
          path="/inventory-masters/special-schemes"
          element={<SpecialSchemes />}
        />
        <Route
          path="/inventory-masters/listed-product-prices"
          element={<ListedProductPrices />}
        />
      </Routes>
    </Suspense>
  );
};
export default Content;
