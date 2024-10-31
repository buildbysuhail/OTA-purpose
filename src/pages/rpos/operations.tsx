import React from "react";
import {
  Phone,
  Mail,
  FileText,
  Globe,
  Receipt,
  User,
  Wallet,
  PiggyBank,
  Package,
  Bell,
  Table,
  RefreshCw,
  HelpCircle,
  Video,
  Languages,
  UserCog,
  DollarSign,
  MessageSquare,
  Bike,
  Tv,
  ShoppingCart,
  UtensilsCrossed,
  Printer,
  Percent,
  Monitor,
  Settings,
  ToggleRight,
  ArrowLeftRight,
  ListTodo,
  Vault,
  BadgeDollarSign,
} from "lucide-react";

const Operations = () => {
  return (
    <div className="p-0">
      <header className="flex justify-between items-center bg-white p-4 shadow-md border-t-[1px]">
      <h2 className="text-lg font-bold mb-0">Operations</h2>
        <div className="flex items-center space-x-4 absolute right-4">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Call For Support</span>
            <span className="font-bold">+91 9335 87623</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Send a Mail:</span>
            <span className="font-bold">support@polosys.com</span>
          </div>
        </div>
      </header>

      <main className="mt-4">
        <section className="bg-white p-4 shadow-md">
          {/* <h2 className="text-lg font-bold mb-4">Operations</h2> */}
          {/* <i className="ri-shake-hands-fill"></i> */}
          <div className="grid grid-cols-11 gap-4">
            {[
              { icon: FileText, label: "Orders" },
              { icon: Globe, label: "Online Orders" },
              { icon: Receipt, label: "KOTs" },
              { icon: User, label: "Customers" },
              { icon: Wallet, label: "Cash Flow" },
              { icon: DollarSign, label: "Expense" },
              { icon: Wallet, label: "Withdrawal" },
              { icon: Vault, label: "Cash Top-Up" },
              { icon: Package, label: "Inventory" },
              { icon: Bell, label: "Notification" },
              { icon: Table, label: "Table" },
              { icon: RefreshCw, label: "Manual Sync" },
              { icon: HelpCircle, label: "Help" },
              { icon: Video, label: "Live View" },
              { icon: ArrowLeftRight, label: "Duo Payment" },
              { icon: Languages, label: "Language Profiles" },
              { icon: UserCog, label: "Billing User Profile" },
              { icon: DollarSign, label: "Currency Conversion" },
              { icon: MessageSquare, label: "Feedback" },
              { icon: Bike, label: "Delivery Boys" },
              { icon: Tv, label: "LED Display" },
              { icon: ShoppingCart, label: "Marketplace", new: true },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 border rounded bg-gray-50"
              >
                <item.icon className="w-6 h-6 mb-2" />
                <span>{item.label}</span>
                {item.new && <span className="text-xs text-blue-500">New</span>}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-4  mt-0">
          <h2 className="text-lg font-bold mb-4 border-b-[1px]">
            Set the configuration for your restaurant
          </h2>
          <div className="grid grid-cols-11 gap-4">
            {[
              { icon: UtensilsCrossed, label: "Menu" },
              { icon: Printer, label: "Bill / KOT Print" },
              { icon: BadgeDollarSign, label: "Tax" },
              { icon: Percent, label: "Discount" },
              { icon: Monitor, label: "Billing Screen" },
              { icon: Settings, label: "Settings" },
              { icon: ToggleRight, label: "Menu Item On Off" },
              { icon: RefreshCw, label: "Service Renewal" },
              { icon: ListTodo, label: "Custom Order Status" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 border rounded bg-gray-50"
              >
                <item.icon className="w-6 h-6 mb-2" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Operations;
