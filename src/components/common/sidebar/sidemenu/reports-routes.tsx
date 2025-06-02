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
    ]
  },

  // {
  //   icon: (<CircleUser className="side-menu__icon side-menu" />),
  //   type: 'sub',
  //   Name: '',
  //   active: false,
  //   selected: false,
  //   title: 'accounts',
  //   badge: '',
  //   badgetxt: '',
  //   class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
  //   columns: 2,
  //   children: [
  //     { id: 100,element:<TransactionReport />, formCode:"TRANSRPT", action: UserAction.Show, path: `/reports/_/accounts/transaction_report`, type: 'link', active: false, selected: false, title: 'transaction_report', icon: FiFileText },
  //     { id: 101,element:<AccountsHistoryReport />, formCode:"RPTTRAHST", action: UserAction.Show, path: `/reports/_/accounts/transaction_history_accounts`, type: 'link', active: false, selected: false, title: 'transaction_history_accounts', icon: LuHistory },
  //     { id: 102,element:<InventoryHistoryReport />, formCode:"RPTTRAHST", action: UserAction.Show, path: `/reports/_/accounts/transaction_history_inventory`, type: 'link', active: false, selected: false, title: 'transaction_history_inventory', icon: MdOutlineManageHistory },
  //     { id: 103,element:<DailySummaryMaster />, formCode:"DSUMRPT", action: UserAction.Show, path: `/reports/_/accounts/daily_summary_report`, type: 'link', active: false, selected: false, title: 'daily_summary_report', icon: CalendarClock },
  //     { id: 104,element:<DailySummaryGlobal />, formCode:"DSUMRPT", action: UserAction.Show, path: `/reports/_/accounts/daily_summary_report`, type: 'link', active: false, selected: false, title: 'daily_summary_report___', icon: CalendarClock },
  //     { id: 105,element:<BillwiseProfit />, formCode:"PFTRPT", action: UserAction.Show, path: `/reports/_/accounts/billwise_profit`, type: 'link', active: false, selected: false, title: 'billwise_profit_report', icon: ChartNoAxesCombined },
  //     { id: 106,element:<BillwiseProfitGlobal />, formCode:"PFTRPT", action: UserAction.Show, path: `/reports/_/accounts/billwise_profit`, type: 'link', active: false, selected: false, title: 'billwise_profit_report___', icon: ChartNoAxesCombined },
  //     { id: 107,element:<PartySummaryMaster />, formCode:"PRTSUM", action: UserAction.Show, path: `/reports/_/accounts/partywise_summary`, type: 'link', active: false, selected: false, title: 'partywise_summary_report', icon: Component },
  //     { id: 108,element:<OutstandingAccountPayableReport />, formCode:"RPTACCPAY", action: UserAction.Show, path: `/reports/_/accounts/outstanding_payable`, type: 'link', active: false, selected: false, title: 'account_payable', icon: LucideCreditCard },
  //     { id: 109,element:<OutstandingAccountReceivableReport />, formCode:"RPTACCREC", action: UserAction.Show, path: `/reports/_/accounts/outstanding_receivable`, type: 'link', active: false, selected: false, title: 'account_receivable', icon: LucideDollarSign },
  //     { id: 110,element:<OutstandingAccountPayableAgingReport />, formCode:"APAGINGRPT", action: UserAction.Show, path: `/reports/_/accounts/outstanding_aging_payable`, type: 'link', active: false, selected: false, title: 'account_payable_aging_report', icon: Clock1Icon },
  //     { id: 111,element:<OutstandingAccountReceivableAgingReport />, formCode:"ARAGINGRPT", action: UserAction.Show, path: `/reports/_/accounts/outstanding_aging_receivable`, type: 'link', active: false, selected: false, title: 'account_receivable_aging_report', icon: Calendar },
  //     { id: 112,element:<LedgerReport />, formCode:"LEDGRRPT", action: UserAction.Show, path: `/reports/_/accounts/ledger_report`, type: 'link', active: false, selected: false, title: 'ledger_report', icon: IoBookOutline },
  //     { id: 113,element:<CashBookSummary />, formCode:"CPRPT", action: UserAction.Show, path: `/reports/_/accounts/cash_book`, type: 'link', active: false, selected: false, title: 'cash_book', icon: FaCoins },
  //     { id: 114,element:<DayBookDetailed />, formCode:"DBRPT", action: UserAction.Show, path: `/reports/_/accounts/day_book_detailed`, type: 'link', active: false, selected: false, title: 'day_book_detailed', icon: BookCopy },
  //     { id: 115,element:<DayBookSummary />, formCode:"DBRPT", action: UserAction.Show, path: `/reports/_/accounts/day_book_summary`, type: 'link', active: false, selected: false, title: 'day_book_summary', icon: MdLibraryBooks },
  //     { id: 116,element:<PaymentReport />, formCode:"PAYMRPT", action: UserAction.Show, path: `/reports/_/accounts/payment_report`, type: 'link', active: false, selected: false, title: 'payment_report', icon: MdOutlinePayments },
  //     { id: 117,element:<CollectionReport />, formCode:"COLLRPT", action: UserAction.Show, path: `/reports/_/accounts/collection_report`, type: 'link', active: false, selected: false, title: 'collection_report', icon: BsCollection },
  //     { id: 118,element:<CashSummary />, formCode:"RPTCASHSUM", action: UserAction.Show, path: `/reports/_/accounts/cash_summary`, type: 'link', active: false, selected: false, title: 'cash_summary_report', icon: GrDocumentStore },
  //     { id: 119,element:<CashSummaryLedgerwise />, formCode:"RPTCASHSUM", action: UserAction.Show, path: `/reports/_/accounts/cash_summary_ledgerwise`, type: 'link', active: false, selected: false, title: 'cash_summary_ledgerwise_report', icon: TbCoins },
  //   ]
  // },

  // {
  //   icon: (<CircleUser className="side-menu__icon side-menu" />),
  //   type: 'sub',
  //   Name: '',
  //   active: false,
  //   selected: false,
  //   title: 'income_and_expense',
  //   badge: '',
  //   badgetxt: '',
  //   class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
  //   columns: 2,
  //   children: [
  //     { id: 200,element:<IncomeReport />, formCode:"IcmRpt", action: UserAction.Show, path: `/reports/_/accounts/income_report`, type: 'link', routePath:'', active: false, selected: false, title: 'income_report', icon: FaHandHoldingDollar },
  //     { id: 201,element:<IncomeReportDetailed />, formCode:"IcmRpt", action: UserAction.Show, path: `/reports/_/accounts/income_report_detailed`, type: 'link', routePath:'', active: false, selected: false, title: 'income_report_detailed', icon: GiReceiveMoney },
  //     { id: 202,element:<ExpenseReport />, formCode:"ExpRpt", action: UserAction.Show, path: `/reports/_/accounts/expense_report`, type: 'link', routePath:'', active: false, selected: false, title: 'expense_report', icon: GiSwapBag },
  //     { id: 203,element:<ExpenseReportDetailed />, formCode:"ExpRpt", action: UserAction.Show, path: `/reports/_/accounts/expense_report_detailed`, type: 'link', routePath:'', active: false, selected: false, title: 'expense_report_detailed', icon: FaSackDollar },
  //     { id: 204,element:<IncomExpenseStatement />, formCode:"INCEXPSMT", action: UserAction.Show, path: `/reports/_/accounts/income_expense_statement`, type: 'link', routePath:'', active: false, selected: false, title: 'income_expense_statement', icon: LiaFileInvoiceDollarSolid },
  //     { id: 205,element:<CashFlowReport />, formCode:"CashFlwRpt", action: UserAction.Show, path: `/reports/_/accounts/cash_flow`, type: 'link', routePath:'', active: false, selected: false, title: 'cash_flow', icon: CircleStackIcon },
  //     { id: 206,element:<BankFlowReport />, formCode:"BankFlwRpt", action: UserAction.Show, path: `/reports/_/accounts/bank_flow`, type: 'link', routePath:'', active: false, selected: false, title: 'bank_flow', icon: RiBankLine },
  //     { id: 207,element:<BankStatementReport />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/accounts/bank_statement`, type: 'link', routePath:'', active: false, selected: false, title: 'bank_statement', icon: RiBankFill },
  //   ]
  // },

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
      { id: 60,element:<SummaryReport dataUrl={urls.purchase_summary_report} gridHeader="purchase_summary_report" gridId="grd_purchase_summary" />, formCode:"RPTPURSUM", action: UserAction.Show, path: `/reports/_/inventory/purchase_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_summary_report', icon: HiOutlineDocumentReport },
      { id: 61,element:<RegisterReport dataUrl={urls.purchase_register_report} gridHeader="purchase_register_report" gridId="grd_purchase_register" />, formCode:"RPTPURREG", action: UserAction.Show, path: `/reports/_/inventory/purchase_register_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_register_report', icon: AiOutlineFileText },
      { id: 62,element:<PartyWiseReport dataUrl={urls.party_wise_report} gridHeader="party_wise_purchase_summary_report" gridId="grd_party_wise" />, formCode:"RPTPWP", action: UserAction.Show, path: `/reports/_/inventory/party_wise_report`, type: 'link', routePath:'', active: false, selected: false, title: 'party_wise_report', icon: PiUsersThreeLight },
      { id: 63,element:<TaxReportDetailed dataUrl={urls.purchase_tax_report_detailed} gridHeader="purchase_tax_report_detailed" gridId="grd_purchase_tax_report_detailed" />, formCode:"RPTPITX", action: UserAction.Show, path: `/reports/_/inventory/purchase_tax_report_detailed`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_tax_report_detailed', icon: PiUsersThreeLight },
      { id: 64,element:<TaxReportSummary dataUrl={urls.purchase_tax_report_summary} gridHeader="purchase_tax_report_summary" gridId="grd_purchase_tax_summary" />, formCode:"RPTPITX", action: UserAction.Show, path: `/reports/_/inventory/purchase_tax_report_summary`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_tax_report_summary', icon: PiUsersThreeLight },
      { id: 65,element:<SummaryReport dataUrl={urls.purchase_return_summary} gridHeader="purchase_return_summary_report" gridId="grd_purchase_return_summary" />, formCode:"RPTPRSUM", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_summary`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_return_summary', icon: PiUsersThreeLight },
      { id: 66,element:<RegisterReport dataUrl={urls.purchase_return_register} gridHeader="purchase_return_register_report" gridId="grd_purchase_return_register" />, formCode:"RPTPRREG", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_register`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_return_register', icon: PiUsersThreeLight },
      { id: 67,element:<SummaryReport dataUrl={urls.purchase_estimate_summary} gridHeader="purchase_estimate_summary_report" gridId="grd_purchase_estimate_summary" />, formCode:"RPTPES", action: UserAction.Show, path: `/reports/_/inventory/purchase_estimate_summary`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_estimate_summary', icon: PiUsersThreeLight },
      { id: 68,element:<SummaryReport dataUrl={urls.purchase_order_summary} gridHeader="purchase_order_summary" gridId="grd_purchase_order_summary" />, formCode:"RPTPOS", action: UserAction.Show, path: `/reports/_/inventory/purchase_order_summary`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_order_summary', icon: PiUsersThreeLight },
      { id: 69,element:<CreditPurchaseSummaryReport />, formCode:"RPTCPIS", action: UserAction.Show, path: `/reports/_/inventory/credit_purchase_summary`, type: 'link', routePath:'', active: false, selected: false, title: 'credit_purchase_summary', icon: AiOutlineFileText },
      { id: 70,element:<PartyMonthwiseSummaryReport dataUrl={urls.party_monthwise_purchase_summary} gridHeader="party_monthwise_purchase_summary" gridId="grd_party_monthwise_purchase_summary" />, formCode:"RPTPMPIS", action: UserAction.Show, path: `/reports/_/inventory/party_monthwise_purchase_summary`, type: 'link', routePath:'', active: false, selected: false, title: 'party_monthwise_purchase_summary', icon: AiOutlineFileText },
      { id: 71,element:<PurchaseOrderTransitReport />, formCode:"RPTPIOT", action: UserAction.Show, path: `/reports/_/inventory/purchase_order_transit_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_order_transit_report', icon: AiOutlineFileText },
      { id: 72,element:<RegisterReport dataUrl={urls.purchase_estimate_register} gridHeader="purchase_estimate_register_report" gridId="grd_purchase_estimate_register" />, formCode:"RPTPIER", action: UserAction.Show, path: `/reports/_/inventory/purchase_estimate_register_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_estimate_register_report', icon: AiOutlineFileText },
      { id: 73,element:<RegisterReport dataUrl={urls.purchase_return_estimate_register} gridHeader="purchase_return_estimate_register_report" gridId="grd_purchase_return_estimate_register" />, formCode:"PREREGT", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_estimate_register_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_return_estimate_register_report', icon: AiOutlineFileText },
      { id: 74,element:<SummaryReport dataUrl={urls.purchase_return_estimate_summary} gridHeader="purchase_return_estimate_summary_report" gridId="grd_purchase_return_estimate_summary" />, formCode:"PRESUMMY", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_estimate_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_return_estimate_summary_report', icon: HiOutlineDocumentReport },

      //purchase Tax
      { id: 86,element:<PurchaseTaxGSTDailySummary dataUrl={urls.purchase_gst_daily_summary} gridHeader="purchase_gst_daily_summary_report" gridId="grd_purchase_gst_daily_summary_report" />, formCode:"RPTPITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_daily_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_gst_daily_summary_report', icon: AiOutlineFileText },
      { id: 90,element:<PurchaseTaxGSTTaxwise dataUrl={urls.purchase_gst_taxwise} gridHeader="purchase_gst_taxwise_report" gridId="grd_purchase_gst_taxwise_report" />, formCode:"RPTPITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_taxwise_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_gst_taxwise_report', icon: AiOutlineFileText },
      { id: 91,element:<PurchaseTaxGSTTaxwiseWithHSN dataUrl={urls.purchase_gst_taxwise_with_hsn} gridHeader="purchase_gst_taxwise_with_hsn_report" gridId="grd_purchase_gst_taxwise_with_hsn_report" />, formCode:"RPTPITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_taxwise_with_hsn_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_gst_taxwise_with_hsn_report', icon: AiOutlineFileText },
      { id: 88,element:<PurchaseTaxGSTMonthlySummary dataUrl={urls.purchase_gst_monthly_summary} gridHeader="purchase_gst_monthly_summary_report" gridId="grd_purchase_gst_monthly_summary_report" />, formCode:"RPTPITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_monthly_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_gst_monthly_summary_report', icon: AiOutlineFileText },
      { id: 87,element:<PurchaseTaxGSTDetailed dataUrl={urls.purchase_gst_detailed} gridHeader="purchase_gst_detailed_report" gridId="grd_purchase_gst_detailed_report" />, formCode:"RPTPITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_detailed_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_gst_detailed_report', icon: AiOutlineFileText },
      { id: 89,element:<PurchaseTaxGSTRegisterFormat dataUrl={urls.purchase_gst_register_format} gridHeader="purchase_gst_register_format_report" gridId="grd_purchase_gst_register_report" />, formCode:"RPTPITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_register_format_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_gst_register_format_report', icon: AiOutlineFileText },
      { id: 85,element:<PurchaseTaxGSTAdvRegisterFormat dataUrl={urls.purchase_gst_adv_register_format} gridHeader="purchase_gst_advanced_register_format_report" gridId="grd_purchase_gst_adv_register_report" />, formCode:"RPTPITAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_adv_register_format_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_gst_advance_register_format_report', icon: AiOutlineFileText },

      //purchase return Tax
      { id: 93,element:<PurchaseTaxGSTDailySummary dataUrl={urls.purchase_return_gst_daily_summary} gridHeader="purchase_return_gst_daily_summary_report" gridId="grd_purchase_return_gst_daily_summary_report" />, formCode:"RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_daily_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_return_gst_daily_summary_report', icon: AiOutlineFileText },
      { id: 97,element:<PurchaseReturnTaxGSTSalesAndReturn />, formCode:"RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_sales_and_return_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_return_gst_sales_and_return_report', icon: AiOutlineFileText },
      { id: 98,element:<PurchaseTaxGSTTaxwise dataUrl={urls.purchase_return_gst_taxwise} gridHeader="purchase_return_gst_taxwise_report" gridId="grd_purchase_return_gst_taxwise_report" />, formCode:"RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_taxwise_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_return_gst_taxwise_report', icon: AiOutlineFileText },
      { id: 99,element:<PurchaseTaxGSTTaxwiseWithHSN dataUrl={urls.purchase_return_gst_taxwise_with_hsn} gridHeader="purchase_return_gst_taxwise_with_hsn_report" gridId="grd_purchase_return_gst_taxwise_with_hsn_report" />, formCode:"RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_taxwise_with_hsn_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_return_gst_taxwise_with_hsn_report', icon: AiOutlineFileText },
      { id: 95,element:<PurchaseTaxGSTMonthlySummary dataUrl={urls.purchase_return_gst_monthly_summary} gridHeader="purchase_return_gst_monthly_summary_report" gridId="grd_purchase_return_gst_monthly_summary_report" />, formCode:"RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_monthly_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_return_gst_monthly_summary_report', icon: AiOutlineFileText },
      { id: 94,element:<PurchaseTaxGSTDetailed dataUrl={urls.purchase_return_gst_detailed} gridHeader="purchase_return_gst_detailed_report" gridId="grd_purchase_return_gst_detailed_report" />, formCode:"RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_detailed_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_return_gst_detailed_report', icon: AiOutlineFileText },
      { id: 96,element:<PurchaseTaxGSTRegisterFormat dataUrl={urls.purchase_return_gst_register_format} gridHeader="purchase_return_gst_register_format_report" gridId="grd_purchase_return_gst_register_report" />, formCode:"RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_register_format_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_return_gst_register_format_report', icon: AiOutlineFileText },
      { id: 92,element:<PurchaseTaxGSTAdvRegisterFormat dataUrl={urls.purchase_return_gst_adv_register_format} gridHeader="purchase_return_gst_advanced_register_format_report" gridId="grd_purchase_return_gst_adv_register_report" />, formCode:"RPTPRTAXGSTR", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_adv_register_format_report`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_return_gst_adv_register_format_report', icon: AiOutlineFileText },

<<<<<<< HEAD
    ]
  },
=======
    // ]
  // },
>>>>>>> 72cc73e049306f5184c76adbc866ea0051a42c67
  // {
  //   icon: (<Boxes className="side-menu__icon side-menu" />),
  //   type: 'sub',
  //   Name: '',
  //   active: false,
  //   selected: false,
  //   title: 'stock',
  //   badge: '',
  //   badgetxt: '',
  //   class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
  //   columns: 2,
  //   children: [
  //     { id: 700,element:<StockJournalReport dataUrl={urls.opening_stock} gridHeader="opening_stock_report" gridId="grd_opening_stock_journal"/>, formCode:"OSRPT", action: UserAction.Show, path: `/reports/_/inventory/opening_stock_report`, type: 'link', active: false, selected: false, title: 'opening_stock', icon: PiPackageLight },
  //     { id: 701,element:<StockJournalReport dataUrl={urls.stock_transfer} gridHeader="stock_transfer_report" gridId="grd_stock_transfer_journal"/>, formCode:"STRPT", action: UserAction.Show, path: `/reports/_/inventory/stock_transfer_report`, type: 'link', active: false, selected: false, title: 'stock_transfer', icon: PiPackageLight },
  //     { id: 702,element:<StockJournalReport dataUrl={urls.damage_stock} gridHeader="damage_stock_report" gridId="grd_damage_stock_journal"/>, formCode:"DMGRPT", action: UserAction.Show, path: `/reports/_/inventory/damage_stock_report`, type: 'link', active: false, selected: false, title: 'damage_stock', icon: PiPackageLight },
  //     { id: 703,element:<StockJournalReport dataUrl={urls.excess_stock} gridHeader="excess_stock_report" gridId="grd_excess_stock_journal"/>, formCode:"EXRPT", action: UserAction.Show, path: `/reports/_/inventory/excess_stock_report`, type: 'link', active: false, selected: false, title: 'excess_stock', icon: PiPackageLight },
  //     { id: 704,element:<StockJournalReport dataUrl={urls.shortage_stock} gridHeader="shortage_stock_report" gridId="grd_shortage_stock_journal"/>, formCode:"SHRPT", action: UserAction.Show, path: `/reports/_/inventory/shortage_stock_report`, type: 'link', active: false, selected: false, title: 'shortage_stock', icon: PiPackageLight },
  //     { id: 705,element:<BranchTransferOut />, formCode:"BTORPT", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_out_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_out', icon: PiPackageLight },
  //     { id: 706,element:<BranchTransferIn />, formCode:"BTIRPT", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_in_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_in', icon: PiPackageLight },
  //     { id: 707,element:<BranchTransferSummaryOut />, formCode:"BTOSRPT", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_summary_out_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_summary_out', icon: PiPackageLight },
  //     { id: 708,element:<BranchTransferSummaryIn />, formCode:"BTISRPT", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_summary_in_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_summary_in', icon: PiPackageLight },
  //     { id: 711,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_opening_stock_summary} gridHeader="itemwise_opening_stock_summary" gridId="grd_itemwise_opening_stock_summary" />, formCode:"OSRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_opening_stock_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_opening_stock_summary', icon: PiPackageLight },
  //     { id: 712,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_substitute_summary} gridHeader="itemwise_substitute_summary" gridId="grd_itemwise_substitute_summary" />, formCode:"SUBRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_substitute_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_substitute_summary', icon: PiPackageLight },
  //     { id: 713,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_branch_transfer_out_summary} gridHeader="itemwise_branch_transfer_out_summary" gridId="grd_itemwise_branch_transfer_out_summary" />, formCode:"BTORPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_branch_transfer_out_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_branch_transfer_out_summary', icon: PiPackageLight },
  //     { id: 714,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_branch_transfer_in_summary} gridHeader="itemwise_branch_transfer_in_summary" gridId="grd_itemwise_branch_transfer_in_summary" />, formCode:"BTIRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_branch_transfer_in_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_branch_transfer_in_summary', icon: PiPackageLight },
  //     { id: 715,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_excess_summary} gridHeader="itemwise_excess_summary" gridId="grd_itemwise_excess_summary" />, formCode:"EXRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_excess_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_excess_summary', icon: PiPackageLight },
  //     { id: 716,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_shortage_summary} gridHeader="itemwise_shortage_summary" gridId="grd_itemwise_shortage_summary" />, formCode:"SHRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_shortage_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_shortage_summary', icon: PiPackageLight },
  //     { id: 717,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_damage_stock_summary} gridHeader="itemwise_damage_stock_summary" gridId="grd_itemwise_damage_stock_summary" />, formCode:"DMGRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_damage_stock_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_damage_stock_summary', icon: PiPackageLight },
  //     { id: 718,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_delivery_summary} gridHeader="itemwise_goods_delivery_summary" gridId="grd_itemwise_goods_delivery_summary" />, formCode:"GDRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_delivery_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_delivery_summary', icon: PiPackageLight },
  //     { id: 719,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_delivery_return_summary} gridHeader="itemwise_goods_delivery_return_summary" gridId="grd_itemwise_goods_delivery_return_summary" />, formCode:"DRRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_delivery_return_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_delivery_return_summary', icon: PiPackageLight },
  //     { id: 720,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_receipt_summary} gridHeader="itemwise_goods_receipt_summary" gridId="grd_itemwise_goods_receipt_summary" />, formCode:"GRNRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_receipt_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_receipt_summary', icon: PiPackageLight },
  //     { id: 721,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_receipt_return_summary} gridHeader="itemwise_goods_receipt_return_summary" gridId="grd_itemwise_goods_receipt_return_summary" />, formCode:"GRRRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_receipt_return_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_receipt_return_summary', icon: PiPackageLight },
  //     { id: 722,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_request_summary} gridHeader="itemwise_goods_request_summary" gridId="grd_itemwise_goods_request_summary" />, formCode:"GR_RPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_request_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_request_summary', icon: PiPackageLight },
  //     { id: 723,element:<StockSummary />, formCode:"RPTSTK", action: UserAction.Show, path: `/reports/_/inventory/stock_summary_report`, type: 'link', active: false, selected: false, title: 'stock_summary', icon: PiPackageLight },
  //     { id: 724,element:<StockLedger />, formCode:"RPTSTKLED", action: UserAction.Show, path: `/reports/_/inventory/stock_ledger_report`, type: 'link', active: false, selected: false, title: 'stock_ledger', icon: HiOutlineClipboardList },
  //     { id: 725,element:<ExpiryReport />, formCode:"EXPIRYRPT", action: UserAction.Show, path: `/reports/_/inventory/expiry_report`, type: 'link', active: false, selected: false, title: 'expiry_report', icon: HiOutlineClipboardList },
  //     { id: 726,element:<TransactionAnalysisReport />, formCode:"TARPT", action: UserAction.Show, path: `/reports/_/inventory/transaction_analysis_report`, type: 'link', active: false, selected: false, title: 'transaction_analysis', icon: MdOutlineAnalytics },
  //     { id: 727,element:<StockFlow />, formCode:"RPTSTKFL", action: UserAction.Show, path: `/reports/_/inventory/stock_flow_report`, type: 'link', active: false, selected: false, title: 'stock_flow_report', icon: GiCargoShip },
  //   ]
  // },
  // {
  //   icon: (<Boxes className="side-menu__icon side-menu" />),
  //   type: 'sub',
  //   Name: '',
  //   active: false,
  //   selected: false,
  //   title: 'sales',
  //   badge: '',
  //   badgetxt: '',
  //   class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
  //   columns: 2,
  //   children: [
  //     { id: 128,element:<SummaryReport dataUrl={urls.sales_summary} gridHeader="sales_summary_report" gridId="grd_sales_summary" />, formCode:"RPTSLSUM", action: UserAction.Show,  path: `/reports/_/inventory/sales_summary_report`, type: 'link', active: false, selected: false, title: 'sales_summary', icon: PiPackageLight },
  //     { id: 129,element:<RegisterReport dataUrl={urls.sales_register} gridHeader="sales_register_report" gridId="grd_sales_register" />, formCode:"RPTSRSUM", action: UserAction.Show,  path: `/reports/_/inventory/sales_register_report`, type: 'link', active: false, selected: false, title: 'sales_register', icon: PiPackageLight },
  //     { id: 130,element:<NetSalesReport dataUrl={urls.net_sales} gridHeader="net_sales_report" gridId="grd_net_sales_report" />, formCode:"RPTNTSI", action: UserAction.Show,  path: `/reports/_/inventory/net_sales_report`, type: 'link', active: false, selected: false, title: 'net_sales', icon: PiPackageLight },
  //     { id: 131,element:<PartyWiseReport dataUrl={urls.partywise_sales} gridHeader="partywise_sales" gridId="grd_partywise_sales" />, formCode:"RPTPRTSL", action: UserAction.Show,  path: `/reports/_/inventory/partywise_sales_report`, type: 'link', active: false, selected: false, title: 'partywise_sales', icon: PiPackageLight },
  //     { id: 132,element:<TaxReportSummary dataUrl={urls.sales_tax_report_summary} gridHeader="sales_tax_report_summary" gridId="grd_sales_tax_summary" />, formCode:"RPTSITAX", action: UserAction.Show,  path: `/reports/_/inventory/sales_tax_report_summary`, type: 'link', active: false, selected: false, title: 'sales_tax_report_summary', icon: PiPackageLight },
  //     { id: 133,element:<TaxReportDetailed dataUrl={urls.sales_tax_report_detailed} gridHeader="sales_tax_report_detailed" gridId="grd_sales_tax_report_detailed" />, formCode:"RPTSITAX", action: UserAction.Show,  path: `/reports/_/inventory/sales_tax_report_detailed`, type: 'link', active: false, selected: false, title: 'sales_tax_report_detailed', icon: PiPackageLight },
  //     { id: 134,element:<SummaryReport dataUrl={urls.sales_return_summary} gridHeader="sales_return_summary" gridId="grd_sales_return_summary" />, formCode:"RPTSRSUM", action: UserAction.Show,  path: `/reports/_/inventory/sales_return_summary`, type: 'link', active: false, selected: false, title: 'sales_return_summary', icon: PiPackageLight },
  //     { id: 135,element:<RegisterReport dataUrl={urls.sales_return_register} gridHeader="sales_return_register" gridId="grd_sales_return_register" />, formCode:"RPTSRREG", action: UserAction.Show,  path: `/reports/_/inventory/sales_return_register`, type: 'link', active: false, selected: false, title: 'sales_return_register', icon: PiPackageLight },
  //     { id: 136,element:<SalesAndSalesReturn />, formCode:"RPTSSR", action: UserAction.Show,  path: `/reports/_/inventory/sales_and_sales_return_report`, type: 'link', active: false, selected: false, title: 'sales_and_sales_return', icon: PiPackageLight },
  //     { id: 137,element:<SummaryReport dataUrl={urls.sales_order_summary} gridHeader="sales_order_summary" gridId="grd_sales_order_summary" />, formCode:"RPTORDSM", action: UserAction.Show,  path: `/reports/_/inventory/sales_order_summary_report`, type: 'link', active: false, selected: false, title: 'sales_order_summary', icon: PiPackageLight },
  //     { id: 138,element:<SummaryReport dataUrl={urls.sales_estimate_summary} gridHeader="sales_estimate_summary" gridId="grd_sales_estimate_summary" />, formCode:"RPTSES", action: UserAction.Show,  path: `/reports/_/inventory/sales_estimate_summary_report`, type: 'link', active: false, selected: false, title: 'sales_estimate_summary', icon: PiPackageLight },
  //     { id: 139,element:<SummaryReport dataUrl={urls.sales_quotation_summary} gridHeader="sales_quotation_summary" gridId="grd_sales_quotation_summary" />, formCode:"RPTSQS", action: UserAction.Show,  path: `/reports/_/inventory/sales_quotation_summary_report`, type: 'link', active: false, selected: false, title: 'sales_quotation_summary', icon: PiPackageLight },
  //     { id: 140,element:<SummaryReport dataUrl={urls.substitute_report} gridHeader="substitute_report" gridId="grd_substitute_report" />, formCode:"RPTSUB", action: UserAction.Show,  path: `/reports/_/inventory/substitute_report`, type: 'link', active: false, selected: false, title: 'substitute_report', icon: PiPackageLight },
  //     { id: 141,element:<DaywiseSummaryWithProfit />, formCode:"RPTSIDWSWP", action: UserAction.Show,  path: `/reports/_/inventory/daywise_summary_with_profit_report`, type: 'link', active: false, selected: false, title: 'daywise_summary_with_profit', icon: PiPackageLight },
  //     { id: 142,element:<GroupwiseSalesSummaryDevexpress />, formCode:"GRPWSSLRPT", action: UserAction.Show,  path: `/reports/_/inventory/groupwise_sales_summary_devexpress_report`, type: 'link', active: false, selected: false, title: 'groupwise_sales_summary_devexpress', icon: PiPackageLight },
  //     { id: 143,element:<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="groupwise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_groupwise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isGroupWise: true }} />, formCode:"GRPWSSLRPT", action: UserAction.Show,  path: `/reports/_/inventory/groupwise_sales_summary_report_groupwise`, type: 'link', active: false, selected: false, title: 'groupwise_sales_summary_report', icon: PiPackageLight },
  //     { id: 144,element:<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="categorywise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_categorywise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isCategoryWise: true }} />, formCode:"GRPWSSLRPT", action: UserAction.Show,  path: `/reports/_/inventory/groupwise_sales_summary_report_categorywise`, type: 'link', active: false, selected: false, title: 'categorywise_sales_summary_report', icon: PiPackageLight },
  //     { id: 145,element:<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="sectionwise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_sectionwise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isSectionWise: true }} />, formCode:"GRPWSSLRPT", action: UserAction.Show,  path: `/reports/_/inventory/groupwise_sales_summary_report_sectionwise`, type: 'link', active: false, selected: false, title: 'sectionwise_sales_summary_report', icon: PiPackageLight },
  //     { id: 146,element:<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="brandwise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_brandwise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isBrandWise: true }} />, formCode:"GRPWSSLRPT", action: UserAction.Show,  path: `/reports/_/inventory/groupwise_sales_summary_report_brandwise`, type: 'link', active: false, selected: false, title: 'brandwise_sales_summary_report', icon: PiPackageLight },
  //     { id: 147,element:<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="product_categorywise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_product_categorywise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isProductCatWise: true }} />, formCode:"GRPWSSLRPT", action: UserAction.Show,  path: `/reports/_/inventory/groupwise_sales_summary_report_product_categorywise`, type: 'link', active: false, selected: false, title: 'product_categorywise_sales_summary_report', icon: PiPackageLight },
  //     { id: 148,element:<SalesmanwiseSalesAndCollection />, formCode:"RPTSIMWSAC", action: UserAction.Show,  path: `/reports/_/inventory/salesman_wise_sales_and_collection_report`, type: 'link', active: false, selected: false, title: 'salesman_wise_sales_and_collection', icon: PiPackageLight },
  //     { id: 149,element:<NonInvoicedGoodsDelivery />, formCode:"RPTSINIGDR", action: UserAction.Show,  path: `/reports/_/inventory/non_invoiced_goods_delivery_report`, type: 'link', active: false, selected: false, title: 'non_invoiced_goods_delivery', icon: PiPackageLight },
  //     { id: 150,element:<SummaryReport dataUrl={urls.booking_summary} gridHeader="booking_summary" gridId="grd_booking_summary" />, formCode:"RPTBKSSUM", action: UserAction.Show,  path: `/reports/_/inventory/booking_summary_report`, type: 'link', active: false, selected: false, title: 'booking_summary', icon: PiPackageLight },
  //     { id: 151,element:<PendingOrderReport />, formCode:"RPTPOR", action: UserAction.Show,  path: `/reports/_/inventory/pending_order_report`, type: 'link', active: false, selected: false, title: 'pending_order', icon: PiPackageLight },
  //     { id: 152,element:<PromotionalSalesReport />, formCode:"RPTPRMSIR", action: UserAction.Show,  path: `/reports/_/inventory/promotional_sales_report`, type: 'link', active: false, selected: false, title: 'promotional_sales', icon: PiPackageLight },
  //     { id: 153,element:<GroupedBrandwiseSales />, formCode:"RPTGRPBRDWSIR", action: UserAction.Show,  path: `/reports/_/inventory/grouped_brandwise_sales_report`, type: 'link', active: false, selected: false, title: 'grouped_brandwise_sales', icon: PiPackageLight },
  //     { id: 154,element:<PartyMonthwiseSummaryReport dataUrl={urls.party_monthwise_sales_summary} gridHeader="party_monthwise_sales_summary" gridId="grd_party_monthwise_sales_summary" />, formCode:"RPTPRTYMWSIS", action: UserAction.Show,  path: `/reports/_/inventory/party_monthwise_sales_summary_report`, type: 'link', active: false, selected: false, title: 'party_monthwise_sales_summary', icon: PiPackageLight },
  //     { id: 155,element:<CouponReports />, formCode:"COUPSALRPT", action: UserAction.Show,  path: `/reports/_/inventory/coupon_reports`, type: 'link', active: false, selected: false, title: 'coupon_reports', icon: PiPackageLight },
  //     { id: 156,element:<SchemeWiseSales />, formCode:"ITMSCMSRPT", action: UserAction.Show,  path: `/reports/_/inventory/scheme_wise_sales_report`, type: 'link', active: false, selected: false, title: 'scheme_wise_sales', icon: PiPackageLight },
  //     { id: 158,element:<RouteWiseSalesAndCollection />, formCode:"ROUTWISE_SL_CR_1", action: UserAction.Show,  path: `/reports/_/inventory/routewise_sales_collection_report`, type: 'link', active: false, selected: false, title: 'routewise_sales_collection', icon: PiPackageLight },
  //     { id: 159,element:<BranchInventoryRequestPendingOrder />, formCode:"ADVBRNCHPEN", action: UserAction.Show,  path: `/reports/_/inventory/branch_inventory_request_pending_order_report`, type: 'link', active: false, selected: false, title: 'branch_inventory_request_pending_order', icon: PiPackageLight },
  //     { id: 160,element:<PrintDetails />, formCode:"ADVPRINT", action: UserAction.Show,  path: `/reports/_/inventory/print_details_report`, type: 'link', active: false, selected: false, title: 'print_details', icon: PiPackageLight },
  //     { id: 161,element:<InventoryStatusReport />, formCode:"INVSTATUSRPT", action: UserAction.Show,  path: `/reports/_/inventory/inventory_status_report`, type: 'link', active: false, selected: false, title: 'inventory_status', icon: PiPackageLight },
  //     { id: 162,element:<VoidReport />, formCode:"RPTADVOID", action: UserAction.Show,  path: `/reports/_/inventory/void_report`, type: 'link', active: false, selected: false, title: 'void_report', icon: PiPackageLight },
  //     { id: 163,element:<CounterReport />, formCode:"CNTRRPT", action: UserAction.Show,  path: `/reports/_/inventory/counter_report`, type: 'link', active: false, selected: false, title: 'counter_report', icon: PiPackageLight },
  //     { id: 164,element:<RegisterReport dataUrl={urls.sales_return_estimate_register} gridHeader="sales_return_estimate_register" gridId="grd_sales_return_estimate_register" />, formCode:"SREREGT", action: UserAction.Show,  path: `/reports/_/inventory/sales_return_estimate_register_report`, type: 'link', active: false, selected: false, title: 'sales_return_estimate_register', icon: PiPackageLight },
  //     { id: 165,element:<DiagnosisReport />, formCode:"ADVDIGREPT", action: UserAction.Show,  path: `/reports/_/inventory/diagnosis_report`, type: 'link', active: false, selected: false, title: 'diagnosis_report', icon: PiPackageLight },
  //     { id: 166,element:<DiagnosisReportZeroRateProductlist />, formCode:"ADVDIGREPT", action: UserAction.Show,  path: `/reports/_/inventory/diagnosis_report_zero_rate_productlist`, type: 'link', active: false, selected: false, title: 'diagnosis_report_zero_rate_productlist', icon: PiPackageLight },
  //     { id: 167,element:<DiagnosisReportPostDatedTransactions />, formCode:"ADVDIGREPT", action: UserAction.Show,  path: `/reports/_/inventory/diagnosis_report_post_dated_transactions`, type: 'link', active: false, selected: false, title: 'diagnosis_report_post_dated_transactions', icon: PiPackageLight },
  //     { id: 168,element:<DiagnosisReportSalesPriceLessThanLPCost />, formCode:"ADVDIGREPT", action: UserAction.Show,  path: `/reports/_/inventory/diagnosis_report_sales_price_less_than_lp_cost`, type: 'link', active: false, selected: false, title: 'diagnosis_report_sales_price_less_than_lp_cost', icon: PiPackageLight },
  //     { id: 169,element:<DiagnosisReportSalesPriceLessthanPurchasePrice />, formCode:"ADVDIGREPT", action: UserAction.Show,  path: `/reports/_/inventory/diagnosis_report_sales_price_less_than_purchase_price`, type: 'link', active: false, selected: false, title: 'diagnosis_report_sales_price_less_than_purchase_price', icon: PiPackageLight },
  //     { id: 170,element:<DiagnosisReportSalesPriceLessthanMSP />, formCode:"ADVDIGREPT", action: UserAction.Show,  path: `/reports/_/inventory/diagnosis_report_sales_price_less_than_msp`, type: 'link', active: false, selected: false, title: 'diagnosis_report_sales_price_less_than_msp', icon: PiPackageLight },
  //     { id: 171,element:<DiagnosisReportSalesPriceGreaterthanMRP />, formCode:"ADVDIGREPT", action: UserAction.Show,  path: `/reports/_/inventory/diagnosis_report_sales_price_greater_than_mrp`, type: 'link', active: false, selected: false, title: 'diagnosis_report_sales_price_greater_than_mrp', icon: PiPackageLight },
  //     { id: 172,element:<CustomerVisitTotalVisit />, formCode:"RPTTOTVIS", action: UserAction.Show,  path: `/reports/_/inventory/customer_visit_total_visit`, type: 'link', active: false, selected: false, title: 'customer_visit_total_visit', icon: PiPackageLight },
  //     { id: 173,element:<CustomerVisitLastVisit />, formCode:"RPTLAVIDET", action: UserAction.Show,  path: `/reports/_/inventory/customer_visit_last_visit`, type: 'link', active: false, selected: false, title: 'customer_visit_last_visit', icon: PiPackageLight },
  //     { id: 174,element:<FOCRegisterReport />, formCode:"RPTFOCREG", action: UserAction.Show,  path: `/reports/_/inventory/foc_register_report`, type: 'link', active: false, selected: false, title: 'foc_register_report', icon: PiPackageLight },
  //     { id: 175,element:<DiscountReportInventory />, formCode:"RPTINV", action: UserAction.Show,  path: `/reports/_/inventory/discount_report_inventory`, type: 'link', active: false, selected: false, title: 'discount_report_inventory', icon: PiPackageLight },
  //     { id: 176,element:<DiscountReportCollection />, formCode:"RPTCOL", action: UserAction.Show,  path: `/reports/_/inventory/discount_report_collection`, type: 'link', active: false, selected: false, title: 'discount_report_collection', icon: PiPackageLight },
  //     { id: 177,element:<ItemUsedForService />, formCode:"ITMSFORSRV", action: UserAction.Show,  path: `/reports/_/inventory/item_used_for_service`, type: 'link', active: false, selected: false, title: 'item_used_for_service', icon: PiPackageLight },
  //     { id: 178,element:<LPOReport />, formCode:"LPORPT", action: UserAction.Show,  path: `/reports/_/inventory/lpo_report`, type: 'link', active: false, selected: false, title: 'lpo_report', icon: PiPackageLight },

  //   ]
  // },
  // {
  //   icon: (<CircleUser className="side-menu__icon side-menu" />),
  //   type: 'sub',
  //   Name: '',
  //   active: false,
  //   selected: false,
  //   title: 'sales_transfer',
  //   badge: '',
  //   badgetxt: '',
  //   class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
  //   columns: 2,
  //   children: [
  //     { id: 210,element:<SummaryReport dataUrl={urls.sales_transfer_summary} gridHeader="sales_transfer_summary" gridId="grd_sales_transfer_summary" />, formCode:"RPTSITRNRS", action: UserAction.Show,  path: `/reports/_/inventory/sales_transfer_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'sales_transfer_summary', icon: FaHandHoldingDollar },
  //     { id: 211,element:<RegisterReport dataUrl={urls.sales_transfer_register} gridHeader="sales_transfer_register" gridId="grd_sales_transfer_register" />, formCode:"RPTSITRNRS", action: UserAction.Show,  path: `/reports/_/inventory/sales_transfer_register_report`, type: 'link', routePath:'', active: false, selected: false, title: 'sales_transfer_register', icon: GiReceiveMoney },
  //     { id: 212,element:<NetSalesReport dataUrl={urls.net_sales_transfer_report} gridHeader="net_sales_transfer_report" gridId="grd_net_sales_transfer_report" />, formCode:"RPTSITRNRS", action: UserAction.Show,  path: `/reports/_/inventory/net_sales_transfer_report`, type: 'link', routePath:'', active: false, selected: false, title: 'net_sales_transfer_report', icon: GiSwapBag },
  //     { id: 213,element:<PartyWiseReport dataUrl={urls.sales_transfer_partyWise_sales} gridHeader="sales_transfer_partyWise_sales" gridId="grd_sales_transfer_partyWise_sales" />, formCode:"RPTSITRNRS", action: UserAction.Show,  path: `/reports/_/inventory/sales_transfer_partyWise_sales`, type: 'link', routePath:'', active: false, selected: false, title: 'sales_transfer_partyWise_sales', icon: FaSackDollar },
  //     { id: 214,element:<SalesTransferMonthWiseSummaryReport dataUrl={urls.sales_transfer_monthWise_summary} gridHeader="sales_transfer_monthWise_summary" gridId="grd_sales_transfer_monthWise_summary" />, formCode:"RPTSITRNRS", action: UserAction.Show,  path: `/reports/_/inventory/sales_transfer_monthWise_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'sales_transfer_monthWise_summary', icon: FaSackDollar },
  //     { id: 215,element:<PartyMonthwiseSummaryReport dataUrl={urls.sales_transfer_partyWise_summary} gridHeader="sales_transfer_partyWise_summary" gridId="grd_sales_transfer_partyWise_summary" />, formCode:"RPTSITRNRS", action: UserAction.Show,  path: `/reports/_/inventory/sales_transfer_partyWise_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'sales_transfer_partyWise_summary', icon: FaSackDollar },
  //   ]
  // },
  // {
  //   icon: (<Boxes className="side-menu__icon side-menu" />),
  //   type: 'sub',
  //   Name: '',
  //   active: false,
  //   selected: false,
  //   title: 'tax_reports',
  //   badge: '',
  //   badgetxt: '',
  //   class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
  //   columns: 2,
  //   children: [
  //     { id: 300,element:<PurchaseTaxReport />, formCode:"TAXRPT", action: UserAction.Show,  path: `/reports/_/inventory/purchase_tax_vat`, type: 'link', routePath:'', active: false, selected: false, title: 'purchase_tax', icon: AiOutlineFileText },
  //     { id: 301,element:<SalesTax />, formCode:"TAXRPT", action: UserAction.Show,  path: `/reports/_/inventory/sales_tax_report`, type: 'link', routePath:'', active: false, selected: false, title: 'sales_tax', icon: AiOutlineFileText },
  //     { id: 302,element:<VatReturnForm />, formCode:"TAXRPT", action: UserAction.Show,  path: `/reports/_/inventory/vat_return_form`, type: 'link', routePath:'', active: false, selected: false, title: 'vat_return_form', icon: AiOutlineFileText },
  //     { id: 303,element:<VatReturnFormArabic />, formCode:"TAXRPT", action: UserAction.Show,  path: `/reports/_/inventory/vat_return_form_arabic`, type: 'link', routePath:'', active: false, selected: false, title: 'vat_return_form_arabic', icon: AiOutlineFileText },
  //     { id: 304,element:<KsaEInvoiceReportSummary />, formCode:"TAXRPT", action: UserAction.Show,  path: `/reports/_/inventory/ksa_e_invoice_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'ksa_e_invoice_summary', icon: AiOutlineFileText },
  //     { id: 305,element:<KsaEInvoiceReportDetailed />, formCode:"TAXRPT", action: UserAction.Show,  path: `/reports/_/inventory/ksa_e_invoice_detailed_report`, type: 'link', routePath:'', active: false, selected: false, title: 'ksa_e_invoice_detailed', icon: AiOutlineFileText },
  //     { id: 306,element:<GSTR1B2B />, formCode:"GSTR1", action: UserAction.Show,  path: `/reports/_/inventory/gstr1b2b_report`, type: 'link', routePath:'', active: false, selected: false, title: 'gstr1_b2b', icon: AiOutlineFileText },
  //     { id: 307,element:<GSTR1B2CLarge />, formCode:"GSTR1", action: UserAction.Show,  path: `/reports/_/inventory/gstr1b2cLarge_report`, type: 'link', routePath:'', active: false, selected: false, title: 'gstr1_b2cLarge', icon: AiOutlineFileText },
  //     { id: 308,element:<GSTR1B2CSmall />, formCode:"GSTR1", action: UserAction.Show,  path: `/reports/_/inventory/gstr1b2cSmall_report`, type: 'link', routePath:'', active: false, selected: false, title: 'gstr1b2c_Small', icon: AiOutlineFileText },
  //     { id: 309,element:<GSTR1CDNR />, formCode:"GSTR1", action: UserAction.Show,  path: `/reports/_/inventory/gstr1cdnr_report`, type: 'link', routePath:'', active: false, selected: false, title: 'gstr1_cdnr', icon: AiOutlineFileText },
  //     { id: 310,element:<GSTR1CDNUR />, formCode:"GSTR1", action: UserAction.Show,  path: `/reports/_/inventory/gstr1cdnur_report`, type: 'link', routePath:'', active: false, selected: false, title: 'gstr1_cdnur', icon: AiOutlineFileText },
  //     { id: 311,element:<GSTR1HSNSummary />, formCode:"GSTR1", action: UserAction.Show,  path: `/reports/_/inventory/gstr1hsnSummary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'gstr1_summary_of_hsn', icon: AiOutlineFileText },
  //     { id: 312,element:<GSTR1Docs />, formCode:"GSTR1", action: UserAction.Show,  path: `/reports/_/inventory/gstr1Docs_report`, type: 'link', routePath:'', active: false, selected: false, title: 'gstr1_docs', icon: AiOutlineFileText },
  //     { id: 313,element:<GSTR3BReport />, formCode:"GSTR3B", action: UserAction.Show,  path: `/reports/_/inventory/gstr3b_report`, type: 'link', routePath:'', active: false, selected: false, title: 'gstr3b', icon: AiOutlineFileText },
  //        ]
  // },
  // {
  //   icon: (<Boxes className="side-menu__icon side-menu" />),
  //   type: 'sub',
  //   Name: '',
  //   active: false,
  //   selected: false,
  //   title: 'itemwise_summary_reports',
  //   badge: '',
  //   badgetxt: '',
  //   class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
  //   columns: 2,
  //   children: [
  //     { id: 400,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_purchase_summary} gridHeader="itemwise_purchase_summary" gridId="grd_itemwise_purchase_summary" />, formCode:"ITPIRPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_purchase_summary`, type: 'link', routePath:'', active: false, selected: false, title: 'itemwise_purchase_summary', icon: AiOutlineFileText },
  //     { id: 401,element:<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_return_summary} gridHeader="item_wise_purchase_return_summary" gridId="grd_item_wise_purchase_return_summary" />, formCode:"ITPRRPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_purchase_return_summary`, type: 'link', routePath:'', active: false, selected: false, title: 'itemwise_purchase_return_summary', icon: AiOutlineFileText },
  //     { id: 402,element:<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_order_summary} gridHeader="item_wise_purchase_order_summary" gridId="grd_item_wise_purchase_order_summary" />, formCode:"ITPORPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_purchase_order_summary`, type: 'link', routePath:'', active: false, selected: false, title: 'itemwise_purchase_order_summary', icon: AiOutlineFileText },
  //     { id: 403,element:<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_estimate_summary} gridHeader="item_wise_purchase_estimate_summary" gridId="grd_item_wise_purchase_estimate_summary" />, formCode:"ITPERPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_purchase_estimate_summary`, type: 'link', routePath:'', active: false, selected: false, title: 'itemwise_purchase_estimate_summary', icon: AiOutlineFileText },
  //     { id: 404,element:<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_quotation_summary} gridHeader="item_wise_purchase_quotation_summary" gridId="grd_item_wise_purchase_quotation_summary" />, formCode:"PQRPTIWS", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_purchase_quotation_summary`, type: 'link', routePath:'', active: false, selected: false, title: 'itemwise_purchase_quotation_summary', icon: AiOutlineFileText },
  //     { id: 405,element:<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_return_estimate_summary} gridHeader="itemwise_purchase_return_estimate_summary" gridId="grd_itemwise_purchase_return_estimate_summary" />, formCode:"PREITEM", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_purchase_return_estimate_summary`, type: 'link', routePath:'', active: false, selected: false, title: 'itemwise_purchase_return_estimate_summary', icon: AiOutlineFileText },
  //     { id: 406,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_summary} gridHeader="itemwise_sales_summary" gridId="grd_itemwise_sales_summary" />, formCode:"ITSIRPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_sales_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'itemwise_sales_summary', icon: PiPackageLight },
  //     { id: 407,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_return_summary} gridHeader="itemwise_sales_return_summary" gridId="grd_itemwise_sales_return_summary" />, formCode:"ITSRRPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_sales_return_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'itemwise_sales_return_summary', icon: PiPackageLight },
  //     { id: 408,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_order_summary} gridHeader="itemwise_sales_order_summary" gridId="grd_itemwise_sales_order_summary" />, formCode:"ITSORPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_sales_order_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'itemwise_sales_order_summary', icon: PiPackageLight },
  //     { id: 409,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_quotation_summary} gridHeader="itemwise_sales_quotation_summary" gridId="grd_itemwise_sales_quotation_summary" />, formCode:"ITSQRPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_sales_quotation_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'itemwise_sales_quotation_summary', icon: PiPackageLight },
  //     { id: 410,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_estimate_summary} gridHeader="itemwise_sales_estimate_summary" gridId="grd_itemwise_sales_estimate_summary" />, formCode:"ITSERPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_sales_estimate_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'itemwise_sales_estimate_summary', icon: PiPackageLight },
  //     { id: 411,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_and_sales_return_summary} gridHeader="itemwise_sales_and_sales_return_summary" gridId="grd_itemwise_sales_and_sales_return_summary" />, formCode:"ITSISRRPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_sales_and_sales_return_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'itemwise_sales_and_sales_return_summary', icon: PiPackageLight },
  //   ]
  // },

  // {
  //   icon: (<Boxes className="side-menu__icon side-menu" />),
  //   type: 'sub',
  //   Name: '',
  //   active: false,
  //   selected: false,
  //   title: 'daily_statement',
  //   badge: '',
  //   badgetxt: '',
  //   class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
  //   columns: 2,
  //   children: [
  //     { id: 600,element:<DailyStatementReport dataUrl={urls.daily_statement_sales} gridHeader="daily_statement_report_of_sales" gridId={GridId.daily_statement_sales} />, formCode:"DSTRPT", action: UserAction.Show,  path: `/reports/_/inventory/daily_statement_sales`, type: 'link', routePath:'', active: false, selected: false, title: 'daily_statement_sales', icon: AiOutlineFileText },
  //     { id: 601,element:<DailyStatementReport dataUrl={urls.daily_statement_purchase} gridHeader="daily_statement_report_of_purchase" gridId={GridId.daily_statement_purchase} />, formCode:"DSTRPT", action: UserAction.Show,  path: `/reports/_/inventory/daily_statement_purchase`, type: 'link', routePath:'', active: false, selected: false, title: 'daily_statement_purchase', icon: AiOutlineFileText },
  //     { id: 602,element:<DailyStatementAllReport />, formCode:"DSTRPT", action: UserAction.Show,  path: `/reports/_/inventory/daily_statement_all`, type: 'link', routePath:'', active: false, selected: false, title: 'daily_statement_all', icon: AiOutlineFileText },
  //   ]
  // },

  // {
  //   icon: (<Boxes className="side-menu__icon side-menu" />),
  //   type: 'sub',
  //   Name: '',
  //   active: false,
  //   selected: false,
  //   title: 'other_inventory_reports',
  //   badge: '',
  //   badgetxt: '',
  //   class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
  //   columns: 1,
  //   children: [
  //     { id: 500,element:<PriceList />, formCode:"PL", action: UserAction.Show,  path: `/reports/_/inventory/price_list_report`, type: 'link', routePath:'', active: false, selected: false, title: 'price_list_report', icon: TbTag },
  //     { id: 501,element:<DailyBalanceAmount />, formCode:"RPTDLBLRPT", action: UserAction.Show,  path: `/reports/_/inventory/daily_balance_report`, type: 'link', routePath:'', active: false, selected: false, title: 'daily_balance_report', icon: IoScaleOutline },
  //     { id: 502,element:<ProductSummaryMaster />, formCode:"PSUMRPT", action: UserAction.Show,  path: `/reports/_/inventory/product_summary`, type: 'link', routePath:'', active: false, selected: false, title: 'product_summary', icon: AiOutlineFileText },
  //     { id: 503,element:<SummaryReport dataUrl={urls.transaction_summary} gridHeader="transaction_summary" gridId="grd_transaction_summary" />, formCode:"INVTRSUM", action: UserAction.Show,  path: `/reports/_/inventory/transaction_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'transaction_summary', icon: PiPackageLight },
  //     { id: 504,element:<RegisterReport dataUrl={urls.inventory_transaction_register} gridHeader="inventory_transaction_register" gridId="grd_inventory_transaction_register" />, formCode:"INVTRREG", action: UserAction.Show,  path: `/reports/_/inventory/inventory_transaction_register_report`, type: 'link', routePath:'', active: false, selected: false, title: 'inventory_transaction_register', icon: PiPackageLight },
  //     { id: 505,element:<InventorySummaryReport />, formCode:"RPTINVSUM", action: UserAction.Show,  path: `/reports/_/inventory/inventory_summary_report`, type: 'link', routePath:'', active: false, selected: false, title: 'inventory_summary_report', icon: PiPackageLight },
  //     { id: 506,element:<ServiceReport />, formCode:"SERVCRPT", action: UserAction.Show,  path: `/reports/_/inventory/service_report`, type: 'link', routePath:'', active: false, selected: false, title: 'service_report', icon: PiPackageLight },
  //     { id: 507,element:<SalesmanIncentiveReport />, formCode:"RPTSLIC", action: UserAction.Show,  path: `/reports/_/inventory/salesman_incentive_report`, type: 'link', routePath:'', active: false, selected: false, title: 'salesman_incentive_report', icon: PiPackageLight },
  //     { id: 508,element:<PrivilegeCardReport />, formCode:"RPTPRCRD", action: UserAction.Show,  path: `/reports/_/inventory/privilege_card_report`, type: 'link', routePath:'', active: false, selected: false, title: 'privilege_card', icon: PiPackageLight },
  //   ]
  // },

];