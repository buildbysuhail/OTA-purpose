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

export const ReportsMenuItems = [
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
      { id: 27, path: `${import.meta.env.BASE_URL}reports/_/accounts/trial_balance`, type: 'link', active: false, selected: false, title: 'trial_balance', icon: SlEqualizer },
      { id: 28, path: `${import.meta.env.BASE_URL}reports/_/accounts/trial_balance_period_wise`, type: 'link', active: false, selected: false, title: 'trial_balance_periodwise', icon: ImEqualizer2 },
      { id: 29, path: `${import.meta.env.BASE_URL}reports/_/accounts/profit_and_loss`, type: 'link', active: false, selected: false, title: 'profit_&_loss_account', icon: TrendingUp },
      { id: 30, path: `${import.meta.env.BASE_URL}reports/_/accounts/profit_and_loss_detailed`, type: 'link', active: false, selected: false, title: 'profit_&_loss_account_detailed', icon: TfiStatsUp },
      { id: 31, path: `${import.meta.env.BASE_URL}reports/_/accounts/balance_sheet`, type: 'link', active: false, selected: false, title: 'balance_sheet', icon: Scale },
      { id: 32, path: `${import.meta.env.BASE_URL}reports/_/accounts/balance_sheet_detailed`, type: 'link', active: false, selected: false, title: 'balance_sheet_detailed', icon: FaScaleUnbalancedFlip },
      // //for checking only skip and take
      // { path: `${import.meta.env.BASE_URL}reports/_/accounts/payable_aging`, type: 'link', active: false, selected: false, title: 'account_payable_aging_report' },
      // { path: `${import.meta.env.BASE_URL}reports/_/accounts/receivable_aging`, type: 'link', active: false, selected: false, title: 'account_receivable_aging_report', },
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
      { id: 17, path: `${import.meta.env.BASE_URL}reports/_/accounts/transaction_report`, type: 'link', active: false, selected: false, title: 'transaction_report', icon: FiFileText },
      { id: 18, path: `${import.meta.env.BASE_URL}reports/_/accounts/transaction_history_accounts`, type: 'link', active: false, selected: false, title: 'transaction_history_accounts', icon: LuHistory },
      { id: 19, path: `${import.meta.env.BASE_URL}reports/_/accounts/transaction_history_inventory`, type: 'link', active: false, selected: false, title: 'transaction_history_inventory', icon: MdOutlineManageHistory },
      { id: 20, path: `${import.meta.env.BASE_URL}reports/_/accounts/daily_summary_report`, type: 'link', active: false, selected: false, title: 'daily_summary_report', icon: CalendarClock },
      { id: 21, path: `${import.meta.env.BASE_URL}reports/_/accounts/billwise_profit`, type: 'link', active: false, selected: false, title: 'billwise_profit_report', icon: ChartNoAxesCombined },
      { id: 22, path: `${import.meta.env.BASE_URL}reports/_/accounts/partywise_summary`, type: 'link', active: false, selected: false, title: 'partywise_summary_report', icon: Component },
      { id: 23, path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_payable`, type: 'link', active: false, selected: false, title: 'account_payable', icon: LucideCreditCard },
      { id: 24, path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_receivable`, type: 'link', active: false, selected: false, title: 'account_receivable', icon: LucideDollarSign },
      { id: 25, path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_aging_payable`, type: 'link', active: false, selected: false, title: 'account_payable_aging_report', icon: Clock1Icon },
      { id: 26, path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_aging_receivable`, type: 'link', active: false, selected: false, title: 'account_receivable_aging_report', icon: Calendar },
      { id: 1, path: `${import.meta.env.BASE_URL}reports/_/accounts/ledger_report`, type: 'link', active: false, selected: false, title: 'ledger_report', icon: IoBookOutline },
      { id: 2, path: `${import.meta.env.BASE_URL}reports/_/accounts/cash_book`, type: 'link', active: false, selected: false, title: 'cash_book', icon: FaCoins },
      { id: 3, path: `${import.meta.env.BASE_URL}reports/_/accounts/day_book_detailed`, type: 'link', active: false, selected: false, title: 'day_book_detailed', icon: BookCopy },
      { id: 4, path: `${import.meta.env.BASE_URL}reports/_/accounts/day_book_summary`, type: 'link', active: false, selected: false, title: 'day_book_summary', icon: MdLibraryBooks },
      { id: 5, path: `${import.meta.env.BASE_URL}reports/_/accounts/payment_report`, type: 'link', active: false, selected: false, title: 'payment_report', icon: MdOutlinePayments },
      { id: 6, path: `${import.meta.env.BASE_URL}reports/_/accounts/collection_report`, type: 'link', active: false, selected: false, title: 'collection_report', icon: BsCollection },
      { id: 7, path: `${import.meta.env.BASE_URL}reports/_/accounts/cash_summary`, type: 'link', active: false, selected: false, title: 'cash_summary_report', icon: GrDocumentStore },
      { id: 8, path: `${import.meta.env.BASE_URL}reports/_/accounts/cash_summary_ledgerwise`, type: 'link', active: false, selected: false, title: 'cash_summary_ledgerwise_report', icon: TbCoins },
      // //for checking only skip and take
      // { path: `${import.meta.env.BASE_URL}reports/_/accounts/payable_aging`, type: 'link', active: false, selected: false, title: 'account_payable_aging_report' },
      // { path: `${import.meta.env.BASE_URL}reports/_/accounts/receivable_aging`, type: 'link', active: false, selected: false, title: 'account_receivable_aging_report', },
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
      { id: 9, path: `${import.meta.env.BASE_URL}reports/_/accounts/income_report`, type: 'link', active: false, selected: false, title: 'income_report', icon: FaHandHoldingDollar },
      { id: 10, path: `${import.meta.env.BASE_URL}reports/_/accounts/income_report_detailed`, type: 'link', active: false, selected: false, title: 'income_report_detailed', icon: GiReceiveMoney },
      { id: 11, path: `${import.meta.env.BASE_URL}reports/_/accounts/expense_report`, type: 'link', active: false, selected: false, title: 'expense_report', icon: GiSwapBag },
      { id: 12, path: `${import.meta.env.BASE_URL}reports/_/accounts/expense_report_detailed`, type: 'link', active: false, selected: false, title: 'expense_report_detailed', icon: FaSackDollar },
      { id: 13, path: `${import.meta.env.BASE_URL}reports/_/accounts/income_expense_statement`, type: 'link', active: false, selected: false, title: 'income_expense_statement', icon: LiaFileInvoiceDollarSolid },
      { id: 14, path: `${import.meta.env.BASE_URL}reports/_/accounts/cash_flow`, type: 'link', active: false, selected: false, title: 'cash_flow', icon: CircleStackIcon },
      { id: 15, path: `${import.meta.env.BASE_URL}reports/_/accounts/bank_flow`, type: 'link', active: false, selected: false, title: 'bank_flow', icon: RiBankLine },
      { id: 16, path: `${import.meta.env.BASE_URL}reports/_/accounts/bank_statement`, type: 'link', active: false, selected: false, title: 'bank_statement', icon: RiBankFill },
      // //for checking only skip and take
      // { path: `${import.meta.env.BASE_URL}reports/_/accounts/payable_aging`, type: 'link', active: false, selected: false, title: 'account_payable_aging_report' },
      // { path: `${import.meta.env.BASE_URL}reports/_/accounts/receivable_aging`, type: 'link', active: false, selected: false, title: 'account_receivable_aging_report', },
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
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_summary_report', icon: HiOutlineDocumentReport },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_register_report`, type: 'link', active: false, selected: false, title: 'purchase_register_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/party_wise_report`, type: 'link', active: false, selected: false, title: 'party_wise_report', icon: PiUsersThreeLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_tax_report_detailed`, type: 'link', active: false, selected: false, title: 'purchase_tax_report_detailed', icon: PiUsersThreeLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_tax_report_summary`, type: 'link', active: false, selected: false, title: 'purchase_tax_report_summary', icon: PiUsersThreeLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_summary`, type: 'link', active: false, selected: false, title: 'purchase_return_summary', icon: PiUsersThreeLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_register`, type: 'link', active: false, selected: false, title: 'purchase_return_register', icon: PiUsersThreeLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_estimate_summary`, type: 'link', active: false, selected: false, title: 'purchase_estimate_summary', icon: PiUsersThreeLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_order_summary`, type: 'link', active: false, selected: false, title: 'purchase_order_summary', icon: PiUsersThreeLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_estimate_register_report`, type: 'link', active: false, selected: false, title: 'purchase_estimate_register_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_estimate_register_report`, type: 'link', active: false, selected: false, title: 'purchase_return_estimate_register_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_estimate_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_return_estimate_summary_report', icon: HiOutlineDocumentReport },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/price_list_report`, type: 'link', active: false, selected: false, title: 'price_list_report', icon: TbTag },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/stock_ledger_report`, type: 'link', active: false, selected: false, title: 'stock_ledger_report', icon: HiOutlineClipboardList },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/daily_balance_report`, type: 'link', active: false, selected: false, title: 'daily_balance_report', icon: IoScaleOutline },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/stock_flow_report`, type: 'link', active: false, selected: false, title: 'stock_flow_report', icon: GiCargoShip },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/transaction_analysis_report`, type: 'link', active: false, selected: false, title: 'transaction_analysis_report', icon: MdOutlineAnalytics },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_tax_vat`, type: 'link', active: false, selected: false, title: 'purchase_tax', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_order_transit_report`, type: 'link', active: false, selected: false, title: 'purchase_order_transit_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/party_monthwise_purchase_summary`, type: 'link', active: false, selected: false, title: 'party_monthwise_purchase_summary', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/credit_purchase_summary`, type: 'link', active: false, selected: false, title: 'credit_purchase_summary', icon: AiOutlineFileText },
      // { path: `${import.meta.env.BASE_URL}reports/_/inventory/daily_statement_purchase`, type: 'link', active: false, selected: false, title: 'daily_statement_purchase', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_purchase_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_summary', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_purchase_return_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_return_summary', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_purchase_order_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_order_summary', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_purchase_estimate_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_estimate_summary', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_purchase_quotation_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_quotation_summary', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/product_summary_master`, type: 'link', active: false, selected: false, title: 'product_summary_master', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/vat_return_form`, type: 'link', active: false, selected: false, title: 'vat_return_form', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/vat_return_form_arabic`, type: 'link', active: false, selected: false, title: 'vat_return_form_arabic', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_gst_adv_register_format_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_advance_register_format_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_gst_daily_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_daily_summary_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_gst_detailed_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_detailed_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_gst_monthly_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_monthly_summary_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_gst_register_format_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_register_format_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_gst_taxwise_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_taxwise_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_gst_taxwise_with_hsn_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_taxwise_with_hsn_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_adv_register_format_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_adv_register_format_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_daily_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_daily_summary_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_detailed_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_detailed_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_monthly_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_monthly_summary_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_register_format_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_register_format_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_sales_and_return_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_sales_and_return_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_taxwise_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_taxwise_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_taxwise_with_hsn_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_taxwise_with_hsn_report', icon: AiOutlineFileText },

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
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/opening_stock_report`, type: 'link', active: false, selected: false, title: 'opening_stock', icon: PiPackageLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/stock_transfer_report`, type: 'link', active: false, selected: false, title: 'stock_transfer', icon: PiPackageLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/damage_stock_report`, type: 'link', active: false, selected: false, title: 'damage_stock', icon: PiPackageLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/excess_stock_report`, type: 'link', active: false, selected: false, title: 'excess_stock', icon: PiPackageLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/shortage_stock_report`, type: 'link', active: false, selected: false, title: 'shortage_stock', icon: PiPackageLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/branch_transfer_out_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_out', icon: PiPackageLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/branch_transfer_in_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_in', icon: PiPackageLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/branch_transfer_summary_out_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_summary_out', icon: PiPackageLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/branch_transfer_summary_in_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_summary_in', icon: PiPackageLight },
      // { path: `${import.meta.env.BASE_URL}reports/_/inventory/daily_statement_all`, type: 'link', active: false, selected: false, title: 'daily_statement_all', icon: AiOutlineFileText },
      // { path: `${import.meta.env.BASE_URL}reports/_/inventory/daily_statement_sales`, type: 'link', active: false, selected: false, title: 'daily_statement_sales', icon: AiOutlineFileText },
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
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_summary_report`, type: 'link', active: false, selected: false, title: 'sales_summary', icon: PiPackageLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_register_report`, type: 'link', active: false, selected: false, title: 'sales_register', icon: PiPackageLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/net_sales_report`, type: 'link', active: false, selected: false, title: 'net_sales', icon: PiPackageLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/partywise_sales_report`, type: 'link', active: false, selected: false, title: 'partywise_sales', icon: PiPackageLight },
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
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/daily_statement_sales`, type: 'link', active: false, selected: false, title: 'daily_statement_sales', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/daily_statement_purchase`, type: 'link', active: false, selected: false, title: 'daily_statement_purchase', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/daily_statement_all`, type: 'link', active: false, selected: false, title: 'daily_statement_all', icon: AiOutlineFileText },
    ]
  },

  // {
  //   icon: (<BanknotesIcon className="side-menu__icon side-menu" />),
  //   type: 'sub',
  //   Name: '',
  //   active: false,
  //   selected: false,
  //   title: 'tax_reports',
  //   badge: '',
  //   badgetxt: '',
  //   class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
  //   columns: 1,
  //   children: [
  //     { path: `${import.meta.env.BASE_URL}reports/_/taxReport/gstr1_report`, type: 'link', active: false, selected: false, title: 'gstr1_report', icon: RiFileListLine },
  //     { path: `${import.meta.env.BASE_URL}reports/_/taxReport/gstr3b_report`, type: 'link', active: false, selected: false, title: 'gstr3b_report', icon: HiOutlineDocumentText },
  //   ]
  // },
];