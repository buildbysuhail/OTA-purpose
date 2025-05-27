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
const OpeningStock = lazy(() => import("../../../pages/inventory/reports/opening-stock-report/opening-stock"));
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

  return (

           <Route
      key={indexChild}
      path={childPath}
      element={
          <RouteGuard  formCode={routeChild.formCode} action={routeChild.action}>
          <CashBookSummary />
          </RouteGuard>} />
          
        ); })
      )
      }
        
        <Route path="/accounts/cash_book" element={<CashBookSummary />} />
        <Route path="/accounts/day_book_detailed" element={<DayBookDetailed />} />
        <Route path="/accounts/day_book_summary" element={<DayBookSummary />} />
        <Route path="/accounts/payment_report" element={<PaymentReport />} />
        <Route path="/accounts/collection_report" element={<CollectionReport />} />
        <Route path="/accounts/cash_summary" element={<CashSummary />} />
        <Route path="/accounts/cash_summary_ledgerwise" element={<CashSummaryLedgerwise />} />
        <Route path="/accounts/income_report" element={<IncomeReport />} />
        <Route path="/accounts/income_report_detailed" element={<IncomeReportDetailed />} />
        <Route path="/accounts/expense_report" element={<ExpenseReport />} />
        <Route path="/accounts/expense_report_detailed" element={<ExpenseReportDetailed />} />
        <Route path="/accounts/income_expense_statement" element={<IncomExpenseStatement />} />
        <Route path="/accounts/cash_flow" element={<CashFlowReport />} />
        <Route path="/accounts/bank_flow" element={<BankFlowReport />} />
        <Route path="/accounts/bank_statement" element={<BankStatementReport />} />
        <Route path="/accounts/transaction_report" element={<TransactionReport />} />
        <Route path="/accounts/transaction_history_accounts" element={<AccountsHistoryReport />} />
        <Route path="/accounts/transaction_history_inventory" element={<InventoryHistoryReport />} />
        <Route path="/accounts/daily_summary_report" element={userSession.countryId === Countries.India ? (<DailySummaryGlobal />) : (<DailySummaryMaster />)} />
        <Route path="/accounts/billwise_profit" element={userSession.countryId === Countries.India ? (<BillwiseProfitGlobal />) : (<BillwiseProfit />)} />
        <Route path="/accounts/partywise_summary" element={<PartySummaryMaster />} />
        <Route path="/accounts/outstanding_payable" element={<OutstandingAccountPayableReport />} />
        <Route path="/accounts/outstanding_receivable" element={<OutstandingAccountReceivableReport />} />
        <Route path="/accounts/outstanding_aging_payable" element={<OutstandingAccountPayableAgingReport />} />
        <Route path="/accounts/outstanding_aging_receivable" element={<OutstandingAccountReceivableAgingReport />} />
        <Route path="/accounts/trial_balance" element={<TrialBalance />} />
        <Route path="/accounts/trial_balance_period_wise" element={<TrialBalancePeriodwise />} />
        <Route path="/accounts/profit_and_loss" element={<ProfitAndLossReport />} />
        <Route path="/accounts/profit_and_loss_detailed" element={<ProfitAndLossDetailedReport />} />
        <Route path="/accounts/balance_sheet" element={<BalanceSheet />} />
        <Route path="/accounts/balance_sheet_detailed" element={<BalancesheetVertical />} />
        {/* <Route  path="/accounts/payable_aging"  element={<AccountPayableAgingReport />}/>
        <Route  path="/accounts/receivable_aging"  element={<AccountReceivableAgingReport />}/> */}
        {/* Reports - Accounts */}
        {/* Reports - Inventory */}
        <Route path="/inventory/purchase_summary_report" element={<SummaryReport dataUrl={urls.purchase_summary_report} gridHeader="purchase_summary_report" gridId="grd_purchase_summary" />} />
        <Route path="/inventory/purchase_register_report" element={<RegisterReport dataUrl={urls.purchase_register_report} gridHeader="purchase_register_report" gridId="grd_purchase_register" />} />
        <Route path="/inventory/party_wise_report" element={<PartyWiseReport dataUrl={urls.party_wise_report} gridHeader="party_wise_purchase_summary_report" gridId="grd_party_wise" />} />
        <Route path="/inventory/purchase_tax_report_detailed" element={<TaxReportDetailed dataUrl={urls.purchase_tax_report_detailed} gridHeader="purchase_tax_report_detailed" gridId="grd_purchase_tax_report_detailed" />} />
        <Route path="/inventory/purchase_tax_report_summary" element={<TaxReportSummary dataUrl={urls.purchase_tax_report_summary} gridHeader="purchase_tax_report_summary" gridId="grd_purchase_tax_summary" />} />
        <Route path="/inventory/purchase_return_summary" element={<SummaryReport dataUrl={urls.purchase_return_summary} gridHeader="purchase_return_summary_report" gridId="grd_purchase_return_summary" />} />
        <Route path="/inventory/purchase_return_register" element={<RegisterReport dataUrl={urls.purchase_return_register} gridHeader="purchase_return_register_report" gridId="grd_purchase_return_register" />} />
        <Route path="/inventory/purchase_estimate_summary" element={<SummaryReport dataUrl={urls.purchase_estimate_summary} gridHeader="purchase_estimate_summary_report" gridId="grd_purchase_estimate_summary" />} />
        <Route path="/inventory/purchase_order_summary" element={<SummaryReport dataUrl={urls.purchase_order_summary} gridHeader="purchase_order_summary" gridId="grd_purchase_order_summary" />} />
        <Route path="/inventory/credit_purchase_summary" element={<CreditPurchaseSummaryReport />} />
        <Route path="/inventory/party_monthwise_purchase_summary" element={<PartyMonthwiseSummaryReport dataUrl={urls.party_monthwise_purchase_summary} gridHeader="party_monthwise_purchase_summary" gridId="grd_party_monthwise_purchase_summary" />} />
        <Route path="/inventory/purchase_order_transit_report" element={<PurchaseOrderTransitReport />} />



        {/* global */}
        <Route path="/inventory/purchase_estimate_register_report" element={<RegisterReport dataUrl={urls.purchase_estimate_register} gridHeader="purchase_estimate_register_report" gridId="grd_purchase_estimate_register" />} />
        <Route path="/inventory/purchase_return_estimate_register_report" element={<RegisterReport dataUrl={urls.purchase_return_estimate_register} gridHeader="purchase_return_estimate_register_report" gridId="grd_purchase_return_estimate_register" />} />
        <Route path="/inventory/purchase_return_estimate_summary_report" element={<SummaryReport dataUrl={urls.purchase_return_estimate_summary} gridHeader="purchase_return_estimate_summary_report" gridId="grd_purchase_return_estimate_summary" />} />
        {/* global end */}
        <Route path="/inventory/price_list_report" element={<PriceList />} />
        <Route path="/inventory/itemwise_purchase_summary" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_purchase_summary} gridHeader="itemwise_purchase_summary" gridId="grd_itemwise_purchase_summary" />} />
        <Route path="/inventory/itemwise_purchase_return_summary" element={<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_return_summary} gridHeader="item_wise_purchase_return_summary" gridId="grd_item_wise_purchase_return_summary" />} />
        <Route path="/inventory/itemwise_purchase_order_summary" element={<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_order_summary} gridHeader="item_wise_purchase_order_summary" gridId="grd_item_wise_purchase_order_summary" />} />
        <Route path="/inventory/itemwise_purchase_estimate_summary" element={<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_estimate_summary} gridHeader="item_wise_purchase_estimate_summary" gridId="grd_item_wise_purchase_estimate_summary" />} />
        <Route path="/inventory/itemwise_purchase_quotation_summary" element={<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_quotation_summary} gridHeader="item_wise_purchase_quotation_summary" gridId="grd_item_wise_purchase_quotation_summary" />} />
        <Route path="/inventory/customer_visit_total_visit" element={<CustomerVisitTotalVisit />} />
        <Route path="/inventory/customer_visit_last_visit" element={<CustomerVisitLastVisit />} />
        <Route path="/inventory/foc_register_report" element={<FOCRegisterReport />} />
        <Route path="/inventory/discount_report_inventory" element={<DiscountReportInventory />} />
        <Route path="/inventory/discount_report_collection" element={<DiscountReportCollection />} />
        <Route path="/inventory/item_used_for_service" element={<ItemUsedForService />} />
        <Route path="/inventory/lpo_report" element={<LPOReport />} />
        {/* global */}
        <Route path="/inventory/itemwise_purchase_return_estimate_summary" element={<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_return_estimate_summary} gridHeader="itemwise_purchase_return_estimate_summary" gridId="grd_itemwise_purchase_return_estimate_summary" />} />
        {/* global end */}
        <Route path="/inventory/product_summary" element={<ProductSummaryMaster />} />
        <Route path="/inventory/stock_transfer_report" element={<StockTransfer />} />
        <Route path="/inventory/damage_stock_report" element={<DamageStock />} />
        <Route path="/inventory/excess_stock_report" element={<ExcessStock />} />
        <Route path="/inventory/shortage_stock_report" element={<ShortageStock />} />
        <Route path="/inventory/branch_transfer_out_report" element={<BranchTransferOut />} />
        <Route path="/inventory/branch_transfer_in_report" element={<BranchTransferIn />} />
        <Route path="/inventory/branch_transfer_summary_out_report" element={<BranchTransferSummaryOut />} />
        <Route path="/inventory/branch_transfer_summary_in_report" element={<BranchTransferSummaryIn />} />
        <Route path="/inventory/sales_summary_report" element={<SummaryReport dataUrl={urls.sales_summary} gridHeader="sales_summary_report" gridId="grd_sales_summary" />} />
        <Route path="/inventory/sales_register_report" element={<RegisterReport dataUrl={urls.sales_register} gridHeader="sales_register_report" gridId="grd_sales_register" />} />
        <Route path="/inventory/net_sales_report" element={<NetSalesReport dataUrl={urls.net_sales} gridHeader="net_sales_report" gridId="grd_net_sales_report" />} />

        <Route path="/inventory/partywise_sales_report" element={<PartyWiseReport dataUrl={urls.partywise_sales} gridHeader="partywise_sales" gridId="grd_partywise_sales" />} />
        <Route path="/inventory/sales_tax_report_summary" element={<TaxReportSummary dataUrl={urls.sales_tax_report_summary} gridHeader="sales_tax_report_summary" gridId="grd_sales_tax_summary" />} />
        <Route path="/inventory/sales_tax_report_detailed" element={<TaxReportDetailed dataUrl={urls.sales_tax_report_detailed} gridHeader="sales_tax_report_detailed" gridId="grd_sales_tax_report_detailed" />} />
        <Route path="/inventory/sales_return_summary" element={<SummaryReport dataUrl={urls.sales_return_summary} gridHeader="sales_return_summary" gridId="grd_sales_return_summary" />} />
        <Route path="/inventory/sales_return_register" element={<RegisterReport dataUrl={urls.sales_return_register} gridHeader="sales_return_register" gridId="grd_sales_return_register" />} />
        <Route path="/inventory/sales_and_sales_return_report" element={<SalesAndSalesReturn />} />
        <Route path="/inventory/sales_order_summary_report" element={<SummaryReport dataUrl={urls.sales_order_summary} gridHeader="sales_order_summary" gridId="grd_sales_order_summary" />} />
        <Route path="/inventory/diagnosis_report" element={<DiagnosisReport />} />
        <Route path="/inventory/routewise_sales_collection_report" element={<RouteWiseSalesAndCollection />} />
        <Route path="/inventory/branch_inventory_request_pending_order_report" element={<BranchInventoryRequestPendingOrder />} />
        <Route path="/inventory/print_details_report" element={<PrintDetails />} />
        <Route path="/inventory/inventory_status_report" element={<InventoryStatusReport />} />
        <Route path="/inventory/void_report" element={<VoidReport />} />
        <Route path="/inventory/counter_report" element={<CounterReport />} />
        <Route path="/inventory/sales_return_estimate_register_report" element={<RegisterReport dataUrl={urls.sales_return_estimate_register} gridHeader="sales_return_estimate_register" gridId="grd_sales_return_estimate_register" />} />
        <Route path="/inventory/diagnosis_report_zero_rate_productlist" element={<DiagnosisReportZeroRateProductlist />} />
        <Route path="/inventory/diagnosis_report_post_dated_transactions" element={<DiagnosisReportPostDatedTransactions />} />
        <Route path="/inventory/diagnosis_report_sales_price_less_than_lp_cost" element={<DiagnosisReportSalesPriceLessThanLPCost />} />
        <Route path="/inventory/diagnosis_report_sales_price_less_than_purchase_price" element={<DiagnosisReportSalesPriceLessthanPurchasePrice />} />
        <Route path="/inventory/diagnosis_report_sales_price_less_than_msp" element={<DiagnosisReportSalesPriceLessthanMSP />} />
        <Route path="/inventory/diagnosis_report_sales_price_greater_than_mrp" element={<DiagnosisReportSalesPriceGreaterthanMRP />} />
        {/* global */}
        <Route path="/inventory/sales_estimate_summary_report" element={<SummaryReport dataUrl={urls.sales_estimate_summary} gridHeader="sales_estimate_summary" gridId="grd_sales_estimate_summary" />} />
        {/* --- */}
        <Route path="/inventory/sales_quotation_summary_report" element={<SummaryReport dataUrl={urls.sales_quotation_summary} gridHeader="sales_quotation_summary" gridId="grd_sales_quotation_summary" />} />
        <Route path="/inventory/substitute_report" element={<SummaryReport dataUrl={urls.substitute_report} gridHeader="substitute_report" gridId="grd_substitute_report" />} />
        <Route path="/inventory/daywise_summary_with_profit_report" element={<DaywiseSummaryWithProfit />} />
        <Route path="/inventory/groupwise_sales_summary_devexpress_report" element={<GroupwiseSalesSummaryDevexpress />} />
        <Route path="/inventory/groupwise_sales_summary_report_groupwise" element={<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="groupwise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_groupwise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isGroupWise: true }} />} />
        <Route path="/inventory/groupwise_sales_summary_report_categorywise" element={<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="categorywise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_categorywise" filterInitialData={{ ...GroupwiseSalesSummaryDevexpressFilterInitialState, isCategoryWise: true }} />} />
        <Route path="/inventory/groupwise_sales_summary_report_sectionwise" element={<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="sectionwise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_sectionwise" filterInitialData={{ ...GroupwiseSalesSummaryDevexpressFilterInitialState, isSectionWise: true }} />} />
        <Route path="/inventory/groupwise_sales_summary_report_brandwise" element={<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="brandwise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_brandwise" filterInitialData={{ ...GroupwiseSalesSummaryDevexpressFilterInitialState, isBrandWise: true }} />} />
        <Route path="/inventory/groupwise_sales_summary_report_product_categorywise" element={<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="product_categorywise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_product_categorywise" filterInitialData={{ ...GroupwiseSalesSummaryDevexpressFilterInitialState, isProductCatWise: true }} />} />
        <Route path="/inventory/salesman_wise_sales_and_collection_report" element={<SalesmanwiseSalesAndCollection />} />
        <Route path="/inventory/non_invoiced_goods_delivery_report" element={<NonInvoicedGoodsDelivery />} />
        {/* <Route path="/inventory/groupwise_sales_summary_devexpress_report" element={<GroupwiseSalesSummaryDevexpress />} />
        <Route path="/inventory/groupwise_sales_summary_devexpress_report" element={<GroupwiseSalesSummaryDevexpress />} /> */}
        <Route path="/inventory/booking_summary_report" element={<SummaryReport dataUrl={urls.booking_summary} gridHeader="booking_summary" gridId="grd_booking_summary" />} />
        <Route path="/inventory/pending_order_report" element={<PendingOrderReport />} />
        <Route path="/inventory/promotional_sales_report" element={<PromotionalSalesReport />} />
        <Route path="/inventory/grouped_brandwise_sales_report" element={<GroupedBrandwiseSales />} />
        <Route path="/inventory/party_monthwise_sales_summary_report" element={<PartyMonthwiseSummaryReport dataUrl={urls.party_monthwise_sales_summary} gridHeader="party_monthwise_sales_summary" gridId="grd_party_monthwise_sales_summary" />} />
        <Route path="/inventory/coupon_reports" element={<CouponReports />} />
        <Route path="/inventory/scheme_wise_sales_report" element={<SchemeWiseSales />} />
        <Route path="/inventory/itemwise_sales_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_summary} gridHeader="itemwise_sales_summary" gridId="grd_itemwise_sales_summary" />} />
        <Route path="/inventory/itemwise_sales_return_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_return_summary} gridHeader="itemwise_sales_return_summary" gridId="grd_itemwise_sales_return_summary" />} />
        <Route path="/inventory/itemwise_sales_order_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_order_summary} gridHeader="itemwise_sales_order_summary" gridId="grd_itemwise_sales_order_summary" />} />
        <Route path="/inventory/itemwise_sales_quotation_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_quotation_summary} gridHeader="itemwise_sales_quotation_summary" gridId="grd_itemwise_sales_quotation_summary" />} />
        <Route path="/inventory/itemwise_sales_estimate_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_estimate_summary} gridHeader="itemwise_sales_estimate_summary" gridId="grd_itemwise_sales_estimate_summary" />} />
        <Route path="/inventory/itemwise_sales_and_sales_return_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_and_sales_return_summary} gridHeader="itemwise_sales_and_sales_return_summary" gridId="grd_itemwise_sales_and_sales_return_summary" />} />
        <Route path="/inventory/itemwise_opening_stock_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_opening_stock_summary} gridHeader="itemwise_opening_stock_summary" gridId="grd_itemwise_opening_stock_summary" />} />
        <Route path="/inventory/itemwise_substitute_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_substitute_summary} gridHeader="itemwise_substitute_summary" gridId="grd_itemwise_substitute_summary" />} />
        <Route path="/inventory/itemwise_branch_transfer_out_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_branch_transfer_out_summary} gridHeader="itemwise_branch_transfer_out_summary" gridId="grd_itemwise_branch_transfer_out_summary" />} />
        <Route path="/inventory/itemwise_branch_transfer_in_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_branch_transfer_in_summary} gridHeader="itemwise_branch_transfer_in_summary" gridId="grd_itemwise_branch_transfer_in_summary" />} />
        <Route path="/inventory/itemwise_excess_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_excess_summary} gridHeader="itemwise_excess_summary" gridId="grd_itemwise_excess_summary" />} />
        <Route path="/inventory/itemwise_shortage_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_shortage_summary} gridHeader="itemwise_shortage_summary" gridId="grd_itemwise_shortage_summary" />} />
        <Route path="/inventory/itemwise_damage_stock_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_damage_stock_summary} gridHeader="itemwise_damage_stock_summary" gridId="grd_itemwise_damage_stock_summary" />} />
        <Route path="/inventory/itemwise_goods_delivery_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_delivery_summary} gridHeader="itemwise_goods_delivery_summary" gridId="grd_itemwise_goods_delivery_summary" />} />
        <Route path="/inventory/itemwise_goods_delivery_return_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_delivery_return_summary} gridHeader="itemwise_goods_delivery_return_summary" gridId="grd_itemwise_goods_delivery_return_summary" />} />
        <Route path="/inventory/itemwise_goods_receipt_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_receipt_summary} gridHeader="itemwise_goods_receipt_summary" gridId="grd_itemwise_goods_receipt_summary" />} />
        <Route path="/inventory/itemwise_goods_receipt_return_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_receipt_return_summary} gridHeader="itemwise_goods_receipt_return_summary" gridId="grd_itemwise_goods_receipt_return_summary" />} />
        <Route path="/inventory/itemwise_goods_request_summary_report" element={<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_request_summary} gridHeader="itemwise_goods_request_summary" gridId="grd_itemwise_goods_request_summary" />} />
        <Route path="/inventory/transaction_summary_report" element={<SummaryReport dataUrl={urls.transaction_summary} gridHeader="transaction_summary" gridId="grd_transaction_summary" />} />
        <Route path="/inventory/inventory_transaction_register_report" element={<RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="inventory_transaction_register" gridId="grd_inventory_transaction_register" />} />
        <Route path="/inventory/stock_summary_report" element={<StockSummary />} />
        <Route path="/inventory/stock_ledger_report" element={<StockLedger />} />
        <Route path="/inventory/expiry_report" element={<ExpiryReport />} />
        <Route path="/inventory/transaction_analysis_report" element={<TransactionAnalysisReport />} />
        <Route path="/inventory/stock_flow_report" element={<StockFlow />} />
        <Route path="/inventory/inventory_summary_report" element={<InventorySummaryReport />} />
        <Route path="/inventory/service_report" element={<ServiceReport />} />
        <Route path="/inventory/salesman_incentive_report" element={<SalesmanIncentiveReport />} />
        <Route path="/inventory/privilege_card_report" element={<PrivilegeCardReport />} />

        <Route path="/inventory/daily_balance_report" element={<DailyBalanceAmount />} />
        <Route path="/inventory/opening_stock_report" element={<OpeningStock />} />

        <Route path="/inventory/sales_transfer_summary_report" element={<SummaryReport dataUrl={urls.sales_transfer_summary} gridHeader="sales_transfer_summary" gridId="grd_sales_transfer_summary" />} />
        <Route path="/inventory/sales_transfer_register_report" element={<RegisterReport dataUrl={urls.sales_transfer_register} gridHeader="sales_transfer_register" gridId="grd_sales_transfer_register" />} />
        <Route path="/inventory/net_sales_transfer_report" element={<NetSalesReport dataUrl={urls.net_sales_transfer_report} gridHeader="net_sales_transfer_report" gridId="grd_net_sales_transfer_report" />} />
        <Route path="/inventory/sales_transfer_partyWise_sales" element={<PartyWiseReport dataUrl={urls.sales_transfer_partyWise_sales} gridHeader="sales_transfer_partyWise_sales" gridId="grd_sales_transfer_partyWise_sales" />} />
        <Route path="/inventory/sales_transfer_monthWise_summary_report" element={<SalesTransferMonthWiseSummaryReport dataUrl={urls.sales_transfer_monthWise_summary} gridHeader="sales_transfer_monthWise_summary" gridId="grd_sales_transfer_monthWise_summary" />} />
        <Route path="/inventory/sales_transfer_partyWise_summary_report" element={<PartyMonthwiseSummaryReport dataUrl={urls.sales_transfer_partyWise_summary} gridHeader="sales_transfer_partyWise_summary" gridId="grd_sales_transfer_partyWise_summary" />} />

        {/* global */}
        <Route path="/inventory/purchase_gst_daily_summary_report" element={<PurchaseTaxGSTDailySummary dataUrl={urls.purchase_gst_daily_summary} gridHeader="purchase_gst_daily_summary_report" gridId="grd_purchase_gst_daily_summary_report" />} />
        <Route path="/inventory/purchase_gst_monthly_summary_report" element={<PurchaseTaxGSTMonthlySummary dataUrl={urls.purchase_gst_monthly_summary} gridHeader="purchase_gst_monthly_summary_report" gridId="grd_purchase_gst_monthly_summary_report" />} />
        <Route path="/inventory/purchase_gst_register_format_report" element={<PurchaseTaxGSTRegisterFormat dataUrl={urls.purchase_gst_register_format} gridHeader="purchase_gst_register_format_report" gridId="grd_purchase_gst_register_report" />} />
        <Route path="/inventory/purchase_gst_adv_register_format_report" element={<PurchaseTaxGSTAdvRegisterFormat dataUrl={urls.purchase_gst_adv_register_format} gridHeader="purchase_gst_advanced_register_format_report" gridId="grd_purchase_gst_adv_register_report" />} />
        <Route path="/inventory/purchase_gst_detailed_report" element={<PurchaseTaxGSTDetailed dataUrl={urls.purchase_gst_detailed} gridHeader="purchase_gst_detailed_report" gridId="grd_purchase_gst_detailed_report" />} />
        <Route path="/inventory/purchase_gst_taxwise_report" element={<PurchaseTaxGSTTaxwise dataUrl={urls.purchase_gst_taxwise} gridHeader="purchase_gst_taxwise_report" gridId="grd_purchase_gst_taxwise_report" />} />
        <Route path="/inventory/purchase_gst_taxwise_with_hsn_report" element={<PurchaseTaxGSTTaxwiseWithHSN dataUrl={urls.purchase_gst_taxwise_with_hsn} gridHeader="purchase_gst_taxwise_with_hsn_report" gridId="grd_purchase_gst_taxwise_with_hsn_report" />} />


        <Route path="/inventory/purchase_return_gst_daily_summary_report" element={<PurchaseTaxGSTDailySummary dataUrl={urls.purchase_return_gst_daily_summary} gridHeader="purchase_return_gst_daily_summary_report" gridId="grd_purchase_return_gst_daily_summary_report" />} />
        <Route path="/inventory/purchase_return_gst_monthly_summary_report" element={<PurchaseTaxGSTMonthlySummary dataUrl={urls.purchase_return_gst_monthly_summary} gridHeader="purchase_return_gst_monthly_summary_report" gridId="grd_purchase_return_gst_monthly_summary_report" />} />
        <Route path="/inventory/purchase_return_gst_register_format_report" element={<PurchaseTaxGSTRegisterFormat dataUrl={urls.purchase_return_gst_register_format} gridHeader="purchase_return_gst_register_format_report" gridId="grd_purchase_return_gst_register_report" />} />
        <Route path="/inventory/purchase_return_gst_adv_register_format_report" element={<PurchaseTaxGSTAdvRegisterFormat dataUrl={urls.purchase_return_gst_adv_register_format} gridHeader="purchase_return_gst_advanced_register_format_report" gridId="grd_purchase_return_gst_adv_register_report" />} />
        <Route path="/inventory/purchase_return_gst_detailed_report" element={<PurchaseTaxGSTDetailed dataUrl={urls.purchase_return_gst_detailed} gridHeader="purchase_return_gst_detailed_report" gridId="grd_purchase_return_gst_detailed_report" />} />
        <Route path="/inventory/purchase_return_gst_taxwise_report" element={<PurchaseTaxGSTTaxwise dataUrl={urls.purchase_return_gst_taxwise} gridHeader="purchase_return_gst_taxwise_report" gridId="grd_purchase_return_gst_taxwise_report" />} />
        <Route path="/inventory/purchase_return_gst_taxwise_with_hsn_report" element={<PurchaseTaxGSTTaxwiseWithHSN dataUrl={urls.purchase_return_gst_taxwise_with_hsn} gridHeader="purchase_return_gst_taxwise_with_hsn_report" gridId="grd_purchase_return_gst_taxwise_with_hsn_report" />} />
        <Route path="/inventory/purchase_return_gst_sales_and_return_report" element={<PurchaseReturnTaxGSTSalesAndReturn />} />
        {/* global end */}
        <Route path="/inventory/purchase_tax_vat" element={<PurchaseTaxReport />} />
        <Route path="/inventory/sales_tax_report" element={<SalesTax />} />
        <Route path="/inventory/vat_return_form" element={<VatReturnForm />} />
        <Route path="/inventory/vat_return_form_arabic" element={<VatReturnFormArabic />} />
        <Route path="/inventory/ksa_e_invoice_summary_report" element={<KsaEInvoiceReportSummary />} />
        <Route path="/inventory/ksa_e_invoice_detailed_report" element={<KsaEInvoiceReportDetailed />} />

        {/* global Start */}
        <Route path="/inventory/gstr1b2b_report" element={<GSTR1B2B />} />
        <Route path="/inventory/gstr1b2cLarge_report" element={<GSTR1B2CLarge />} />
        <Route path="/inventory/gstr1b2cSmall_report" element={<GSTR1B2CSmall />} />
        <Route path="/inventory/gstr1cdnr_report" element={<GSTR1CDNR />} />
        <Route path="/inventory/gstr1cdnur_report" element={<GSTR1CDNUR />} />
        <Route path="/inventory/gstr1hsnSummary_report" element={<GSTR1HSNSummary />} />
        <Route path="/inventory/gstr1Docs_report" element={<GSTR1Docs />} />

        <Route path="/inventory/gstr3b_report" element={<GSTR3BReport />} />
        {/* global end */}
        {/* Reports - Tax*/}
        {/* <Route path="/inventory/purchase_summary_report" element={<PurchaseSummaryReport />} /> */}
        {/* Reports */}
        {/* <Route path="/*" element={<NotFound />} /> */}

        {/* side menu */}
        {/* <Route path="cash-payments" element={<AccTransactionMobile />} /> */}

        {/* Inventory Masters */}
        <Route path="/inventory/daily_statement_all" element={<DailyStatementAllReport />} />
        <Route path="/inventory-masters/products" element={<Products />} />
        <Route path="/inventory-masters/product-group" element={<ProductGroup />} />
        <Route path="/inventory-masters/product-category" element={<ProductCategory />} />
        <Route path="/inventory-masters/brands" element={<Brands />} />
        <Route path="/inventory/daily_statement_sales" element={<DailyStatementReport dataUrl={urls.daily_statement_sales} gridHeader="daily_statement_report_of_sales" gridId={GridId.daily_statement_sales} />} />
        <Route path="/inventory/daily_statement_purchase" element={<DailyStatementReport dataUrl={urls.daily_statement_purchase} gridHeader="daily_statement_report_of_purchase" gridId={GridId.daily_statement_purchase} />} />
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
