import {
  AdjustmentsVerticalIcon,
  BanknotesIcon,
  BellAlertIcon,
  BellIcon,
  BuildingOffice2Icon,
  CheckBadgeIcon,
  PuzzlePieceIcon,
  UserIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline";

export const SettingsRoutes = [
  {
    header: "Accounts Masters",
    icon: CheckBadgeIcon,
    items: [
      {
        routes: [
            { title: "Account Group", path: "/settings/account-masters/account-group" },
            { title: "Account Ledger", path: "/settings/account-masters/account-ledger" },
            { title: "Currency Master", path: "/settings/account-masters/currency-master" },
            { title: "Cost Center", path: "/settings/account-masters/cost-center" },
            { title: "Branch Ledgers", path: "/settings/account-masters/branch-ledgers" },
            { title: "Chart of Accounts", path: "/settings/account-masters/chart-of-accounts" },
            { title: "Cost Center (Chart of Accounts)", path: "/settings/account-masters/chart-of-accounts/cost-center" },
        ],
      },
      {
        routes: [
          
            { title: "Opening Balance", path: "/settings/account-masters/opening-balance" },
            { title: "Party Category", path: "/settings/account-masters/party-category" },
            { title: "Supplier/Customer Master", path: "/settings/account-masters/supplier-customer-master" },
            { title: "Cash/Bank Master", path: "/settings/account-masters/cash-bank-master" },
            { title: "Privilege Cards", path: "/settings/account-masters/privilege-cards" },
            { title: "Customer/Supplier Ledger", path: "/settings/account-masters/customer-supplier-ledger" }
        ],
      },
    ],
  },
  {
    header: "Users & Roles",
    icon: UserIcon,
    items: [
      {
        routes: [
          { title: "Users", path: "/settings/user-management/users" },
          {
            title: "User Types",
            path: "/settings/roles",
          },
          {
            title: "User Type Privileges",
            path: "",
          },
        ],
      },
    ],
  },
  {
  header: "Administration",
  icon: UserIcon,
  items: [
    {
      routes: [
        { title: "Company Profile", path: "/settings/user-management/users" },
        { title: "Branches", path: "/settings/user-management/users" },
        { title: "Delete Inactive Transactions", path: "/settings/user-management/users" },
        { title: "Bank POS Settings", path: "/settings/user-management/users" },
      ],
    },
  ],
},
{
header: "System",
icon: UserIcon,
items: [
  {
    routes: [
      { title: "Administration Settings", path: "/settings/system/administration-settings" },
      { title: "Export Import", path: "/settings/system/export-import" },
      { title: "Reset Database", path: "/settings/system/reset-database" },
      { title: "Counters", path: "/settings/system/counters" },
      { title: "Financial Year", path: "/settings/system/financial-year" },
      { title: "Vouchers", path: "/settings/system/vouchers" },
      { title: "Barcode Print", path: "/settings/system/barcode-print" },
      { title: "Headers and Footers", path: "/settings/system/headers-footers" },
    ],
  },
  {
    routes: [
     
        { title: "Invoice Designer", path: "/settings/system/invoice-designer" },
        { title: "Commands", path: "/settings/system/commands" },
        { title: "User Action Report", path: "/settings/system/user-action-report" },
        { title: "Reminders", path: "/settings/system/reminders" },
        { title: "Exchange Rates", path: "/settings/system/exchange-rates" },
        { title: "Refresh All Branches", path: "/settings/system/refresh-all-branches" },
        { title: "Day Close", path: "/settings/system/day-close" },
        { title: "Advance Options", path: "/settings/system/advance-options" }
    ],
  },
],
},
  
];
