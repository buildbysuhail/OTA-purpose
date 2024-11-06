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
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/cash_book`, type: 'link', active: false, selected: false, title: 'Cash Book' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/day_book_detailed`, type: 'link', active: false, selected: false, title: 'Day Book Detailed' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/day_book_summary`, type: 'link', active: false, selected: false, title: 'Day Book Summary' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/payment_report`, type: 'link', active: false, selected: false, title: 'Payment Report' },  
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/collection_report`, type: 'link', active: false, selected: false, title: 'Collection Report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/cash_summary`, type: 'link', active: false, selected: false, title: 'Cash Summary Report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/transaction_report`, type: 'link', active: false, selected: false, title: 'Transaction Report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/transaction_history_accounts`, type: 'link', active: false, selected: false, title: 'Transaction History Accounts' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/transaction_history_inventory`, type: 'link', active: false, selected: false, title: 'Transaction History Inventory' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/daily_summary_report`, type: 'link', active: false, selected: false, title: 'Daily Summary Report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/billwise_profit`, type: 'link', active: false, selected: false, title: 'Billwise Profit Report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/partywise_summary`, type: 'link', active: false, selected: false, title: 'Partywise Summary Report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_payable`, type: 'link', active: false, selected: false, title: 'Account Payable' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_receivable`, type: 'link', active: false, selected: false, title: 'Account Receivable' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_aging_payable`, type: 'link', active: false, selected: false, title: 'Account Payable Aging Report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_aging_receivable`, type: 'link', active: false, selected: false, title: 'Account Receivable Aging Report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/trial_balance`, type: 'link', active: false, selected: false, title: 'Trial Balance' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/profit_and_loss`, type: 'link', active: false, selected: false, title: 'Profit & Loss Account' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/balance_sheet`, type: 'link', active: false, selected: false, title: 'Balance Sheet' },

      { path: `${import.meta.env.BASE_URL}reports/_/accounts/payable_aging`, type: 'link', active: false, selected: false, title: 'Account Payable Aging Report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/receivable_aging`, type: 'link', active: false, selected: false, title: 'Account Receivable Aging Report', },
    ]
  },
  {
    icon: (<CheckBadgeIcon className="side-menu__icon" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'inventory',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [ 
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_summary_report`, type: 'link', active: false, selected: false, title: 'Purchase Summary Report'},
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_register_report`, type: 'link', active: false, selected: false, title: 'Purchase Register Report'},
    ]
  },
];