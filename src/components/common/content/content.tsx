import { FC, lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ApplicationSettingsVirtual from "../../../pages/settings/system/app-new/application-settings-virtual";
import Templates from "../../../pages/InvoiceDesigner/Templates";
import Settings from "../../../pages/settings/AllSettings/Settings";
import UserActionReport from "../../../pages/settings/system/user-action-report";
import ReportList from "../../ERPComponents/reports/reports-list";
import TemplateDesignerLayout from "../layout/template-designer-layout";
import LedgerReport from "../../../pages/accounts/reports/ledger-report";
import CashBookSummary from "../../../pages/accounts/reports/cashBook/cash-book-summary";
import DayBookDetailed from "../../../pages/accounts/reports/dayBook/day-book-detailed";
import DayBookSummary from "../../../pages/accounts/reports/dayBook/dayBookSummary/day-book-summary";
import PaymentReport from "../../../pages/accounts/reports/payment-report";
import TransactionReport from "../../../pages/accounts/reports/transactionReport/transaction-report";
import AccountsHistoryReport from "../../../pages/accounts/reports/transactionHistory/accountsHistory/accounts-history-report";
import BillwiseProfit from "../../../pages/accounts/reports/billwise-profit/billwise-profit";
import OutstandingAccountPayableReport from "../../../pages/accounts/reports/outStandingReports/outstanding-account-payable-report";
import OutstandingAccountReceivableReport from "../../../pages/accounts/reports/outStandingReports/outstanding-account-receivable-report";
import OutstandingAccountPayableAgingReport from "../../../pages/accounts/reports/outStandingReportsAging/outstanding-account-payable-aging-report";
import OutstandingAccountReceivableAgingReport from "../../../pages/accounts/reports/outStandingReportsAging/outstanding-account-receivable-aging-report";
import TrialBalance from "../../../pages/accounts/reports/trialBalance/trial-balance";
import BalanceSheet from "../../../pages/accounts/reports/balanceSheet/balace-sheet";
import InventoryHistoryReport from "../../../pages/accounts/reports/transactionHistory/InventoryHistory/inventory-history-report";
import BillwiseProfitGlobal from "../../../pages/accounts/reports/billwise-profit/billwise-profit-global";

const AccountSettingsSecurity = lazy(() => import("../../../pages/account-settings/account-settings-security"));
const AccountSettingsPreference = lazy(() => import("../../../pages/account-settings/account-settings-preference"));
const WorkSpaceSettings = lazy(() => import("../../../pages/work-space/workspace-settings"));
const AccountSettingsSessions = lazy(() => import("../../../pages/account-settings/account-settings-sessions"));
const AccountSettingsProfile = lazy(() => import("../../../pages/account-settings/account-settings-profile"));
const WorkspaceSettingsMembers = lazy(() => import("../../../pages/work-space/workspace-settings-members"));
const WorkspaceSettingsSecurity = lazy(() => import("../../../pages/work-space/workspace-settings-security"));
const UserTypes = lazy(() => import("../../../pages/settings/userManagement/user-types"));
const Users = lazy(() => import("../../../pages/settings/userManagement/Users"));
const SystemCounters = lazy(() => import("../../../pages/settings/system/counters"));
const SystemVoucher = lazy(() => import("../../../pages/settings/system/vouchers"));
const FinancialYear = lazy(() => import("../../../pages/settings/system/financial-year"));
const Dashboard = lazy(() => import("../../../pages/dashboards/crm/crm"));
const Reminders = lazy(() => import("../../../pages/settings/system/remainder"));
const BranchGrid = lazy(() => import("../../../pages/settings/Administration/branch"));
const NotificationSettings = lazy(() => import("../../../pages/settings/system/notification-settings"));
const CounterSettings = lazy(() => import("../../../pages/settings/system/counter-settings"));

// Inventory Starts
// const InvTransactionMobile = lazy(
//   () => import("../../../pages/inventory/inv-transaction-mobile")
// );
// Inventory End
// Acc Starts

const AccountsMasters = lazy(() => import("../../../pages/accounts/masters/account-groups/account-group"));
const BankCards = lazy(() => import("../../../pages/accounts/masters/bank-cards/bank-cards"));
const Upi = lazy(() => import("../../../pages/accounts/masters/upi/upi"));
const AccountsLedger = lazy(() => import("../../../pages/accounts/masters/account-ledgers/account-ledger"));
const CostCenter = lazy(() => import("../../../pages/accounts/masters/cost centre/cost-centre"));
const BranchLedger = lazy(() => import("../../../pages/accounts/masters/branch ledger/branch-ledger"));
const PartyCategory = lazy(() => import("../../../pages/accounts/masters/account-party-category/party-category"));
const PrivilegeCard = lazy(() => import("../../../pages/accounts/masters/account-privilege-card/privilege-card"));
const CurrencyMaster = lazy(() => import("../../../pages/accounts/masters/currency-master/currency-master"));
const RevertBillModifications = lazy(() => import("../../../pages/settings/system/revert-bill-modifications"));
const ChartOfAccounts = lazy(() => import("../../../pages/accounts/masters/chart-of-accounts/chart-of-accounts"));
const Customers = lazy(() => import("../../../pages/accounts/masters/parties/customers"));
const Suppliers = lazy(() => import("../../../pages/accounts/masters/parties/suppliers"));
const CustomerSupplierLedger = lazy(() => import("../../../pages/accounts/masters/customer/supplier/ledger/customer-supplier-ledger"));
// Acc End

//side menu account
const AccTransactionMobile = lazy(() => import("../../../pages/accounts/transactions/acc-transaction-mobile"));
//integration
const SmsIntegration = lazy(() => import("../../../pages/settings/Integration/sms-integration"));
const EmailIntegration = lazy(() => import("../../../pages/settings/Integration/email-integration"));
const WhatsappIntegration = lazy(() => import("../../../pages/settings/Integration/whatsapp-integration"));
const Test = lazy(() => import("../../../pages/test"));
// const AccountGroupTypeTest = lazy(() => import('../../../pages/accountgrouptest'));
const TotalSummary = lazy(() => import("../../../pages/total-summary"));
const ShortkeysSettings = lazy(() => import("../../../pages/settings/Integration/shortkeysSettings"));
const TestInputButton = lazy(() => import("../../../pages/test-input-button"));
const AccTransactionGrid = lazy(() => import("../../../pages/accounts/transactions/acc-transacton-grid"));
const TransactionGrid = lazy(() => import("../../../pages/inventory/transactions/purchase/transacton-grid"));

// Inventory Masters
const Products = lazy(() => import("../../../pages/inventory/masters/products/products"));
const ProductGroup = lazy(() => import("../../../pages/inventory/masters/product-group/product-group"));
const ProductCategory = lazy(() => import("../../../pages/inventory/masters/product-category/product-category"));
const Brands = lazy(() => import("../../../pages/inventory/masters/brands/brands"));
const PriceCategory = lazy(() => import("../../../pages/inventory/masters/price-category/price-category"));
const UnitOfMeasure = lazy(() => import("../../../pages/inventory/masters/unit-of-meassure/unit-of-measure"));
const Vehicles = lazy(() => import("../../../pages/inventory/masters/vehicles/vehicles"));
const WareHouse = lazy(() => import("../../../pages/inventory/masters/warehouse/warehouse"));
const TaxCategory = lazy(() => import("../../../pages/inventory/masters/tax-category/tax-category"));
const SalesmanRoute = lazy(() => import("../../../pages/inventory/masters/salesman-route/salesman-route"));
const Schemes = lazy(() => import("../../../pages/inventory/masters/schemes/schemes"));
const SchemeSettingsSpecial = lazy(() => import("../../../pages/inventory/masters/schemes-settings/scheme-settings-special"));
const SchemeSettingsDiscount = lazy(() => import("../../../pages/inventory/masters/schemes-settings/scheme-settings-discount"));
const SalesRoute = lazy(() => import("../../../pages/inventory/masters/sales-route/sales-route"));
const Section = lazy(() => import("../../../pages/inventory/masters/section/section"));
const GroupCategory = lazy(() => import("../../../pages/inventory/masters/group-category/group-category"));
const SpecialSchemes = lazy(() => import("../../../pages/inventory/masters/special-schemes/special-schemes"));
const ListedProductPrices = lazy(() => import("../../../pages/inventory/masters/listed-product-prices/listed-product-prices"));
//transaction
const PostDatedCheques = lazy(() => import("../../../pages/accounts/transactions/acc-post-dated-cheques"));
// Inventory Reports
import PartyWiseReport from "../../../pages/inventory/reports/party-wise-report/party-wise-report";
import DailySummaryGlobal from "../../../pages/accounts/reports/dailySummary/daily-summary-global";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Countries } from "../../../redux/slices/user-session/reducer";
import ProfitAndLossReport from "../../../pages/accounts/reports/profitAndLoss/profit-and-loss-report";
import CashSummary from "../../../pages/accounts/reports/cashSummary/cash-summary";
import CashSummaryLedgerwise from "../../../pages/accounts/reports/cashSummary/cash-summary-ledgerwise";
import TrialBalancePeriodwise from "../../../pages/accounts/reports/trialBalance/trial-balance-detailed";
import ProfitAndLossDetailedReport from "../../../pages/accounts/reports/profitAndLoss/profit-and-loss-report-detailed";
import BalancesheetVertical from "../../../pages/accounts/reports/balanceSheet/balancesheet-vertical";
import RouteGuard from "../../../utilities/route-guard";
import { UserAction } from "../../../helpers/user-right-helper";
import { TransactionBase, transactionRoutes } from "./transaction-routes";
import AccTransactionFormContainer from "../../../pages/accounts/transactions/acc-transaction-container";
import PartySummaryMaster from "../../../pages/accounts/reports/partywise-summary/party-summary-master";
import DailySummaryMaster from "../../../pages/accounts/reports/dailySummary/daily-summary-master";
import IncomeReport from "../../../pages/accounts/reports/incomeexpense/income-report";
import IncomeReportDetailed from "../../../pages/accounts/reports/incomeexpense/income-report-detailed";
import ExpenseReport from "../../../pages/accounts/reports/incomeexpense/expense-report";
import ExpenseReportDetailed from "../../../pages/accounts/reports/incomeexpense/expense-report-detailed";
import CollectionReport from "../../../pages/accounts/reports/collection-report";
import BankFlowReport from "../../../pages/accounts/reports/CashFlowBankFlow/bank-flow-report";
import CashFlowReport from "../../../pages/accounts/reports/CashFlowBankFlow/rpt-cash-flow-report";
import IncomExpenseStatement from "../../../pages/accounts/reports/incomeexpense/income-expense-statement";
import BankStatementReport from "../../../pages/accounts/reports/bank-statement-report";
import BankReconciliation from "../../../pages/accounts/transactions/acc-bank-reconciliation";
import ProductSummaryMaster from "../../../pages/inventory/reports/product-summary/product-summary-master";
import StockTransfer from "../../../pages/inventory/reports/stock-transfer-report/stock-transfer";
import DamageStock from "../../../pages/inventory/reports/damage-stock-report/damage-stock";
import ExcessStock from "../../../pages/inventory/reports/excess-stock-report/excess-stock";
import ShortageStock from "../../../pages/inventory/reports/shortage-stock-report/shortage-stock";
import BranchTransferOut from "../../../pages/inventory/reports/branch-transfer-out-report/branch-tranfer-out";
import TransactionFormContainer from "../../../pages/inventory/transactions/purchase/transaction-container";
import urls from "../../../redux/urls";
import ItemWiseSummaryReport from "../../../pages/inventory/reports/itemwise-summary-report/itemwise-summary";
import CreditPurchaseSummaryReport from "../../../pages/inventory/reports/credit-purchase-summary-report/credit-purchase-summary-report";
import DailyStatementAllReport from "../../../pages/inventory/reports/daily-statement-report/daily-statement-all-report ";
import PurchaseOrderTransitReport from "../../../pages/inventory/reports/Purchase-order-transit-report/Purchase-order-transit-report";
import PurchaseTaxReport from "../../../pages/inventory/reports/tax-reports-ksa/Purchase-Tax-report";
import PurchaseTaxGSTDailySummary from "../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-daily-summary-report";
import PurchaseTaxGSTMonthlySummary from "../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-monthly-summary-report";
import PurchaseTaxGSTRegisterFormat from "../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-register-format-report";
import PurchaseTaxGSTAdvRegisterFormat from "../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-adv-register-format-report";
import PurchaseTaxGSTDetailed from "../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-detailed-report";
import PurchaseTaxGSTTaxwise from "../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-taxwise-report";
import PurchaseTaxGSTTaxwiseWithHSN from "../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-taxwise-with-hsn-report";
import PurchaseReturnTaxGSTSalesAndReturn from "../../../pages/inventory/reports/purchase-return-tax-gst-reports/purchase-return-tax-gst-sales-and-return-report";
import VatReturnForm from "../../../pages/inventory/reports/tax-reports-ksa/vat-return-form/Vat-Return-Form";
import BranchTransferIn from "../../../pages/inventory/reports/branch-transfer-in-report/branch-tranfer-in";
import BranchTransferSummaryOut from "../../../pages/inventory/reports/branch-transfer-summary-out-report/branch-tranfer-summary-out";
import BranchTransferSummaryIn from "../../../pages/inventory/reports/branch-transfer-summary-in-report/branch-tranfer-summary-in";
import SummaryReport from "../../../pages/inventory/reports/summary-report/summary-report";
import RegisterReport from "../../../pages/inventory/reports/register-report/register-report";
import VatReturnFormArabic from "../../../pages/inventory/reports/tax-reports-ksa/vat-return-form/Vat-Return-Form-arabic";
import TaxReportSummary from "../../../pages/inventory/reports/purchase-tax-report-summary/purchase-tax-report-summary";
import TaxReportDetailed from "../../../pages/inventory/reports/purchase-tax-report-detailed/purchase-tax-report-detailed";
import SalesAndSalesReturn from "../../../pages/inventory/reports/sales-and-sales-return-report/sales-and-sales-return";
import DaywiseSummaryWithProfit from "../../../pages/inventory/reports/daywise-summary-with-profit-report/daywise-summary-with-profit";
import GroupwiseSalesSummaryDevexpress from "../../../pages/inventory/reports/groupwise-sales-summary/groupwise-sales-summary-devexpress";
import { GroupwiseSalesSummaryDevexpressFilterInitialState } from "../../../pages/inventory/reports/groupwise-sales-summary/groupwise-sales-summary-devexpress-filter";
import GroupwiseSalesSummary from "../../../pages/inventory/reports/groupwise-sales-summary/groupwise-sales-summary";
import { GroupwiseSalesSummaryFilterInitialState } from "../../../pages/inventory/reports/groupwise-sales-summary/groupwise-sales-summary-filter";
import SalesmanwiseSalesAndCollection from "../../../pages/inventory/reports/salesman-wise-sales-and-collection-report/salesman-wise-sales-and-collection";
import NonInvoicedGoodsDelivery from "../../../pages/inventory/reports/non-invoiced-goods-delivery-report/non-invoiced-goods-delivery";
import PendingOrderReport from "../../../pages/inventory/reports/pending-order-report/pending-order";
import PromotionalSalesReport from "../../../pages/inventory/reports/promotional-sales-report/promotional-sales";
import GroupedBrandwiseSales from "../../../pages/inventory/reports/grouped-brandwise-sales-report/grouped-brandwise-sales";
import PartyMonthwiseSummaryReport from "../../../pages/inventory/reports/Party-monthwise-purchase-summary-report/Party-monthwise-purchase-summary-report";
import CouponReports from "../../../pages/inventory/reports/coupon-report/coupon-report";
import SchemeWiseSales from "../../../pages/inventory/reports/scheme-wise-sales-report/scheme-wise-sales";
import SalesTax from "../../../pages/inventory/reports/tax-reports-ksa/sales-tax";
import KsaEInvoiceReportSummary from "../../../pages/inventory/reports/tax-reports-ksa/ksa-e-invoice-report/ksa-e-invoice-summary.tsx";
import KsaEInvoiceReportDetailed from "../../../pages/inventory/reports/tax-reports-ksa/ksa-e-invoice-report/ksa-e-invoice-detailed";
import StockSummary from "../../../pages/inventory/reports/stock-summary-report/stock-summary";
import ExpiryReport from "../../../pages/inventory/reports/expiry-report/expiry-report";
import InventorySummaryReport from "../../../pages/inventory/reports/inventory-summary-report/inventory-summary-report";
import ServiceReport from "../../../pages/inventory/reports/service-report/service-report";
import SalesmanIncentiveReport from "../../../pages/inventory/reports/salesman-incentive-report/salesman-incentive-report";
import PrivilegeCardReport from "../../../pages/inventory/reports/privilege-card-report/privilege-card";
import GSTR1B2B from "../../../pages/inventory/reports/GSTR1/gstr1-b2b";
import GSTR1B2CLarge from "../../../pages/inventory/reports/GSTR1/gstr1-b2c-large";
import GSTR1B2CSmall from "../../../pages/inventory/reports/GSTR1/gstr1-b2c-small";
import GSTR1CDNR from "../../../pages/inventory/reports/GSTR1/gstr1-cdnr";
import GSTR1CDNUR from "../../../pages/inventory/reports/GSTR1/gstr1-cdnur";
import GSTR1HSNSummary from "../../../pages/inventory/reports/GSTR1/gstr1-summaryOfHSN";
import GSTR1Docs from "../../../pages/inventory/reports/GSTR1/gstr1-docs";
import GSTR3BReport from "../../../pages/inventory/reports/GSTR3B/gstr3b";
import TaxCategoryIndia from "../../../pages/inventory/masters/tax-category-india/tax-category-india";
import TcsCategory from "../../../pages/inventory/masters/tcs-category/tcs-category";
import ProductPricesIndia from "../../../pages/inventory/masters/product-prices/products-price-india";
import ProductPricesGCC from "../../../pages/inventory/masters/product-prices/products-price-gcc";
import NetSalesReport from "../../../pages/inventory/reports/net-sales-report/net-sales";
import GeneralMaster from "../../../pages/inventory/masters/general-master";
import SalesTransferMonthWiseSummaryReport from "../../../pages/inventory/reports/sales-transfer-monthWise-summary/sales-transfer-monthwise-summary-report";
import DailyStatementReport from "../../../pages/inventory/reports/daily-statement-report/daily-statement-report";
import GridId from "../../../redux/gridId";
import BranchInventoryRequestPendingOrder from "../../../pages/inventory/reports/branch-inventory-request-pending-order-report/branch-inventory-request-pending-order";
import DiagnosisReport from "../../../pages/inventory/reports/diagnosis-report/diagnosis-report";
import InventoryStatusReport from "../../../pages/inventory/reports/inventory-status-report/inventory-status";
import PrintDetails from "../../../pages/inventory/reports/print-details-report/print-details";
import RouteWiseSalesAndCollection from "../../../pages/inventory/reports/routewise-sales-and-collection-report/routewise-sales-and-collection";
import VoidReport from "../../../pages/inventory/reports/void-report/void-report";
import CounterReport from "../../../pages/inventory/reports/counter-report/counter-report";
import DiagnosisReportZeroRateProductlist from "../../../pages/inventory/reports/diagnosis-report/diagnosis-report-zero-rate-productlist";
import DiagnosisReportPostDatedTransactions from "../../../pages/inventory/reports/diagnosis-report/diagnosis-report-post-dated-transactions";
import DiagnosisReportSalesPriceLessThanLPCost from "../../../pages/inventory/reports/diagnosis-report/diagnosis-report-sales-price-less-than-lp-cost";
import DiagnosisReportSalesPriceLessthanPurchasePrice from "../../../pages/inventory/reports/diagnosis-report/diagnosis-report-sales-price-less-than-purchase-price";
import DiagnosisReportSalesPriceLessthanMSP from "../../../pages/inventory/reports/diagnosis-report/diagnosis-report-sales-price-less-than-msp";
import DiagnosisReportSalesPriceGreaterthanMRP from "../../../pages/inventory/reports/diagnosis-report/diagnosis-report-sales-price-greater-than-mrp";
import CustomerVisitLastVisit from "../../../pages/inventory/reports/customer-visit-last-visit-report/customer-visit-last-visit-report";
import CustomerVisitTotalVisit from "../../../pages/inventory/reports/customer-visit-total-visit-report/customer-visit-total-visit-report";
import DiscountReportCollection from "../../../pages/inventory/reports/discount_report_collection-report/discount_report_collection-report";
import DiscountReportInventory from "../../../pages/inventory/reports/discount_report_inventory-report/discount_report_inventory-report";
import FOCRegisterReport from "../../../pages/inventory/reports/foc-register-report/foc-register-report";
import ItemUsedForService from "../../../pages/inventory/reports/item_used_for_service-report/item_used_for_service-report";
import LPOReport from "../../../pages/inventory/reports/lpo_report/lpo_report";
import AccTransactionFormContainerView from "../../../pages/accounts/transactions/acc-transaction-View-container";
import { SearchProvider } from "../../../pages/accounts/transactions/search-context.tsx";
import { ReportsMenuItems } from "../sidebar/sidemenu/reports-routes";

const PriceList = lazy(() => import("../../../pages/inventory/reports/price-list/price-list-report"));
const StockLedger = lazy(() => import("../../../pages/inventory/reports/stock-ledger/stock-ledger-report"));
const DailyBalanceAmount = lazy(() => import("../../../pages/inventory/reports/daily-balance/daily-balance-report"));
const OpeningStock = lazy(() => import("../../../pages/inventory/reports/stock-journal-report/stock-journal"));
const StockFlow = lazy(() => import("../../../pages/inventory/reports/stock-flow/stock-flow-report"));
const TransactionAnalysisReport = lazy(() => import("../../../pages/inventory/reports/transaction-analysis-report/transaction-analysis-report"));

interface ContentProps { }
const loading = (
  <div className="w-full h-full bg-transparent flex items-center justify-center">
    <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
  </div>
);

const Content: FC<ContentProps> = () => {
  const [myClass, setMyClass] = useState("");
  const userSession = useSelector((state: RootState) => state.UserSession);
  const clientSession = useSelector((state: RootState) => state.ClientSession);
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
        <Route path="/system/application-settings" element={<ApplicationSettingsVirtual />} />
        <Route path="/system/revert-bill-modifications" element={<RevertBillModifications />} />
        <Route path="/system/notification-settings" element={<NotificationSettings />} />
        <Route path="/system/counter-settings" element={<CounterSettings />} />
        <Route path="settings" element={<Settings />} />

        {/* Integration Start */}
        <Route path="/integration/sms" element={<SmsIntegration />} />
        <Route path="/integration/whatsapp" element={<WhatsappIntegration />} />
        <Route path="/integration/email" element={<EmailIntegration />} />
        <Route path="/integration/test" element={<Test />} />
        {/* <Route path="/integration/account_group_test" element={<AccountGroupTypeTest />} /> */}
        <Route path="/integration/total-summary" element={<TotalSummary />} />
        <Route path="/integration/shortkeys_settings" element={<ShortkeysSettings defaultShortcuts={[]} />} />
        <Route path="/integration/test-input-button" element={<TestInputButton />} />
        {/* Integration End */}

        {/* Templates starts */}
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/invoice_designer/*" element={<TemplateDesignerLayout />} />
        {/* Templates ends */}

        {/* Inventory Starts */}
        {/* <Route path="sales/new" element={<InvTransactionMobile />} /> */}
        {/* Inventory End */}

        {/* Accounts Start */}
        {/* Accounts Masters */}
        <Route path="account-masters/account-group" element={<AccountsMasters />} />
        <Route path="account-masters/Bank-Cards" element={<BankCards />} />
        <Route path="account-masters/upi" element={<Upi />} />
        <Route path="account-masters/privilege-cards" element={<PrivilegeCard />} />
        <Route path="account-masters/account-ledger" element={<AccountsLedger />} />
        <Route path="account-masters/party-category" element={<PartyCategory />} />
        <Route path="/account-masters/currency-master" element={<CurrencyMaster />} />
        <Route path="/account-masters/cost-center" element={<CostCenter />} />
        <Route path="account-masters/branch-ledgers" element={<BranchLedger />} />
        <Route path="account-masters/chart-of-accounts" element={<ChartOfAccounts />} />
        <Route path="account-masters/suppliers" element={<Suppliers />} />
        <Route path="account-masters/customers" element={<Customers />} />
        <Route path="/account-masters/customer-supplier-ledger" element={<CustomerSupplierLedger />} />
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
            {route.transactionBase == TransactionBase.Accounts && (
              <>
                <Route
                  key={index}
                  path={`${route.transactionBase}/${route.transactionType}`}
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
                  path={`${route.transactionBase}/${route.transactionType}List`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                       <SearchProvider>
                      <AccTransactionGrid
                        voucherType={route.voucherType}
                        transactionType={route.transactionType}
                        title={route.listTitle}
                        addTitle={route.title}
                      />
                      </SearchProvider>
                    </RouteGuard>
                  }
                />
                <Route
                  key={index}
                  path={`${route.transactionBase}/${route.transactionType}/:voucherNo`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                       <SearchProvider>
                      <AccTransactionFormContainerView
                        voucherType={route.voucherType}
                        transactionType={route.transactionType}
                        formCode={route.formCode}
                        voucherPrefix={""}
                        formType={route.formType}
                        title={route.title}
                        drCr={route.drCr}
                        voucherNo={0}
                      />
                      </SearchProvider>
                    </RouteGuard>
                  }
                />
                <Route
                  key={index}
                  path={`${route.transactionBase}/${route.transactionType}/:voucherNo/edit`}
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
            )}
            {route.transactionBase == TransactionBase.Purchase && (
              <>
                <Route
                  key={index}
                  path={`${route.transactionBase}/${route.transactionType}`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                      <TransactionFormContainer
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
                  path={`${route.transactionBase}/${route.transactionType}List`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                      <TransactionGrid
                        voucherType={route.voucherType}
                        transactionType={route.transactionType}
                        title={route.listTitle}
                        addTitle={route.title}
                      />
                    </RouteGuard>
                  }
                />
                <Route
                  key={index}
                  path={`${route.transactionBase}/${route.transactionType}/:voucherNo`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                      <TransactionFormContainer ///abc
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
                  path={`${route.transactionBase}/${route.transactionType}/:voucherNo/edit`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                      <TransactionFormContainer
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
            )}
          </>
        ))}
        <Route
          path={`/accounts/transactions/BankReconciliation`}
          element={
            <RouteGuard formCode="BankReconciliation" action={UserAction.Show}>
              <BankReconciliation />
            </RouteGuard>
          }
        />
        <Route
          path="accounts/transactions/PostDatedCheques"
          element={
            <RouteGuard formCode="BankReconciliation" action={UserAction.Show}>
              <PostDatedCheques />
            </RouteGuard>
          }
        />
        {/* Accounts Masters End */}

        {/* Reports */}
        <Route path="/reports" element={<ReportList />} />
        {/* Reports - Accounts */}

         {ReportsMenuItems.map((route, index) => 
        route?.children?.map((routeChild, indexChild) => {
  const childPath = routeChild.path.includes("/_/")
    ? "/" + routeChild.path.split("/_/")[1]
    : routeChild.path;
// console.log(childPath);

  return (

           <Route
      key={indexChild}
      path={childPath}
      element={
          <RouteGuard  formCode={routeChild.formCode} action={routeChild.action} >
          {routeChild.element}
          </RouteGuard>} />
          
        ); })

        
      )
      }
      {/* <Route path="/accounts/trial_balance" element={<TrialBalance />} />
        <Route path="/accounts/trial_balance_period_wise" element={<TrialBalancePeriodwise />} />
        <Route path="/accounts/profit_and_loss" element={<ProfitAndLossReport />} />
        <Route path="/accounts/profit_and_loss_detailed" element={<ProfitAndLossDetailedReport />} />
        <Route path="/accounts/balance_sheet" element={<BalanceSheet />} />
        <Route path="/accounts/balance_sheet_detailed" element={<BalancesheetVertical />} /> */}

        
        {/* <Route path="/inventory/purchase_summary_report" element={<PurchaseSummaryReport />} /> */}
        {/* Reports */}
        {/* <Route path="/*" element={<NotFound />} /> */}

        {/* side menu */}
        {/* <Route path="cash-payments" element={<AccTransactionMobile />} /> */}

        {/* Inventory Masters */}
 
        <Route path="/inventory-masters/products" element={<Products />} />
        <Route path="/inventory-masters/product-group" element={<ProductGroup />} />
        <Route path="/inventory-masters/product-category" element={<ProductCategory />} />
        <Route path="/inventory-masters/brands" element={<Brands />} />

        <Route path="/inventory-masters/price-category" element={<PriceCategory />} />
        <Route path="/inventory-masters/unit-of-measure" element={<UnitOfMeasure />} />
        <Route path="/inventory-masters/vehicles" element={<Vehicles />} />
        <Route path="/inventory-masters/warehouse" element={<WareHouse />} />
        <Route path="/inventory-masters/tax-category" element={clientSession.isAppGlobal ? <TaxCategoryIndia /> : <TaxCategory />} />
        <Route path="/inventory-masters/tcs-category" element={<TcsCategory />} />
        <Route path="/inventory-masters/salesman-route" element={<SalesmanRoute />} />
        <Route path="/inventory-masters/section" element={<Section />} />
        <Route path="/inventory-masters/schemes" element={<Schemes />} />
        <Route path="/inventory-masters/scheme_settings_special" element={<SchemeSettingsSpecial />} />
        <Route path="/inventory-masters/scheme_settings_discount" element={<SchemeSettingsDiscount />} />
        <Route path="/inventory-masters/product_price_settings" element={clientSession.isAppGlobal ? <ProductPricesIndia /> : <ProductPricesGCC />} />
        <Route path="/inventory-masters/sales-route" element={<SalesRoute />} />
        <Route path="/inventory-masters/group-category" element={<GroupCategory />} />
        <Route path="/inventory-masters/general_master" element={<GeneralMaster />} />
        {/* <Route path="/inventory-masters/listed-product-prices" element={<ListedProductPrices />} /> */}

      </Routes>
    </Suspense>
  );
};
export default Content;
