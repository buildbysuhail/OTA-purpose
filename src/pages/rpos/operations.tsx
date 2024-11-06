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
  Keyboard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { t } from "i18next";

const Operations = () => {
  return (
    <div className="p-0">
      <header className="flex justify-between items-center bg-white p-4 shadow-md border-t-[1px]">
        <h2 className="text-lg font-bold mb-0">{t("operations")}</h2>
        <div
          className="flex items-center space-x-4 absolute ltr:right-4 rtl:left-4 "
          // style={{ insetInlineEnd: "1rem" }}
        >
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 me-2" />
            <span>{t("call_for_support")}</span>
            <div>
              {/* <span className="font-bold">+91 9335 87623</span> */}
              <span className="font-bold">
                {"+91 " +
                  "123456789"
                    .split("")
                    .reverse()
                    .join("")
                    .replace(/(\d{3})(?=\d)/, "$1 ")}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 me-2" />
            <span>{t("send_a_mail")}</span>
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
              { icon: FileText, label: "orders", link: "/rpos/Orders" },
              { icon: Globe, label: "online_orders" },
              { icon: Receipt, label: "kots", link: "/rpos/kots" },
              { icon: User, label: "customers", link: "/rpos/customers" },
              { icon: Wallet, label: "cash_flow" },
              { icon: DollarSign, label: "expense" },
              { icon: Wallet, label: "withdrawal" },
              { icon: Vault, label: "cash_top_up" },
              { icon: Package, label: "inventory" },
              { icon: Bell, label: "notification" },
              { icon: Table, label: "table" },
              { icon: RefreshCw, label: "manual_sync" },
              {
                icon: Keyboard,
                label: "shortcut_keys",
                link: "/rpos/shortkeys",
              },
              { icon: Video, label: "live_view" },
              { icon: ArrowLeftRight, label: "duo_payment" },
              { icon: Languages, label: "language_profiles" },
              { icon: UserCog, label: "billing_user_profile" },
              { icon: DollarSign, label: "currency_conversion" },
              { icon: MessageSquare, label: "feedback" },
              { icon: Bike, label: "delivery_boys" },
              { icon: Tv, label: "led_display" },
              { icon: ShoppingCart, label: "marketplace", new: true },
            ].map((item: any, index) => (
              <Link
                // to= {item.link}
                to={item.link ?? "/"}
                className="!p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none text-xs"
              >
                <div
                  key={index}
                  className="flex flex-col items-center p-4 border rounded bg-gray-50"
                >
                  <item.icon className="w-6 h-6 mb-2" />
                  <span>{t(item.label)}</span>
                  {item.new && (
                    <span className="text-xs text-blue-500">New</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white p-4  mt-0">
          <h2 className="text-lg font-bold mb-4 border-b-[1px]">
            {t("set_the_configuration_for_your_restaurant")}
          </h2>
          <div className="grid grid-cols-11 gap-4">
            {[
              { icon: UtensilsCrossed, label: "menu" },
              { icon: Printer, label: "bill_kot_print" },
              { icon: BadgeDollarSign, label: "tax" },
              { icon: Percent, label: "discount" },
              { icon: Monitor, label: "billing_screen" },
              { icon: Settings, label: "settings" },
              { icon: ToggleRight, label: "menu_item_on_off" },
              { icon: RefreshCw, label: "service_renewal" },
              {
                icon: ListTodo,
                label: "custom_order_status",
                link: "/rpos/customorderstatus",
              },
            ].map((item: any, index) => (
              <Link
                // to= {item.link}
                to={item.link ?? "/"}
                className="!p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none text-xs"
              >
                <div
                  key={index}
                  className="flex flex-col items-center p-4 border rounded bg-gray-50"
                >
                  <item.icon className="w-6 h-6 mb-2" />
                  <span>{t(item.label)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Operations;
