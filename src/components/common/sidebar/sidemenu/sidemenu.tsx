import { Landmark } from "lucide-react";
import { TransactionBase, transactionRoutes } from "../../content/transaction-routes";
import { TransactionTitles } from "../../content/transaction-titles";
import { BanknotesIcon } from "@heroicons/react/24/outline";

export const MENUITEMS = [
  {
    icon: <i className="side-menu__icon ri-coins-fill"></i>,
    type: "sub",
    Name: "",
    active: false,
    selected: false,
    title: "purchase",
    badge: "",
    badgetxt: "",
    rights: "",
    class: "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2",
    children: [
      ...transactionRoutes.filter(x => x.transactionBase == TransactionBase.Purchase).map((route) => ({
        path: `${import.meta.env.BASE_URL}${TransactionBase.Purchase}/${route.transactionType}List`,
        addPath: `${import.meta.env.BASE_URL}${TransactionBase.Purchase}/${route.transactionType}`,
        type: "link",
        active: false,
        selected: false,
        title: route.title,
        rights: route.formCode,
        icon: route.icon,
      })),
      {
        path: `${import.meta.env.BASE_URL}purchase/transactions/LPO`,
        type: "link",
        active: false,
        selected: false,
        title: TransactionTitles.LPO,
        rights: "BRC",
        icon: Landmark
      },
    ],
  },
]