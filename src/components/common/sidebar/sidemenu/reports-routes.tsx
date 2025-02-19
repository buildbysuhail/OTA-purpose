import { BanknotesIcon, CircleStackIcon } from "@heroicons/react/24/outline";
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
import { RiFileListLine } from "react-icons/ri";
import { HiOutlineDocumentText } from "react-icons/hi";


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
    title: 'Accounts',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/ledger_report`, type: 'link', active: false, selected: false, title: 'ledger_report', icon: IoBookOutline },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/cash_book`, type: 'link', active: false, selected: false, title: 'cash_book', icon: FaCoins },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/day_book_detailed`, type: 'link', active: false, selected: false, title: 'day_book_detailed', icon: BookCopy },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/day_book_summary`, type: 'link', active: false, selected: false, title: 'day_book_summary', icon: MdLibraryBooks },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/payment_report`, type: 'link', active: false, selected: false, title: 'payment_report', icon: MdOutlinePayments },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/collection_report`, type: 'link', active: false, selected: false, title: 'collection_report', icon: BsCollection },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/cash_summary`, type: 'link', active: false, selected: false, title: 'cash_summary_report', icon: GrDocumentStore },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/cash_summary_ledgerwise`, type: 'link', active: false, selected: false, title: 'cash_summary_ledgerwsie_report', icon: TbCoins },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/income_report`, type: 'link', active: false, selected: false, title: 'income_report', icon: FaHandHoldingDollar },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/income_report_detailed`, type: 'link', active: false, selected: false, title: 'income_report_detailed', icon: GiReceiveMoney },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/expense_report`, type: 'link', active: false, selected: false, title: 'expense_report', icon: GiSwapBag },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/expense_report_detailed`, type: 'link', active: false, selected: false, title: 'expense_report_detailed', icon: FaSackDollar },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/income_expense_statement`, type: 'link', active: false, selected: false, title: 'income_expense_statement', icon: LiaFileInvoiceDollarSolid },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/cash_flow`, type: 'link', active: false, selected: false, title: 'cash_flow', icon: CircleStackIcon },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/bank_flow`, type: 'link', active: false, selected: false, title: 'bank_flow', icon: RiBankLine },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/bank_statement`, type: 'link', active: false, selected: false, title: 'bank_statement', icon: RiBankFill },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/transaction_report`, type: 'link', active: false, selected: false, title: 'transaction_report', icon: FiFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/transaction_history_accounts`, type: 'link', active: false, selected: false, title: 'transaction_history_accounts', icon: LuHistory },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/transaction_history_inventory`, type: 'link', active: false, selected: false, title: 'transaction_history_inventory', icon: MdOutlineManageHistory },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/daily_summary_report`, type: 'link', active: false, selected: false, title: 'daily_summary_report', icon: CalendarClock },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/billwise_profit`, type: 'link', active: false, selected: false, title: 'billwise_profit_report', icon: ChartNoAxesCombined },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/partywise_summary`, type: 'link', active: false, selected: false, title: 'partywise_summary_report', icon: Component },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_payable`, type: 'link', active: false, selected: false, title: 'account_payable', icon: LucideCreditCard },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_receivable`, type: 'link', active: false, selected: false, title: 'account_receivable', icon: LucideDollarSign },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_aging_payable`, type: 'link', active: false, selected: false, title: 'account_payable_aging_report', icon: Clock1Icon },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_aging_receivable`, type: 'link', active: false, selected: false, title: 'account_receivable_aging_report', icon: Calendar },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/trial_balance`, type: 'link', active: false, selected: false, title: 'trial_balance', icon: SlEqualizer },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/trial_balance_period_wise`, type: 'link', active: false, selected: false, title: 'trial_balance_periodwise', icon: ImEqualizer2 },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/profit_and_loss`, type: 'link', active: false, selected: false, title: 'profit_&_loss_account', icon: TrendingUp },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/profit_and_loss_detailed`, type: 'link', active: false, selected: false, title: 'profit_&_loss_account_detailed', icon: TfiStatsUp },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/balance_sheet`, type: 'link', active: false, selected: false, title: 'balance_sheet', icon: Scale },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/balance_sheet_detailed`, type: 'link', active: false, selected: false, title: 'balance_sheet_detailed', icon: FaScaleUnbalancedFlip },
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
    title: 'Inventory',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_summary_report', icon: HiOutlineDocumentReport },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_register_report`, type: 'link', active: false, selected: false, title: 'purchase_register_report', icon: AiOutlineFileText },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/party_wise_report`, type: 'link', active: false, selected: false, title: 'party_wise_report', icon: PiUsersThreeLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/price_list_report`, type: 'link', active: false, selected: false, title: 'price_list_report', icon: TbTag },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/stock_ledger_report`, type: 'link', active: false, selected: false, title: 'stock_ledger_report', icon: HiOutlineClipboardList },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/daily_balance_report`, type: 'link', active: false, selected: false, title: 'daily_balance_report', icon: IoScaleOutline },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/opening_stock_report`, type: 'link', active: false, selected: false, title: 'opening_stock_report', icon: PiPackageLight },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/stock_flow_report`, type: 'link', active: false, selected: false, title: 'stock_flow_report', icon: GiCargoShip },
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/transaction_analysis_report`, type: 'link', active: false, selected: false, title: 'transaction_analysis_report', icon: MdOutlineAnalytics },

    ]
  },
  {
    icon: (<BanknotesIcon className="side-menu__icon side-menu" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'Tax Reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 1,
    children: [
      { path: `${import.meta.env.BASE_URL}reports/_/taxReport/gstr1_report`, type: 'link', active: false, selected: false, title: 'gstr1_report', icon: RiFileListLine },
      { path: `${import.meta.env.BASE_URL}reports/_/taxReport/gstr3b_report`, type: 'link', active: false, selected: false, title: 'gstr3b_report', icon: HiOutlineDocumentText },
    ]
  },
];