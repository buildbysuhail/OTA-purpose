import { CircleStackIcon } from "@heroicons/react/24/outline";
import { BookCopy, Boxes, Calendar, CalendarClock, ChartNoAxesCombined, CircleUser, Clock1Icon, Component, LucideCreditCard, LucideDollarSign, Scale, TrendingUp } from "lucide-react";
import { IoBookOutline } from "react-icons/io5";
import { BsCollection } from "react-icons/bs";
import { FaScaleUnbalancedFlip } from "react-icons/fa6";
import { FaCoins } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { TbCoins } from "react-icons/tb";
import { RiBankLine } from "react-icons/ri";
import { RiBankFill } from "react-icons/ri";
import { MdLibraryBooks } from "react-icons/md";
import { TfiStatsUp } from "react-icons/tfi";
import { SlEqualizer } from "react-icons/sl";
import { ImEqualizer2 } from "react-icons/im";
import { FiFileText } from "react-icons/fi";
import { LuHistory } from "react-icons/lu";
import { MdOutlineManageHistory } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { GrDocumentStore } from "react-icons/gr";
import { FaSackDollar } from "react-icons/fa6";
import { GiSwapBag } from "react-icons/gi";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { AiOutlineFileText } from "react-icons/ai";
import { TbTag } from "react-icons/tb";
import { HiOutlineClipboardList } from "react-icons/hi";
import { PiPackageLight } from "react-icons/pi";
import { GiCargoShip } from "react-icons/gi";
import { MdOutlineAnalytics } from "react-icons/md";
import { PiUsersThreeLight } from "react-icons/pi";
import { IoScaleOutline } from "react-icons/io5";
import { UserAction } from "../../../../helpers/user-right-helper";
import { lazy, ReactElement } from "react";
import urls from "../../../../redux/urls";
import GridId from "../../../../redux/gridId";
import { GroupwiseSalesSummaryFilterInitialState } from "../../../../pages/inventory/reports/sales-reports/groupwise-sales-summary/groupwise-sales-summary-filter";

const TrialBalance = lazy(() => import("../../../../pages/accounts/reports/trialBalance/trial-balance"));
const StockFlow = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/stock-flow/stock-flow-report"));
const TrialBalancePeriodwise = lazy(() => import("../../../../pages/accounts/reports/trialBalance/trial-balance-detailed"));
const ProfitAndLossDetailedReport = lazy(() => import("../../../../pages/accounts/reports/profitAndLoss/profit-and-loss-report-detailed"));
const ProfitAndLossReport = lazy(() => import("../../../../pages/accounts/reports/profitAndLoss/profit-and-loss-report"));
const BalanceSheet = lazy(() => import("../../../../pages/accounts/reports/balanceSheet/balace-sheet"));
const BalancesheetVertical = lazy(() => import("../../../../pages/accounts/reports/balanceSheet/balancesheet-vertical"));
const TransactionReport = lazy(() => import("../../../../pages/accounts/reports/transactionReport/transaction-report"));
const AccountsHistoryReport = lazy(() => import("../../../../pages/accounts/reports/transactionHistory/accountsHistory/accounts-history-report"));
const InventoryHistoryReport = lazy(() => import("../../../../pages/accounts/reports/transactionHistory/InventoryHistory/inventory-history-report"));
const DailySummaryMaster = lazy(() => import("../../../../pages/accounts/reports/dailySummary/daily-summary-master"));
const DailySummaryGlobal = lazy(() => import("../../../../pages/accounts/reports/dailySummary/daily-summary-global"));
const BillwiseProfit = lazy(() => import("../../../../pages/accounts/reports/billwise-profit/billwise-profit"));
const BillwiseProfitGlobal = lazy(() => import("../../../../pages/accounts/reports/billwise-profit/billwise-profit-global"));
const LedgerReport = lazy(() => import("../../../../pages/accounts/reports/ledger-report"));
const OutstandingAccountPayableAgingReport = lazy(() => import("../../../../pages/accounts/reports/outStandingReportsAging/outstanding-account-payable-aging-report"));
const OutstandingAccountPayableReport = lazy(() => import("../../../../pages/accounts/reports/outStandingReports/outstanding-account-payable-report"));
const PartySummaryMaster = lazy(() => import("../../../../pages/accounts/reports/partywise-summary/party-summary-master"));
const OutstandingAccountReceivableReport = lazy(() => import("../../../../pages/accounts/reports/outStandingReports/outstanding-account-receivable-report"));
const OutstandingAccountReceivableAgingReport = lazy(() => import("../../../../pages/accounts/reports/outStandingReportsAging/outstanding-account-receivable-aging-report"));
const CashBookSummary = lazy(() => import("../../../../pages/accounts/reports/cashBook/cash-book-summary"));
const DayBookDetailed = lazy(() => import("../../../../pages/accounts/reports/dayBook/day-book-detailed"));
const DayBookSummary = lazy(() => import("../../../../pages/accounts/reports/dayBook/dayBookSummary/day-book-summary"));
const PaymentReport = lazy(() => import("../../../../pages/accounts/reports/payment-report"));
const CollectionReport = lazy(() => import("../../../../pages/accounts/reports/collection-report"));
const CashSummary = lazy(() => import("../../../../pages/accounts/reports/cashSummary/cash-summary"));
const CashSummaryLedgerwise = lazy(() => import("../../../../pages/accounts/reports/cashSummary/cash-summary-ledgerwise"));
const IncomeReport = lazy(() => import("../../../../pages/accounts/reports/incomeexpense/income-report"));
const IncomeReportDetailed = lazy(() => import("../../../../pages/accounts/reports/incomeexpense/income-report-detailed"));
const ExpenseReport = lazy(() => import("../../../../pages/accounts/reports/incomeexpense/expense-report"));
const BankFlowReport = lazy(() => import("../../../../pages/accounts/reports/CashFlowBankFlow/bank-flow-report"));
const IncomExpenseStatement = lazy(() => import("../../../../pages/accounts/reports/incomeexpense/income-expense-statement"));
const BankStatementReport = lazy(() => import("../../../../pages/accounts/reports/bank-statement-report"));
const CashFlowReport = lazy(() => import("../../../../pages/accounts/reports/CashFlowBankFlow/rpt-cash-flow-report"));
const ExpenseReportDetailed = lazy(() => import("../../../../pages/accounts/reports/incomeexpense/expense-report-detailed"));
const SummaryReport = lazy(() => import("../../../../pages/inventory/reports/common-reports/summary-report/summary-report"));
const RegisterReport = lazy(() => import("../../../../pages/inventory/reports/common-reports/register-report/register-report"));
const PartyWiseReport = lazy(() => import("../../../../pages/inventory/reports/common-reports/party-wise-report/party-wise-report"));
const TaxReportDetailed = lazy(() => import("../../../../pages/inventory/reports/common-reports/tax-reports/tax-report-detailed"));
const TaxReportSummary = lazy(() => import("../../../../pages/inventory/reports/common-reports/tax-reports/tax-report-summary"));
const CreditPurchaseSummaryReport = lazy(() => import("../../../../pages/inventory/reports/purchase-reports/credit-purchase-summary-report/credit-purchase-summary-report"));
const PartyMonthwiseSummaryReport = lazy(() => import("../../../../pages/inventory/reports/common-reports/Party-monthwise-summary-report/Party-monthwise-summary-report"));
const PurchaseOrderTransitReport = lazy(() => import("../../../../pages/inventory/reports/purchase-reports/Purchase-order-transit-report/Purchase-order-transit-report"));
const ItemWiseSummaryReport = lazy(() => import("../../../../pages/inventory/reports/itemwise-reports/itemwise-summary-report/itemwise-summary"));
const StockSummary = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/stock-summary-report/stock-summary"));
const StockLedger = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/stock-ledger/stock-ledger-report"));
const ExpiryReport = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/expiry-report/expiry-report"));
const TransactionAnalysisReport = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/transaction-analysis-report/transaction-analysis-report"));
const PendingOrderReport = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/pending-order-report/pending-order"));
const RouteWiseSalesAndCollection = lazy(() => import("../../../../pages/inventory/reports/advanced-reports/routewise-sales-and-collection-report/routewise-sales-and-collection"));
const BranchInventoryRequestPendingOrder = lazy(() => import("../../../../pages/inventory/reports/advanced-reports/branch-inventory-request-pending-order-report/branch-inventory-request-pending-order"));
const PrintDetails = lazy(() => import("../../../../pages/inventory/reports/advanced-reports/print-details-report/print-details"));
const InventoryStatusReport = lazy(() => import("../../../../pages/inventory/reports/advanced-reports/inventory-status-report/inventory-status"));
const VoidReport = lazy(() => import("../../../../pages/inventory/reports/advanced-reports/void-report/void-report"));
const CounterReport = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/counter-report/counter-report"));
const DiagnosisReport = lazy(() => import("../../../../pages/inventory/reports/diagnosis-reports/diagnosis-report"));
const DiagnosisReportPostDatedTransactions = lazy(() => import("../../../../pages/inventory/reports/diagnosis-reports/diagnosis-report-post-dated-transactions"));
const CustomerVisitTotalVisit = lazy(() => import("../../../../pages/inventory/reports/customer-visit-reports/customer-visit-total-visit-report/customer-visit-total-visit-report"));
const CustomerVisitLastVisit = lazy(() => import("../../../../pages/inventory/reports/customer-visit-reports/customer-visit-last-visit-report/customer-visit-last-visit-report"));
const FOCRegisterReport = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/foc-register-report/foc-register-report"));
const DiscountReportInventory = lazy(() => import("../../../../pages/inventory/reports/discount-reports/discount_report_inventory-report/discount_report_inventory-report"));
const DiscountReportCollection = lazy(() => import("../../../../pages/inventory/reports/discount-reports/discount_report_collection-report/discount_report_collection-report"));
const ItemUsedForService = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/item_used_for_service-report/item_used_for_service-report"));
const LPOReport = lazy(() => import("../../../../pages/inventory/reports/advanced-reports/lpo_report/lpo_report"));
const SalesTransferMonthWiseSummaryReport = lazy(() => import("../../../../pages/inventory/reports/sales-reports/sales-transfer-monthWise-summary/sales-transfer-monthwise-summary-report"));
const PurchaseTaxReport = lazy(() => import("../../../../pages/inventory/reports/tax-reports-ksa/Purchase-Tax-report"));
const SalesTax = lazy(() => import("../../../../pages/inventory/reports/tax-reports-ksa/sales-tax"));
const VatReturnForm = lazy(() => import("../../../../pages/inventory/reports/tax-reports-ksa/vat-return-form/Vat-Return-Form"));
const VatReturnFormArabic = lazy(() => import("../../../../pages/inventory/reports/tax-reports-ksa/vat-return-form/Vat-Return-Form-arabic"));
const KsaEInvoiceReportSummary = lazy(() => import("../../../../pages/inventory/reports/tax-reports-ksa/ksa-e-invoice-report/ksa-e-invoice-summary.tsx"));
const KsaEInvoiceReportDetailed = lazy(() => import("../../../../pages/inventory/reports/tax-reports-ksa/ksa-e-invoice-report/ksa-e-invoice-detailed"));
const GSTR1B2B = lazy(() => import("../../../../pages/inventory/reports/tax-reports-gst/GSTR1/gstr1-b2b"));
const GSTR1B2CLarge = lazy(() => import("../../../../pages/inventory/reports/tax-reports-gst/GSTR1/gstr1-b2c-large"));
const GSTR1B2CSmall = lazy(() => import("../../../../pages/inventory/reports/tax-reports-gst/GSTR1/gstr1-b2c-small"));
const GSTR1CDNR = lazy(() => import("../../../../pages/inventory/reports/tax-reports-gst/GSTR1/gstr1-cdnr"));
const GSTR1CDNUR = lazy(() => import("../../../../pages/inventory/reports/tax-reports-gst/GSTR1/gstr1-cdnur"));
const GSTR1HSNSummary = lazy(() => import("../../../../pages/inventory/reports/tax-reports-gst/GSTR1/gstr1-summaryOfHSN"));
const GSTR1Docs = lazy(() => import("../../../../pages/inventory/reports/tax-reports-gst/GSTR1/gstr1-docs"));
const GSTR3BReport = lazy(() => import("../../../../pages/inventory/reports/tax-reports-gst/GSTR3B/gstr3b"));
const DailyStatementReport = lazy(() => import("../../../../pages/inventory/reports/daily-statement-reports/daily-statement-report"));
const DailyStatementAllReport = lazy(() => import("../../../../pages/inventory/reports/daily-statement-reports/daily-statement-all-report "));
const PriceList = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/price-list/price-list-report"));
const ProductSummaryMaster = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/product-summary/product-summary-master"));
const InventorySummaryReport = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/inventory-summary-report/inventory-summary-report"));
const ServiceReport = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/service-report/service-report"));
const SalesmanIncentiveReport = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/salesman-incentive-report/salesman-incentive-report"));
const PrivilegeCardReport = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/privilege-card-report/privilege-card-report"));
const StockJournalReport = lazy(() => import("../../../../pages/inventory/reports/stock-journal-reports/stock-journal-report/stock-journal"));
const BranchTransferOutIn = lazy(() => import("../../../../pages/inventory/reports/stock-journal-reports/branch-transfer-reports/branch-tranfer-out-in"));
const BranchTransferSummary = lazy(() => import("../../../../pages/inventory/reports/stock-journal-reports/branch-transfer-reports/branch-tranfer-summary"));
const DiagnosisDynamicReport = lazy(() => import("../../../../pages/inventory/reports/diagnosis-reports/diagnosis-report-dynamic"));
const DiagnosisReportDuplicateVouchers = lazy(() => import("../../../../pages/inventory/reports/diagnosis-reports/diagnosis-report-duplicate-vouchers"));
const DiagnosisReportBarcodeRepeat = lazy(() => import("../../../../pages/inventory/reports/diagnosis-reports/diagnosis-report-barcode-repeat"));
const DiagnosisReportInvalidProducts = lazy(() => import("../../../../pages/inventory/reports/diagnosis-reports/diagnosis-report-invalid-products"));
const FastMovingProductsReport = lazy(() => import("../../../../pages/inventory/reports/advanced-reports/fast-moving-products/fast-moving-products"));
const UnsoldProductReport = lazy(() => import("../../../../pages/inventory/reports/advanced-reports/unsold-products/unsold-products"));
const ItemWiseGroupedBrandwiseSales = lazy(() => import("../../../../pages/inventory/reports/itemwise-reports/itemwise-grouped-brandwise-sales/itemwise-grouped-brandwise-sales"));
const DailyBalanceReport = lazy(() => import("../../../../pages/inventory/reports/other-inventory-reports/daily-balance/daily-balance-report"));
const GSTDailySummary = lazy(() => import("../../../../pages/inventory/reports/common-reports/tax-gst-reports/gst-daily-summary-report"));
const ReturnTaxGSTSalesAndReturn = lazy(() => import("../../../../pages/inventory/reports/common-reports/tax-gst-reports/return-tax-gst-sales-and-return-report"));
const GSTTaxwise = lazy(() => import("../../../../pages/inventory/reports/common-reports/tax-gst-reports/gst-taxwise-report"));
const GSTTaxwiseWithHSN = lazy(() => import("../../../../pages/inventory/reports/common-reports/tax-gst-reports/gst-taxwise-with-hsn-report"));
const GSTMonthlySummary = lazy(() => import("../../../../pages/inventory/reports/common-reports/tax-gst-reports/gst-monthly-summary-report"));
const GSTDetailed = lazy(() => import("../../../../pages/inventory/reports/common-reports/tax-gst-reports/gst-detailed-report"));
const GSTRegisterFormat = lazy(() => import("../../../../pages/inventory/reports/common-reports/tax-gst-reports/gst-register-format-report"));
const GSTAdvRegisterFormat = lazy(() => import("../../../../pages/inventory/reports/common-reports/tax-gst-reports/gst-adv-register-format-report"));
const NetSalesReport = lazy(() => import("../../../../pages/inventory/reports/sales-reports/net-sales-report/net-sales"));
const SalesAndSalesReturn = lazy(() => import("../../../../pages/inventory/reports/sales-reports/sales-and-sales-return-report/sales-and-sales-return"));
const DaywiseSummaryWithProfit = lazy(() => import("../../../../pages/inventory/reports/sales-reports/daywise-summary-with-profit-report/daywise-summary-with-profit"));
const GroupwiseSalesSummaryDevexpress = lazy(() => import("../../../../pages/inventory/reports/sales-reports/groupwise-sales-summary/groupwise-sales-summary-devexpress"));
const GroupwiseSalesSummary = lazy(() => import("../../../../pages/inventory/reports/sales-reports/groupwise-sales-summary/groupwise-sales-summary"));
const NonInvoicedGoodsDelivery = lazy(() => import("../../../../pages/inventory/reports/sales-reports/non-invoiced-goods-delivery-report/non-invoiced-goods-delivery"));
const SalesmanwiseSalesAndCollection = lazy(() => import("../../../../pages/inventory/reports/sales-reports/salesman-wise-sales-and-collection-report/salesman-wise-sales-and-collection"));
const PromotionalSalesReport = lazy(() => import("../../../../pages/inventory/reports/sales-reports/promotional-sales-report/promotional-sales"));
const GroupedBrandwiseSales = lazy(() => import("../../../../pages/inventory/reports/sales-reports/grouped-brandwise-sales-report/grouped-brandwise-sales"));
const CouponReports = lazy(() => import("../../../../pages/inventory/reports/sales-reports/other-reports/coupon-report/coupon-report"));
const SchemeWiseSales = lazy(() => import("../../../../pages/inventory/reports/sales-reports/other-reports/scheme-wise-sales-report/scheme-wise-sales"));
export interface NavigationItem {
  id: number;
  path: string;
  routePath: string;
  type: 'link' | 'button' | 'dropdown'; // Extend as needed
  active: boolean;
  selected: boolean;
  title: string;
  icon: any;
  formCode: string;
  action: UserAction;
  element: ReactElement;
}
export interface NavigationParentItem {
  children?: NavigationItem[];
  [key: string]: any;
}
export const ReportsMenuItems: NavigationParentItem[] = [
  {
    menutitle: 'reports',
  },

  {
    icon: (<CircleUser className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'final_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 1, element: <TrialBalance />, formCode: "TBRpt", action: UserAction.Show, path: `/reports/_/accounts/trial_balance`, routePath: `/accounts/trial_balance`, type: 'link', active: false, selected: false, title: 'trial_balance', icon: SlEqualizer },
      { id: 2, element: <TrialBalancePeriodwise />, formCode: "TBRpt", action: UserAction.Show, path: `/reports/_/accounts/trial_balance_period_wise`, routePath: "/accounts/trial_balance_period_wise", type: 'link', active: false, selected: false, title: 'trial_balance_periodwise', icon: ImEqualizer2 },
      { id: 3, element: <ProfitAndLossReport />, formCode: "PLRPT", action: UserAction.Show, path: `/reports/_/accounts/profit_and_loss`, type: 'link', routePath: '', active: false, selected: false, title: 'profit_&_loss_account', icon: TrendingUp },
      { id: 4, element: <ProfitAndLossDetailedReport />, formCode: "PLRPT", action: UserAction.Show, path: `/reports/_/accounts/profit_and_loss_detailed`, type: 'link', routePath: '', active: false, selected: false, title: 'profit_&_loss_account_detailed', icon: TfiStatsUp },
      { id: 5, element: <BalanceSheet />, formCode: "BSRPT", action: UserAction.Show, path: `/reports/_/accounts/balance_sheet`, type: 'link', routePath: '', active: false, selected: false, title: 'balance_sheet', icon: Scale },
      { id: 6, element: <BalancesheetVertical />, formCode: "BSRPT", action: UserAction.Show, path: `/reports/_/accounts/balance_sheet_detailed`, type: 'link', routePath: '', active: false, selected: false, title: 'balance_sheet_detailed', icon: FaScaleUnbalancedFlip },
    ]
  },

  {
    icon: (<CircleUser className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'accounts',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 100, element: <TransactionReport />, formCode: "TRANSRPT", action: UserAction.Show, path: `/reports/_/accounts/transaction_report`, type: 'link', active: false, selected: false, title: 'transaction_report', icon: FiFileText, routePath: "" },
      { id: 101, element: <AccountsHistoryReport />, formCode: "RPTTRAHST", action: UserAction.Show, path: `/reports/_/accounts/transaction_history_accounts`, type: 'link', active: false, selected: false, title: 'transaction_history_accounts', icon: LuHistory, routePath: "" },
      { id: 102, element: <InventoryHistoryReport />, formCode: "RPTTRAHST", action: UserAction.Show, path: `/reports/_/accounts/transaction_history_inventory`, type: 'link', active: false, selected: false, title: 'transaction_history_inventory', icon: MdOutlineManageHistory, routePath: "" },
      { id: 103, element: <DailySummaryMaster />, formCode: "DSUMRPT", action: UserAction.Show, path: `/reports/_/accounts/daily_summary_report`, type: 'link', active: false, selected: false, title: 'daily_summary_report', icon: CalendarClock, routePath: "" },
      { id: 104, element: <DailySummaryGlobal />, formCode: "DSUMRPT", action: UserAction.Show, path: `/reports/_/accounts/daily_summary_report_global`, type: 'link', active: false, selected: false, title: 'daily_summary_report___', icon: CalendarClock, routePath: "" },
      { id: 105, element: <BillwiseProfit />, formCode: "PFTRPT", action: UserAction.Show, path: `/reports/_/accounts/billwise_profit`, type: 'link', active: false, selected: false, title: 'billwise_profit_report', icon: ChartNoAxesCombined, routePath: "" },
      { id: 106, element: <BillwiseProfitGlobal />, formCode: "PFTRPT", action: UserAction.Show, path: `/reports/_/accounts/billwise_profit`, type: 'link', active: false, selected: false, title: 'billwise_profit_report___', icon: ChartNoAxesCombined, routePath: "" },
      { id: 107, element: <PartySummaryMaster />, formCode: "PRTSUM", action: UserAction.Show, path: `/reports/_/accounts/partywise_summary`, type: 'link', active: false, selected: false, title: 'partywise_summary_report', icon: Component, routePath: "" },
      { id: 108, element: <OutstandingAccountPayableReport />, formCode: "RPTACCPAY", action: UserAction.Show, path: `/reports/_/accounts/outstanding_payable`, type: 'link', active: false, selected: false, title: 'account_payable', icon: LucideCreditCard, routePath: "" },
      { id: 109, element: <OutstandingAccountReceivableReport />, formCode: "RPTACCREC", action: UserAction.Show, path: `/reports/_/accounts/outstanding_receivable`, type: 'link', active: false, selected: false, title: 'account_receivable', icon: LucideDollarSign, routePath: "" },
      { id: 110, element: <OutstandingAccountPayableAgingReport />, formCode: "APAGINGRPT", action: UserAction.Show, path: `/reports/_/accounts/outstanding_aging_payable`, type: 'link', active: false, selected: false, title: 'account_payable_aging_report', icon: Clock1Icon, routePath: "" },
      { id: 111, element: <OutstandingAccountReceivableAgingReport />, formCode: "ARAGINGRPT", action: UserAction.Show, path: `/reports/_/accounts/outstanding_aging_receivable`, type: 'link', active: false, selected: false, title: 'account_receivable_aging_report', icon: Calendar, routePath: "" },
      { id: 112, element: <LedgerReport />, formCode: "LEDGRRPT", action: UserAction.Show, path: `/reports/_/accounts/ledger_report`, type: 'link', active: false, selected: false, title: 'ledger_report', icon: IoBookOutline, routePath: "" },
      { id: 113, element: <CashBookSummary />, formCode: "CPRPT", action: UserAction.Show, path: `/reports/_/accounts/cash_book`, type: 'link', active: false, selected: false, title: 'cash_book', icon: FaCoins, routePath: "" },
      { id: 114, element: <DayBookDetailed />, formCode: "DBRPT", action: UserAction.Show, path: `/reports/_/accounts/day_book_detailed`, type: 'link', active: false, selected: false, title: 'day_book_detailed', icon: BookCopy, routePath: "" },
      { id: 115, element: <DayBookSummary />, formCode: "DBRPT", action: UserAction.Show, path: `/reports/_/accounts/day_book_summary`, type: 'link', active: false, selected: false, title: 'day_book_summary', icon: MdLibraryBooks, routePath: "" },
      { id: 116, element: <PaymentReport />, formCode: "PAYMRPT", action: UserAction.Show, path: `/reports/_/accounts/payment_report`, type: 'link', active: false, selected: false, title: 'payment_report', icon: MdOutlinePayments, routePath: "" },
      { id: 117, element: <CollectionReport />, formCode: "COLLRPT", action: UserAction.Show, path: `/reports/_/accounts/collection_report`, type: 'link', active: false, selected: false, title: 'collection_report', icon: BsCollection, routePath: "" },
      { id: 118, element: <CashSummary />, formCode: "RPTCASHSUM", action: UserAction.Show, path: `/reports/_/accounts/cash_summary`, type: 'link', active: false, selected: false, title: 'cash_summary_report', icon: GrDocumentStore, routePath: "" },
      { id: 119, element: <CashSummaryLedgerwise />, formCode: "RPTCASHSUM", action: UserAction.Show, path: `/reports/_/accounts/cash_summary_ledgerwise`, type: 'link', active: false, selected: false, title: 'cash_summary_ledgerwise_report', icon: TbCoins, routePath: "" },
    ]
  },

  {
    icon: (<CircleUser className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'income_and_expense',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 200, element: <IncomeReport />, formCode: "IcmRpt", action: UserAction.Show, path: `/reports/_/accounts/income_report`, type: 'link', routePath: '', active: false, selected: false, title: 'income_report', icon: FaHandHoldingDollar },
      { id: 201, element: <IncomeReportDetailed />, formCode: "IcmRpt", action: UserAction.Show, path: `/reports/_/accounts/income_report_detailed`, type: 'link', routePath: '', active: false, selected: false, title: 'income_report_detailed', icon: GiReceiveMoney },
      { id: 202, element: <ExpenseReport />, formCode: "ExpRpt", action: UserAction.Show, path: `/reports/_/accounts/expense_report`, type: 'link', routePath: '', active: false, selected: false, title: 'expense_report', icon: GiSwapBag },
      { id: 203, element: <ExpenseReportDetailed />, formCode: "ExpRpt", action: UserAction.Show, path: `/reports/_/accounts/expense_report_detailed`, type: 'link', routePath: '', active: false, selected: false, title: 'expense_report_detailed', icon: FaSackDollar },
      { id: 204, element: <IncomExpenseStatement />, formCode: "INCEXPSMT", action: UserAction.Show, path: `/reports/_/accounts/income_expense_statement`, type: 'link', routePath: '', active: false, selected: false, title: 'income_expense_statement', icon: LiaFileInvoiceDollarSolid },
      { id: 205, element: <CashFlowReport />, formCode: "CashFlwRpt", action: UserAction.Show, path: `/reports/_/accounts/cash_flow`, type: 'link', routePath: '', active: false, selected: false, title: 'cash_flow', icon: CircleStackIcon },
      { id: 206, element: <BankFlowReport />, formCode: "BankFlwRpt", action: UserAction.Show, path: `/reports/_/accounts/bank_flow`, type: 'link', routePath: '', active: false, selected: false, title: 'bank_flow', icon: RiBankLine },
      { id: 207, element: <BankStatementReport />, formCode: "BKSTMT", action: UserAction.Show, path: `/reports/_/accounts/bank_statement`, type: 'link', routePath: '', active: false, selected: false, title: 'bank_statement', icon: RiBankFill },
    ]
  },
  {
    icon: (<Boxes className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'other_inventory_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 1,
    children: [
      { id: 1500, element: <PriceList />, formCode: "PL", action: UserAction.Show, path: `/reports/_/inventory/price_list_report`, type: 'link', routePath: '', active: false, selected: false, title: 'price_list_report', icon: TbTag },
      { id: 1501, element: <PendingOrderReport />, formCode: "RPTPOR", action: UserAction.Show, path: `/reports/_/inventory/pending_order_report`, type: 'link', active: false, selected: false, title: 'pending_order', icon: PiPackageLight, routePath: "" },
      { id: 1504, element: <StockSummary />, formCode: "RPTSTK", action: UserAction.Show, path: `/reports/_/inventory/stock_summary_report`, type: 'link', active: false, selected: false, title: 'stock_summary', icon: PiPackageLight, routePath: "" },
      { id: 1505, element: <StockLedger />, formCode: "RPTSTKLED", action: UserAction.Show, path: `/reports/_/inventory/stock_ledger_report`, type: 'link', active: false, selected: false, title: 'stock_ledger', icon: HiOutlineClipboardList, routePath: "" },
      { id: 1506, element: <ExpiryReport />, formCode: "EXPIRYRPT", action: UserAction.Show, path: `/reports/_/inventory/expiry_report`, type: 'link', active: false, selected: false, title: 'expiry_report', icon: HiOutlineClipboardList, routePath: "" },
      { id: 1507, element: <DailyBalanceReport />, formCode: "RPTDLBLRPT", action: UserAction.Show, path: `/reports/_/inventory/daily_balance_report`, type: 'link', routePath: '', active: false, selected: false, title: 'daily_balance_report', icon: IoScaleOutline },
      { id: 1508, element: <TransactionAnalysisReport />, formCode: "TARPT", action: UserAction.Show, path: `/reports/_/inventory/transaction_analysis_report`, type: 'link', active: false, selected: false, title: 'transaction_analysis', icon: MdOutlineAnalytics, routePath: "" },
      { id: 1509, element: <ProductSummaryMaster />, formCode: "PSUMRPT", action: UserAction.Show, path: `/reports/_/inventory/product_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'product_summary', icon: AiOutlineFileText },
      { id: 1510, element: <StockFlow />, formCode: "RPTSTKFL", action: UserAction.Show, path: `/reports/_/inventory/stock_flow_report`, type: 'link', active: false, selected: false, title: 'stock_flow_report', icon: GiCargoShip, routePath: "" },
      { id: 1511, element: <InventorySummaryReport />, formCode: "RPTINVSUM", action: UserAction.Show, path: `/reports/_/inventory/inventory_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'inventory_summary_report', icon: PiPackageLight },
      { id: 1512, element: <ServiceReport />, formCode: "SERVCRPT", action: UserAction.Show, path: `/reports/_/inventory/service_report`, type: 'link', routePath: '', active: false, selected: false, title: 'service_report', icon: PiPackageLight },
      { id: 1513, element: <SalesmanIncentiveReport />, formCode: "RPTSLIC", action: UserAction.Show, path: `/reports/_/inventory/salesman_incentive_report`, type: 'link', routePath: '', active: false, selected: false, title: 'salesman_incentive_report', icon: PiPackageLight },
      { id: 1514, element: <PrivilegeCardReport />, formCode: "RPTPRCRD", action: UserAction.Show, path: `/reports/_/inventory/privilege_card_report`, type: 'link', routePath: '', active: false, selected: false, title: 'privilege_card', icon: PiPackageLight },
      { id: 1515, element: <FOCRegisterReport />, formCode: "RPTFOCREG", action: UserAction.Show, path: `/reports/_/inventory/foc_register_report`, type: 'link', active: false, selected: false, title: 'foc_register_report', icon: PiPackageLight, routePath: "" },
      { id: 1516, element: <ItemUsedForService />, formCode: "ITMSFORSRV", action: UserAction.Show, path: `/reports/_/inventory/item_used_for_service`, type: 'link', active: false, selected: false, title: 'item_used_for_service', icon: PiPackageLight, routePath: "" },
      { id: 1517, element: <CounterReport />, formCode: "CNTRRPT", action: UserAction.Show, path: `/reports/_/inventory/counter_report`, type: 'link', active: false, selected: false, title: 'counter_report', icon: PiPackageLight, routePath: "" },
    ]
  },
  {
    icon: (<CircleUser className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'transaction_summary_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
     { id: 1900, element: <SummaryReport dataUrl={urls.sales_summary} gridHeader="sales_summary_report" gridId="grd_sales_summary" />, formCode: "RPTSLSUM", action: UserAction.Show, path: `/reports/_/inventory/sales_summary_report`, type: 'link', active: false, selected: false, title: 'sales_summary', icon: PiPackageLight, routePath: "" },
     { id: 1901, element: <SummaryReport dataUrl={urls.sales_return_summary} gridHeader="sales_return_summary" gridId="grd_sales_return_summary" />, formCode: "RPTSRSM", action: UserAction.Show, path: `/reports/_/inventory/sales_return_summary`, type: 'link', active: false, selected: false, title: 'sales_return_summary', icon: PiPackageLight, routePath: "" },
     { id: 1902, element: <SummaryReport dataUrl={urls.purchase_summary_report} gridHeader="purchase_summary_report" gridId="grd_purchase_summary" />, formCode: "RPTPURSUM", action: UserAction.Show, path: `/reports/_/inventory/purchase_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_summary_report', icon: HiOutlineDocumentReport },
     { id: 1903, element: <SummaryReport dataUrl={urls.purchase_return_summary} gridHeader="purchase_return_summary_report" gridId="grd_purchase_return_summary" />, formCode: "RPTPRSUM", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_return_summary', icon: PiUsersThreeLight },
     { id: 1904, element: <SummaryReport dataUrl={urls.sales_order_summary} gridHeader="sales_order_summary" gridId="grd_sales_order_summary" />, formCode: "RPTORDSM", action: UserAction.Show, path: `/reports/_/inventory/sales_order_summary_report`, type: 'link', active: false, selected: false, title: 'sales_order_summary', icon: PiPackageLight, routePath: "" },
     { id: 1905, element: <SummaryReport dataUrl={urls.sales_quotation_summary} gridHeader="sales_quotation_summary" gridId="grd_sales_quotation_summary" />, formCode: "RPTSQS", action: UserAction.Show, path: `/reports/_/inventory/sales_quotation_summary_report`, type: 'link', active: false, selected: false, title: 'sales_quotation_summary', icon: PiPackageLight, routePath: "" },
     { id: 1906, element: <SummaryReport dataUrl={urls.substitute_report} gridHeader="substitute_report" gridId="grd_substitute_report" />, formCode: "RPTSUB", action: UserAction.Show, path: `/reports/_/inventory/substitute_report`, type: 'link', active: false, selected: false, title: 'substitute_report', icon: PiPackageLight, routePath: "" },
     { id: 1907, element: <SummaryReport dataUrl={urls.purchase_order_summary} gridHeader="purchase_order_summary" gridId="grd_purchase_order_summary" />, formCode: "RPTPOS", action: UserAction.Show, path: `/reports/_/inventory/purchase_order_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_order_summary', icon: PiUsersThreeLight },
     { id: 1908, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="opening_stock_summary" gridId="grd_opening_stock_summary" voucherType="OS" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/opening_stock_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'opening_stock_summary', icon: PiUsersThreeLight },
     { id: 1909, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="purchase_quotation_summary" gridId="grd_purchase_quotation_summary" voucherType="PQ" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/purchase_quotation_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_quotation_summary', icon: PiUsersThreeLight },
     { id: 1910, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="goods_request_summary" gridId="grd_goods_request_summary" voucherType="GR" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/goods_request_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'goods_request_summary', icon: PiUsersThreeLight },
     { id: 1912, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="branch_transfer_out_summary" gridId="grd_branch_transfer_out_summary" voucherType="BTO" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_out_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'branch_transfer_out_summary', icon: PiUsersThreeLight },
     { id: 1913, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="branch_transfer_in_summary" gridId="grd_branch_transfer_in_summary" voucherType="BTI" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_in_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'branch_transfer_in_summary', icon: PiUsersThreeLight },
     { id: 1914, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="excess_stock_summary" gridId="grd_excess_stock_summary" voucherType="EX" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/excess_stock_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'excess_stock_summary', icon: PiUsersThreeLight },
     { id: 1915, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="sales_transfer_to_branch_summary" gridId="grd_sales_transfer_to_branch_summary" voucherType="SI-BT" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/sales_transfer_to_branch_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_transfer_to_branch_summary', icon: PiUsersThreeLight },
     { id: 1916, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="sales_estimate_transfer_to_branch_summary" gridId="grd_sales_estimate_transfer_to_branch_summary" voucherType="SE-BT" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/sales_estimate_transfer_to_branch_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_estimate_transfer_to_branch_summary', icon: PiUsersThreeLight },
     { id: 1917, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="shortage_stock_summary" gridId="grd_shortage_stock_summary" voucherType="SH" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/shortage_stock_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'shortage_stock_summary', icon: PiUsersThreeLight },
     { id: 1918, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="damage_entry_summary" gridId="grd_damage_entry_summary" voucherType="DMG" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/damage_entry_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'damage_entry_summary', icon: PiUsersThreeLight },
     { id: 1919, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="stock_transfer_summary" gridId="grd_stock_transfer_summary" voucherType="ST" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/stock_transfer_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'stock_transfer_summary', icon: PiUsersThreeLight },
     { id: 1920, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="goods_delivery_summary" gridId="grd_goods_delivery_summary" voucherType="GD" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/goods_delivery_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'goods_delivery_summary', icon: PiUsersThreeLight },
     { id: 1921, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="goods_delivery_return_summary" gridId="grd_goods_delivery_return_summary" voucherType="DR" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/goods_delivery_return_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'goods_delivery_return_summary', icon: PiUsersThreeLight },
     { id: 1922, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="goods_receipt_summary" gridId="grd_goods_receipt_summary" voucherType="GRN" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/goods_receipt_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'goods_receipt_summary', icon: PiUsersThreeLight },
     { id: 1923, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="goods_receipt_return_summary" gridId="grd_goods_receipt_return_summary" voucherType="GRR" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/goods_receipt_return_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'goods_receipt_return_summary', icon: PiUsersThreeLight },
     { id: 1924, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="sales_discount_summary" gridId="grd_sales_discount_summary" voucherType="SD" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/sales_discount_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_discount_summary', icon: PiUsersThreeLight },
     { id: 1925, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="service_invoice_summary" gridId="grd_service_invoice_summary" voucherType="SVI" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/service_invoice_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'service_invoice_summary', icon: PiUsersThreeLight },
     { id: 1926, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="staff_food_summary" gridId="grd_staff_food_summary" voucherType="STF" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/staff_food_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'staff_food_summary', icon: PiUsersThreeLight },
     { id: 1927, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="excess_stock_sp_summary" gridId="grd_excess_stock_sp_summary" voucherType="EX-SP" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/excess_stock_sp_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'excess_stock_sp_summary', icon: PiUsersThreeLight },
     { id: 1928, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="shortage_stock_sp_summary" gridId="grd_shortage_stock_sp_summary" voucherType="SH-SP" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/shortage_stock_sp_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'shortage_stock_sp_summary', icon: PiUsersThreeLight },
     { id: 1929, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="purchase_estimate_summary" gridId="grd_purchase_estimate_summary" voucherType="PE" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/purchase_estimate_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_estimate_summary', icon: PiUsersThreeLight },
     { id: 1930, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="sales_estimate_summary" gridId="grd_sales_estimate_summary" voucherType="SE" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/sales_estimate_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_estimate_summary', icon: PiUsersThreeLight },
     { id: 1931, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="purchase_return_estimate_summary" gridId="grd_purchase_return_estimate_summary" voucherType="PRE" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_estimate_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_return_estimate_summary', icon: PiUsersThreeLight },
     { id: 1932, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="sales_return_estimate_summary" gridId="grd_sales_return_estimate_summary" voucherType="SRE" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/sales_return_estimate_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_return_estimate_summary', icon: PiUsersThreeLight },
     { id: 1933, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="item_load_request_summary" gridId="grd_item_load_request_summary" voucherType="ILR" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/item_load_request_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'item_load_request_summary', icon: PiUsersThreeLight },
     { id: 1934, element: <SummaryReport dataUrl={urls.transaction_summary} gridHeader="debit_note_against_sales_summary" gridId="grd_debit_note_against_sales_summary" voucherType="DNS" />, formCode: "INVTRSUM", action: UserAction.Show, path: `/reports/_/inventory/debit_note_against_sales_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'debit_note_against_sales_summary', icon: PiUsersThreeLight },
       ]
  },
  {
    icon: (<CircleUser className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'inventory_register_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 2000, element: <RegisterReport dataUrl={urls.sales_register} gridHeader="sales_register" gridId="grd_sales_register" />, formCode: "RPTSRSUM", action: UserAction.Show, path: `/reports/_/inventory/sales_register_report`, type: 'link', active: false, selected: false, title: 'sales_register', icon: PiPackageLight, routePath: "" },
      { id: 2001, element: <RegisterReport dataUrl={urls.sales_return_register} gridHeader="sales_return_register" gridId="grd_sales_return_register" />, formCode: "RPTSRREG", action: UserAction.Show, path: `/reports/_/inventory/sales_return_register`, type: 'link', active: false, selected: false, title: 'sales_return_register', icon: PiPackageLight, routePath: "" },
      { id: 2002, element: <RegisterReport dataUrl={urls.purchase_register_report} gridHeader="purchase_register" gridId="grd_purchase_register" />, formCode: "RPTPURREG", action: UserAction.Show, path: `/reports/_/inventory/purchase_register_report`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_register', icon: AiOutlineFileText },
      { id: 2003, element: <RegisterReport dataUrl={urls.purchase_return_register} gridHeader="purchase_return_register" gridId="grd_purchase_return_register" />, formCode: "RPTPRREG", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_register`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_return_register', icon: PiUsersThreeLight },
      { id: 2004, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="stock_transafer_register" gridId="grd_stock_transafer_register" voucherType="ST" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/stock_transafer_register`, type: 'link', routePath: '', active: false, selected: false, title: 'stock_transafer_register', icon: PiUsersThreeLight },
      { id: 2005, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="sales_order_register" gridId="grd_sales_order_register" voucherType="SO" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/sales_order_register`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_order_register', icon: PiUsersThreeLight },
      { id: 2006, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="sales_quotation_register" gridId="grd_sales_quotation_register" voucherType="SQ" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/sales_quotation_register`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_quotation_register', icon: PiUsersThreeLight },
      { id: 2007, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="substitute_register" gridId="grd_substitute_register" voucherType="SUB" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/substitute_register`, type: 'link', routePath: '', active: false, selected: false, title: 'substitute_register', icon: PiUsersThreeLight },
      { id: 2008, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="opening_stock_register" gridId="grd_opening_stock_register" voucherType="OS" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/opening_stock_register`, type: 'link', routePath: '', active: false, selected: false, title: 'opening_stock_register', icon: PiUsersThreeLight },
      { id: 2009, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="purchase_order_register" gridId="grd_purchase_order_register" voucherType="PO" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/purchase_order_register`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_order_register', icon: PiUsersThreeLight },
      { id: 2010, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="goods_request_register" gridId="grd_goods_request_register" voucherType="GR" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/goods_request_register`, type: 'link', routePath: '', active: false, selected: false, title: 'goods_request_register', icon: PiUsersThreeLight },
      { id: 2011, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="purchase_quotation_register" gridId="grd_purchase_quotation_register" voucherType="PQ" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/purchase_quotation_register`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_quotation_register', icon: PiUsersThreeLight },
      { id: 2012, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="branch_transfer_out_register" gridId="grd_branch_transfer_out_register" voucherType="BTO" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_out_register`, type: 'link', routePath: '', active: false, selected: false, title: 'branch_transfer_out_register', icon: PiUsersThreeLight },
      { id: 2013, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="branch_transfer_in_register" gridId="grd_branch_transfer_in_register" voucherType="BTI" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_in_register`, type: 'link', routePath: '', active: false, selected: false, title: 'branch_transfer_in_register', icon: PiUsersThreeLight },
      { id: 2014, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="excess_stock_register" gridId="grd_excess_stock_register" voucherType="EX" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/excess_stock_register`, type: 'link', routePath: '', active: false, selected: false, title: 'excess_stock_register', icon: PiUsersThreeLight },
      { id: 2015, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="shortage_stock_register" gridId="grd_shortage_stock_register" voucherType="SH" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/shortage_stock_register`, type: 'link', routePath: '', active: false, selected: false, title: 'shortage_stock_register', icon: PiUsersThreeLight },
      { id: 2016, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="damage_entry_register" gridId="grd_damage_entry_register" voucherType="DMG" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/damage_entry_register`, type: 'link', routePath: '', active: false, selected: false, title: 'damage_entry_register', icon: PiUsersThreeLight },
      { id: 2017, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="goods_delivery_register" gridId="grd_goods_delivery_register" voucherType="GD" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/goods_delivery_register`, type: 'link', routePath: '', active: false, selected: false, title: 'goods_delivery_register', icon: PiUsersThreeLight },
      { id: 2018, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="goods_delivery_return_register" gridId="grd_goods_delivery_return_register" voucherType="DR" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/goods_delivery_return_register`, type: 'link', routePath: '', active: false, selected: false, title: 'goods_delivery_return_register', icon: PiUsersThreeLight },
      { id: 2019, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="goods_receipt_register" gridId="grd_goods_receipt_register" voucherType="GRN" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/goods_receipt_register`, type: 'link', routePath: '', active: false, selected: false, title: 'goods_receipt_register', icon: PiUsersThreeLight },
      { id: 2020, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="sales_transfer_register" gridId="grd_sales_transfer_register" voucherType="SI-BT" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/sales_transfer_register`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_transfer_register', icon: PiUsersThreeLight },
      { id: 2021, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="sales_estimate_transfer_register" gridId="grd_sales_estimate_transfer_register" voucherType="SE-BT" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/sales_estimate_transfer_register`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_estimate_transfer_register', icon: PiUsersThreeLight },
      { id: 2022, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="goods_receipt_return_register" gridId="grd_goods_receipt_return_register" voucherType="GRR" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/goods_receipt_return_register`, type: 'link', routePath: '', active: false, selected: false, title: 'goods_receipt_return_register', icon: PiUsersThreeLight },
      { id: 2023, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="sales_booking_register" gridId="grd_sales_booking_register" voucherType="SB" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/sales_booking_register`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_booking_register', icon: PiUsersThreeLight },
      { id: 2024, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="staff_food_register" gridId="grd_staff_food_register" voucherType="STF" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/staff_food_register`, type: 'link', routePath: '', active: false, selected: false, title: 'staff_food_register', icon: PiUsersThreeLight },
      { id: 2025, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="purchase_estimate_register" gridId="grd_purchase_estimate_register" voucherType="PE" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/purchase_estimate_register`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_estimate_register', icon: PiUsersThreeLight },
      { id: 2026, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="sales_estimate_register" gridId="grd_sales_estimate_register" voucherType="SE" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/sales_estimate_register`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_estimate_register', icon: PiUsersThreeLight },
      { id: 2027, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="excess_stock_sp_register" gridId="grd_excess_stock_sp_register" voucherType="EX-SP" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/excess_stock_sp_register`, type: 'link', routePath: '', active: false, selected: false, title: 'excess_stock_sp_register', icon: PiUsersThreeLight },
      { id: 2028, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="shortage_stock_sp_register" gridId="grd_shortage_stock_sp_register" voucherType="SH-SP" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/shortage_stock_sp_register`, type: 'link', routePath: '', active: false, selected: false, title: 'shortage_stock_sp_register', icon: PiUsersThreeLight },
      { id: 2029, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="purchase_return_estimate_register" gridId="grd_purchase_return_estimate_register" voucherType="PRE" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_estimate_register`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_return_estimate_register', icon: PiUsersThreeLight },
      { id: 2030, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="sales_return_estimate_register" gridId="grd_sales_return_estimate_register" voucherType="SRE" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/sales_return_estimate_register`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_return_estimate_register', icon: PiUsersThreeLight },
      { id: 2031, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="item_load_request_register" gridId="grd_item_load_request_register" voucherType="ILR" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/item_load_request_register`, type: 'link', routePath: '', active: false, selected: false, title: 'item_load_request_register', icon: PiUsersThreeLight },
      { id: 2032, element: <RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="debit_note_against_sales_register" gridId="grd_debit_note_against_sales_register" voucherType="DNS" />, formCode: "INVTRREG", action: UserAction.Show, path: `/reports/_/inventory/debit_note_against_sales_register`, type: 'link', routePath: '', active: false, selected: false, title: 'debit_note_against_sales_register', icon: PiUsersThreeLight },
    ]
  },
  {
    icon: (<Boxes className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'sales',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 300, element: <SummaryReport dataUrl={urls.sales_summary} gridHeader="sales_summary_report" gridId="grd_sales_summary" />, formCode: "RPTSLSUM", action: UserAction.Show, path: `/reports/_/inventory/sales_summary_report`, type: 'link', active: false, selected: false, title: 'sales_summary', icon: PiPackageLight, routePath: "" },
      { id: 301, element: <RegisterReport dataUrl={urls.sales_register} gridHeader="sales_register_report" gridId="grd_sales_register" />, formCode: "RPTSRSUM", action: UserAction.Show, path: `/reports/_/inventory/sales_register_report`, type: 'link', active: false, selected: false, title: 'sales_register', icon: PiPackageLight, routePath: "" },
      { id: 302, element: <NetSalesReport dataUrl={urls.net_sales} gridHeader="net_sales_report" gridId="grd_net_sales_report" />, formCode: "RPTNTSI", action: UserAction.Show, path: `/reports/_/inventory/net_sales_report`, type: 'link', active: false, selected: false, title: 'net_sales', icon: PiPackageLight, routePath: "" },
      { id: 303, element: <PartyWiseReport dataUrl={urls.partywise_sales} gridHeader="partywise_sales" gridId="grd_partywise_sales" />, formCode: "RPTPRTSL", action: UserAction.Show, path: `/reports/_/inventory/partywise_sales_report`, type: 'link', active: false, selected: false, title: 'partywise_sales', icon: PiPackageLight, routePath: "" },
      { id: 304, element: <TaxReportSummary dataUrl={urls.sales_tax_report_summary} gridHeader="sales_tax_report_summary" gridId="grd_sales_tax_summary" />, formCode: "RPTSITAX", action: UserAction.Show, path: `/reports/_/inventory/sales_sales_tax_report_summary`, type: 'link', active: false, selected: false, title: 'sales_tax_report_summary', icon: PiPackageLight, routePath: "" },
      { id: 305, element: <TaxReportDetailed dataUrl={urls.sales_tax_report_detailed} gridHeader="sales_tax_report_detailed" gridId="grd_sales_tax_report_detailed" />, formCode: "RPTSITAX", action: UserAction.Show, path: `/reports/_/inventory/sales_sales_tax_report_detailed`, type: 'link', active: false, selected: false, title: 'sales_tax_report_detailed', icon: PiPackageLight, routePath: "" },
      { id: 306, element: <SummaryReport dataUrl={urls.sales_return_summary} gridHeader="sales_return_summary" gridId="grd_sales_return_summary" />, formCode: "RPTSRSM", action: UserAction.Show, path: `/reports/_/inventory/sales_return_summary`, type: 'link', active: false, selected: false, title: 'sales_return_summary', icon: PiPackageLight, routePath: "" },
      { id: 307, element: <RegisterReport dataUrl={urls.sales_return_register} gridHeader="sales_return_register" gridId="grd_sales_return_register" />, formCode: "RPTSRREG", action: UserAction.Show, path: `/reports/_/inventory/sales_return_register`, type: 'link', active: false, selected: false, title: 'sales_return_register', icon: PiPackageLight, routePath: "" },
      { id: 308, element: <SalesAndSalesReturn />, formCode: "RPTSSR", action: UserAction.Show, path: `/reports/_/inventory/sales_and_sales_return_report`, type: 'link', active: false, selected: false, title: 'sales_and_sales_return', icon: PiPackageLight, routePath: "" },
      //#region global
      { id: 309, element: <RegisterReport dataUrl={urls.sales_return_estimate_register} gridHeader="sales_return_estimate_register_report" gridId="grd_sales_return_estimate_register" />, formCode: "SREREGT", action: UserAction.Show, path: `/reports/_/inventory/sales_return_estimate_register_report`, type: 'link', active: false, selected: false, title: 'sales_return_estimate_register', icon: PiPackageLight, routePath: "" },
      { id: 310, element: <SummaryReport dataUrl={urls.sales_return_estimate_summary} gridHeader="sales_return_estimate_summary" gridId="grd_sales_return_estimate_summary" />, formCode: "SRESUMY", action: UserAction.Show, path: `/reports/_/inventory/sales_return_estimate_summary`, type: 'link', active: false, selected: false, title: 'sales_return_estimate_summary', icon: PiPackageLight, routePath: "" },
      //#endregion global
      { id: 311, element: <SummaryReport dataUrl={urls.sales_order_summary} gridHeader="sales_order_summary" gridId="grd_sales_order_summary" />, formCode: "RPTORDSM", action: UserAction.Show, path: `/reports/_/inventory/sales_order_summary_report`, type: 'link', active: false, selected: false, title: 'sales_order_summary', icon: PiPackageLight, routePath: "" },
      //#region global
      { id: 312, element: <RegisterReport dataUrl={urls.sales_estimate_register} gridHeader="sales_estimate_register" gridId="grd_sales_estimate_register" />, formCode: "RPTSERGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_estimate_register_report`, type: 'link', active: false, selected: false, title: 'sales_estimate_register', icon: PiPackageLight, routePath: "" },
      //#endregion global
      { id: 313, element: <SummaryReport dataUrl={urls.sales_estimate_summary} gridHeader="sales_estimate_summary" gridId="grd_sales_estimate_summary" />, formCode: "RPTSES", action: UserAction.Show, path: `/reports/_/inventory/sales_estimate_summary_report`, type: 'link', active: false, selected: false, title: 'sales_estimate_summary', icon: PiPackageLight, routePath: "" },
      { id: 314, element: <SummaryReport dataUrl={urls.sales_quotation_summary} gridHeader="sales_quotation_summary" gridId="grd_sales_quotation_summary" />, formCode: "RPTSQS", action: UserAction.Show, path: `/reports/_/inventory/sales_quotation_summary_report`, type: 'link', active: false, selected: false, title: 'sales_quotation_summary', icon: PiPackageLight, routePath: "" },
      { id: 315, element: <SummaryReport dataUrl={urls.substitute_report} gridHeader="substitute_report" gridId="grd_substitute_report" />, formCode: "RPTSUB", action: UserAction.Show, path: `/reports/_/inventory/substitute_report`, type: 'link', active: false, selected: false, title: 'substitute_report', icon: PiPackageLight, routePath: "" },
      { id: 316, element: <DaywiseSummaryWithProfit />, formCode: "RPTSIDWSWP", action: UserAction.Show, path: `/reports/_/inventory/daywise_summary_with_profit_report`, type: 'link', active: false, selected: false, title: 'daywise_summary_with_profit', icon: PiPackageLight, routePath: "" },
      { id: 317, element: <GroupwiseSalesSummaryDevexpress />, formCode: "GRPWSSLRPT", action: UserAction.Show, path: `/reports/_/inventory/groupwise_sales_summary_devexpress_report`, type: 'link', active: false, selected: false, title: 'groupwise_sales_summary_devexpress', icon: PiPackageLight, routePath: "" },
      { id: 318, element: <GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="groupwise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_groupwise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isGroupWise: true }} />, formCode: "GRPWSSLRPT", action: UserAction.Show, path: `/reports/_/inventory/groupwise_sales_summary_report_groupwise`, type: 'link', active: false, selected: false, title: 'groupwise_sales_summary_report', icon: PiPackageLight, routePath: "" },
      { id: 319, element: <GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="categorywise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_categorywise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isCategoryWise: true }} />, formCode: "GRPWSSLRPT", action: UserAction.Show, path: `/reports/_/inventory/groupwise_sales_summary_report_categorywise`, type: 'link', active: false, selected: false, title: 'categorywise_sales_summary_report', icon: PiPackageLight, routePath: "" },
      { id: 320, element: <GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="sectionwise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_sectionwise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isSectionWise: true }} />, formCode: "GRPWSSLRPT", action: UserAction.Show, path: `/reports/_/inventory/groupwise_sales_summary_report_sectionwise`, type: 'link', active: false, selected: false, title: 'sectionwise_sales_summary_report', icon: PiPackageLight, routePath: "" },
      { id: 321, element: <GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="brandwise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_brandwise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isBrandWise: true }} />, formCode: "GRPWSSLRPT", action: UserAction.Show, path: `/reports/_/inventory/groupwise_sales_summary_report_brandwise`, type: 'link', active: false, selected: false, title: 'brandwise_sales_summary_report', icon: PiPackageLight, routePath: "" },
      { id: 322, element: <GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="product_categorywise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_product_categorywise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isProductCatWise: true }} />, formCode: "GRPWSSLRPT", action: UserAction.Show, path: `/reports/_/inventory/groupwise_sales_summary_report_product_categorywise`, type: 'link', active: false, selected: false, title: 'product_categorywise_sales_summary_report', icon: PiPackageLight, routePath: "" },
      { id: 322, element: <GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="salesmanwise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_salesmanwise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isSalesmanwise: true }} />, formCode: "GRPWSSLRPT", action: UserAction.Show, path: `/reports/_/inventory/groupwise_sales_summary_report_salesmanwise`, type: 'link', active: false, selected: false, title: 'salesmanwise_sales_summary_report', icon: PiPackageLight, routePath: "" },
      { id: 323, element: <SalesmanwiseSalesAndCollection />, formCode: "RPTSIMWSAC", action: UserAction.Show, path: `/reports/_/inventory/salesman_wise_sales_and_collection_report`, type: 'link', active: false, selected: false, title: 'salesman_wise_sales_and_collection', icon: PiPackageLight, routePath: "" },
      { id: 324, element: <NonInvoicedGoodsDelivery />, formCode: "RPTSINIGDR", action: UserAction.Show, path: `/reports/_/inventory/non_invoiced_goods_delivery_report`, type: 'link', active: false, selected: false, title: 'non_invoiced_goods_delivery', icon: PiPackageLight, routePath: "" },
      { id: 325, element: <SummaryReport dataUrl={urls.booking_summary} gridHeader="booking_summary" gridId="grd_booking_summary" />, formCode: "RPTBKSSUM", action: UserAction.Show, path: `/reports/_/inventory/booking_summary_report`, type: 'link', active: false, selected: false, title: 'booking_summary', icon: PiPackageLight, routePath: "" },
      { id: 326, element: <PromotionalSalesReport />, formCode: "RPTPRMSIR", action: UserAction.Show, path: `/reports/_/inventory/promotional_sales_report`, type: 'link', active: false, selected: false, title: 'promotional_sales', icon: PiPackageLight, routePath: "" },
      { id: 327, element: <GroupedBrandwiseSales />, formCode: "RPTGRPBRDWSIR", action: UserAction.Show, path: `/reports/_/inventory/grouped_brandwise_sales_report`, type: 'link', active: false, selected: false, title: 'grouped_brandwise_sales', icon: PiPackageLight, routePath: "" },
      { id: 328, element: <PartyMonthwiseSummaryReport dataUrl={urls.party_monthwise_sales_summary} gridHeader="party_monthwise_sales_summary" gridId="grd_party_monthwise_sales_summary" />, formCode: "RPTPRTYMWSIS", action: UserAction.Show, path: `/reports/_/inventory/party_monthwise_sales_summary_report`, type: 'link', active: false, selected: false, title: 'party_monthwise_sales_summary', icon: PiPackageLight, routePath: "" },
    ]
  },

  {
    icon: (<Boxes className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'purchase',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 500, element: <SummaryReport dataUrl={urls.purchase_summary_report} gridHeader="purchase_summary_report" gridId="grd_purchase_summary" />, formCode: "RPTPURSUM", action: UserAction.Show, path: `/reports/_/inventory/purchase_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_summary_report', icon: HiOutlineDocumentReport },
      { id: 501, element: <RegisterReport dataUrl={urls.purchase_register_report} gridHeader="purchase_register_report" gridId="grd_purchase_register" />, formCode: "RPTPURREG", action: UserAction.Show, path: `/reports/_/inventory/purchase_register_report`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_register_report', icon: AiOutlineFileText },
      { id: 502, element: <PartyWiseReport dataUrl={urls.party_wise_report} gridHeader="party_wise_purchase_summary_report" gridId="grd_party_wise" />, formCode: "RPTPWP", action: UserAction.Show, path: `/reports/_/inventory/party_wise_report`, type: 'link', routePath: '', active: false, selected: false, title: 'party_wise_report', icon: PiUsersThreeLight },
      { id: 503, element: <TaxReportDetailed dataUrl={urls.purchase_tax_report_detailed} gridHeader="purchase_tax_report_detailed" gridId="grd_purchase_tax_report_detailed" />, formCode: "RPTPITX", action: UserAction.Show, path: `/reports/_/inventory/purchase_tax_report_detailed`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_tax_report_detailed', icon: PiUsersThreeLight },
      { id: 504, element: <TaxReportSummary dataUrl={urls.purchase_tax_report_summary} gridHeader="purchase_tax_report_summary" gridId="grd_purchase_tax_summary" />, formCode: "RPTPITX", action: UserAction.Show, path: `/reports/_/inventory/purchase_tax_report_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_tax_report_summary', icon: PiUsersThreeLight },
      { id: 505, element: <SummaryReport dataUrl={urls.purchase_return_summary} gridHeader="purchase_return_summary_report" gridId="grd_purchase_return_summary" />, formCode: "RPTPRSUM", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_return_summary', icon: PiUsersThreeLight },
      { id: 506, element: <RegisterReport dataUrl={urls.purchase_return_register} gridHeader="purchase_return_register_report" gridId="grd_purchase_return_register" />, formCode: "RPTPRREG", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_register`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_return_register', icon: PiUsersThreeLight },
      //#region global
      { id: 507, element: <RegisterReport dataUrl={urls.purchase_estimate_register} gridHeader="purchase_estimate_register_report" gridId="grd_purchase_estimate_register" />, formCode: "RPTPIER", action: UserAction.Show, path: `/reports/_/inventory/purchase_estimate_register_report`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_estimate_register_report', icon: AiOutlineFileText },
      //#endregion global
      { id: 508, element: <SummaryReport dataUrl={urls.purchase_estimate_summary} gridHeader="purchase_estimate_summary_report" gridId="grd_purchase_estimate_summary" />, formCode: "RPTPES", action: UserAction.Show, path: `/reports/_/inventory/purchase_estimate_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_estimate_summary', icon: PiUsersThreeLight },
      //#region global
      { id: 509, element: <RegisterReport dataUrl={urls.purchase_return_estimate_register} gridHeader="purchase_return_estimate_register_report" gridId="grd_purchase_return_estimate_register" />, formCode: "PREREGT", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_estimate_register_report`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_return_estimate_register_report', icon: AiOutlineFileText },
      { id: 510, element: <SummaryReport dataUrl={urls.purchase_return_estimate_summary} gridHeader="purchase_return_estimate_summary_report" gridId="grd_purchase_return_estimate_summary" />, formCode: "PRESUMMY", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_estimate_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_return_estimate_summary_report', icon: HiOutlineDocumentReport },
      //#endregion global
      { id: 511, element: <SummaryReport dataUrl={urls.purchase_order_summary} gridHeader="purchase_order_summary" gridId="grd_purchase_order_summary" />, formCode: "RPTPOS", action: UserAction.Show, path: `/reports/_/inventory/purchase_order_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_order_summary', icon: PiUsersThreeLight },
      { id: 512, element: <CreditPurchaseSummaryReport />, formCode: "RPTCPIS", action: UserAction.Show, path: `/reports/_/inventory/credit_purchase_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'credit_purchase_summary', icon: AiOutlineFileText },
      { id: 513, element: <PartyMonthwiseSummaryReport dataUrl={urls.party_monthwise_purchase_summary} gridHeader="party_monthwise_purchase_summary" gridId="grd_party_monthwise_purchase_summary" />, formCode: "RPTPMPIS", action: UserAction.Show, path: `/reports/_/inventory/party_monthwise_purchase_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'party_monthwise_purchase_summary', icon: AiOutlineFileText },
      { id: 514, element: <PurchaseOrderTransitReport />, formCode: "RPTPIOT", action: UserAction.Show, path: `/reports/_/inventory/purchase_order_transit_report`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_order_transit_report', icon: AiOutlineFileText },
    ]
  },
  {
    icon: (<CircleUser className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'diagnosis_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 1300, element: <DiagnosisReport dataUrl={urls.diagnosis_report} gridHeader="diagnosis_report_of_zero_rate_product_list" gridId="grd_diagnosis_report_of_zero_rate_product_list" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_of_zero_rate_product_list`, type: 'link', active: false, selected: false, title: 'zero_rate_product_list', icon: PiPackageLight, routePath: "" },
      { id: 1301, element: <DiagnosisReportPostDatedTransactions dataUrl={urls.diagnosis_report_post_dated_transactions} gridHeader="diagnosis_report_of_post_dated_transactions" gridId="grd_diagnosis_report_of_post_dated_transactions" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_of_post_dated_transactions`, type: 'link', active: false, selected: false, title: 'post_dated_transactions', icon: PiPackageLight, routePath: "" },
      { id: 1302, element: <DiagnosisReport dataUrl={urls.diagnosis_report_sales_price_less_than_lp_cost} gridHeader="diagnosis_report_of_sales_price_less_than_cost" gridId="grd_diagnosis_report_of_sales_price_less_than_cost" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_sales_price_less_than_lp_cost`, type: 'link', active: false, selected: false, title: 'sales_price_less_than_lp_cost', icon: PiPackageLight, routePath: "" },
      { id: 1303, element: <DiagnosisReport dataUrl={urls.diagnosis_report_sales_price_less_than_purchase_price} gridHeader="diagnosis_report_sales_price_less_than_purchase_price" gridId="grd_diagnosis_report_sales_price_less_than_purchase_price" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_sales_price_less_than_purchase_price`, type: 'link', active: false, selected: false, title: 'sales_price_less_than_purchase_price', icon: PiPackageLight, routePath: "" },
      { id: 1304, element: <DiagnosisReport dataUrl={urls.diagnosis_report_sales_price_less_than_msp} gridHeader="diagnosis_report_sales_price_less_than_msp" gridId="grd_diagnosis_report_sales_price_less_than_msp" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_sales_price_less_than_msp`, type: 'link', active: false, selected: false, title: 'sales_price_less_than_msp', icon: PiPackageLight, routePath: "" },
      { id: 1305, element: <DiagnosisReport dataUrl={urls.diagnosis_report_sales_price_greater_than_mrp} gridHeader="diagnosis_report_sales_price_greater_than_mrp" gridId="grd_diagnosis_report_sales_price_greater_than_mrp" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_sales_price_greater_than_mrp`, type: 'link', active: false, selected: false, title: 'sales_price_greater_than_mrp', icon: PiPackageLight, routePath: "" },
      { id: 1306, element: <DiagnosisDynamicReport dataUrl={urls.diagnosis_report_sales_price_category_greater_than_mrp} gridHeader="diagnosis_report_sales_price_category_greater_than_mrp" gridId="grd_diagnosis_report_sales_price_category_greater_than_mrp" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_sales_price_category_greater_than_mrp`, type: 'link', active: false, selected: false, title: 'sales_price_category_greater_than_mrp', icon: PiPackageLight, routePath: "" },
      { id: 1307, element: <DiagnosisReport dataUrl={urls.diagnosis_report_sales_price_equal_to_mrp} gridHeader="diagnosis_report_sales_price_equal_to_mrp" gridId="grd_diagnosis_report_sales_price_equal_to_mrp" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_sales_price_equal_to_mrp`, type: 'link', active: false, selected: false, title: 'sales_price_equal_to_mrp', icon: PiPackageLight, routePath: "" },
      { id: 1308, element: <DiagnosisReport dataUrl={urls.diagnosis_report_zero_price_category_1} gridHeader="diagnosis_report_zero_price_category_1" gridId="grd_diagnosis_report_zero_price_category_1" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_zero_price_category_1`, type: 'link', active: false, selected: false, title: 'zero_price_category_1', icon: PiPackageLight, routePath: "" },
      { id: 1309, element: <DiagnosisReport dataUrl={urls.diagnosis_report_zero_price_category_2} gridHeader="diagnosis_report_zero_price_category_2" gridId="grd_diagnosis_report_zero_price_category_2" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_zero_price_category_2`, type: 'link', active: false, selected: false, title: 'zero_price_category_2', icon: PiPackageLight, routePath: "" },
      { id: 1310, element: <DiagnosisReport dataUrl={urls.diagnosis_report_sales_price_less_than_price_category_1} gridHeader="diagnosis_report_sales_price_less_than_price_category_1" gridId="grd_diagnosis_report_sales_price_less_than_price_category_1" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_sales_price_less_than_price_category_1`, type: 'link', active: false, selected: false, title: 'sales_price_less_than_price_category_1', icon: PiPackageLight, routePath: "" },
      { id: 1311, element: <DiagnosisReport dataUrl={urls.diagnosis_report_sales_price_less_than_price_category_2} gridHeader="diagnosis_report_sales_price_less_than_price_category_2" gridId="grd_diagnosis_report_sales_price_less_than_price_category_2" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_sales_price_less_than_price_category_2`, type: 'link', active: false, selected: false, title: 'sales_price_less_than_price_category_2', icon: PiPackageLight, routePath: "" },
      { id: 1312, element: <DiagnosisReportPostDatedTransactions dataUrl={urls.diagnosis_report_invalid_ledger_or_related_ledger} gridHeader="diagnosis_report_invalid_ledger_or_related_ledger" gridId="grd_diagnosis_report_invalid_ledger_or_related_ledger" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_invalid_ledger_or_related_ledger`, type: 'link', active: false, selected: false, title: 'invalid_ledger_or_related_ledger', icon: PiPackageLight, routePath: "" },
      { id: 1313, element: <DiagnosisReportDuplicateVouchers />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_of_duplicate_vouchers`, type: 'link', active: false, selected: false, title: 'duplicate_vouchers', icon: PiPackageLight, routePath: "" },
      { id: 1314, element: <DiagnosisReportBarcodeRepeat dataUrl={urls.diagnosis_report_of_barcode_repeat} gridHeader="diagnosis_report_of_barcode_repeat" gridId="grd_diagnosis_report_of_barcode_repeat" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_of_barcode_repeat`, type: 'link', active: false, selected: false, title: 'barcode_repeat', icon: PiPackageLight, routePath: "" },
      { id: 1315, element: <DiagnosisReportBarcodeRepeat dataUrl={urls.diagnosis_report_of_barcode_repeat_multi_units} gridHeader="diagnosis_report_of_barcode_repeat_multi_units" gridId="grd_diagnosis_report_of_barcode_repeat_multi_units" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_of_barcode_repeat_multi_units`, type: 'link', active: false, selected: false, title: 'barcode_repeat_multi_units', icon: PiPackageLight, routePath: "" },
      { id: 1316, element: <DiagnosisReportBarcodeRepeat dataUrl={urls.diagnosis_report_of_barcode_repeat_multi_barcodes} gridHeader="diagnosis_report_of_barcode_repeat_multi_barcodes" gridId="grd_diagnosis_report_of_barcode_repeat_multi_barcodes" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_of_barcode_repeat_multi_barcodes`, type: 'link', active: false, selected: false, title: 'barcode_repeat_multi_barcodes', icon: PiPackageLight, routePath: "" },
      { id: 1317, element: <DiagnosisReport dataUrl={urls.diagnosis_report_sales_price_equal_to_purchase_price} gridHeader="diagnosis_report_sales_price_equal_to_purchase_price" gridId="grd_diagnosis_report_sales_price_equal_to_purchase_price" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_sales_price_equal_to_purchase_price`, type: 'link', active: false, selected: false, title: 'sales_price_equal_to_purchase_price', icon: PiPackageLight, routePath: "" },
      { id: 1318, element: <DiagnosisReport dataUrl={urls.diagnosis_report_of_zero_purchase_rate_product_list} gridHeader="diagnosis_report_of_zero_purchase_rate_product_list" gridId="grd_diagnosis_report_of_zero_purchase_rate_product_list" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_of_zero_purchase_rate_product_list`, type: 'link', active: false, selected: false, title: 'zero_purchase_rate_product_list', icon: PiPackageLight, routePath: "" },
      { id: 1319, element: <DiagnosisReport dataUrl={urls.diagnosis_report_of_inactive_products} gridHeader="diagnosis_report_of_inactive_products" gridId="grd_diagnosis_report_of_inactive_products" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_of_inactive_products`, type: 'link', active: false, selected: false, title: 'inactive_products', icon: PiPackageLight, routePath: "" },
      { id: 1320, element: <DiagnosisReport dataUrl={urls.diagnosis_report_of_zero_mrp_product_list} gridHeader="diagnosis_report_of_zero_mrp_product_list" gridId="grd_diagnosis_report_of_zero_mrp_product_list" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_of_zero_mrp_product_list`, type: 'link', active: false, selected: false, title: 'zero_mrp_product_list', icon: PiPackageLight, routePath: "" },
      { id: 1321, element: <DiagnosisReportInvalidProducts />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_of_invalid_products`, type: 'link', active: false, selected: false, title: 'invalid_products', icon: PiPackageLight, routePath: "" },
      { id: 1322, element: <DiagnosisReport dataUrl={urls.diagnosis_report_of_products_with_multi_batch} gridHeader="diagnosis_report_of_products_with_multi_batch" gridId="grd_diagnosis_report_of_products_with_multi_batch" />, formCode: "ADVDIGREPT", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_of_products_with_multi_batch`, type: 'link', active: false, selected: false, title: 'products_with_multi_batch', icon: PiPackageLight, routePath: "" },
    ]
  },

  {
    icon: (<Boxes className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'itemwise_summary_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 700, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_sales_summary} gridHeader="itemwise_sales_summary" gridId="grd_itemwise_sales_summary" />, formCode: "ITSIRPT", action: UserAction.Show, path: `/reports/_/inventory/itemwise_sales_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'itemwise_sales_summary', icon: PiPackageLight },
      //#region global
      { id: 701, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_sales_transfer_summary} gridHeader="itemwise_sales_transfer_summary" gridId="grd_itemwise_sales_transfer_summary" />, formCode: "SELTRANS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_sales_transfer_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'itemwise_sales_transfer_summary', icon: PiPackageLight },
      //#endregion global
      { id: 702, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_sales_return_summary} gridHeader="itemwise_sales_return_summary" gridId="grd_itemwise_sales_return_summary" />, formCode: "ITSRRPT", action: UserAction.Show, path: `/reports/_/inventory/itemwise_sales_return_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'itemwise_sales_return_summary', icon: PiPackageLight },
      { id: 703, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_purchase_summary} gridHeader="itemwise_purchase_summary" gridId="grd_itemwise_purchase_summary" />, formCode: "ITPIRPT", action: UserAction.Show, path: `/reports/_/inventory/itemwise_purchase_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'itemwise_purchase_summary', icon: AiOutlineFileText },
      { id: 704, element: <ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_return_summary} gridHeader="itemwise_purchase_return_summary" gridId="grd_item_wise_purchase_return_summary" />, formCode: "ITPRRPT", action: UserAction.Show, path: `/reports/_/inventory/itemwise_purchase_return_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'itemwise_purchase_return_summary', icon: AiOutlineFileText },
      { id: 705, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_sales_order_summary} gridHeader="itemwise_sales_order_summary" gridId="grd_itemwise_sales_order_summary" />, formCode: "ITSORPT", action: UserAction.Show, path: `/reports/_/inventory/itemwise_sales_order_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'itemwise_sales_order_summary', icon: PiPackageLight },
      { id: 706, element: <ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_order_summary} gridHeader="item_wise_purchase_order_summary" gridId="grd_item_wise_purchase_order_summary" />, formCode: "ITPORPT", action: UserAction.Show, path: `/reports/_/inventory/itemwise_purchase_order_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'itemwise_purchase_order_summary', icon: AiOutlineFileText },
      { id: 707, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_sales_quotation_summary} gridHeader="itemwise_sales_quotation_summary" gridId="grd_itemwise_sales_quotation_summary" />, formCode: "ITSQRPT", action: UserAction.Show, path: `/reports/_/inventory/itemwise_sales_quotation_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'itemwise_sales_quotation_summary', icon: PiPackageLight },
      { id: 708, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_sales_estimate_summary} gridHeader="itemwise_sales_estimate_summary" gridId="grd_itemwise_sales_estimate_summary" />, formCode: "ITSERPT", action: UserAction.Show, path: `/reports/_/inventory/itemwise_sales_estimate_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'itemwise_sales_estimate_summary', icon: PiPackageLight },
      //#region global
      { id: 709, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_sales_return_estimate_summary} gridHeader="itemwise_sales_return_estimate_summary" gridId="grd_itemwise_sales_return_estimate_summary" />, formCode: "SREITEM", action: UserAction.Show, path: `/reports/_/inventory/itemwise_sales_return_estimate_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'itemwise_sales_return_estimate_summary', icon: PiPackageLight },
      //#endregion global
      { id: 710, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_sales_and_sales_return_summary} gridHeader="itemwise_sales_and_sales_return_summary" gridId="grd_itemwise_sales_and_sales_return_summary" />, formCode: "ITSISRRPT", action: UserAction.Show, path: `/reports/_/inventory/itemwise_sales_and_sales_return_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'itemwise_sales_and_sales_return_summary', icon: PiPackageLight },
      { id: 711, element: <ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_estimate_summary} gridHeader="item_wise_purchase_estimate_summary" gridId="grd_item_wise_purchase_estimate_summary" />, formCode: "ITPERPT", action: UserAction.Show, path: `/reports/_/inventory/itemwise_purchase_estimate_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'itemwise_purchase_estimate_summary', icon: AiOutlineFileText },
      //#region global
      { id: 712, element: <ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_return_estimate_summary} gridHeader="itemwise_purchase_return_estimate_summary" gridId="grd_itemwise_purchase_return_estimate_summary" />, formCode: "PREITEM", action: UserAction.Show, path: `/reports/_/inventory/itemwise_purchase_return_estimate_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'itemwise_purchase_return_estimate_summary', icon: AiOutlineFileText },
      //#endregion global
      { id: 713, element: <ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_quotation_summary} gridHeader="item_wise_purchase_quotation_summary" gridId="grd_item_wise_purchase_quotation_summary" />, formCode: "PQRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_purchase_quotation_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'itemwise_purchase_quotation_summary', icon: AiOutlineFileText },
      { id: 714, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_opening_stock_summary} gridHeader="itemwise_opening_stock_summary" gridId="grd_itemwise_opening_stock_summary" />, formCode: "OSRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_opening_stock_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_opening_stock_summary', icon: PiPackageLight, routePath: "" },
      { id: 715, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_substitute_summary} gridHeader="itemwise_substitute_summary" gridId="grd_itemwise_substitute_summary" />, formCode: "SUBRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_substitute_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_substitute_summary', icon: PiPackageLight, routePath: "" },
      { id: 716, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_branch_transfer_out_summary} gridHeader="itemwise_branch_transfer_out_summary" gridId="grd_itemwise_branch_transfer_out_summary" />, formCode: "BTORPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_branch_transfer_out_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_branch_transfer_out_summary', icon: PiPackageLight, routePath: "" },
      { id: 717, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_branch_transfer_in_summary} gridHeader="itemwise_branch_transfer_in_summary" gridId="grd_itemwise_branch_transfer_in_summary" />, formCode: "BTIRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_branch_transfer_in_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_branch_transfer_in_summary', icon: PiPackageLight, routePath: "" },
      { id: 718, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_excess_summary} gridHeader="itemwise_excess_summary" gridId="grd_itemwise_excess_summary" />, formCode: "EXRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_excess_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_excess_summary', icon: PiPackageLight, routePath: "" },
      { id: 719, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_shortage_summary} gridHeader="itemwise_shortage_summary" gridId="grd_itemwise_shortage_summary" />, formCode: "SHRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_shortage_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_shortage_summary', icon: PiPackageLight, routePath: "" },
      { id: 720, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_damage_stock_summary} gridHeader="itemwise_damage_stock_summary" gridId="grd_itemwise_damage_stock_summary" />, formCode: "DMGRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_damage_stock_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_damage_stock_summary', icon: PiPackageLight, routePath: "" },
      { id: 721, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_goods_delivery_summary} gridHeader="itemwise_goods_delivery_summary" gridId="grd_itemwise_goods_delivery_summary" />, formCode: "GDRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_delivery_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_delivery_summary', icon: PiPackageLight, routePath: "" },
      { id: 722, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_goods_delivery_return_summary} gridHeader="itemwise_goods_delivery_return_summary" gridId="grd_itemwise_goods_delivery_return_summary" />, formCode: "DRRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_delivery_return_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_delivery_return_summary', icon: PiPackageLight, routePath: "" },
      { id: 723, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_goods_receipt_summary} gridHeader="itemwise_goods_receipt_summary" gridId="grd_itemwise_goods_receipt_summary" />, formCode: "GRNRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_receipt_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_receipt_summary', icon: PiPackageLight, routePath: "" },
      { id: 724, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_goods_receipt_return_summary} gridHeader="itemwise_goods_receipt_return_summary" gridId="grd_itemwise_goods_receipt_return_summary" />, formCode: "GRRRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_receipt_return_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_receipt_return_summary', icon: PiPackageLight, routePath: "" },
      { id: 725, element: <ItemWiseGroupedBrandwiseSales />, formCode: "STMRYBRD", action: UserAction.Show, path: `/reports/_/inventory/itemwise_grouped_brandwise_sales_summary`, type: 'link', routePath: '', active: false, selected: false, title: 'grouped_brandwise_sales_summary', icon: AiOutlineFileText },
      { id: 726, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_goods_request_summary} gridHeader="itemwise_goods_request_summary" gridId="grd_itemwise_goods_request_summary" />, formCode: "GR_RPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_request_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_request_summary', icon: PiPackageLight, routePath: "" },
      //Settings.InventorySettings.EnableAddStockAdjustment for sp //settings visible false for gcc
      //#region global
      { id: 727, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_excess_stock_sp} gridHeader="itemwise_excess_stock_sp" gridId="grd_itemwise_excess_stock_sp" />, formCode: "EX-SPRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_excess_stock_sp`, type: 'link', active: false, selected: false, title: 'excess_stock_sp', icon: PiPackageLight, routePath: "" },
      { id: 728, element: <ItemWiseSummaryReport dataUrl={urls.itemwise_shortage_stock_sp} gridHeader="itemwise_shortage_stock_sp" gridId="grd_itemwise_shortage_stock_sp" />, formCode: "SH-SPRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_shortage_stock_sp`, type: 'link', active: false, selected: false, title: 'shortage_stock_sp', icon: PiPackageLight, routePath: "" },
      //#endregion global
    ]
  },
  {
    icon: (<Boxes className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'sales_tax_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      //#region global
      //sales Tax
      { id: 1700, element: <GSTDailySummary dataUrl={urls.sales_gst_daily_summary} gridHeader="gst_sales_daily_summary_report" gridId="grd_sales_gst_daily_summary_report" />, formCode: "RPTSITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_gst_daily_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'daily_summary', icon: AiOutlineFileText },
      { id: 1701, element: <ReturnTaxGSTSalesAndReturn dataUrl={urls.sales_gst_sales_and_return} gridHeader="gst_sales_report" gridId="grd_sales_gst_sales_and_return" />, formCode: "RPTSITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_gst_sales_and_return`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_and_return', icon: AiOutlineFileText },
      { id: 1702, element: <GSTTaxwise dataUrl={urls.sales_gst_taxwise} gridHeader="sales_gst_taxwise_report" gridId="grd_sales_gst_taxwise_report" />, formCode: "RPTSITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_gst_taxwise_report`, type: 'link', routePath: '', active: false, selected: false, title: 'taxwise', icon: AiOutlineFileText },
      { id: 1703, element: <GSTTaxwiseWithHSN dataUrl={urls.sales_gst_taxwise_with_hsn} gridHeader="sales_gst_taxwise_with_hsn_report" gridId="grd_sales_gst_taxwise_with_hsn_report" />, formCode: "RPTSITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_gst_taxwise_with_hsn_report`, type: 'link', routePath: '', active: false, selected: false, title: 'taxwise_with_hsn', icon: AiOutlineFileText },
      { id: 1704, element: <GSTMonthlySummary dataUrl={urls.sales_gst_monthly_summary} gridHeader="sales_gst_monthly_summary_report" gridId="grd_sales_gst_monthly_summary_report" />, formCode: "RPTSITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_gst_monthly_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'monthly_summary', icon: AiOutlineFileText },
      { id: 1705, element: <GSTDetailed dataUrl={urls.sales_gst_detailed} gridHeader="sales_gst_detailed_report" gridId="grd_sales_gst_detailed_report" />, formCode: "RPTSITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_gst_detailed_report`, type: 'link', routePath: '', active: false, selected: false, title: 'detailed', icon: AiOutlineFileText },
      { id: 1706, element: <GSTRegisterFormat dataUrl={urls.sales_gst_register_format} gridHeader="sales_gst_register_format_report" gridId="grd_sales_gst_register_report" />, formCode: "RPTSITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_gst_register_format_report`, type: 'link', routePath: '', active: false, selected: false, title: 'register_format', icon: AiOutlineFileText },
      { id: 1707, element: <GSTAdvRegisterFormat dataUrl={urls.sales_gst_adv_register_format} gridHeader="sales_gst_advanced_register_format_report" gridId="grd_sales_gst_adv_register_report" />, formCode: "RPTSITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_gst_adv_register_format_report`, type: 'link', routePath: '', active: false, selected: false, title: 'adv_register_format', icon: AiOutlineFileText },
      //#endregion global  
    ]
  },
  {
    icon: (<Boxes className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'sales_return_tax_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      //#region global
      //sales return Tax
      { id: 1800, element: <GSTDailySummary dataUrl={urls.sales_return_gst_daily_summary} gridHeader="sales_return_gst_daily_summary_report" gridId="grd_sales_return_gst_daily_summary_report" />, formCode: "RPTSRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_return_gst_daily_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'daily_summary', icon: AiOutlineFileText },
      { id: 1801, element: <ReturnTaxGSTSalesAndReturn dataUrl={urls.sales_return_gst_sales_and_return} gridHeader="sales_return_gst_report" gridId="grd_sales_return_gst_sales_and_return" />, formCode: "RPTSRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_return_gst_sales_and_return`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_and_return', icon: AiOutlineFileText },
      { id: 1802, element: <GSTTaxwise dataUrl={urls.sales_return_gst_taxwise} gridHeader="sales_return_gst_taxwise_report" gridId="grd_sales_return_gst_taxwise_report" />, formCode: "RPTSRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_return_gst_taxwise_report`, type: 'link', routePath: '', active: false, selected: false, title: 'taxwise', icon: AiOutlineFileText },
      { id: 1803, element: <GSTTaxwiseWithHSN dataUrl={urls.sales_return_gst_taxwise_with_hsn} gridHeader="sales_return_gst_taxwise_with_hsn_report" gridId="grd_sales_return_gst_taxwise_with_hsn_report" />, formCode: "RPTSRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_return_gst_taxwise_with_hsn_report`, type: 'link', routePath: '', active: false, selected: false, title: 'taxwise_with_hsn', icon: AiOutlineFileText },
      { id: 1804, element: <GSTMonthlySummary dataUrl={urls.sales_return_gst_monthly_summary} gridHeader="sales_return_gst_monthly_summary_report" gridId="grd_sales_return_gst_monthly_summary_report" />, formCode: "RPTSRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_return_gst_monthly_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'monthly_summary', icon: AiOutlineFileText },
      { id: 1805, element: <GSTDetailed dataUrl={urls.sales_return_gst_detailed} gridHeader="sales_return_gst_detailed_report" gridId="grd_sales_return_gst_detailed_report" />, formCode: "RPTSRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_return_gst_detailed_report`, type: 'link', routePath: '', active: false, selected: false, title: 'detailed', icon: AiOutlineFileText },
      { id: 1806, element: <GSTRegisterFormat dataUrl={urls.sales_return_gst_register_format} gridHeader="sales_return_gst_register_format_report" gridId="grd_sales_return_gst_register_report" />, formCode: "RPTSRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_return_gst_register_format_report`, type: 'link', routePath: '', active: false, selected: false, title: 'register_format', icon: AiOutlineFileText },
      { id: 1807, element: <GSTAdvRegisterFormat dataUrl={urls.sales_return_gst_adv_register_format} gridHeader="sales_return_gst_advanced_register_format_report" gridId="grd_sales_return_gst_adv_register_report" />, formCode: "RPTSRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/sales_return_gst_adv_register_format_report`, type: 'link', routePath: '', active: false, selected: false, title: 'adv_register_format', icon: AiOutlineFileText },
      //#endregion global  
    ]
  },
  {
    icon: (<Boxes className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'purchase_tax_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      //#region global
      //purchase Tax
      { id: 1900, element: <GSTDailySummary dataUrl={urls.purchase_gst_daily_summary} gridHeader="purchase_gst_daily_summary_report" gridId="grd_purchase_gst_daily_summary_report" />, formCode: "RPTPITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_daily_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'daily_summary', icon: AiOutlineFileText },
      { id: 1901, element: <GSTTaxwise dataUrl={urls.purchase_gst_taxwise} gridHeader="purchase_gst_taxwise_report" gridId="grd_purchase_gst_taxwise_report" />, formCode: "RPTPITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_taxwise_report`, type: 'link', routePath: '', active: false, selected: false, title: 'taxwise', icon: AiOutlineFileText },
      { id: 1902, element: <GSTTaxwiseWithHSN dataUrl={urls.purchase_gst_taxwise_with_hsn} gridHeader="purchase_gst_taxwise_with_hsn_report" gridId="grd_purchase_gst_taxwise_with_hsn_report" />, formCode: "RPTPITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_taxwise_with_hsn_report`, type: 'link', routePath: '', active: false, selected: false, title: 'taxwise_with_hsn', icon: AiOutlineFileText },
      { id: 1903, element: <GSTMonthlySummary dataUrl={urls.purchase_gst_monthly_summary} gridHeader="purchase_gst_monthly_summary_report" gridId="grd_purchase_gst_monthly_summary_report" />, formCode: "RPTPITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_monthly_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'monthly_summary', icon: AiOutlineFileText },
      { id: 1904, element: <GSTDetailed dataUrl={urls.purchase_gst_detailed} gridHeader="purchase_gst_detailed_report" gridId="grd_purchase_gst_detailed_report" />, formCode: "RPTPITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_detailed_report`, type: 'link', routePath: '', active: false, selected: false, title: 'detailed', icon: AiOutlineFileText },
      { id: 1905, element: <GSTRegisterFormat dataUrl={urls.purchase_gst_register_format} gridHeader="purchase_gst_register_format_report" gridId="grd_purchase_gst_register_report" />, formCode: "RPTPITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_register_format_report`, type: 'link', routePath: '', active: false, selected: false, title: 'register_format', icon: AiOutlineFileText },
      { id: 1906, element: <GSTAdvRegisterFormat dataUrl={urls.purchase_gst_adv_register_format} gridHeader="purchase_gst_advanced_register_format_report" gridId="grd_purchase_gst_adv_register_report" />, formCode: "RPTPITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_adv_register_format_report`, type: 'link', routePath: '', active: false, selected: false, title: 'adv_register_format', icon: AiOutlineFileText },
      //#endregion global  
    ]
  },
  {
    icon: (<Boxes className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'purchase_return_tax_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      //#region global
      //purchase return Tax
      { id: 2000, element: <GSTDailySummary dataUrl={urls.purchase_return_gst_daily_summary} gridHeader="purchase_return_gst_daily_summary_report" gridId="grd_purchase_return_gst_daily_summary_report" />, formCode: "RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_daily_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'daily_summary', icon: AiOutlineFileText },
      { id: 2001, element: <ReturnTaxGSTSalesAndReturn dataUrl={urls.purchase_return_gst_sales_and_return} gridHeader="gst_purchase_return_report" gridId="grd_purchase_return_gst_sales_and_return_report" />, formCode: "RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_sales_and_return_report`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_and_return', icon: AiOutlineFileText },
      { id: 2002, element: <GSTTaxwise dataUrl={urls.purchase_return_gst_taxwise} gridHeader="purchase_return_gst_taxwise_report" gridId="grd_purchase_return_gst_taxwise_report" />, formCode: "RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_taxwise_report`, type: 'link', routePath: '', active: false, selected: false, title: 'taxwise', icon: AiOutlineFileText },
      { id: 2003, element: <GSTTaxwiseWithHSN dataUrl={urls.purchase_return_gst_taxwise_with_hsn} gridHeader="purchase_return_gst_taxwise_with_hsn_report" gridId="grd_purchase_return_gst_taxwise_with_hsn_report" />, formCode: "RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_taxwise_with_hsn_report`, type: 'link', routePath: '', active: false, selected: false, title: 'taxwise_with_hsn', icon: AiOutlineFileText },
      { id: 2004, element: <GSTMonthlySummary dataUrl={urls.purchase_return_gst_monthly_summary} gridHeader="purchase_return_gst_monthly_summary_report" gridId="grd_purchase_return_gst_monthly_summary_report" />, formCode: "RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_monthly_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'monthly_summary', icon: AiOutlineFileText },
      { id: 2005, element: <GSTDetailed dataUrl={urls.purchase_return_gst_detailed} gridHeader="purchase_return_gst_detailed_report" gridId="grd_purchase_return_gst_detailed_report" />, formCode: "RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_detailed_report`, type: 'link', routePath: '', active: false, selected: false, title: 'detailed', icon: AiOutlineFileText },
      { id: 2006, element: <GSTRegisterFormat dataUrl={urls.purchase_return_gst_register_format} gridHeader="purchase_return_gst_register_format_report" gridId="grd_purchase_return_gst_register_report" />, formCode: "RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_register_format_report`, type: 'link', routePath: '', active: false, selected: false, title: 'register_format', icon: AiOutlineFileText },
      { id: 2007, element: <GSTAdvRegisterFormat dataUrl={urls.purchase_return_gst_adv_register_format} gridHeader="purchase_return_gst_advanced_register_format_report" gridId="grd_purchase_return_gst_adv_register_report" />, formCode: "RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_adv_register_format_report`, type: 'link', routePath: '', active: false, selected: false, title: 'adv_register_format', icon: AiOutlineFileText },
      //#endregion global
    ]
  },
  {
    icon: (<Boxes className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'tax_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 600, element: <PurchaseTaxReport />, formCode: "TAXRPT", action: UserAction.Show, path: `/reports/_/inventory/purchase_tax_vat`, type: 'link', routePath: '', active: false, selected: false, title: 'purchase_tax', icon: AiOutlineFileText },
      { id: 601, element: <SalesTax />, formCode: "TAXRPT", action: UserAction.Show, path: `/reports/_/inventory/sales_tax_report`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_tax', icon: AiOutlineFileText },
      { id: 602, element: <VatReturnForm />, formCode: "TAXRPT", action: UserAction.Show, path: `/reports/_/inventory/vat_return_form`, type: 'link', routePath: '', active: false, selected: false, title: 'vat_return_form', icon: AiOutlineFileText },
      { id: 603, element: <VatReturnFormArabic />, formCode: "TAXRPT", action: UserAction.Show, path: `/reports/_/inventory/vat_return_form_arabic`, type: 'link', routePath: '', active: false, selected: false, title: 'vat_return_form_arabic', icon: AiOutlineFileText },
      { id: 604, element: <KsaEInvoiceReportSummary />, formCode: "TAXRPT", action: UserAction.Show, path: `/reports/_/inventory/ksa_e_invoice_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'ksa_e_invoice_summary', icon: AiOutlineFileText },
      { id: 605, element: <KsaEInvoiceReportDetailed />, formCode: "TAXRPT", action: UserAction.Show, path: `/reports/_/inventory/ksa_e_invoice_detailed_report`, type: 'link', routePath: '', active: false, selected: false, title: 'ksa_e_invoice_detailed', icon: AiOutlineFileText },
      { id: 606, element: <GSTR1B2B />, formCode: "GSTR1", action: UserAction.Show, path: `/reports/_/inventory/gstr1b2b_report`, type: 'link', routePath: '', active: false, selected: false, title: 'gstr1_b2b', icon: AiOutlineFileText },
      { id: 607, element: <GSTR1B2CLarge />, formCode: "GSTR1", action: UserAction.Show, path: `/reports/_/inventory/gstr1b2cLarge_report`, type: 'link', routePath: '', active: false, selected: false, title: 'gstr1_b2cLarge', icon: AiOutlineFileText },
      { id: 608, element: <GSTR1B2CSmall />, formCode: "GSTR1", action: UserAction.Show, path: `/reports/_/inventory/gstr1b2cSmall_report`, type: 'link', routePath: '', active: false, selected: false, title: 'gstr1b2c_Small', icon: AiOutlineFileText },
      { id: 609, element: <GSTR1CDNR />, formCode: "GSTR1", action: UserAction.Show, path: `/reports/_/inventory/gstr1cdnr_report`, type: 'link', routePath: '', active: false, selected: false, title: 'gstr1_cdnr', icon: AiOutlineFileText },
      { id: 610, element: <GSTR1CDNUR />, formCode: "GSTR1", action: UserAction.Show, path: `/reports/_/inventory/gstr1cdnur_report`, type: 'link', routePath: '', active: false, selected: false, title: 'gstr1_cdnur', icon: AiOutlineFileText },
      { id: 611, element: <GSTR1HSNSummary />, formCode: "GSTR1", action: UserAction.Show, path: `/reports/_/inventory/gstr1hsnSummary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'gstr1_summary_of_hsn', icon: AiOutlineFileText },
      { id: 612, element: <GSTR1Docs />, formCode: "GSTR1", action: UserAction.Show, path: `/reports/_/inventory/gstr1Docs_report`, type: 'link', routePath: '', active: false, selected: false, title: 'gstr1_docs', icon: AiOutlineFileText },
      { id: 613, element: <GSTR3BReport />, formCode: "GSTR3B", action: UserAction.Show, path: `/reports/_/inventory/gstr3b_report`, type: 'link', routePath: '', active: false, selected: false, title: 'gstr3b', icon: AiOutlineFileText },
    ]
  },
  {
    icon: (<CircleUser className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'advanced_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 1200, element: <FastMovingProductsReport />, formCode: "FMVGRPT", action: UserAction.Show, path: `/reports/_/inventory/fast_moving_products_report`, type: 'link', active: false, selected: false, title: 'fast_moving_products', icon: PiPackageLight, routePath: "" },
      { id: 1201, element: <UnsoldProductReport />, formCode: "UNSLDPRD", action: UserAction.Show, path: `/reports/_/inventory/unsoled_products`, type: 'link', active: false, selected: false, title: 'unsoled_products', icon: PiPackageLight, routePath: "" },
      { id: 1202, element: <LPOReport />, formCode: "LPORPT", action: UserAction.Show, path: `/reports/_/inventory/lpo_report`, type: 'link', active: false, selected: false, title: 'lpo_report', icon: PiPackageLight, routePath: "" },
      { id: 1203, element: <RouteWiseSalesAndCollection />, formCode: "ROUTWISE_SL_CR_1", action: UserAction.Show, path: `/reports/_/inventory/routewise_sales_collection_report`, type: 'link', active: false, selected: false, title: 'routewise_sales_collection', icon: PiPackageLight, routePath: "" },
      { id: 1204, element: <BranchInventoryRequestPendingOrder />, formCode: "ADVBRNCHPEN", action: UserAction.Show, path: `/reports/_/inventory/branch_inventory_request_pending_order_report`, type: 'link', active: false, selected: false, title: 'branch_inventory_request_pending_order', icon: PiPackageLight, routePath: "" },
      { id: 1205, element: <PrintDetails />, formCode: "ADVPRINT", action: UserAction.Show, path: `/reports/_/inventory/print_details_report`, type: 'link', active: false, selected: false, title: 'print_details', icon: PiPackageLight, routePath: "" },
      { id: 1206, element: <InventoryStatusReport />, formCode: "INVSTATUSRPT", action: UserAction.Show, path: `/reports/_/inventory/inventory_status_report`, type: 'link', active: false, selected: false, title: 'inventory_status', icon: PiPackageLight, routePath: "" },
      { id: 1207, element: <VoidReport />, formCode: "RPTADVOID", action: UserAction.Show, path: `/reports/_/inventory/void_report`, type: 'link', active: false, selected: false, title: 'void_report', icon: PiPackageLight, routePath: "" },
    ]
  },
  {
    icon: (<Boxes className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'stock_journal_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 800, element: <StockJournalReport dataUrl={urls.opening_stock} gridHeader="opening_stock_report" gridId="grd_opening_stock_journal" />, formCode: "OSRPT", action: UserAction.Show, path: `/reports/_/inventory/opening_stock_report`, type: 'link', routePath: '', active: false, selected: false, title: 'opening_stock', icon: PiPackageLight },
      { id: 801, element: <StockJournalReport dataUrl={urls.stock_transfer} gridHeader="stock_transfer_report" gridId="grd_stock_transfer_journal" />, formCode: "STRPT", action: UserAction.Show, path: `/reports/_/inventory/stock_transfer_report`, type: 'link', active: false, selected: false, title: 'stock_transfer', icon: PiPackageLight, routePath: "" },
      { id: 802, element: <StockJournalReport dataUrl={urls.damage_stock} gridHeader="damage_stock_report" gridId="grd_damage_stock_journal" />, formCode: "DMGRPT", action: UserAction.Show, path: `/reports/_/inventory/damage_stock_report`, type: 'link', active: false, selected: false, title: 'damage_stock', icon: PiPackageLight, routePath: "" },
      { id: 803, element: <StockJournalReport dataUrl={urls.excess_stock} gridHeader="excess_stock_report" gridId="grd_excess_stock_journal" />, formCode: "EXRPT", action: UserAction.Show, path: `/reports/_/inventory/excess_stock_report`, type: 'link', active: false, selected: false, title: 'excess_stock', icon: PiPackageLight, routePath: "" },
      { id: 804, element: <StockJournalReport dataUrl={urls.shortage_stock} gridHeader="shortage_stock_report" gridId="grd_shortage_stock_journal" />, formCode: "SHRPT", action: UserAction.Show, path: `/reports/_/inventory/shortage_stock_report`, type: 'link', active: false, selected: false, title: 'shortage_stock', icon: PiPackageLight, routePath: "" },
      { id: 805, element: <BranchTransferOutIn dataUrl={urls.branch_transfer_out} gridHeader="branch_transfer_out_report" gridId="grd_branch_transfer_out" />, formCode: "BTORPT", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_out_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_out', icon: PiPackageLight, routePath: "" },
      { id: 806, element: <BranchTransferOutIn dataUrl={urls.branch_transfer_in} gridHeader="branch_transfer_in_report" gridId="grd_branch_transfer_in" />, formCode: "BTIRPT", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_in_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_in', icon: PiPackageLight, routePath: "" },
      { id: 807, element: <BranchTransferSummary dataUrl={urls.branch_transfer_summary_out} gridHeader="branch_transfer_summary_out_report" gridId="grd_branch_transfer_summary_out" />, formCode: "BTOSRPT", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_summary_out_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_summary_out', icon: PiPackageLight, routePath: "" },
      { id: 808, element: <BranchTransferSummary dataUrl={urls.branch_transfer_summary_in} gridHeader="branch_transfer_summary_in_report" gridId="grd_branch_transfer_summary_in" />, formCode: "BTISRPT", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_summary_in_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_summary_in', icon: PiPackageLight, routePath: "" },
      //#region global
      //Settings.InventorySettings.EnableAddStockAdjustment for sp //settings visible false for gcc
      { id: 809, element: <StockJournalReport dataUrl={urls.stock_journal_excess_stock_sp} gridHeader="excess_stock_sp" gridId="grd_stock_journal_excess_stock_sp" />, formCode: "EX-SPRPT", action: UserAction.Show, path: `/reports/_/inventory/stock_journal_excess_stock_sp`, type: 'link', active: false, selected: false, title: 'excess_stock_sp', icon: PiPackageLight, routePath: "" },
      { id: 810, element: <StockJournalReport dataUrl={urls.stock_journal_shortage_stock_sp} gridHeader="shortage_stock_sp" gridId="grd_stock_journal_shortage_stock_sp" />, formCode: "SH-SPRPT", action: UserAction.Show, path: `/reports/_/inventory/stock_journal_shortage_stock_sp`, type: 'link', active: false, selected: false, title: 'shortage_stock_sp', icon: PiPackageLight, routePath: "" },
      //#endregion global
    ]
  },
  //show only when Settings.InventorySettings.autoSyncSIandPI_BT (in mscellaneous and settings visible only on global)
  {
    icon: (<CircleUser className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'sales_transfer',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 400, element: <SummaryReport dataUrl={urls.sales_transfer_summary} gridHeader="sales_transfer_summary" gridId="grd_sales_transfer_summary" />, formCode: "RPTSITRNRS", action: UserAction.Show, path: `/reports/_/inventory/summary_sales_transfer_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_transfer_summary', icon: FaHandHoldingDollar },
      { id: 401, element: <RegisterReport dataUrl={urls.sales_transfer_register} gridHeader="sales_transfer_register" gridId="grd_sales_transfer_register" />, formCode: "RPTSITRNRS", action: UserAction.Show, path: `/reports/_/inventory/register_sales_transfer_register_report`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_transfer_register', icon: GiReceiveMoney },
      { id: 402, element: <NetSalesReport dataUrl={urls.net_sales_transfer_report} gridHeader="net_sales_transfer_report" gridId="grd_net_sales_transfer_report" />, formCode: "RPTSITRNRS", action: UserAction.Show, path: `/reports/_/inventory/net_sales_transfer_report`, type: 'link', routePath: '', active: false, selected: false, title: 'net_sales_transfer_report', icon: GiSwapBag },
      { id: 403, element: <PartyWiseReport dataUrl={urls.sales_transfer_partyWise_sales} gridHeader="sales_transfer_partyWise_sales" gridId="grd_sales_transfer_partyWise_sales" />, formCode: "RPTSITRNRS", action: UserAction.Show, path: `/reports/_/inventory/partywise_sales_transfer_partyWise_sales`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_transfer_partyWise_sales', icon: FaSackDollar },
      { id: 404, element: <SalesTransferMonthWiseSummaryReport dataUrl={urls.sales_transfer_monthWise_summary} gridHeader="sales_transfer_monthWise_summary" gridId="grd_sales_transfer_monthWise_summary" />, formCode: "RPTSITRNRS", action: UserAction.Show, path: `/reports/_/inventory/monthly_sales_transfer_monthWise_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_transfer_monthWise_summary', icon: FaSackDollar },
      { id: 405, element: <PartyMonthwiseSummaryReport dataUrl={urls.sales_transfer_partyWise_summary} gridHeader="sales_transfer_partyWise_summary" gridId="grd_sales_transfer_partyWise_summary" />, formCode: "RPTSITRNRS", action: UserAction.Show, path: `/reports/_/inventory/_partywsie_sales_transfer_partyWise_summary_report`, type: 'link', routePath: '', active: false, selected: false, title: 'sales_transfer_partyWise_summary', icon: FaSackDollar },
    ]
  },
  {
    icon: (<CircleUser className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'sales_other_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 1600, element: <CouponReports />, formCode: "COUPSALRPT", action: UserAction.Show, path: `/reports/_/inventory/coupon_reports`, type: 'link', active: false, selected: false, title: 'coupon_reports', icon: PiPackageLight, routePath: "" },
      { id: 1601, element: <SchemeWiseSales />, formCode: "ITMSCMSRPT", action: UserAction.Show, path: `/reports/_/inventory/scheme_wise_sales_report`, type: 'link', active: false, selected: false, title: 'scheme_wise_sales', icon: PiPackageLight, routePath: "" },
    ]
  },
  {
    icon: (<Boxes className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'daily_statement',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 900, element: <DailyStatementReport dataUrl={urls.daily_statement_sales} gridHeader="daily_statement_report_of_sales" gridId={GridId.daily_statement_sales} />, formCode: "DSTRPT", action: UserAction.Show, path: `/reports/_/inventory/daily_statement_sales`, type: 'link', routePath: '', active: false, selected: false, title: 'daily_statement_sales', icon: AiOutlineFileText },
      { id: 901, element: <DailyStatementReport dataUrl={urls.daily_statement_purchase} gridHeader="daily_statement_report_of_purchase" gridId={GridId.daily_statement_purchase} />, formCode: "DSTRPT", action: UserAction.Show, path: `/reports/_/inventory/daily_statement_purchase`, type: 'link', routePath: '', active: false, selected: false, title: 'daily_statement_purchase', icon: AiOutlineFileText },
      { id: 902, element: <DailyStatementAllReport />, formCode: "DSTRPT", action: UserAction.Show, path: `/reports/_/inventory/daily_statement_all`, type: 'link', routePath: '', active: false, selected: false, title: 'daily_statement_all', icon: AiOutlineFileText },
    ]
  },
  {
    icon: (<CircleUser className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'customer_visit_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 1000, element: <CustomerVisitTotalVisit />, formCode: "RPTTOTVIS", action: UserAction.Show, path: `/reports/_/inventory/customer_visit_total_visit`, type: 'link', active: false, selected: false, title: 'customer_visit_total_visit', icon: PiPackageLight, routePath: "" },
      { id: 1001, element: <CustomerVisitLastVisit />, formCode: "RPTLAVIDET", action: UserAction.Show, path: `/reports/_/inventory/customer_visit_last_visit`, type: 'link', active: false, selected: false, title: 'customer_visit_last_visit', icon: PiPackageLight, routePath: "" },
    ]
  },
  {
    icon: (<CircleUser className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'discount_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 1100, element: <DiscountReportInventory />, formCode: "RPTINV", action: UserAction.Show, path: `/reports/_/inventory/discount_report_inventory`, type: 'link', active: false, selected: false, title: 'discount_report_inventory', icon: PiPackageLight, routePath: "" },
      { id: 1101, element: <DiscountReportCollection />, formCode: "RPTCOL", action: UserAction.Show, path: `/reports/_/inventory/discount_report_collection`, type: 'link', active: false, selected: false, title: 'discount_report_collection', icon: PiPackageLight, routePath: "" },
    ]
  },
  {
    icon: (<CircleUser className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'inventory_price_reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 1400, element: <DiagnosisDynamicReport dataUrl={urls.diagnosis_report_sales_price_category_greater_than_mrp} gridHeader="diagnosis_report_sales_price_category_greater_than_mrp" gridId="grd_diagnosis_report_sales_price_category_greater_than_mrp" />, formCode: "INVPR", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_sales_price_category_greater_than_mrp`, type: 'link', active: false, selected: false, title: 'sales_price_category_greater_than_mrp', icon: PiPackageLight, routePath: "" },
      { id: 1401, element: <DiagnosisDynamicReport dataUrl={urls.inventory_price_report_products_with_price_category} gridHeader="inventory_report_of_products_with_all_price_category" gridId="grd_inventory_price_report_products_with_price_category" />, formCode: "INVPR", action: UserAction.Show, path: `/reports/_/inventory/inventory_price_report_products_with_price_category`, type: 'link', active: false, selected: false, title: 'products_with_price_categories', icon: PiPackageLight, routePath: "" },
      { id: 1402, element: <DiagnosisReport dataUrl={urls.diagnosis_report_of_zero_mrp_product_list} gridHeader="diagnosis_report_of_zero_mrp_product_list" gridId="grd_diagnosis_report_of_zero_mrp_product_list" />, formCode: "INVPR", action: UserAction.Show, path: `/reports/_/inventory/diagnosis_report_of_zero_mrp_product_list`, type: 'link', active: false, selected: false, title: 'zero_mrp_product_list', icon: PiPackageLight, routePath: "" },
    ]
  },
];