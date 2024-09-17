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
            title: "Roles",
            path: "/settings/roles",
          },
          {
            title: "User Preferences",
            path: "",
          },
        ],
      },
    ],
  },
  
];
