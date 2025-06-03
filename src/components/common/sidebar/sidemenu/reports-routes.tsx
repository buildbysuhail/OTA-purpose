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
const TrialBalance = lazy(() => import("../../../../pages/accounts/reports/trialBalance/trial-balance"));
const StockFlow = lazy(() => import("../../../../pages/inventory/reports/stock-flow/stock-flow-report"));
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
const SummaryReport = lazy(() => import("../../../../pages/inventory/reports/summary-report/summary-report"));
const RegisterReport = lazy(() => import("../../../../pages/inventory/reports/register-report/register-report"));
const PartyWiseReport = lazy(() => import("../../../../pages/inventory/reports/party-wise-report/party-wise-report"));
const TaxReportDetailed = lazy(() => import("../../../../pages/inventory/reports/purchase-tax-report-detailed/purchase-tax-report-detailed"));
const TaxReportSummary = lazy(() => import("../../../../pages/inventory/reports/purchase-tax-report-summary/purchase-tax-report-summary"));
const CreditPurchaseSummaryReport = lazy(() => import("../../../../pages/inventory/reports/credit-purchase-summary-report/credit-purchase-summary-report"));
const PartyMonthwiseSummaryReport = lazy(() => import("../../../../pages/inventory/reports/Party-monthwise-purchase-summary-report/Party-monthwise-purchase-summary-report"));
const PurchaseOrderTransitReport = lazy(() => import("../../../../pages/inventory/reports/Purchase-order-transit-report/Purchase-order-transit-report"));
const PurchaseTaxGSTDailySummary = lazy(() => import("../../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-daily-summary-report"));
const PurchaseTaxGSTAdvRegisterFormat = lazy(() => import("../../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-adv-register-format-report"));
const PurchaseTaxGSTRegisterFormat = lazy(() => import("../../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-register-format-report"));
const PurchaseTaxGSTDetailed = lazy(() => import("../../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-detailed-report"));
const PurchaseTaxGSTMonthlySummary = lazy(() => import("../../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-monthly-summary-report"));
const PurchaseTaxGSTTaxwiseWithHSN = lazy(() => import("../../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-taxwise-with-hsn-report"));
const PurchaseTaxGSTTaxwise = lazy(() => import("../../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-taxwise-report"));
const PurchaseReturnTaxGSTSalesAndReturn = lazy(() => import("../../../../pages/inventory/reports/purchase-return-tax-gst-reports/purchase-return-tax-gst-sales-and-return-report"));
const BranchTransferOut = lazy(() => import("../../../../pages/inventory/reports/branch-transfer-out-report/branch-tranfer-out"));
const BranchTransferIn = lazy(() => import("../../../../pages/inventory/reports/branch-transfer-in-report/branch-tranfer-in"));
const BranchTransferSummaryOut = lazy(() => import("../../../../pages/inventory/reports/branch-transfer-summary-out-report/branch-tranfer-summary-out"));
const BranchTransferSummaryIn = lazy(() => import("../../../../pages/inventory/reports/branch-transfer-summary-in-report/branch-tranfer-summary-in"));
const ItemWiseSummaryReport = lazy(() => import("../../../../pages/inventory/reports/itemwise-summary-report/itemwise-summary"));
const StockSummary = lazy(() => import("../../../../pages/inventory/reports/stock-summary-report/stock-summary"));
const StockLedger = lazy(() => import("../../../../pages/inventory/reports/stock-ledger/stock-ledger-report"));
const ExpiryReport = lazy(() => import("../../../../pages/inventory/reports/expiry-report/expiry-report"));
const TransactionAnalysisReport = lazy(() => import("../../../../pages/inventory/reports/transaction-analysis-report/transaction-analysis-report"));
const SalesAndSalesReturn = lazy(() => import("../../../../pages/inventory/reports/sales-and-sales-return-report/sales-and-sales-return"));
const NetSalesReport = lazy(() => import("../../../../pages/inventory/reports/net-sales-report/net-sales"));
const DaywiseSummaryWithProfit = lazy(() => import("../../../../pages/inventory/reports/daywise-summary-with-profit-report/daywise-summary-with-profit"));
const GroupwiseSalesSummaryDevexpress = lazy(() => import("../../../../pages/inventory/reports/groupwise-sales-summary/groupwise-sales-summary-devexpress"));
const GroupwiseSalesSummary = lazy(() => import("../../../../pages/inventory/reports/groupwise-sales-summary/groupwise-sales-summary"));
const SalesmanwiseSalesAndCollection = lazy(() => import("../../../../pages/inventory/reports/salesman-wise-sales-and-collection-report/salesman-wise-sales-and-collection"));
const NonInvoicedGoodsDelivery = lazy(() => import("../../../../pages/inventory/reports/non-invoiced-goods-delivery-report/non-invoiced-goods-delivery"));
const PendingOrderReport = lazy(() => import("../../../../pages/inventory/reports/pending-order-report/pending-order"));
const PromotionalSalesReport = lazy(() => import("../../../../pages/inventory/reports/promotional-sales-report/promotional-sales"));
const GroupedBrandwiseSales = lazy(() => import("../../../../pages/inventory/reports/grouped-brandwise-sales-report/grouped-brandwise-sales"));
const CouponReports = lazy(() => import("../../../../pages/inventory/reports/coupon-report/coupon-report"));
const SchemeWiseSales = lazy(() => import("../../../../pages/inventory/reports/scheme-wise-sales-report/scheme-wise-sales"));
const RouteWiseSalesAndCollection = lazy(() => import("../../../../pages/inventory/reports/routewise-sales-and-collection-report/routewise-sales-and-collection"));
const BranchInventoryRequestPendingOrder = lazy(() => import("../../../../pages/inventory/reports/branch-inventory-request-pending-order-report/branch-inventory-request-pending-order"));
const PrintDetails = lazy(() => import("../../../../pages/inventory/reports/print-details-report/print-details"));
const InventoryStatusReport = lazy(() => import("../../../../pages/inventory/reports/inventory-status-report/inventory-status"));
const VoidReport = lazy(() => import("../../../../pages/inventory/reports/void-report/void-report"));
const CounterReport = lazy(() => import("../../../../pages/inventory/reports/counter-report/counter-report"));
const DiagnosisReport = lazy(() => import("../../../../pages/inventory/reports/diagnosis-report/diagnosis-report"));
const DiagnosisReportZeroRateProductlist = lazy(() => import("../../../../pages/inventory/reports/diagnosis-report/diagnosis-report-zero-rate-productlist"));
const DiagnosisReportPostDatedTransactions = lazy(() => import("../../../../pages/inventory/reports/diagnosis-report/diagnosis-report-post-dated-transactions"));
const DiagnosisReportSalesPriceLessThanLPCost = lazy(() => import("../../../../pages/inventory/reports/diagnosis-report/diagnosis-report-sales-price-less-than-lp-cost"));
const DiagnosisReportSalesPriceLessthanPurchasePrice = lazy(() => import("../../../../pages/inventory/reports/diagnosis-report/diagnosis-report-sales-price-less-than-purchase-price"));
const DiagnosisReportSalesPriceLessthanMSP = lazy(() => import("../../../../pages/inventory/reports/diagnosis-report/diagnosis-report-sales-price-less-than-msp"));
const DiagnosisReportSalesPriceGreaterthanMRP = lazy(() => import("../../../../pages/inventory/reports/diagnosis-report/diagnosis-report-sales-price-greater-than-mrp"));
const CustomerVisitTotalVisit = lazy(() => import("../../../../pages/inventory/reports/customer-visit-total-visit-report/customer-visit-total-visit-report"));
const CustomerVisitLastVisit = lazy(() => import("../../../../pages/inventory/reports/customer-visit-last-visit-report/customer-visit-last-visit-report"));
const FOCRegisterReport = lazy(() => import("../../../../pages/inventory/reports/foc-register-report/foc-register-report"));
const DiscountReportInventory = lazy(() => import("../../../../pages/inventory/reports/discount_report_inventory-report/discount_report_inventory-report"));
const DiscountReportCollection = lazy(() => import("../../../../pages/inventory/reports/discount_report_collection-report/discount_report_collection-report"));
const ItemUsedForService = lazy(() => import("../../../../pages/inventory/reports/item_used_for_service-report/item_used_for_service-report"));
const LPOReport = lazy(() => import("../../../../pages/inventory/reports/lpo_report/lpo_report"));
const SalesTransferMonthWiseSummaryReport = lazy(() => import("../../../../pages/inventory/reports/sales-transfer-monthWise-summary/sales-transfer-monthwise-summary-report"));
const PurchaseTaxReport = lazy(() => import("../../../../pages/inventory/reports/tax-reports-ksa/Purchase-Tax-report"));
const SalesTax = lazy(() => import("../../../../pages/inventory/reports/tax-reports-ksa/sales-tax"));
const VatReturnForm = lazy(() => import("../../../../pages/inventory/reports/tax-reports-ksa/vat-return-form/Vat-Return-Form"));
const VatReturnFormArabic = lazy(() => import("../../../../pages/inventory/reports/tax-reports-ksa/vat-return-form/Vat-Return-Form-arabic"));
const KsaEInvoiceReportSummary = lazy(() => import("../../../../pages/inventory/reports/tax-reports-ksa/ksa-e-invoice-report/ksa-e-invoice-summary.tsx"));
const KsaEInvoiceReportDetailed = lazy(() => import("../../../../pages/inventory/reports/tax-reports-ksa/ksa-e-invoice-report/ksa-e-invoice-detailed"));
const GSTR1B2B = lazy(() => import("../../../../pages/inventory/reports/GSTR1/gstr1-b2b"));
const GSTR1B2CLarge = lazy(() => import("../../../../pages/inventory/reports/GSTR1/gstr1-b2c-large"));
const GSTR1B2CSmall = lazy(() => import("../../../../pages/inventory/reports/GSTR1/gstr1-b2c-small"));
const GSTR1CDNR = lazy(() => import("../../../../pages/inventory/reports/GSTR1/gstr1-cdnr"));
const GSTR1CDNUR = lazy(() => import("../../../../pages/inventory/reports/GSTR1/gstr1-cdnur"));
const GSTR1HSNSummary = lazy(() => import("../../../../pages/inventory/reports/GSTR1/gstr1-summaryOfHSN"));
const GSTR1Docs = lazy(() => import("../../../../pages/inventory/reports/GSTR1/gstr1-docs"));
const GSTR3BReport = lazy(() => import("../../../../pages/inventory/reports/GSTR3B/gstr3b"));
const DailyStatementReport = lazy(() => import("../../../../pages/inventory/reports/daily-statement-report/daily-statement-report"));
const DailyStatementAllReport = lazy(() => import("../../../../pages/inventory/reports/daily-statement-report/daily-statement-all-report "));
const PriceList = lazy(() => import("../../../../pages/inventory/reports/price-list/price-list-report"));
const DailyBalanceAmount = lazy(() => import("../../../../pages/inventory/reports/daily-balance/daily-balance-report"));
const ProductSummaryMaster = lazy(() => import("../../../../pages/inventory/reports/product-summary/product-summary-master"));
const InventorySummaryReport = lazy(() => import("../../../../pages/inventory/reports/inventory-summary-report/inventory-summary-report"));
const ServiceReport = lazy(() => import("../../../../pages/inventory/reports/service-report/service-report"));
const SalesmanIncentiveReport = lazy(() => import("../../../../pages/inventory/reports/salesman-incentive-report/salesman-incentive-report"));
const PrivilegeCardReport = lazy(() => import("../../../../pages/inventory/reports/privilege-card-report/privilege-card"));
const StockJournalReport = lazy(() => import("../../../../pages/inventory/reports/stock-journal-report/stock-journal"));

import urls from "../../../../redux/urls";
import GridId from "../../../../redux/gridId";
import { GroupwiseSalesSummaryFilterInitialState } from "../../../../pages/inventory/reports/groupwise-sales-summary/groupwise-sales-summary-filter";
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
export const ReportsMenuItems :NavigationParentItem[]= [
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
      { id: 1,element:<TrialBalance />, formCode:"TBRpt", action: UserAction.Show, path: `/reports/_/accounts/trial_balance`, routePath: `/accounts/trial_balance`, type: 'link',  active: false, selected: false, title: 'trial_balance', icon: SlEqualizer },
      { id: 2,element:<TrialBalancePeriodwise />, formCode:"TBRpt", action: UserAction.Show,  path: `/reports/_/accounts/trial_balance_period_wise`, routePath: `/accounts/trial_balance_period_wise`, type: 'link', active: false, selected: false, title: 'trial_balance_periodwise', icon: ImEqualizer2 },
      // { id: 3,element:<ProfitAndLossReport />, formCode:"PLRPT", action: UserAction.Show, path: `/reports/_/accounts/profit_and_loss`, type: 'link', routePath:'', active: false, selected: false, title: 'profit_&_loss_account', icon: TrendingUp },
      // { id: 4,element:<ProfitAndLossDetailedReport />, formCode:"PLRPT", action: UserAction.Show, path: `/reports/_/accounts/profit_and_loss_detailed`, type: 'link', routePath:'', active: false, selected: false, title: 'profit_&_loss_account_detailed', icon: TfiStatsUp },
      // { id: 5,element:<BalanceSheet />, formCode:"BSRPT", action: UserAction.Show, path: `/reports/_/accounts/balance_sheet`, type: 'link', routePath:'', active: false, selected: false, title: 'balance_sheet', icon: Scale },
      // { id: 6,element:<BalancesheetVertical />, formCode:"BSRPT", action: UserAction.Show, path: `/reports/_/accounts/balance_sheet_detailed`, type: 'link', routePath:'', active: false, selected: false, title: 'balance_sheet_detailed', icon: FaScaleUnbalancedFlip },
    { id: 100, routePath:"", element:<TransactionReport />, formCode:"TRANSRPT", action: UserAction.Show, path: `/reports/_/accounts/transaction_report`, type: 'link', active: false, selected: false, title: 'transaction_report', icon: FiFileText },
      { id: 101, routePath:"",element:<AccountsHistoryReport />, formCode:"RPTTRAHST", action: UserAction.Show, path: `/reports/_/accounts/transaction_history_accounts`, type: 'link', active: false, selected: false, title: 'transaction_history_accounts', icon: LuHistory },
      { id: 102, routePath:"",element:<InventoryHistoryReport />, formCode:"RPTTRAHST", action: UserAction.Show, path: `/reports/_/accounts/transaction_history_inventory`, type: 'link', active: false, selected: false, title: 'transaction_history_inventory', icon: MdOutlineManageHistory },
      { id: 103, routePath:"",element:<DailySummaryMaster />, formCode:"DSUMRPT", action: UserAction.Show, path: `/reports/_/accounts/daily_summary_report`, type: 'link', active: false, selected: false, title: 'daily_summary_report', icon: CalendarClock },
      { id: 104, routePath:"",element:<DailySummaryGlobal />, formCode:"DSUMRPT", action: UserAction.Show, path: `/reports/_/accounts/daily_summary_report`, type: 'link', active: false, selected: false, title: 'daily_summary_report___', icon: CalendarClock },
      { id: 105, routePath:"",element:<BillwiseProfit />, formCode:"PFTRPT", action: UserAction.Show, path: `/reports/_/accounts/billwise_profit`, type: 'link', active: false, selected: false, title: 'billwise_profit_report', icon: ChartNoAxesCombined },
      { id: 106, routePath:"",element:<BillwiseProfitGlobal />, formCode:"PFTRPT", action: UserAction.Show, path: `/reports/_/accounts/billwise_profit`, type: 'link', active: false, selected: false, title: 'billwise_profit_report___', icon: ChartNoAxesCombined },
      { id: 107, routePath:"",element:<PartySummaryMaster />, formCode:"PRTSUM", action: UserAction.Show, path: `/reports/_/accounts/partywise_summary`, type: 'link', active: false, selected: false, title: 'partywise_summary_report', icon: Component },
      { id: 108, routePath:"",element:<OutstandingAccountPayableReport />, formCode:"RPTACCPAY", action: UserAction.Show, path: `/reports/_/accounts/outstanding_payable`, type: 'link', active: false, selected: false, title: 'account_payable', icon: LucideCreditCard },
      { id: 109, routePath:"",element:<OutstandingAccountReceivableReport />, formCode:"RPTACCREC", action: UserAction.Show, path: `/reports/_/accounts/outstanding_receivable`, type: 'link', active: false, selected: false, title: 'account_receivable', icon: LucideDollarSign },
      { id: 110, routePath:"",element:<OutstandingAccountPayableAgingReport />, formCode:"APAGINGRPT", action: UserAction.Show, path: `/reports/_/accounts/outstanding_aging_payable`, type: 'link', active: false, selected: false, title: 'account_payable_aging_report', icon: Clock1Icon },
      { id: 111, routePath:"",element:<OutstandingAccountReceivableAgingReport />, formCode:"ARAGINGRPT", action: UserAction.Show, path: `/reports/_/accounts/outstanding_aging_receivable`, type: 'link', active: false, selected: false, title: 'account_receivable_aging_report', icon: Calendar },
      { id: 112, routePath:"",element:<LedgerReport />, formCode:"LEDGRRPT", action: UserAction.Show, path: `/reports/_/accounts/ledger_report`, type: 'link', active: false, selected: false, title: 'ledger_report', icon: IoBookOutline },
      { id: 113, routePath:"",element:<CashBookSummary />, formCode:"CPRPT", action: UserAction.Show, path: `/reports/_/accounts/cash_book`, type: 'link', active: false, selected: false, title: 'cash_book', icon: FaCoins },
      { id: 114, routePath:"",element:<DayBookDetailed />, formCode:"DBRPT", action: UserAction.Show, path: `/reports/_/accounts/day_book_detailed`, type: 'link', active: false, selected: false, title: 'day_book_detailed', icon: BookCopy },
      { id: 115, routePath:"",element:<DayBookSummary />, formCode:"DBRPT", action: UserAction.Show, path: `/reports/_/accounts/day_book_summary`, type: 'link', active: false, selected: false, title: 'day_book_summary', icon: MdLibraryBooks },
      { id: 116, routePath:"",element:<PaymentReport />, formCode:"PAYMRPT", action: UserAction.Show, path: `/reports/_/accounts/payment_report`, type: 'link', active: false, selected: false, title: 'payment_report', icon: MdOutlinePayments },
      { id: 117, routePath:"",element:<CollectionReport />, formCode:"COLLRPT", action: UserAction.Show, path: `/reports/_/accounts/collection_report`, type: 'link', active: false, selected: false, title: 'collection_report', icon: BsCollection },
      { id: 118, routePath:"",element:<CashSummary />, formCode:"RPTCASHSUM", action: UserAction.Show, path: `/reports/_/accounts/cash_summary`, type: 'link', active: false, selected: false, title: 'cash_summary_report', icon: GrDocumentStore },
      { id: 119, routePath:"",element:<CashSummaryLedgerwise />, formCode:"RPTCASHSUM", action: UserAction.Show, path: `/reports/_/accounts/cash_summary_ledgerwise`, type: 'link', active: false, selected: false, title: 'cash_summary_ledgerwise_report', icon: TbCoins },
     ]
  },


];