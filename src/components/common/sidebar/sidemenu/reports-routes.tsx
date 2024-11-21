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
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/ledger_report`, type: 'link', active: false, selected: false, title: 'ledger_report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/cash_book`, type: 'link', active: false, selected: false, title: 'cash_book' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/day_book_detailed`, type: 'link', active: false, selected: false, title: 'day_book_detailed' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/day_book_summary`, type: 'link', active: false, selected: false, title: 'day_book_summary' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/payment_report`, type: 'link', active: false, selected: false, title: 'payment_report' },  
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/collection_report`, type: 'link', active: false, selected: false, title: 'collection_report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/cash_summary`, type: 'link', active: false, selected: false, title: 'cash_summary_report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/transaction_report`, type: 'link', active: false, selected: false, title: 'transaction_report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/transaction_history_accounts`, type: 'link', active: false, selected: false, title: 'transaction_history_accounts' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/transaction_history_inventory`, type: 'link', active: false, selected: false, title: 'transaction_history_inventory' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/daily_summary_report`, type: 'link', active: false, selected: false, title: 'daily_summary_report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/billwise_profit`, type: 'link', active: false, selected: false, title: 'billwise_profit_report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/partywise_summary`, type: 'link', active: false, selected: false, title: 'partywise_summary_report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_payable`, type: 'link', active: false, selected: false, title: 'account_payable' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_receivable`, type: 'link', active: false, selected: false, title: 'account_receivable' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_aging_payable`, type: 'link', active: false, selected: false, title: 'account_payable_aging_report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/outstanding_aging_receivable`, type: 'link', active: false, selected: false, title: 'account_receivable_aging_report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/trial_balance`, type: 'link', active: false, selected: false, title: 'trial_balance' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/profit_and_loss`, type: 'link', active: false, selected: false, title: 'profit_&_loss_account' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/balance_sheet`, type: 'link', active: false, selected: false, title: 'balance_sheet' },

      { path: `${import.meta.env.BASE_URL}reports/_/accounts/payable_aging`, type: 'link', active: false, selected: false, title: 'account_payable_aging_report' },
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/receivable_aging`, type: 'link', active: false, selected: false, title: 'account_receivable_aging_report', },
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
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_summary_report`, type: 'link', active: false, selected: false, title: 'purchase_summary_report'},
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/purchase_register_report`, type: 'link', active: false, selected: false, title: 'purchase_register_report'},
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/party_wise_report`, type: 'link', active: false, selected: false, title: 'party_wise_report'},
      { path: `${import.meta.env.BASE_URL}reports/_/inventory/gstr_report`, type: 'link', active: false, selected: false, title: 'gstr_report'},
    ]
  },
];