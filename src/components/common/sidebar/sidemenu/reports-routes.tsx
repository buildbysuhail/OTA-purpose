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
import { ReactElement } from "react";
import TrialBalance from "../../../../pages/accounts/reports/trialBalance/trial-balance";
import TrialBalancePeriodwise from "../../../../pages/accounts/reports/trialBalance/trial-balance-detailed";
import ProfitAndLossDetailedReport from "../../../../pages/accounts/reports/profitAndLoss/profit-and-loss-report-detailed";
import ProfitAndLossReport from "../../../../pages/accounts/reports/profitAndLoss/profit-and-loss-report";
import BalanceSheet from "../../../../pages/accounts/reports/balanceSheet/balace-sheet";
import BalancesheetVertical from "../../../../pages/accounts/reports/balanceSheet/balancesheet-vertical";
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

  

];