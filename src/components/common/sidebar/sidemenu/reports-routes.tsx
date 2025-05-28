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
import TrialBalancePeriodwise from "../../../../pages/accounts/reports/trialBalance/trial-balance-detailed";
import ProfitAndLossDetailedReport from "../../../../pages/accounts/reports/profitAndLoss/profit-and-loss-report-detailed";
import ProfitAndLossReport from "../../../../pages/accounts/reports/profitAndLoss/profit-and-loss-report";
import BalanceSheet from "../../../../pages/accounts/reports/balanceSheet/balace-sheet";
import BalancesheetVertical from "../../../../pages/accounts/reports/balanceSheet/balancesheet-vertical";
import TransactionReport from "../../../../pages/accounts/reports/transactionReport/transaction-report";
import AccountsHistoryReport from "../../../../pages/accounts/reports/transactionHistory/accountsHistory/accounts-history-report";
import InventoryHistoryReport from "../../../../pages/accounts/reports/transactionHistory/InventoryHistory/inventory-history-report";
import DailySummaryMaster from "../../../../pages/accounts/reports/dailySummary/daily-summary-master";
import DailySummaryGlobal from "../../../../pages/accounts/reports/dailySummary/daily-summary-global";
import BillwiseProfit from "../../../../pages/accounts/reports/billwise-profit/billwise-profit";
import BillwiseProfitGlobal from "../../../../pages/accounts/reports/billwise-profit/billwise-profit-global";
import LedgerReport from "../../../../pages/accounts/reports/ledger-report";
import OutstandingAccountPayableAgingReport from "../../../../pages/accounts/reports/outStandingReportsAging/outstanding-account-payable-aging-report";
import OutstandingAccountPayableReport from "../../../../pages/accounts/reports/outStandingReports/outstanding-account-payable-report";
import PartySummaryMaster from "../../../../pages/accounts/reports/partywise-summary/party-summary-master";
import OutstandingAccountReceivableReport from "../../../../pages/accounts/reports/outStandingReports/outstanding-account-receivable-report";
import OutstandingAccountReceivableAgingReport from "../../../../pages/accounts/reports/outStandingReportsAging/outstanding-account-receivable-aging-report";
import CashBookSummary from "../../../../pages/accounts/reports/cashBook/cash-book-summary";
import DayBookDetailed from "../../../../pages/accounts/reports/dayBook/day-book-detailed";
import DayBookSummary from "../../../../pages/accounts/reports/dayBook/dayBookSummary/day-book-summary";
import PaymentReport from "../../../../pages/accounts/reports/payment-report";
import CollectionReport from "../../../../pages/accounts/reports/collection-report";
import CashSummary from "../../../../pages/accounts/reports/cashSummary/cash-summary";
import CashSummaryLedgerwise from "../../../../pages/accounts/reports/cashSummary/cash-summary-ledgerwise";
import IncomeReport from "../../../../pages/accounts/reports/incomeexpense/income-report";
import IncomeReportDetailed from "../../../../pages/accounts/reports/incomeexpense/income-report-detailed";
import ExpenseReport from "../../../../pages/accounts/reports/incomeexpense/expense-report";
import BankFlowReport from "../../../../pages/accounts/reports/CashFlowBankFlow/bank-flow-report";
import IncomExpenseStatement from "../../../../pages/accounts/reports/incomeexpense/income-expense-statement";
import BankStatementReport from "../../../../pages/accounts/reports/bank-statement-report";
import CashFlowReport from "../../../../pages/accounts/reports/CashFlowBankFlow/rpt-cash-flow-report";
import ExpenseReportDetailed from "../../../../pages/accounts/reports/incomeexpense/expense-report-detailed";
import SummaryReport from "../../../../pages/inventory/reports/summary-report/summary-report";
import urls from "../../../../redux/urls";
import RegisterReport from "../../../../pages/inventory/reports/register-report/register-report";
import PartyWiseReport from "../../../../pages/inventory/reports/party-wise-report/party-wise-report";
import TaxReportDetailed from "../../../../pages/inventory/reports/purchase-tax-report-detailed/purchase-tax-report-detailed";
import TaxReportSummary from "../../../../pages/inventory/reports/purchase-tax-report-summary/purchase-tax-report-summary";
import CreditPurchaseSummaryReport from "../../../../pages/inventory/reports/credit-purchase-summary-report/credit-purchase-summary-report";
import PartyMonthwiseSummaryReport from "../../../../pages/inventory/reports/Party-monthwise-purchase-summary-report/Party-monthwise-purchase-summary-report";
import PurchaseOrderTransitReport from "../../../../pages/inventory/reports/Purchase-order-transit-report/Purchase-order-transit-report";
import PurchaseTaxGSTDailySummary from "../../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-daily-summary-report";
import PurchaseTaxGSTAdvRegisterFormat from "../../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-adv-register-format-report";
import PurchaseTaxGSTRegisterFormat from "../../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-register-format-report";
import PurchaseTaxGSTDetailed from "../../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-detailed-report";
import PurchaseTaxGSTMonthlySummary from "../../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-monthly-summary-report";
import PurchaseTaxGSTTaxwiseWithHSN from "../../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-taxwise-with-hsn-report";
import PurchaseTaxGSTTaxwise from "../../../../pages/inventory/reports/purchase-tax-gst-reports/purchase-tax-gst-taxwise-report";
import PurchaseReturnTaxGSTSalesAndReturn from "../../../../pages/inventory/reports/purchase-return-tax-gst-reports/purchase-return-tax-gst-sales-and-return-report";
import OpeningStock from "../../../../pages/inventory/reports/opening-stock-report/opening-stock";
import StockTransfer from "../../../../pages/inventory/reports/stock-transfer-report/stock-transfer";
import DamageStock from "../../../../pages/inventory/reports/damage-stock-report/damage-stock";
import ExcessStock from "../../../../pages/inventory/reports/excess-stock-report/excess-stock";
import ShortageStock from "../../../../pages/inventory/reports/shortage-stock-report/shortage-stock";
import BranchTransferOut from "../../../../pages/inventory/reports/branch-transfer-out-report/branch-tranfer-out";
import BranchTransferIn from "../../../../pages/inventory/reports/branch-transfer-in-report/branch-tranfer-in";
import BranchTransferSummaryOut from "../../../../pages/inventory/reports/branch-transfer-summary-out-report/branch-tranfer-summary-out";
import BranchTransferSummaryIn from "../../../../pages/inventory/reports/branch-transfer-summary-in-report/branch-tranfer-summary-in";
import ItemWiseSummaryReport from "../../../../pages/inventory/reports/itemwise-summary-report/itemwise-summary";
import StockSummary from "../../../../pages/inventory/reports/stock-summary-report/stock-summary";
import StockLedger from "../../../../pages/inventory/reports/stock-ledger/stock-ledger-report";
import ExpiryReport from "../../../../pages/inventory/reports/expiry-report/expiry-report";
import TransactionAnalysisReport from "../../../../pages/inventory/reports/transaction-analysis-report/transaction-analysis-report";
import { GroupwiseSalesSummaryFilterInitialState } from "../../../../pages/inventory/reports/groupwise-sales-summary/groupwise-sales-summary-filter";
import SalesAndSalesReturn from "../../../../pages/inventory/reports/sales-and-sales-return-report/sales-and-sales-return";
import NetSalesReport from "../../../../pages/inventory/reports/net-sales-report/net-sales";
import DaywiseSummaryWithProfit from "../../../../pages/inventory/reports/daywise-summary-with-profit-report/daywise-summary-with-profit";
import GroupwiseSalesSummaryDevexpress from "../../../../pages/inventory/reports/groupwise-sales-summary/groupwise-sales-summary-devexpress";
import GroupwiseSalesSummary from "../../../../pages/inventory/reports/groupwise-sales-summary/groupwise-sales-summary";
import SalesmanwiseSalesAndCollection from "../../../../pages/inventory/reports/salesman-wise-sales-and-collection-report/salesman-wise-sales-and-collection";
import NonInvoicedGoodsDelivery from "../../../../pages/inventory/reports/non-invoiced-goods-delivery-report/non-invoiced-goods-delivery";
import PendingOrderReport from "../../../../pages/inventory/reports/pending-order-report/pending-order";
import PromotionalSalesReport from "../../../../pages/inventory/reports/promotional-sales-report/promotional-sales";
import GroupedBrandwiseSales from "../../../../pages/inventory/reports/grouped-brandwise-sales-report/grouped-brandwise-sales";
import CouponReports from "../../../../pages/inventory/reports/coupon-report/coupon-report";
import SchemeWiseSales from "../../../../pages/inventory/reports/scheme-wise-sales-report/scheme-wise-sales";
import RouteWiseSalesAndCollection from "../../../../pages/inventory/reports/routewise-sales-and-collection-report/routewise-sales-and-collection";
import BranchInventoryRequestPendingOrder from "../../../../pages/inventory/reports/branch-inventory-request-pending-order-report/branch-inventory-request-pending-order";
import PrintDetails from "../../../../pages/inventory/reports/print-details-report/print-details";
import InventoryStatusReport from "../../../../pages/inventory/reports/inventory-status-report/inventory-status";
import VoidReport from "../../../../pages/inventory/reports/void-report/void-report";
import CounterReport from "../../../../pages/inventory/reports/counter-report/counter-report";
import DiagnosisReport from "../../../../pages/inventory/reports/diagnosis-report/diagnosis-report";
import DiagnosisReportZeroRateProductlist from "../../../../pages/inventory/reports/diagnosis-report/diagnosis-report-zero-rate-productlist";
import DiagnosisReportPostDatedTransactions from "../../../../pages/inventory/reports/diagnosis-report/diagnosis-report-post-dated-transactions";
import DiagnosisReportSalesPriceLessThanLPCost from "../../../../pages/inventory/reports/diagnosis-report/diagnosis-report-sales-price-less-than-lp-cost";
import DiagnosisReportSalesPriceLessthanPurchasePrice from "../../../../pages/inventory/reports/diagnosis-report/diagnosis-report-sales-price-less-than-purchase-price";
import DiagnosisReportSalesPriceLessthanMSP from "../../../../pages/inventory/reports/diagnosis-report/diagnosis-report-sales-price-less-than-msp";
import DiagnosisReportSalesPriceGreaterthanMRP from "../../../../pages/inventory/reports/diagnosis-report/diagnosis-report-sales-price-greater-than-mrp";
import CustomerVisitTotalVisit from "../../../../pages/inventory/reports/customer-visit-total-visit-report/customer-visit-total-visit-report";
import CustomerVisitLastVisit from "../../../../pages/inventory/reports/customer-visit-last-visit-report/customer-visit-last-visit-report";
import FOCRegisterReport from "../../../../pages/inventory/reports/foc-register-report/foc-register-report";
import DiscountReportInventory from "../../../../pages/inventory/reports/discount_report_inventory-report/discount_report_inventory-report";
import DiscountReportCollection from "../../../../pages/inventory/reports/discount_report_collection-report/discount_report_collection-report";
import ItemUsedForService from "../../../../pages/inventory/reports/item_used_for_service-report/item_used_for_service-report";
import LPOReport from "../../../../pages/inventory/reports/lpo_report/lpo_report";
import SalesTransferMonthWiseSummaryReport from "../../../../pages/inventory/reports/sales-transfer-monthWise-summary/sales-transfer-monthwise-summary-report";
import PurchaseTaxReport from "../../../../pages/inventory/reports/tax-reports-ksa/Purchase-Tax-report";
import SalesTax from "../../../../pages/inventory/reports/tax-reports-ksa/sales-tax";
import VatReturnForm from "../../../../pages/inventory/reports/tax-reports-ksa/vat-return-form/Vat-Return-Form";
import VatReturnFormArabic from "../../../../pages/inventory/reports/tax-reports-ksa/vat-return-form/Vat-Return-Form-arabic";
import KsaEInvoiceReportSummary from "../../../../pages/inventory/reports/tax-reports-ksa/ksa-e-invoice-report/ksa-e-invoice-summary.tsx";
import KsaEInvoiceReportDetailed from "../../../../pages/inventory/reports/tax-reports-ksa/ksa-e-invoice-report/ksa-e-invoice-detailed";
import GSTR1B2B from "../../../../pages/inventory/reports/GSTR1/gstr1-b2b";
import GSTR1B2CLarge from "../../../../pages/inventory/reports/GSTR1/gstr1-b2c-large";
import GSTR1B2CSmall from "../../../../pages/inventory/reports/GSTR1/gstr1-b2c-small";
import GSTR1CDNR from "../../../../pages/inventory/reports/GSTR1/gstr1-cdnr";
import GSTR1CDNUR from "../../../../pages/inventory/reports/GSTR1/gstr1-cdnur";
import GSTR1HSNSummary from "../../../../pages/inventory/reports/GSTR1/gstr1-summaryOfHSN";
import GSTR1Docs from "../../../../pages/inventory/reports/GSTR1/gstr1-docs";
import GSTR3BReport from "../../../../pages/inventory/reports/GSTR3B/gstr3b";
import GridId from "../../../../redux/gridId";
import DailyStatementReport from "../../../../pages/inventory/reports/daily-statement-report/daily-statement-report";
import DailyStatementAllReport from "../../../../pages/inventory/reports/daily-statement-report/daily-statement-all-report ";
export interface NavigationItem {
  id: number;
  path: string;
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
      { id: 27,element:<TrialBalance />, formCode:"TBRpt", action: UserAction.Show, path: `/reports/_/accounts/trial_balance`, type: 'link', active: false, selected: false, title: 'trial_balance', icon: SlEqualizer },
      { id: 28,element:<TrialBalancePeriodwise />, formCode:"TBRpt", action: UserAction.Show,  path: `/reports/_/accounts/trial_balance_period_wise`, type: 'link', active: false, selected: false, title: 'trial_balance_periodwise', icon: ImEqualizer2 },
      { id: 29,element:<ProfitAndLossReport />, formCode:"PLRPT", action: UserAction.Show, path: `/reports/_/accounts/profit_and_loss`, type: 'link', active: false, selected: false, title: 'profit_&_loss_account', icon: TrendingUp },
      { id: 30,element:<ProfitAndLossDetailedReport />, formCode:"PLRPT", action: UserAction.Show, path: `/reports/_/accounts/profit_and_loss_detailed`, type: 'link', active: false, selected: false, title: 'profit_&_loss_account_detailed', icon: TfiStatsUp },
      { id: 31,element:<BalanceSheet />, formCode:"BSRPT", action: UserAction.Show, path: `/reports/_/accounts/balance_sheet`, type: 'link', active: false, selected: false, title: 'balance_sheet', icon: Scale },
      { id: 32,element:<BalancesheetVertical />, formCode:"BSRPT", action: UserAction.Show, path: `/reports/_/accounts/balance_sheet_detailed`, type: 'link', active: false, selected: false, title: 'balance_sheet_detailed', icon: FaScaleUnbalancedFlip },
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
      { id: 17,element:<TransactionReport />, formCode:"TRANSRPT", action: UserAction.Show, path: `/reports/_/accounts/transaction_report`, type: 'link', active: false, selected: false, title: 'transaction_report', icon: FiFileText },
      { id: 18,element:<AccountsHistoryReport />, formCode:"RPTTRAHST", action: UserAction.Show, path: `/reports/_/accounts/transaction_history_accounts`, type: 'link', active: false, selected: false, title: 'transaction_history_accounts', icon: LuHistory },
      { id: 19,element:<InventoryHistoryReport />, formCode:"RPTTRAHST", action: UserAction.Show, path: `/reports/_/accounts/transaction_history_inventory`, type: 'link', active: false, selected: false, title: 'transaction_history_inventory', icon: MdOutlineManageHistory },
      { id: 20,element:<DailySummaryMaster />, formCode:"DSUMRPT", action: UserAction.Show, path: `/reports/_/accounts/daily_summary_report`, type: 'link', active: false, selected: false, title: 'daily_summary_report', icon: CalendarClock },
      { id: 20,element:<DailySummaryGlobal />, formCode:"DSUMRPT", action: UserAction.Show, path: `/reports/_/accounts/daily_summary_report`, type: 'link', active: false, selected: false, title: 'daily_summary_report___', icon: CalendarClock },
      { id: 21,element:<BillwiseProfit />, formCode:"PFTRPT", action: UserAction.Show, path: `/reports/_/accounts/billwise_profit`, type: 'link', active: false, selected: false, title: 'billwise_profit_report', icon: ChartNoAxesCombined },
      { id: 21,element:<BillwiseProfitGlobal />, formCode:"PFTRPT", action: UserAction.Show, path: `/reports/_/accounts/billwise_profit`, type: 'link', active: false, selected: false, title: 'billwise_profit_report__', icon: ChartNoAxesCombined },
      { id: 22,element:<PartySummaryMaster />, formCode:"PRTSUM", action: UserAction.Show, path: `/reports/_/accounts/partywise_summary`, type: 'link', active: false, selected: false, title: 'partywise_summary_report', icon: Component },
      { id: 23,element:<OutstandingAccountPayableReport />, formCode:"RPTACCPAY", action: UserAction.Show, path: `/reports/_/accounts/outstanding_payable`, type: 'link', active: false, selected: false, title: 'account_payable', icon: LucideCreditCard },
      { id: 24,element:<OutstandingAccountReceivableReport />, formCode:"RPTACCREC", action: UserAction.Show, path: `/reports/_/accounts/outstanding_receivable`, type: 'link', active: false, selected: false, title: 'account_receivable', icon: LucideDollarSign },
      { id: 25,element:<OutstandingAccountPayableAgingReport />, formCode:"APAGINGRPT", action: UserAction.Show, path: `/reports/_/accounts/outstanding_aging_payable`, type: 'link', active: false, selected: false, title: 'account_payable_aging_report', icon: Clock1Icon },
      { id: 26,element:<OutstandingAccountReceivableAgingReport />, formCode:"ARAGINGRPT", action: UserAction.Show, path: `/reports/_/accounts/outstanding_aging_receivable`, type: 'link', active: false, selected: false, title: 'account_receivable_aging_report', icon: Calendar },
      { id: 1,element:<LedgerReport />, formCode:"LEDGRRPT", action: UserAction.Show, path: `/reports/_/accounts/ledger_report`, type: 'link', active: false, selected: false, title: 'ledger_report', icon: IoBookOutline },
      { id: 2,element:<CashBookSummary />, formCode:"CPRPT", action: UserAction.Show, path: `/reports/_/accounts/cash_book`, type: 'link', active: false, selected: false, title: 'cash_book', icon: FaCoins },
      { id: 3,element:<DayBookDetailed />, formCode:"DBRPT", action: UserAction.Show, path: `/reports/_/accounts/day_book_detailed`, type: 'link', active: false, selected: false, title: 'day_book_detailed', icon: BookCopy },
      { id: 4,element:<DayBookSummary />, formCode:"DBRPT", action: UserAction.Show, path: `/reports/_/accounts/day_book_summary`, type: 'link', active: false, selected: false, title: 'day_book_summary', icon: MdLibraryBooks },
      { id: 5,element:<PaymentReport />, formCode:"PAYMRPT", action: UserAction.Show, path: `/reports/_/accounts/payment_report`, type: 'link', active: false, selected: false, title: 'payment_report', icon: MdOutlinePayments },
      { id: 6,element:<CollectionReport />, formCode:"COLLRPT", action: UserAction.Show, path: `/reports/_/accounts/collection_report`, type: 'link', active: false, selected: false, title: 'collection_report', icon: BsCollection },
      { id: 7,element:<CashSummary />, formCode:"RPTCASHSUM", action: UserAction.Show, path: `/reports/_/accounts/cash_summary`, type: 'link', active: false, selected: false, title: 'cash_summary_report', icon: GrDocumentStore },
      { id: 8,element:<CashSummaryLedgerwise />, formCode:"RPTCASHSUM", action: UserAction.Show, path: `/reports/_/accounts/cash_summary_ledgerwise`, type: 'link', active: false, selected: false, title: 'cash_summary_ledgerwise_report', icon: TbCoins },
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
      { id: 9,element:<IncomeReport />, formCode:"IcmRpt", action: UserAction.Show, path: `/reports/_/accounts/income_report`, type: 'link', active: false, selected: false, title: 'income_report', icon: FaHandHoldingDollar },
      { id: 10,element:<IncomeReportDetailed />, formCode:"IcmRpt", action: UserAction.Show, path: `/reports/_/accounts/income_report_detailed`, type: 'link', active: false, selected: false, title: 'income_report_detailed', icon: GiReceiveMoney },
      { id: 11,element:<ExpenseReport />, formCode:"ExpRpt", action: UserAction.Show, path: `/reports/_/accounts/expense_report`, type: 'link', active: false, selected: false, title: 'expense_report', icon: GiSwapBag },
      { id: 12,element:<ExpenseReportDetailed />, formCode:"ExpRpt", action: UserAction.Show, path: `/reports/_/accounts/expense_report_detailed`, type: 'link', active: false, selected: false, title: 'expense_report_detailed', icon: FaSackDollar },
      { id: 13,element:<IncomExpenseStatement />, formCode:"INCEXPSMT", action: UserAction.Show, path: `/reports/_/accounts/income_expense_statement`, type: 'link', active: false, selected: false, title: 'income_expense_statement', icon: LiaFileInvoiceDollarSolid },
      { id: 14,element:<CashFlowReport />, formCode:"CashFlwRpt", action: UserAction.Show, path: `/reports/_/accounts/cash_flow`, type: 'link', active: false, selected: false, title: 'cash_flow', icon: CircleStackIcon },
      { id: 15,element:<BankFlowReport />, formCode:"CashFlwRpt", action: UserAction.Show, path: `/reports/_/accounts/bank_flow`, type: 'link', active: false, selected: false, title: 'bank_flow', icon: RiBankLine },
      { id: 16,element:<BankStatementReport />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/accounts/bank_statement`, type: 'link', active: false, selected: false, title: 'bank_statement', icon: RiBankFill },
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
      { id: 60,element:<SummaryReport dataUrl={urls.purchase_summary_report} gridHeader="purchase_summary_report" gridId="grd_purchase_summary" />, formCode:"RPTPURSUM", action: UserAction.Show, path: `/reports/_/inventory/purchase_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_summary_report', icon: HiOutlineDocumentReport },
      { id: 61,element:<RegisterReport dataUrl={urls.purchase_register_report} gridHeader="purchase_register_report" gridId="grd_purchase_register" />, formCode:"RPTPURREG", action: UserAction.Show, path: `/reports/_/inventory/purchase_register_report`, type: 'link', active: false, selected: false, title: 'purchase_register_report', icon: AiOutlineFileText },
      { id: 62,element:<PartyWiseReport dataUrl={urls.party_wise_report} gridHeader="party_wise_purchase_summary_report" gridId="grd_party_wise" />, formCode:"RPTPWP", action: UserAction.Show, path: `/reports/_/inventory/party_wise_report`, type: 'link', active: false, selected: false, title: 'party_wise_report', icon: PiUsersThreeLight },
      { id: 63,element:<TaxReportDetailed dataUrl={urls.purchase_tax_report_detailed} gridHeader="purchase_tax_report_detailed" gridId="grd_purchase_tax_report_detailed" />, formCode:"RPTPITX", action: UserAction.Show, path: `/reports/_/inventory/purchase_tax_report_detailed`, type: 'link', active: false, selected: false, title: 'purchase_tax_report_detailed', icon: PiUsersThreeLight },
      { id: 64,element:<TaxReportSummary dataUrl={urls.purchase_tax_report_summary} gridHeader="purchase_tax_report_summary" gridId="grd_purchase_tax_summary" />, formCode:"RPTPITX", action: UserAction.Show, path: `/reports/_/inventory/purchase_tax_report_summary`, type: 'link', active: false, selected: false, title: 'purchase_tax_report_summary', icon: PiUsersThreeLight },
      { id: 65,element:<SummaryReport dataUrl={urls.purchase_return_summary} gridHeader="purchase_return_summary_report" gridId="grd_purchase_return_summary" />, formCode:"RPTPRSUM", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_summary`, type: 'link', active: false, selected: false, title: 'purchase_return_summary', icon: PiUsersThreeLight },
      { id: 66,element:<RegisterReport dataUrl={urls.purchase_return_register} gridHeader="purchase_return_register_report" gridId="grd_purchase_return_register" />, formCode:"RPTPRREG", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_register`, type: 'link', active: false, selected: false, title: 'purchase_return_register', icon: PiUsersThreeLight },
      { id: 67,element:<SummaryReport dataUrl={urls.purchase_estimate_summary} gridHeader="purchase_estimate_summary_report" gridId="grd_purchase_estimate_summary" />, formCode:"RPTPES", action: UserAction.Show, path: `/reports/_/inventory/purchase_estimate_summary`, type: 'link', active: false, selected: false, title: 'purchase_estimate_summary', icon: PiUsersThreeLight },
      { id: 68,element:<SummaryReport dataUrl={urls.purchase_order_summary} gridHeader="purchase_order_summary" gridId="grd_purchase_order_summary" />, formCode:"RPTPOS", action: UserAction.Show, path: `/reports/_/inventory/purchase_order_summary`, type: 'link', active: false, selected: false, title: 'purchase_order_summary', icon: PiUsersThreeLight },
      { id: 69,element:<CreditPurchaseSummaryReport />, formCode:"", action: UserAction.Show, path: `/reports/_/inventory/credit_purchase_summary`, type: 'link', active: false, selected: false, title: 'credit_purchase_summary', icon: AiOutlineFileText },
      { id: 70,element:<PartyMonthwiseSummaryReport dataUrl={urls.party_monthwise_purchase_summary} gridHeader="party_monthwise_purchase_summary" gridId="grd_party_monthwise_purchase_summary" />, formCode:"", action: UserAction.Show, path: `/reports/_/inventory/party_monthwise_purchase_summary`, type: 'link', active: false, selected: false, title: 'party_monthwise_purchase_summary', icon: AiOutlineFileText },
      { id: 71,element:<PurchaseOrderTransitReport />, formCode:"", action: UserAction.Show, path: `/reports/_/inventory/purchase_order_transit_report`, type: 'link', active: false, selected: false, title: 'purchase_order_transit_report', icon: AiOutlineFileText },
      { id: 72,element:<RegisterReport dataUrl={urls.purchase_estimate_register} gridHeader="purchase_estimate_register_report" gridId="grd_purchase_estimate_register" />, formCode:"", action: UserAction.Show, path: `/reports/_/inventory/purchase_estimate_register_report`, type: 'link', active: false, selected: false, title: 'purchase_estimate_register_report', icon: AiOutlineFileText },
      { id: 73,element:<RegisterReport dataUrl={urls.purchase_return_estimate_register} gridHeader="purchase_return_estimate_register_report" gridId="grd_purchase_return_estimate_register" />, formCode:"PREREGT", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_estimate_register_report`, type: 'link', active: false, selected: false, title: 'purchase_return_estimate_register_report', icon: AiOutlineFileText },
      { id: 74,element:<SummaryReport dataUrl={urls.purchase_return_estimate_summary} gridHeader="purchase_return_estimate_summary_report" gridId="grd_purchase_return_estimate_summary" />, formCode:"PRESUMMY", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_estimate_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_return_estimate_summary_report', icon: HiOutlineDocumentReport },

      //purchase Tax
      { id: 86,element:<PurchaseTaxGSTDailySummary dataUrl={urls.purchase_gst_daily_summary} gridHeader="purchase_gst_daily_summary_report" gridId="grd_purchase_gst_daily_summary_report" />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_daily_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_daily_summary_report', icon: AiOutlineFileText },
      { id: 90,element:<PurchaseTaxGSTTaxwise dataUrl={urls.purchase_gst_taxwise} gridHeader="purchase_gst_taxwise_report" gridId="grd_purchase_gst_taxwise_report" />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_taxwise_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_taxwise_report', icon: AiOutlineFileText },
      { id: 91,element:<PurchaseTaxGSTTaxwiseWithHSN dataUrl={urls.purchase_gst_taxwise_with_hsn} gridHeader="purchase_gst_taxwise_with_hsn_report" gridId="grd_purchase_gst_taxwise_with_hsn_report" />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_taxwise_with_hsn_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_taxwise_with_hsn_report', icon: AiOutlineFileText },
      { id: 88,element:<PurchaseTaxGSTMonthlySummary dataUrl={urls.purchase_gst_monthly_summary} gridHeader="purchase_gst_monthly_summary_report" gridId="grd_purchase_gst_monthly_summary_report" />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_monthly_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_monthly_summary_report', icon: AiOutlineFileText },
      { id: 87,element:<PurchaseTaxGSTDetailed dataUrl={urls.purchase_gst_detailed} gridHeader="purchase_gst_detailed_report" gridId="grd_purchase_gst_detailed_report" />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_detailed_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_detailed_report', icon: AiOutlineFileText },
      { id: 89,element:<PurchaseTaxGSTRegisterFormat dataUrl={urls.purchase_gst_register_format} gridHeader="purchase_gst_register_format_report" gridId="grd_purchase_gst_register_report" />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_register_format_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_register_format_report', icon: AiOutlineFileText },
      { id: 85,element:<PurchaseTaxGSTAdvRegisterFormat dataUrl={urls.purchase_gst_adv_register_format} gridHeader="purchase_gst_advanced_register_format_report" gridId="grd_purchase_gst_adv_register_report" />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_gst_adv_register_format_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_advance_register_format_report', icon: AiOutlineFileText },

      //purchase return Tax
      { id: 93,element:<PurchaseTaxGSTDailySummary dataUrl={urls.purchase_return_gst_daily_summary} gridHeader="purchase_return_gst_daily_summary_report" gridId="grd_purchase_return_gst_daily_summary_report" />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_daily_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_daily_summary_report', icon: AiOutlineFileText },
      { id: 97,element:<PurchaseReturnTaxGSTSalesAndReturn />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_sales_and_return_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_sales_and_return_report', icon: AiOutlineFileText },
      { id: 98,element:<PurchaseTaxGSTTaxwise dataUrl={urls.purchase_return_gst_taxwise} gridHeader="purchase_return_gst_taxwise_report" gridId="grd_purchase_return_gst_taxwise_report" />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_taxwise_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_taxwise_report', icon: AiOutlineFileText },
      { id: 99,element:<PurchaseTaxGSTTaxwiseWithHSN dataUrl={urls.purchase_return_gst_taxwise_with_hsn} gridHeader="purchase_return_gst_taxwise_with_hsn_report" gridId="grd_purchase_return_gst_taxwise_with_hsn_report" />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_taxwise_with_hsn_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_taxwise_with_hsn_report', icon: AiOutlineFileText },
      { id: 95,element:<PurchaseTaxGSTMonthlySummary dataUrl={urls.purchase_return_gst_monthly_summary} gridHeader="purchase_return_gst_monthly_summary_report" gridId="grd_purchase_return_gst_monthly_summary_report" />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_monthly_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_monthly_summary_report', icon: AiOutlineFileText },
      { id: 94,element:<PurchaseTaxGSTDetailed dataUrl={urls.purchase_return_gst_detailed} gridHeader="purchase_return_gst_detailed_report" gridId="grd_purchase_return_gst_detailed_report" />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_detailed_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_detailed_report', icon: AiOutlineFileText },
      { id: 96,element:<PurchaseTaxGSTRegisterFormat dataUrl={urls.purchase_return_gst_register_format} gridHeader="purchase_return_gst_register_format_report" gridId="grd_purchase_return_gst_register_report" />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_register_format_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_register_format_report', icon: AiOutlineFileText },
      { id: 92,element:<PurchaseTaxGSTAdvRegisterFormat dataUrl={urls.purchase_return_gst_adv_register_format} gridHeader="purchase_return_gst_advanced_register_format_report" gridId="grd_purchase_return_gst_adv_register_report" />, formCode:"BKSTMT", action: UserAction.Show, path: `/reports/_/inventory/purchase_return_gst_adv_register_format_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_adv_register_format_report', icon: AiOutlineFileText },

    ]
  },
  {
    icon: (<Boxes className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'stock',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { id: 100,element:<OpeningStock />, formCode:"OSRPT", action: UserAction.Show, path: `/reports/_/inventory/opening_stock_report`, type: 'link', active: false, selected: false, title: 'opening_stock', icon: PiPackageLight },
      { id: 101,element:<StockTransfer />, formCode:"STRPT", action: UserAction.Show, path: `/reports/_/inventory/stock_transfer_report`, type: 'link', active: false, selected: false, title: 'stock_transfer', icon: PiPackageLight },
      { id: 102,element:<DamageStock />, formCode:"DMGRPT", action: UserAction.Show, path: `/reports/_/inventory/damage_stock_report`, type: 'link', active: false, selected: false, title: 'damage_stock', icon: PiPackageLight },
      { id: 103,element:<ExcessStock />, formCode:"EXRPT", action: UserAction.Show, path: `/reports/_/inventory/excess_stock_report`, type: 'link', active: false, selected: false, title: 'excess_stock', icon: PiPackageLight },
      { id: 104,element:<ShortageStock />, formCode:"SHRPT", action: UserAction.Show, path: `/reports/_/inventory/shortage_stock_report`, type: 'link', active: false, selected: false, title: 'shortage_stock', icon: PiPackageLight },
      { id: 105,element:<BranchTransferOut />, formCode:"BTORPT", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_out_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_out', icon: PiPackageLight },
      { id: 106,element:<BranchTransferIn />, formCode:"BTIRPT", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_in_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_in', icon: PiPackageLight },
      { id: 107,element:<BranchTransferSummaryOut />, formCode:"", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_summary_out_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_summary_out', icon: PiPackageLight },
      { id: 108,element:<BranchTransferSummaryIn />, formCode:"", action: UserAction.Show, path: `/reports/_/inventory/branch_transfer_summary_in_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_summary_in', icon: PiPackageLight },
      { id: 111,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_opening_stock_summary} gridHeader="itemwise_opening_stock_summary" gridId="grd_itemwise_opening_stock_summary" />, formCode:"OSRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_opening_stock_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_opening_stock_summary', icon: PiPackageLight },
      { id: 112,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_substitute_summary} gridHeader="itemwise_substitute_summary" gridId="grd_itemwise_substitute_summary" />, formCode:"SUBRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_substitute_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_substitute_summary', icon: PiPackageLight },
      { id: 113,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_branch_transfer_out_summary} gridHeader="itemwise_branch_transfer_out_summary" gridId="grd_itemwise_branch_transfer_out_summary" />, formCode:"BTORPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_branch_transfer_out_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_branch_transfer_out_summary', icon: PiPackageLight },
      { id: 114,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_branch_transfer_in_summary} gridHeader="itemwise_branch_transfer_in_summary" gridId="grd_itemwise_branch_transfer_in_summary" />, formCode:"BTIRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_branch_transfer_in_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_branch_transfer_in_summary', icon: PiPackageLight },
      { id: 115,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_excess_summary} gridHeader="itemwise_excess_summary" gridId="grd_itemwise_excess_summary" />, formCode:"EXRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_excess_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_excess_summary', icon: PiPackageLight },
      { id: 116,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_shortage_summary} gridHeader="itemwise_shortage_summary" gridId="grd_itemwise_shortage_summary" />, formCode:"SHRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_shortage_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_shortage_summary', icon: PiPackageLight },
      { id: 117,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_damage_stock_summary} gridHeader="itemwise_damage_stock_summary" gridId="grd_itemwise_damage_stock_summary" />, formCode:"DMGRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_damage_stock_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_damage_stock_summary', icon: PiPackageLight },
      { id: 118,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_delivery_summary} gridHeader="itemwise_goods_delivery_summary" gridId="grd_itemwise_goods_delivery_summary" />, formCode:"GDRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_delivery_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_delivery_summary', icon: PiPackageLight },
      { id: 119,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_delivery_return_summary} gridHeader="itemwise_goods_delivery_return_summary" gridId="grd_itemwise_goods_delivery_return_summary" />, formCode:"DRRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_delivery_return_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_delivery_return_summary', icon: PiPackageLight },
      { id: 120,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_receipt_summary} gridHeader="itemwise_goods_receipt_summary" gridId="grd_itemwise_goods_receipt_summary" />, formCode:"GRNRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_receipt_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_receipt_summary', icon: PiPackageLight },
      { id: 121,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_receipt_return_summary} gridHeader="itemwise_goods_receipt_return_summary" gridId="grd_itemwise_goods_receipt_return_summary" />, formCode:"GRRRPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_receipt_return_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_receipt_return_summary', icon: PiPackageLight },
      { id: 122,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_goods_request_summary} gridHeader="itemwise_goods_request_summary" gridId="grd_itemwise_goods_request_summary" />, formCode:"GR_RPTIWS", action: UserAction.Show, path: `/reports/_/inventory/itemwise_goods_request_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_request_summary', icon: PiPackageLight },
      { id: 123,element:<StockSummary />, formCode:"RPTSTK", action: UserAction.Show, path: `/reports/_/inventory/stock_summary_report`, type: 'link', active: false, selected: false, title: 'stock_summary', icon: PiPackageLight },
      { id: 124,element:<StockLedger />, formCode:"RPTSTKLED", action: UserAction.Show, path: `/reports/_/inventory/stock_ledger_report`, type: 'link', active: false, selected: false, title: 'stock_ledger', icon: HiOutlineClipboardList },
      { id: 125,element:<ExpiryReport />, formCode:"EXPIRYRPT", action: UserAction.Show, path: `/reports/_/inventory/expiry_report`, type: 'link', active: false, selected: false, title: 'expiry_report', icon: HiOutlineClipboardList },
      { id: 126,element:<TransactionAnalysisReport />, formCode:"TARPT", action: UserAction.Show, path: `/reports/_/inventory/transaction_analysis_report`, type: 'link', active: false, selected: false, title: 'transaction_analysis', icon: MdOutlineAnalytics },
      { id: 127,element:<StockFlow />, formCode:"RPTSTKFL", action: UserAction.Show, path: `/reports/_/inventory/stock_flow_report`, type: 'link', active: false, selected: false, title: 'stock_flow_report', icon: GiCargoShip },
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
      { id: 128,element:<SummaryReport dataUrl={urls.sales_summary} gridHeader="sales_summary_report" gridId="grd_sales_summary" />, formCode:"RPTSLSUM", action: UserAction.Show,  path: `/reports/_/inventory/sales_summary_report`, type: 'link', active: false, selected: false, title: 'sales_summary', icon: PiPackageLight },
      { id: 129,element:<RegisterReport dataUrl={urls.sales_register} gridHeader="sales_register_report" gridId="grd_sales_register" />, formCode:"RPTSRSUM", action: UserAction.Show,  path: `/reports/_/inventory/sales_register_report`, type: 'link', active: false, selected: false, title: 'sales_register', icon: PiPackageLight },
      { id: 130,element:<NetSalesReport dataUrl={urls.net_sales} gridHeader="net_sales_report" gridId="grd_net_sales_report" />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/net_sales_report`, type: 'link', active: false, selected: false, title: 'net_sales', icon: PiPackageLight },
      { id: 131,element:<PartyWiseReport dataUrl={urls.partywise_sales} gridHeader="partywise_sales" gridId="grd_partywise_sales" />, formCode:"RPTPRTSL", action: UserAction.Show,  path: `/reports/_/inventory/partywise_sales_report`, type: 'link', active: false, selected: false, title: 'partywise_sales', icon: PiPackageLight },
      { id: 132,element:<TaxReportSummary dataUrl={urls.sales_tax_report_summary} gridHeader="sales_tax_report_summary" gridId="grd_sales_tax_summary" />, formCode:"RPTSITAX", action: UserAction.Show,  path: `/reports/_/inventory/sales_tax_report_summary`, type: 'link', active: false, selected: false, title: 'sales_tax_report_summary', icon: PiPackageLight },
      { id: 133,element:<TaxReportDetailed dataUrl={urls.sales_tax_report_detailed} gridHeader="sales_tax_report_detailed" gridId="grd_sales_tax_report_detailed" />, formCode:"RPTSITAX", action: UserAction.Show,  path: `/reports/_/inventory/sales_tax_report_detailed`, type: 'link', active: false, selected: false, title: 'sales_tax_report_detailed', icon: PiPackageLight },
      { id: 134,element:<SummaryReport dataUrl={urls.sales_return_summary} gridHeader="sales_return_summary" gridId="grd_sales_return_summary" />, formCode:"RPTSRSUM", action: UserAction.Show,  path: `/reports/_/inventory/sales_return_summary`, type: 'link', active: false, selected: false, title: 'sales_return_summary', icon: PiPackageLight },
      { id: 135,element:<RegisterReport dataUrl={urls.sales_return_register} gridHeader="sales_return_register" gridId="grd_sales_return_register" />, formCode:"RPTSRREG", action: UserAction.Show,  path: `/reports/_/inventory/sales_return_register`, type: 'link', active: false, selected: false, title: 'sales_return_register', icon: PiPackageLight },
      { id: 136,element:<SalesAndSalesReturn />, formCode:"RPTSSR", action: UserAction.Show,  path: `/reports/_/inventory/sales_and_sales_return_report`, type: 'link', active: false, selected: false, title: 'sales_and_sales_return', icon: PiPackageLight },
      { id: 137,element:<SummaryReport dataUrl={urls.sales_order_summary} gridHeader="sales_order_summary" gridId="grd_sales_order_summary" />, formCode:"RPTORDSM", action: UserAction.Show,  path: `/reports/_/inventory/sales_order_summary_report`, type: 'link', active: false, selected: false, title: 'sales_order_summary', icon: PiPackageLight },
      { id: 138,element:<SummaryReport dataUrl={urls.sales_estimate_summary} gridHeader="sales_estimate_summary" gridId="grd_sales_estimate_summary" />, formCode:"RPTSES", action: UserAction.Show,  path: `/reports/_/inventory/sales_estimate_summary_report`, type: 'link', active: false, selected: false, title: 'sales_estimate_summary', icon: PiPackageLight },
      { id: 139,element:<SummaryReport dataUrl={urls.sales_quotation_summary} gridHeader="sales_quotation_summary" gridId="grd_sales_quotation_summary" />, formCode:"RPTSQS", action: UserAction.Show,  path: `/reports/_/inventory/sales_quotation_summary_report`, type: 'link', active: false, selected: false, title: 'sales_quotation_summary', icon: PiPackageLight },
      { id: 140,element:<SummaryReport dataUrl={urls.substitute_report} gridHeader="substitute_report" gridId="grd_substitute_report" />, formCode:"RPTSUB", action: UserAction.Show,  path: `/reports/_/inventory/substitute_report`, type: 'link', active: false, selected: false, title: 'substitute_report', icon: PiPackageLight },
      { id: 141,element:<DaywiseSummaryWithProfit />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/daywise_summary_with_profit_report`, type: 'link', active: false, selected: false, title: 'daywise_summary_with_profit', icon: PiPackageLight },
      { id: 142,element:<GroupwiseSalesSummaryDevexpress />, formCode:"GRPWSSLRPT", action: UserAction.Show,  path: `/reports/_/inventory/groupwise_sales_summary_devexpress_report`, type: 'link', active: false, selected: false, title: 'groupwise_sales_summary_devexpress', icon: PiPackageLight },
      { id: 143,element:<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="groupwise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_groupwise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isGroupWise: true }} />, formCode:"GRPWSSLRPT", action: UserAction.Show,  path: `/reports/_/inventory/groupwise_sales_summary_report_groupwise`, type: 'link', active: false, selected: false, title: 'groupwise_sales_summary_report', icon: PiPackageLight },
      { id: 144,element:<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="categorywise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_categorywise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isCategoryWise: true }} />, formCode:"GRPWSSLRPT", action: UserAction.Show,  path: `/reports/_/inventory/groupwise_sales_summary_report_categorywise`, type: 'link', active: false, selected: false, title: 'categorywise_sales_summary_report', icon: PiPackageLight },
      { id: 145,element:<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="sectionwise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_sectionwise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isSectionWise: true }} />, formCode:"GRPWSSLRPT", action: UserAction.Show,  path: `/reports/_/inventory/groupwise_sales_summary_report_sectionwise`, type: 'link', active: false, selected: false, title: 'sectionwise_sales_summary_report', icon: PiPackageLight },
      { id: 146,element:<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="brandwise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_brandwise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isBrandWise: true }} />, formCode:"GRPWSSLRPT", action: UserAction.Show,  path: `/reports/_/inventory/groupwise_sales_summary_report_brandwise`, type: 'link', active: false, selected: false, title: 'brandwise_sales_summary_report', icon: PiPackageLight },
      { id: 147,element:<GroupwiseSalesSummary dataUrl={urls.groupwise_sales_summary} gridHeader="product_categorywise_sales_summary_report" gridId="grd_groupwise_sales_summary_report_product_categorywise" filterInitialData={{ ...GroupwiseSalesSummaryFilterInitialState, isProductCatWise: true }} />, formCode:"GRPWSSLRPT", action: UserAction.Show,  path: `/reports/_/inventory/groupwise_sales_summary_report_product_categorywise`, type: 'link', active: false, selected: false, title: 'product_categorywise_sales_summary_report', icon: PiPackageLight },
      { id: 148,element:<SalesmanwiseSalesAndCollection />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/salesman_wise_sales_and_collection_report`, type: 'link', active: false, selected: false, title: 'salesman_wise_sales_and_collection', icon: PiPackageLight },
      { id: 149,element:<NonInvoicedGoodsDelivery />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/non_invoiced_goods_delivery_report`, type: 'link', active: false, selected: false, title: 'non_invoiced_goods_delivery', icon: PiPackageLight },
      { id: 150,element:<SummaryReport dataUrl={urls.booking_summary} gridHeader="booking_summary" gridId="grd_booking_summary" />, formCode:"RPTBKSSUM", action: UserAction.Show,  path: `/reports/_/inventory/booking_summary_report`, type: 'link', active: false, selected: false, title: 'booking_summary', icon: PiPackageLight },
      { id: 151,element:<PendingOrderReport />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/pending_order_report`, type: 'link', active: false, selected: false, title: 'pending_order', icon: PiPackageLight },
      { id: 152,element:<PromotionalSalesReport />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/promotional_sales_report`, type: 'link', active: false, selected: false, title: 'promotional_sales', icon: PiPackageLight },
      { id: 153,element:<GroupedBrandwiseSales />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/grouped_brandwise_sales_report`, type: 'link', active: false, selected: false, title: 'grouped_brandwise_sales', icon: PiPackageLight },
      { id: 154,element:<PartyMonthwiseSummaryReport dataUrl={urls.party_monthwise_sales_summary} gridHeader="party_monthwise_sales_summary" gridId="grd_party_monthwise_sales_summary" />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/party_monthwise_sales_summary_report`, type: 'link', active: false, selected: false, title: 'party_monthwise_sales_summary', icon: PiPackageLight },
      { id: 155,element:<CouponReports />, formCode:"COUPSALRPT", action: UserAction.Show,  path: `/reports/_/inventory/coupon_reports`, type: 'link', active: false, selected: false, title: 'coupon_reports', icon: PiPackageLight },
      { id: 156,element:<SchemeWiseSales />, formCode:"ITMSCMSRPT", action: UserAction.Show,  path: `/reports/_/inventory/scheme_wise_sales_report`, type: 'link', active: false, selected: false, title: 'scheme_wise_sales', icon: PiPackageLight },
      { id: 158,element:<RouteWiseSalesAndCollection />, formCode:"ROUTWISE_SL_CR_1", action: UserAction.Show,  path: `/reports/_/inventory/routewise_sales_collection_report`, type: 'link', active: false, selected: false, title: 'routewise_sales_collection', icon: PiPackageLight },
      { id: 159,element:<BranchInventoryRequestPendingOrder />, formCode:"ADVBRNCHPEN", action: UserAction.Show,  path: `/reports/_/inventory/branch_inventory_request_pending_order_report`, type: 'link', active: false, selected: false, title: 'branch_inventory_request_pending_order', icon: PiPackageLight },
      { id: 160,element:<PrintDetails />, formCode:"ADVPRINT", action: UserAction.Show,  path: `/reports/_/inventory/print_details_report`, type: 'link', active: false, selected: false, title: 'print_details', icon: PiPackageLight },
      { id: 161,element:<InventoryStatusReport />, formCode:"INVSTATUSRPT", action: UserAction.Show,  path: `/reports/_/inventory/inventory_status_report`, type: 'link', active: false, selected: false, title: 'inventory_status', icon: PiPackageLight },
      { id: 162,element:<VoidReport />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/void_report`, type: 'link', active: false, selected: false, title: 'void_report', icon: PiPackageLight },
      { id: 163,element:<CounterReport />, formCode:"CNTRRPT", action: UserAction.Show,  path: `/reports/_/inventory/counter_report`, type: 'link', active: false, selected: false, title: 'counter_report', icon: PiPackageLight },
      { id: 164,element:<RegisterReport dataUrl={urls.sales_return_estimate_register} gridHeader="sales_return_estimate_register" gridId="grd_sales_return_estimate_register" />, formCode:"SREREGT", action: UserAction.Show,  path: `/reports/_/inventory/sales_return_estimate_register_report`, type: 'link', active: false, selected: false, title: 'sales_return_estimate_register', icon: PiPackageLight },
      { id: 165,element:<DiagnosisReport />, formCode:"ADVDIGREPT", action: UserAction.Show,  path: `/reports/_/inventory/diagnosis_report`, type: 'link', active: false, selected: false, title: 'diagnosis_report', icon: PiPackageLight },
      { id: 166,element:<DiagnosisReportZeroRateProductlist />, formCode:"ADVDIGREPT", action: UserAction.Show,  path: `/reports/_/inventory/diagnosis_report_zero_rate_productlist`, type: 'link', active: false, selected: false, title: 'diagnosis_report_zero_rate_productlist', icon: PiPackageLight },
      { id: 167,element:<DiagnosisReportPostDatedTransactions />, formCode:"ADVDIGREPT", action: UserAction.Show,  path: `/reports/_/inventory/diagnosis_report_post_dated_transactions`, type: 'link', active: false, selected: false, title: 'diagnosis_report_post_dated_transactions', icon: PiPackageLight },
      { id: 168,element:<DiagnosisReportSalesPriceLessThanLPCost />, formCode:"ADVDIGREPT", action: UserAction.Show,  path: `/reports/_/inventory/diagnosis_report_sales_price_less_than_lp_cost`, type: 'link', active: false, selected: false, title: 'diagnosis_report_sales_price_less_than_lp_cost', icon: PiPackageLight },
      { id: 169,element:<DiagnosisReportSalesPriceLessthanPurchasePrice />, formCode:"ADVDIGREPT", action: UserAction.Show,  path: `/reports/_/inventory/diagnosis_report_sales_price_less_than_purchase_price`, type: 'link', active: false, selected: false, title: 'diagnosis_report_sales_price_less_than_purchase_price', icon: PiPackageLight },
      { id: 170,element:<DiagnosisReportSalesPriceLessthanMSP />, formCode:"ADVDIGREPT", action: UserAction.Show,  path: `/reports/_/inventory/diagnosis_report_sales_price_less_than_msp`, type: 'link', active: false, selected: false, title: 'diagnosis_report_sales_price_less_than_msp', icon: PiPackageLight },
      { id: 171,element:<DiagnosisReportSalesPriceGreaterthanMRP />, formCode:"ADVDIGREPT", action: UserAction.Show,  path: `/reports/_/inventory/diagnosis_report_sales_price_greater_than_mrp`, type: 'link', active: false, selected: false, title: 'diagnosis_report_sales_price_greater_than_mrp', icon: PiPackageLight },
      { id: 172,element:<CustomerVisitTotalVisit />, formCode:"RPTTOTVIS", action: UserAction.Show,  path: `/reports/_/inventory/customer_visit_total_visit`, type: 'link', active: false, selected: false, title: 'customer_visit_total_visit', icon: PiPackageLight },
      { id: 173,element:<CustomerVisitLastVisit />, formCode:"RPTLAVIDET", action: UserAction.Show,  path: `/reports/_/inventory/customer_visit_last_visit`, type: 'link', active: false, selected: false, title: 'customer_visit_last_visit', icon: PiPackageLight },
      { id: 174,element:<FOCRegisterReport />, formCode:"RPTFOCREG", action: UserAction.Show,  path: `/reports/_/inventory/foc_register_report`, type: 'link', active: false, selected: false, title: 'foc_register_report', icon: PiPackageLight },
      { id: 175,element:<DiscountReportInventory />, formCode:"RPTINV", action: UserAction.Show,  path: `/reports/_/inventory/discount_report_inventory`, type: 'link', active: false, selected: false, title: 'discount_report_inventory', icon: PiPackageLight },
      { id: 176,element:<DiscountReportCollection />, formCode:"RPTCOL", action: UserAction.Show,  path: `/reports/_/inventory/discount_report_collection`, type: 'link', active: false, selected: false, title: 'discount_report_collection', icon: PiPackageLight },
      { id: 177,element:<ItemUsedForService />, formCode:"ITMSFORSRV", action: UserAction.Show,  path: `/reports/_/inventory/item_used_for_service`, type: 'link', active: false, selected: false, title: 'item_used_for_service', icon: PiPackageLight },
      { id: 178,element:<LPOReport />, formCode:"LPORPT", action: UserAction.Show,  path: `/reports/_/inventory/lpo_report`, type: 'link', active: false, selected: false, title: 'lpo_report', icon: PiPackageLight },

    ]
  },
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
      { id: 210,element:<SummaryReport dataUrl={urls.sales_transfer_summary} gridHeader="sales_transfer_summary" gridId="grd_sales_transfer_summary" />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/sales_transfer_summary_report`, type: 'link', active: false, selected: false, title: 'sales_transfer_summary', icon: FaHandHoldingDollar },
      { id: 211,element:<RegisterReport dataUrl={urls.sales_transfer_register} gridHeader="sales_transfer_register" gridId="grd_sales_transfer_register" />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/sales_transfer_register_report`, type: 'link', active: false, selected: false, title: 'sales_transfer_register', icon: GiReceiveMoney },
      { id: 212,element:<NetSalesReport dataUrl={urls.net_sales_transfer_report} gridHeader="net_sales_transfer_report" gridId="grd_net_sales_transfer_report" />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/net_sales_transfer_report`, type: 'link', active: false, selected: false, title: 'net_sales_transfer_report', icon: GiSwapBag },
      { id: 213,element:<PartyWiseReport dataUrl={urls.sales_transfer_partyWise_sales} gridHeader="sales_transfer_partyWise_sales" gridId="grd_sales_transfer_partyWise_sales" />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/sales_transfer_partyWise_sales`, type: 'link', active: false, selected: false, title: 'sales_transfer_partyWise_sales', icon: FaSackDollar },
      { id: 214,element:<SalesTransferMonthWiseSummaryReport dataUrl={urls.sales_transfer_monthWise_summary} gridHeader="sales_transfer_monthWise_summary" gridId="grd_sales_transfer_monthWise_summary" />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/sales_transfer_monthWise_summary_report`, type: 'link', active: false, selected: false, title: 'sales_transfer_monthWise_summary', icon: FaSackDollar },
      { id: 215,element:<PartyMonthwiseSummaryReport dataUrl={urls.sales_transfer_partyWise_summary} gridHeader="sales_transfer_partyWise_summary" gridId="grd_sales_transfer_partyWise_summary" />, formCode:"", action: UserAction.Show,  path: `/reports/_/inventory/sales_transfer_partyWise_summary_report`, type: 'link', active: false, selected: false, title: 'sales_transfer_partyWise_summary', icon: FaSackDollar },
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
      { id: 300,element:<PurchaseTaxReport />, formCode:"TAXRPT", action: UserAction.Show,  path: `/reports/_/inventory/purchase_tax_vat`, type: 'link', active: false, selected: false, title: 'purchase_tax', icon: AiOutlineFileText },
      { id: 301,element:<SalesTax />, formCode:"TAXRPT", action: UserAction.Show,  path: `/reports/_/inventory/sales_tax_report`, type: 'link', active: false, selected: false, title: 'sales_tax', icon: AiOutlineFileText },
      { id: 302,element:<VatReturnForm />, formCode:"TAXRPT", action: UserAction.Show,  path: `/reports/_/inventory/vat_return_form`, type: 'link', active: false, selected: false, title: 'vat_return_form', icon: AiOutlineFileText },
      { id: 303,element:<VatReturnFormArabic />, formCode:"TAXRPT", action: UserAction.Show,  path: `/reports/_/inventory/vat_return_form_arabic`, type: 'link', active: false, selected: false, title: 'vat_return_form_arabic', icon: AiOutlineFileText },
      { id: 304,element:<KsaEInvoiceReportSummary />, formCode:"TAXRPT", action: UserAction.Show,  path: `/reports/_/inventory/ksa_e_invoice_summary_report`, type: 'link', active: false, selected: false, title: 'ksa_e_invoice_summary', icon: AiOutlineFileText },
      { id: 305,element:<KsaEInvoiceReportDetailed />, formCode:"TAXRPT", action: UserAction.Show,  path: `/reports/_/inventory/ksa_e_invoice_detailed_report`, type: 'link', active: false, selected: false, title: 'ksa_e_invoice_detailed', icon: AiOutlineFileText },
      { id: 306,element:<GSTR1B2B />, formCode:"GSTR1", action: UserAction.Show,  path: `/reports/_/inventory/gstr1b2b_report`, type: 'link', active: false, selected: false, title: 'gstr1_b2b', icon: AiOutlineFileText },
      { id: 307,element:<GSTR1B2CLarge />, formCode:"GSTR1", action: UserAction.Show,  path: `/reports/_/inventory/gstr1b2cLarge_report`, type: 'link', active: false, selected: false, title: 'gstr1_b2cLarge', icon: AiOutlineFileText },
      { id: 308,element:<GSTR1B2CSmall />, formCode:"GSTR1", action: UserAction.Show,  path: `/reports/_/inventory/gstr1b2cSmall_report`, type: 'link', active: false, selected: false, title: 'gstr1b2c_Small', icon: AiOutlineFileText },
      { id: 309,element:<GSTR1CDNR />, formCode:"GSTR1", action: UserAction.Show,  path: `/reports/_/inventory/gstr1cdnr_report`, type: 'link', active: false, selected: false, title: 'gstr1_cdnr', icon: AiOutlineFileText },
      { id: 310,element:<GSTR1CDNUR />, formCode:"GSTR1", action: UserAction.Show,  path: `/reports/_/inventory/gstr1cdnur_report`, type: 'link', active: false, selected: false, title: 'gstr1_cdnur', icon: AiOutlineFileText },
      { id: 311,element:<GSTR1HSNSummary />, formCode:"GSTR1", action: UserAction.Show,  path: `/reports/_/inventory/gstr1hsnSummary_report`, type: 'link', active: false, selected: false, title: 'gstr1_summary_of_hsn', icon: AiOutlineFileText },
      { id: 312,element:<GSTR1Docs />, formCode:"GSTR1", action: UserAction.Show,  path: `/reports/_/inventory/gstr1Docs_report`, type: 'link', active: false, selected: false, title: 'gstr1_docs', icon: AiOutlineFileText },
      { id: 313,element:<GSTR3BReport />, formCode:"GSTR3B", action: UserAction.Show,  path: `/reports/_/inventory/gstr3b_report`, type: 'link', active: false, selected: false, title: 'gstr3b', icon: AiOutlineFileText },
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
      { id: 400,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_purchase_summary} gridHeader="itemwise_purchase_summary" gridId="grd_itemwise_purchase_summary" />, formCode:"ITPIRPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_purchase_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_summary', icon: AiOutlineFileText },
      { id: 401,element:<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_return_summary} gridHeader="item_wise_purchase_return_summary" gridId="grd_item_wise_purchase_return_summary" />, formCode:"ITPRRPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_purchase_return_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_return_summary', icon: AiOutlineFileText },
      { id: 402,element:<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_order_summary} gridHeader="item_wise_purchase_order_summary" gridId="grd_item_wise_purchase_order_summary" />, formCode:"ITPORPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_purchase_order_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_order_summary', icon: AiOutlineFileText },
      { id: 403,element:<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_estimate_summary} gridHeader="item_wise_purchase_estimate_summary" gridId="grd_item_wise_purchase_estimate_summary" />, formCode:"ITPERPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_purchase_estimate_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_estimate_summary', icon: AiOutlineFileText },
      { id: 404,element:<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_quotation_summary} gridHeader="item_wise_purchase_quotation_summary" gridId="grd_item_wise_purchase_quotation_summary" />, formCode:"PQRPTIWS", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_purchase_quotation_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_quotation_summary', icon: AiOutlineFileText },
      { id: 405,element:<ItemWiseSummaryReport dataUrl={urls.item_wise_purchase_return_estimate_summary} gridHeader="itemwise_purchase_return_estimate_summary" gridId="grd_itemwise_purchase_return_estimate_summary" />, formCode:"PREITEM", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_purchase_return_estimate_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_return_estimate_summary', icon: AiOutlineFileText },
      { id: 406,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_summary} gridHeader="itemwise_sales_summary" gridId="grd_itemwise_sales_summary" />, formCode:"ITSIRPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_sales_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_sales_summary', icon: PiPackageLight },
      { id: 407,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_return_summary} gridHeader="itemwise_sales_return_summary" gridId="grd_itemwise_sales_return_summary" />, formCode:"ITSRRPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_sales_return_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_sales_return_summary', icon: PiPackageLight },
      { id: 408,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_order_summary} gridHeader="itemwise_sales_order_summary" gridId="grd_itemwise_sales_order_summary" />, formCode:"ITSORPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_sales_order_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_sales_order_summary', icon: PiPackageLight },
      { id: 409,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_quotation_summary} gridHeader="itemwise_sales_quotation_summary" gridId="grd_itemwise_sales_quotation_summary" />, formCode:"ITSQRPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_sales_quotation_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_sales_quotation_summary', icon: PiPackageLight },
      { id: 410,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_estimate_summary} gridHeader="itemwise_sales_estimate_summary" gridId="grd_itemwise_sales_estimate_summary" />, formCode:"ITSERPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_sales_estimate_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_sales_estimate_summary', icon: PiPackageLight },
      { id: 411,element:<ItemWiseSummaryReport dataUrl={urls.itemwise_sales_and_sales_return_summary} gridHeader="itemwise_sales_and_sales_return_summary" gridId="grd_itemwise_sales_and_sales_return_summary" />, formCode:"ITSISRRPT", action: UserAction.Show,  path: `/reports/_/inventory/itemwise_sales_and_sales_return_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_sales_and_sales_return_summary', icon: PiPackageLight },
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
      { id: 600,element:<DailyStatementReport dataUrl={urls.daily_statement_sales} gridHeader="daily_statement_report_of_sales" gridId={GridId.daily_statement_sales} />, formCode:"DSTRPT", action: UserAction.Show,  path: `/reports/_/inventory/daily_statement_sales`, type: 'link', active: false, selected: false, title: 'daily_statement_sales', icon: AiOutlineFileText },
      { id: 601,element:<DailyStatementReport dataUrl={urls.daily_statement_purchase} gridHeader="daily_statement_report_of_purchase" gridId={GridId.daily_statement_purchase} />, formCode:"DSTRPT", action: UserAction.Show,  path: `/reports/_/inventory/daily_statement_purchase`, type: 'link', active: false, selected: false, title: 'daily_statement_purchase', icon: AiOutlineFileText },
      { id: 602,element:<DailyStatementAllReport />, formCode:"DSTRPT", action: UserAction.Show,  path: `/reports/_/inventory/daily_statement_all`, type: 'link', active: false, selected: false, title: 'daily_statement_all', icon: AiOutlineFileText },
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
      { id: 500,element:<StockFlow />, formCode:"RPTSTKFL", action: UserAction.Show,  path: `/reports/_/inventory/price_list_report`, type: 'link', active: false, selected: false, title: 'price_list_report', icon: TbTag },
      { id: 501,element:<StockFlow />, formCode:"RPTSTKFL", action: UserAction.Show,  path: `/reports/_/inventory/daily_balance_report`, type: 'link', active: false, selected: false, title: 'daily_balance_report', icon: IoScaleOutline },
      { id: 502,element:<StockFlow />, formCode:"RPTSTKFL", action: UserAction.Show,  path: `/reports/_/inventory/product_summary`, type: 'link', active: false, selected: false, title: 'product_summary', icon: AiOutlineFileText },
      { id: 503,element:<StockFlow />, formCode:"RPTSTKFL", action: UserAction.Show,  path: `/reports/_/inventory/transaction_summary_report`, type: 'link', active: false, selected: false, title: 'transaction_summary', icon: PiPackageLight },
      { id: 504,element:<StockFlow />, formCode:"RPTSTKFL", action: UserAction.Show,  path: `/reports/_/inventory/inventory_transaction_register_report`, type: 'link', active: false, selected: false, title: 'inventory_transaction_register', icon: PiPackageLight },
      { id: 505,element:<StockFlow />, formCode:"RPTSTKFL", action: UserAction.Show,  path: `/reports/_/inventory/inventory_summary_report`, type: 'link', active: false, selected: false, title: 'inventory_summary_report', icon: PiPackageLight },
      { id: 506,element:<StockFlow />, formCode:"RPTSTKFL", action: UserAction.Show,  path: `/reports/_/inventory/service_report`, type: 'link', active: false, selected: false, title: 'service_report', icon: PiPackageLight },
      { id: 507,element:<StockFlow />, formCode:"RPTSTKFL", action: UserAction.Show,  path: `/reports/_/inventory/salesman_incentive_report`, type: 'link', active: false, selected: false, title: 'salesman_incentive_report', icon: PiPackageLight },
      { id: 508,element:<StockFlow />, formCode:"RPTSTKFL", action: UserAction.Show,  path: `/reports/_/inventory/privilege_card_report`, type: 'link', active: false, selected: false, title: 'privilege_card', icon: PiPackageLight },
    ]
  },

];