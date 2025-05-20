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
      {id: 60, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_summary_report', icon: HiOutlineDocumentReport },
      {id: 61, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_register_report`, type: 'link', active: false, selected: false, title: 'purchase_register_report', icon: AiOutlineFileText },
      {id: 62, path: `${import.meta.env.BASE_URL}reports/_/inventory/party_wise_report`, type: 'link', active: false, selected: false, title: 'party_wise_report', icon: PiUsersThreeLight },
      {id: 63, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_tax_report_detailed`, type: 'link', active: false, selected: false, title: 'purchase_tax_report_detailed', icon: PiUsersThreeLight },
      {id: 64, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_tax_report_summary`, type: 'link', active: false, selected: false, title: 'purchase_tax_report_summary', icon: PiUsersThreeLight },
      {id: 65, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_summary`, type: 'link', active: false, selected: false, title: 'purchase_return_summary', icon: PiUsersThreeLight },
      {id: 66, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_register`, type: 'link', active: false, selected: false, title: 'purchase_return_register', icon: PiUsersThreeLight },
      {id: 67, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_estimate_summary`, type: 'link', active: false, selected: false, title: 'purchase_estimate_summary', icon: PiUsersThreeLight },
      {id: 68, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_order_summary`, type: 'link', active: false, selected: false, title: 'purchase_order_summary', icon: PiUsersThreeLight },
      {id: 69, path: `${import.meta.env.BASE_URL}reports/_/inventory/credit_purchase_summary`, type: 'link', active: false, selected: false, title: 'credit_purchase_summary', icon: AiOutlineFileText },
      {id: 70, path: `${import.meta.env.BASE_URL}reports/_/inventory/party_monthwise_purchase_summary`, type: 'link', active: false, selected: false, title: 'party_monthwise_purchase_summary', icon: AiOutlineFileText },
      {id: 71, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_order_transit_report`, type: 'link', active: false, selected: false, title: 'purchase_order_transit_report', icon: AiOutlineFileText },
      {id: 72, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_estimate_register_report`, type: 'link', active: false, selected: false, title: 'purchase_estimate_register_report', icon: AiOutlineFileText },
      {id: 73, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_estimate_register_report`, type: 'link', active: false, selected: false, title: 'purchase_return_estimate_register_report', icon: AiOutlineFileText },
      {id: 74, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_estimate_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_return_estimate_summary_report', icon: HiOutlineDocumentReport },

//purchase Tax
      {id: 86, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_gst_daily_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_daily_summary_report', icon: AiOutlineFileText },
      {id: 90, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_gst_taxwise_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_taxwise_report', icon: AiOutlineFileText },
      {id: 91, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_gst_taxwise_with_hsn_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_taxwise_with_hsn_report', icon: AiOutlineFileText },
      {id: 88, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_gst_monthly_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_monthly_summary_report', icon: AiOutlineFileText },
      {id: 87, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_gst_detailed_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_detailed_report', icon: AiOutlineFileText },
      {id: 89, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_gst_register_format_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_register_format_report', icon: AiOutlineFileText },
      {id: 85, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_gst_adv_register_format_report`, type: 'link', active: false, selected: false, title: 'purchase_gst_advance_register_format_report', icon: AiOutlineFileText },
     
//purchase return Tax
      {id: 93, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_daily_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_daily_summary_report', icon: AiOutlineFileText },
      {id: 97, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_sales_and_return_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_sales_and_return_report', icon: AiOutlineFileText },
      {id: 98, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_taxwise_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_taxwise_report', icon: AiOutlineFileText },
      {id: 99, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_taxwise_with_hsn_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_taxwise_with_hsn_report', icon: AiOutlineFileText },
      {id: 95, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_monthly_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_monthly_summary_report', icon: AiOutlineFileText },
      {id: 94, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_detailed_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_detailed_report', icon: AiOutlineFileText },
      {id: 96, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_register_format_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_register_format_report', icon: AiOutlineFileText },
      {id: 92, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_return_gst_adv_register_format_report`, type: 'link', active: false, selected: false, title: 'purchase_return_gst_adv_register_format_report', icon: AiOutlineFileText },
   
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
      {id: 100, path: `${import.meta.env.BASE_URL}reports/_/inventory/opening_stock_report`, type: 'link', active: false, selected: false, title: 'opening_stock', icon: PiPackageLight },
      {id: 101, path: `${import.meta.env.BASE_URL}reports/_/inventory/stock_transfer_report`, type: 'link', active: false, selected: false, title: 'stock_transfer', icon: PiPackageLight },
      {id: 102, path: `${import.meta.env.BASE_URL}reports/_/inventory/damage_stock_report`, type: 'link', active: false, selected: false, title: 'damage_stock', icon: PiPackageLight },
      {id: 103, path: `${import.meta.env.BASE_URL}reports/_/inventory/excess_stock_report`, type: 'link', active: false, selected: false, title: 'excess_stock', icon: PiPackageLight },
      {id: 104, path: `${import.meta.env.BASE_URL}reports/_/inventory/shortage_stock_report`, type: 'link', active: false, selected: false, title: 'shortage_stock', icon: PiPackageLight },
      {id: 105, path: `${import.meta.env.BASE_URL}reports/_/inventory/branch_transfer_out_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_out', icon: PiPackageLight },
      {id: 106, path: `${import.meta.env.BASE_URL}reports/_/inventory/branch_transfer_in_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_in', icon: PiPackageLight },
      {id: 107, path: `${import.meta.env.BASE_URL}reports/_/inventory/branch_transfer_summary_out_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_summary_out', icon: PiPackageLight },
      {id: 108, path: `${import.meta.env.BASE_URL}reports/_/inventory/branch_transfer_summary_in_report`, type: 'link', active: false, selected: false, title: 'branch_transfer_summary_in', icon: PiPackageLight },
      {id: 111, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_opening_stock_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_opening_stock_summary', icon: PiPackageLight },
      {id: 112, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_substitute_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_substitute_summary', icon: PiPackageLight },
      {id: 113, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_branch_transfer_out_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_branch_transfer_out_summary', icon: PiPackageLight },
      {id: 114, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_branch_transfer_in_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_branch_transfer_in_summary', icon: PiPackageLight },
      {id: 115, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_excess_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_excess_summary', icon: PiPackageLight },
      {id: 116, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_shortage_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_shortage_summary', icon: PiPackageLight },
      {id: 117, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_damage_stock_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_damage_stock_summary', icon: PiPackageLight },
      {id: 118, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_goods_delivery_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_delivery_summary', icon: PiPackageLight },
      {id: 119, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_goods_delivery_return_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_delivery_return_summary', icon: PiPackageLight },
      {id: 120, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_goods_receipt_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_receipt_summary', icon: PiPackageLight },
      {id: 121, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_goods_receipt_return_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_receipt_return_summary', icon: PiPackageLight },
      {id: 122, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_goods_request_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_goods_request_summary', icon: PiPackageLight },
      {id: 123, path: `${import.meta.env.BASE_URL}reports/_/inventory/stock_summary_report`, type: 'link', active: false, selected: false, title: 'stock_summary', icon: PiPackageLight },
      {id: 124, path: `${import.meta.env.BASE_URL}reports/_/inventory/stock_ledger_report`, type: 'link', active: false, selected: false, title: 'stock_ledger', icon: HiOutlineClipboardList },
      {id: 125, path: `${import.meta.env.BASE_URL}reports/_/inventory/expiry_report`, type: 'link', active: false, selected: false, title: 'expiry_report', icon: HiOutlineClipboardList },
      {id: 126, path: `${import.meta.env.BASE_URL}reports/_/inventory/transaction_analysis_report`, type: 'link', active: false, selected: false, title: 'transaction_analysis', icon: MdOutlineAnalytics },
      {id: 127, path: `${import.meta.env.BASE_URL}reports/_/inventory/stock_flow_report`, type: 'link', active: false, selected: false, title: 'stock_flow_report', icon: GiCargoShip },
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
      {id: 128, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_summary_report`, type: 'link', active: false, selected: false, title: 'sales_summary', icon: PiPackageLight },
      {id: 129, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_register_report`, type: 'link', active: false, selected: false, title: 'sales_register', icon: PiPackageLight },
      {id: 130, path: `${import.meta.env.BASE_URL}reports/_/inventory/net_sales_report`, type: 'link', active: false, selected: false, title: 'net_sales', icon: PiPackageLight },
      {id: 131, path: `${import.meta.env.BASE_URL}reports/_/inventory/partywise_sales_report`, type: 'link', active: false, selected: false, title: 'partywise_sales', icon: PiPackageLight },
      {id: 132, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_tax_report_summary`, type: 'link', active: false, selected: false, title: 'sales_tax_report_summary', icon: PiPackageLight },
      {id: 133, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_tax_report_detailed`, type: 'link', active: false, selected: false, title: 'sales_tax_report_detailed', icon: PiPackageLight },
      {id: 134, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_return_summary`, type: 'link', active: false, selected: false, title: 'sales_return_summary', icon: PiPackageLight },
      {id: 135, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_return_register`, type: 'link', active: false, selected: false, title: 'sales_return_register', icon: PiPackageLight },
      {id: 136, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_and_sales_return_report`, type: 'link', active: false, selected: false, title: 'sales_and_sales_return', icon: PiPackageLight },
      {id: 137, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_order_summary_report`, type: 'link', active: false, selected: false, title: 'sales_order_summary', icon: PiPackageLight },
      {id: 138, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_estimate_summary_report`, type: 'link', active: false, selected: false, title: 'sales_estimate_summary', icon: PiPackageLight },
      {id: 139, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_quotation_summary_report`, type: 'link', active: false, selected: false, title: 'sales_quotation_summary', icon: PiPackageLight },
      {id: 140, path: `${import.meta.env.BASE_URL}reports/_/inventory/substitute_report`, type: 'link', active: false, selected: false, title: 'substitute_report', icon: PiPackageLight },
      {id: 141, path: `${import.meta.env.BASE_URL}reports/_/inventory/daywise_summary_with_profit_report`, type: 'link', active: false, selected: false, title: 'daywise_summary_with_profit', icon: PiPackageLight },
      {id: 142, path: `${import.meta.env.BASE_URL}reports/_/inventory/groupwise_sales_summary_devexpress_report`, type: 'link', active: false, selected: false, title: 'groupwise_sales_summary_devexpress', icon: PiPackageLight },
      {id: 143, path: `${import.meta.env.BASE_URL}reports/_/inventory/groupwise_sales_summary_report_groupwise`, type: 'link', active: false, selected: false, title: 'groupwise_sales_summary_report', icon: PiPackageLight },
      {id: 144, path: `${import.meta.env.BASE_URL}reports/_/inventory/groupwise_sales_summary_report_categorywise`, type: 'link', active: false, selected: false, title: 'categorywise_sales_summary_report', icon: PiPackageLight },
      {id: 145, path: `${import.meta.env.BASE_URL}reports/_/inventory/groupwise_sales_summary_report_sectionwise`, type: 'link', active: false, selected: false, title: 'sectionwise_sales_summary_report', icon: PiPackageLight },
      {id: 146, path: `${import.meta.env.BASE_URL}reports/_/inventory/groupwise_sales_summary_report_brandwise`, type: 'link', active: false, selected: false, title: 'brandwise_sales_summary_report', icon: PiPackageLight },
      {id: 147, path: `${import.meta.env.BASE_URL}reports/_/inventory/groupwise_sales_summary_report_product_categorywise`, type: 'link', active: false, selected: false, title: 'product_categorywise_sales_summary_report', icon: PiPackageLight },
      {id: 148, path: `${import.meta.env.BASE_URL}reports/_/inventory/salesman_wise_sales_and_collection_report`, type: 'link', active: false, selected: false, title: 'salesman_wise_sales_and_collection', icon: PiPackageLight },
      {id: 149, path: `${import.meta.env.BASE_URL}reports/_/inventory/non_invoiced_goods_delivery_report`, type: 'link', active: false, selected: false, title: 'non_invoiced_goods_delivery', icon: PiPackageLight },
      {id: 150, path: `${import.meta.env.BASE_URL}reports/_/inventory/booking_summary_report`, type: 'link', active: false, selected: false, title: 'booking_summary', icon: PiPackageLight },
      {id: 151, path: `${import.meta.env.BASE_URL}reports/_/inventory/pending_order_report`, type: 'link', active: false, selected: false, title: 'pending_order', icon: PiPackageLight },
      {id: 152, path: `${import.meta.env.BASE_URL}reports/_/inventory/promotional_sales_report`, type: 'link', active: false, selected: false, title: 'promotional_sales', icon: PiPackageLight },
      {id: 153, path: `${import.meta.env.BASE_URL}reports/_/inventory/grouped_brandwise_sales_report`, type: 'link', active: false, selected: false, title: 'grouped_brandwise_sales', icon: PiPackageLight },
      {id: 154, path: `${import.meta.env.BASE_URL}reports/_/inventory/party_monthwise_sales_summary_report`, type: 'link', active: false, selected: false, title: 'party_monthwise_sales_summary', icon: PiPackageLight },
      {id: 155, path: `${import.meta.env.BASE_URL}reports/_/inventory/coupon_reports`, type: 'link', active: false, selected: false, title: 'coupon_reports', icon: PiPackageLight },
      {id: 156, path: `${import.meta.env.BASE_URL}reports/_/inventory/scheme_wise_sales_report`, type: 'link', active: false, selected: false, title: 'scheme_wise_sales', icon: PiPackageLight },
       { id: 157, path: `${import.meta.env.BASE_URL}reports/_/inventory/diagnosis_report`, type: 'link', active: false, selected: false, title: 'diagnosis_report', icon: PiPackageLight },
      { id: 158, path: `${import.meta.env.BASE_URL}reports/_/inventory/routewise_sales_collection_report`, type: 'link', active: false, selected: false, title: 'routewise_sales_collection', icon: PiPackageLight },
      { id: 159, path: `${import.meta.env.BASE_URL}reports/_/inventory/branch_inventory_request_pending_order_report`, type: 'link', active: false, selected: false, title: 'branch_inventory_request_pending_order', icon: PiPackageLight },
      { id: 160, path: `${import.meta.env.BASE_URL}reports/_/inventory/print_details_report`, type: 'link', active: false, selected: false, title: 'print_details', icon: PiPackageLight },
      { id: 161, path: `${import.meta.env.BASE_URL}reports/_/inventory/inventory_status_report`, type: 'link', active: false, selected: false, title: 'inventory_status', icon: PiPackageLight },
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
      { id: 210, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_transfer_summary_report`, type: 'link', active: false, selected: false, title: 'sales_transfer_summary', icon: FaHandHoldingDollar },
      { id: 211, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_transfer_register_report`, type: 'link', active: false, selected: false, title: 'sales_transfer_register', icon: GiReceiveMoney },
      { id: 212, path: `${import.meta.env.BASE_URL}reports/_/inventory/net_sales_transfer_report`, type: 'link', active: false, selected: false, title: 'net_sales_transfer_report', icon: GiSwapBag },
      { id: 213, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_transfer_partyWise_sales`, type: 'link', active: false, selected: false, title: 'sales_transfer_partyWise_sales', icon: FaSackDollar },
      { id: 214, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_transfer_monthWise_summary_report`, type: 'link', active: false, selected: false, title: 'sales_transfer_monthWise_summary', icon: FaSackDollar },
      { id: 215, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_transfer_partyWise_summary_report`, type: 'link', active: false, selected: false, title: 'sales_transfer_partyWise_summary', icon: FaSackDollar },
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
      {id: 77, path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_tax_vat`, type: 'link', active: false, selected: false, title: 'purchase_tax', icon: AiOutlineFileText },
      { id: 169, path: `${import.meta.env.BASE_URL}reports/_/inventory/sales_tax_report`, type: 'link', active: false, selected: false, title: 'sales_tax', icon: AiOutlineFileText },
      { id: 170, path: `${import.meta.env.BASE_URL}reports/_/inventory/vat_return_form`, type: 'link', active: false, selected: false, title: 'vat_return_form', icon: AiOutlineFileText },
      { id: 171, path: `${import.meta.env.BASE_URL}reports/_/inventory/vat_return_form_arabic`, type: 'link', active: false, selected: false, title: 'vat_return_form_arabic', icon: AiOutlineFileText },
      { id: 172, path: `${import.meta.env.BASE_URL}reports/_/inventory/ksa_e_invoice_summary_report`, type: 'link', active: false, selected: false, title: 'ksa_e_invoice_summary', icon: AiOutlineFileText },
      { id: 173, path: `${import.meta.env.BASE_URL}reports/_/inventory/ksa_e_invoice_detailed_report`, type: 'link', active: false, selected: false, title: 'ksa_e_invoice_detailed', icon: AiOutlineFileText },
      { id: 174, path: `${import.meta.env.BASE_URL}reports/_/inventory/gstr1b2b_report`, type: 'link', active: false, selected: false, title: 'gstr1_b2b', icon: AiOutlineFileText },
      { id: 175, path: `${import.meta.env.BASE_URL}reports/_/inventory/gstr1b2cLarge_report`, type: 'link', active: false, selected: false, title: 'gstr1_b2cLarge', icon: AiOutlineFileText },
      { id: 176, path: `${import.meta.env.BASE_URL}reports/_/inventory/gstr1b2cSmall_report`, type: 'link', active: false, selected: false, title: 'gstr1b2c_Small', icon: AiOutlineFileText },
      { id: 177, path: `${import.meta.env.BASE_URL}reports/_/inventory/gstr1cdnr_report`, type: 'link', active: false, selected: false, title: 'gstr1_cdnr', icon: AiOutlineFileText },
      { id: 178, path: `${import.meta.env.BASE_URL}reports/_/inventory/gstr1cdnur_report`, type: 'link', active: false, selected: false, title: 'gstr1_cdnur', icon: AiOutlineFileText },
      { id: 179, path: `${import.meta.env.BASE_URL}reports/_/inventory/gstr1hsnSummary_report`, type: 'link', active: false, selected: false, title: 'gstr1_summary_of_hsn', icon: AiOutlineFileText },
      { id: 180, path: `${import.meta.env.BASE_URL}reports/_/inventory/gstr1Docs_report`, type: 'link', active: false, selected: false, title: 'gstr1_docs', icon: AiOutlineFileText },
      { id: 181, path: `${import.meta.env.BASE_URL}reports/_/inventory/gstr3b_report`, type: 'link', active: false, selected: false, title: 'gstr3b', icon: AiOutlineFileText },
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
      {id: 78, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_purchase_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_summary', icon: AiOutlineFileText },
      {id: 79, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_purchase_return_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_return_summary', icon: AiOutlineFileText },
      {id: 80, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_purchase_order_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_order_summary', icon: AiOutlineFileText },
      {id: 81, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_purchase_estimate_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_estimate_summary', icon: AiOutlineFileText },
      {id: 82, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_purchase_quotation_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_quotation_summary', icon: AiOutlineFileText },
      {id: 83, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_purchase_return_estimate_summary`, type: 'link', active: false, selected: false, title: 'itemwise_purchase_return_estimate_summary', icon: AiOutlineFileText },
      { id: 157, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_sales_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_sales_summary', icon: PiPackageLight },
      { id: 158, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_sales_return_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_sales_return_summary', icon: PiPackageLight },
      { id: 159, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_sales_order_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_sales_order_summary', icon: PiPackageLight },
      { id: 160, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_sales_quotation_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_sales_quotation_summary', icon: PiPackageLight },
      { id: 161, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_sales_estimate_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_sales_estimate_summary', icon: PiPackageLight },
      { id: 162, path: `${import.meta.env.BASE_URL}reports/_/inventory/itemwise_sales_and_sales_return_summary_report`, type: 'link', active: false, selected: false, title: 'itemwise_sales_and_sales_return_summary', icon: PiPackageLight },
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
      { id: 174, path: `${import.meta.env.BASE_URL}reports/_/inventory/daily_statement_sales`, type: 'link', active: false, selected: false, title: 'daily_statement_sales', icon: AiOutlineFileText },
      { id: 175, path: `${import.meta.env.BASE_URL}reports/_/inventory/daily_statement_purchase`, type: 'link', active: false, selected: false, title: 'daily_statement_purchase', icon: AiOutlineFileText },
      { id: 176, path: `${import.meta.env.BASE_URL}reports/_/inventory/daily_statement_all`, type: 'link', active: false, selected: false, title: 'daily_statement_all', icon: AiOutlineFileText },
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
      {id: 75, path: `${import.meta.env.BASE_URL}reports/_/inventory/price_list_report`, type: 'link', active: false, selected: false, title: 'price_list_report', icon: TbTag },
      {id: 76, path: `${import.meta.env.BASE_URL}reports/_/inventory/daily_balance_report`, type: 'link', active: false, selected: false, title: 'daily_balance_report', icon: IoScaleOutline },
      {id: 84, path: `${import.meta.env.BASE_URL}reports/_/inventory/product_summary`, type: 'link', active: false, selected: false, title: 'product_summary', icon: AiOutlineFileText },
      { id: 163, path: `${import.meta.env.BASE_URL}reports/_/inventory/transaction_summary_report`, type: 'link', active: false, selected: false, title: 'transaction_summary', icon: PiPackageLight },
      { id: 164, path: `${import.meta.env.BASE_URL}reports/_/inventory/inventory_transaction_register_report`, type: 'link', active: false, selected: false, title: 'inventory_transaction_register', icon: PiPackageLight },
      { id: 165, path: `${import.meta.env.BASE_URL}reports/_/inventory/inventory_summary_report`, type: 'link', active: false, selected: false, title: 'inventory_summary_report', icon: PiPackageLight },
      { id: 166, path: `${import.meta.env.BASE_URL}reports/_/inventory/service_report`, type: 'link', active: false, selected: false, title: 'service_report', icon: PiPackageLight },
      { id: 167, path: `${import.meta.env.BASE_URL}reports/_/inventory/salesman_incentive_report`, type: 'link', active: false, selected: false, title: 'salesman_incentive_report', icon: PiPackageLight },
      { id: 168, path: `${import.meta.env.BASE_URL}reports/_/inventory/privilege_card_report`, type: 'link', active: false, selected: false, title: 'privilege_card', icon: PiPackageLight },
    ]
  },
  
];