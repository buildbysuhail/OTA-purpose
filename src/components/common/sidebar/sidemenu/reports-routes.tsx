import {
  CheckBadgeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export const ReportsMenuItems = [
  // {
  //   menutitle: 'Settings',
  //   showWorkspaceMiniCard: true,
  // },
  {
    icon: (<CheckBadgeIcon className="side-menu__icon" />),
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
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/ledger_report`, type: 'link', active: false, selected: false, title: 'Ledger Report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/cash`, type: 'link', active: false, selected: false, title: 'cash' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/payable_aging`, type: 'link', active: false, selected: false, title: 'Account Payable Aging Report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/receivable_aging`, type: 'link', active: false, selected: false, title: 'Account Receivable Aging Report', },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/payable_aging_skiptake`, type: 'link', active: false, selected: false, title: 'Account Payable Aging Report Skiptake' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/receivable_aging_skiptake`, type: 'link', active: false, selected: false, title: 'Account Receivable Aging Report Skiptake', },
    ]
  },
];