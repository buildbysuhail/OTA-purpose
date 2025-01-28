"use client";

import { Dispatch,Key,SetStateAction,useEffect,useRef,useState } from "react";
import { X,CheckCircle2,AlertTriangle,CircleDot,CreditCard,Receipt,UserPlus } from "lucide-react";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";
import profile from "../../assets/images/faces/profile-circle.512x512.png";
import { useTranslation } from "react-i18next";
import { useNumberFormat } from "../../utilities/hooks/use-number-format";

interface Activity {
  id: string;
  type: "payment" | "invoice" | "contact";
  message: string;
  timestamp: string;
  user: string;
}

interface CustomerDetailsProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  // activities: Activity[]
}

export default function CustomerDetails({ setIsOpen }: CustomerDetailsProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [showContactPersons, setShowContactPersons] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const ledgerData = useAppSelector(
    (state: RootState) => state.AccTransaction.ledgerData
  );
   const { getFormattedValue } = useNumberFormat()

  // const getIcon = (type: Activity['type']) => {
  //   switch (type) {
  //     case 'payment':
  //       return <CreditCard className="h-4 w-4 text-[#22c55e]" />
  //     case 'invoice':
  //       return <Receipt className="h-4 w-4 text-[#3b82f6]" />
  //     case 'contact':
  //       return <UserPlus className="h-4 w-4 text-[#8b5cf6]" />
  //     default:
  //       return <CircleDot className="h-4 w-4 text-gray-500" />
  //   }
  // }

  // Handle clicks outside the component

  // function getFormattedValue(value: number | string): string {
  //   if (typeof value === "number") {
  //     return value.toLocaleString("ar", {
  //       style: "currency",
  //       currency: "sar",
  //     });
  //   }
  //   return String(value);
  // }

  const getActivityConfig = (type: Activity["type"]) => {
    switch (type) {
      case "payment":
        return {
          icon: <CreditCard className="h-4 w-4" />,
          iconBg: "bg-[#e6f4ff]",
          iconColor: "text-[#22c55e]",
        };
      case "invoice":
        return {
          icon: <Receipt className="h-4 w-4" />,
          iconBg: "bg-[#e6f4ff]",
          iconColor: "text-[#3b82f6]",
        };
      case "contact":
        return {
          icon: <UserPlus className="h-4 w-4" />,
          iconBg: "bg-[#e6f4ff]",
          iconColor: "text-[#8b5cf6]",
        };
      default:
        return {
          icon: <CircleDot className="h-4 w-4" />,
          iconBg: "bg-gray-100",
          iconColor: "text-gray-500",
        };
    }
    // switch (type) {
    //   case 'payment':
    //     return <CreditCard className="h-4 w-4 text-[#22c55e]" />
    //   case 'invoice':
    //     return <Receipt className="h-4 w-4 text-[#3b82f6]" />
    //   case 'contact':
    //     return <UserPlus className="h-4 w-4 text-[#8b5cf6]" />
    //   default:
    //     return <CircleDot className="h-4 w-4 text-gray-500" />
    // }
  };

  const activities: Activity[] = [
    {
      id: "1",
      type: "payment",
      message: "Payment of amount ₹255.00 received and applied for INV-000001",
      timestamp: "13/12/2024 12:29 PM",
      user: "Safvan",
    },
    {
      id: "2",
      type: "invoice",
      message: "Invoice INV-000001 marked as sent",
      timestamp: "09/12/2024 01:27 PM",
      user: "Safvan",
    },
    {
      id: "3",
      type: "invoice",
      message: "Invoice INV-000001 of amount ₹255.00 created",
      timestamp: "09/12/2024 01:26 PM",
      user: "Safvan",
    },
    {
      id: "4",
      type: "contact",
      message: "Contact person xcvxc has been created",
      timestamp: "09/12/2024 01:26 PM",
      user: "Safvan",
    },
    {
      id: "5",
      type: "contact",
      message: "Contact created",
      timestamp: "09/12/2024 01:26 PM",
      user: "Safvan",
    },
  ];

  const customerName = {
    user: "polosys",
  };

  const { t } = useTranslation("transaction");

  return (
    <div className="max-w-2xl dark:bg-dark-bg mx-auto p-4 overflow-auto ">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
            <img
              className="text-lg font-medium dark:bg-[#f2f2f28a] rounded-md"
              src={ledgerData?.partyPhoto || profile}
            ></img>
          </div>
          <div>
            <div className="text-sm dark:text-dark-text text-black">{ledgerData?.partyName}</div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{ledgerData?.partyCategory}</span>
              {/* <h6 className="text-sm text-gray-600">{customerName.user}</h6> */}
              <CheckCircle2 className="w-4 h-4 text-white " color="green" />
            </div>
          </div>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <X className="w-[22px] h-[22px] p-1 rounded-full text-[12px] hover:shadow-lg transition-all duration-300 ease-in-out" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 dark:border-dark-border border-b mb-6">
        <button
          className={`px-1 py-2 text-sm ${
            activeTab === "details"
              ? "border-b-2 border-primary font-medium"
              : "dark:text-dark-text text-black"
          }`}
          onClick={() => setActiveTab("details")}
        >
          {t("details")}
        </button>
        <button
          className={`px-1 py-2 text-sm ${
            activeTab === "activity"
              ? "border-b-2 border-primary font-medium"
              : "dark:text-dark-text text-black "
          }`}
          onClick={() => setActiveTab("activity")}
        >
          {t("activity_log")}
        </button>
      </div>

      {activeTab === "details" ? (
        <div className="space-y-6">
          {/* Financial Overview */}
          {ledgerData?.partyType == "Supp" ||
            (ledgerData?.partyType == "Cust" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 dark:border-dark-border border rounded-lg">
                  <div className="flex flex-col justify-center items-center gap-2 text-amber-500 mb-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="text-[12px] dark:text-dark-text text-gray-600">
                      {t("receivables")}
                    </span>
                    <p className="text-[16px] dark:text-dark-text text-black font-semibold">
                      {getFormattedValue(ledgerData?.outstandingReceivables)}
                    </p>
                  </div>
                </div>
                <div className="p-3 dark:border-dark-border border rounded-lg">
                  <div className="flex flex-col justify-center items-center gap-2 text-emerald-500 mb-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-[12px] dark:text-dark-text text-gray-600">
                      {t("total_sales_amount")}
                    </span>
                    <p className="text-[16px] dark:text-dark-text text-black font-semibold">
                      {getFormattedValue(ledgerData?.totalSalesAmount)}
                    </p>
                  </div>
                </div>
                <div className="p-3 dark:border-dark-border border rounded-lg">
                  <div className="flex flex-col justify-center items-center gap-2 text-emerald-500 mb-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-[12px] dark:text-dark-text text-gray-600">
                      {t("total_purchase_amount")}
                    </span>
                    <p className="text-[16px] dark:text-dark-text text-black font-semibold">
                      {getFormattedValue(ledgerData?.totalPurchaseAmount)}
                    </p>
                  </div>
                </div>
                <div className="p-3 dark:border-dark-border border rounded-lg">
                  <div className="flex flex-col justify-center items-center gap-2 text-emerald-500 mb-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-[12px] dark:text-dark-text text-gray-600">
                      {t("total_sales_count")}
                    </span>
                    <p className="text-[16px] dark:text-dark-text text-black font-semibold">
                      {ledgerData?.totalSalesCount}
                    </p>
                  </div>
                </div>
                <div className="p-3 dark:border-dark-border border rounded-lg">
                  <div className="flex flex-col justify-center items-center gap-2 text-emerald-500 mb-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-[12px] dark:text-dark-text text-gray-600">
                      {t("total_purchase_count")}
                    </span>
                    <p className="text-[16px] dark:text-dark-text text-black font-semibold">
                      {ledgerData?.totalPurchaseCount}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          {/* Contact Details */}
          <div className="p-4 dark:bg-dark-bg-card shadow rounded-lg">
            <div className="space-y-6">
              {/* <h2 className="text-lg font-semibold">Contact Details</h2> */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-sm dark:text-dark-text text-black flex items-center justify-between">
                      <p className="dark:text-dark-text text-[#8c8c8c] text-[12px]">
                        {t("party_type")}
                      </p>
                      <div className="w-1/2 text-[12px] text-left">
                        {ledgerData?.partyType}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm dark:text-dark-text text-black flex items-center justify-between">
                      <p className="dark:text-dark-text text-[#8c8c8c] text-[12px]">
                        {t("party_category")}
                      </p>
                      <div className="w-1/2 text-[12px] text-left">
                        {ledgerData?.partyCategory}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm dark:text-dark-text text-black flex items-center justify-between">
                      <p className="dark:text-dark-text text-[#8c8c8c] text-[12px]">
                        {t("price_category")}
                      </p>
                      <div className="w-1/2 text-[12px] text-left">
                        {ledgerData?.priceCategory}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm dark:text-dark-text text-black flex items-center justify-between">
                      <p className="dark:text-dark-text text-[#8c8c8c] text-[12px]">
                        {t("tax_number")}
                      </p>
                      <div className="w-1/2 text-[12px] text-left">
                        {ledgerData?.taxNumber}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm dark:text-dark-text text-black flex items-center justify-between">
                      <p className="dark:text-dark-text text-[#8c8c8c] text-[12px]">
                        {t("credit_amount")}
                      </p>
                      <div className="w-1/2 text-[12px] text-left">
                        {getFormattedValue(ledgerData?.creditAmount)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm dark:text-dark-text text-black flex items-center justify-between">
                      <p className="dark:text-dark-text text-[#8c8c8c] text-[12px]">
                        {t("credit_days")}
                      </p>
                      <div className="w-1/2 text-[12px] text-left">
                        {ledgerData?.creditDays}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm dark:text-dark-text text-black flex items-center justify-between">
                      <p className="dark:text-dark-text text-[#8c8c8c] text-[12px]">
                        {t("billwise_applicable")}
                      </p>
                      <div className="w-1/2 text-[12px] text-left">
                        {ledgerData?.billwiseApplicable}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm dark:text-dark-text text-black flex items-center justify-between">
                      <p className="dark:text-dark-text text-[#8c8c8c] text-[12px]">
                        {t("route_name")}
                      </p>
                      <div className="w-1/2 text-[12px] text-left">
                        {ledgerData?.routeName}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm dark:text-dark-text text-black flex items-center justify-between">
                      <p className=" dark:text-dark-text text-[#8c8c8c] text-[12px]">
                        {t("created_date")}
                      </p>
                      <div className="w-1/2 text-[12px] text-left">
                        {new Date(ledgerData?.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm dark:text-dark-text text-black flex items-center justify-between">
                      <p className=" dark:text-dark-text text-[#8c8c8c] text-[12px]">
                        {t("expiry_date")}
                      </p>
                      <div className="w-1/2 text-[12px] text-left">
                        {new Date(ledgerData?.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Details */}
          <div className="p-4 dark:bg-dark-bg-card shadow rounded-lg">
            <div className="space-y-6">
              <h2 className="text-lg dark:text-dark-text text-black font-semibold text-start">
                {t("billing_address")}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="dark:text-dark-text text-gray-700 font-medium text-[12px] flex flex-col items-start space-y-1">
                    {ledgerData?.billingAddress?.length > 0 ? (
                      ledgerData?.billingAddress?.map(
                        (line: any, index: Key | null | undefined) => (
                          <div key={index}>{line || "\u00A0"}</div>
                        )
                      )
                    ) : (
                      <div>{t("no_billing")}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-4 dark:bg-dark-bg-card shadow rounded-lg">
            <div className="space-y-6">
              <h2 className="text-lg dark:text-dark-text text-black font-semibold text-start">
                {t("shipping_address")}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-[12px] dark:text-dark-text text-gray-700 font-medium flex flex-col items-start space-y-1">
                    {ledgerData?.shippingAddress?.length > 0 ? (
                      ledgerData.shippingAddress.map(
                        (line: any, index: Key | null | undefined) => (
                          <div key={index}>{line || "\u00A0"}</div>
                        )
                      )
                    ) : (
                      <div>{t("no_shipping")}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          {/* <div>
            <button 
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
              onClick={() => setShowAddress(!showAddress)}
            >
              <span className="font-medium">Address</span>
              <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${showAddress ? 'rotate-90' : ''}`} />
            </button>
            {showAddress && (
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Billing Address</h3>
                  {ledgerData?.BillingAddress.map((line, index) => (
                    <p key={index} className="text-sm">{line}</p>
                  ))}
                </div>
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  {ledgerData?.ShippingAddress.length > 0 ? (
                    ledgerData?.ShippingAddress.map((line, index) => (
                      <p key={index} className="text-sm">{line}</p>
                    ))
                  ) : (
                    <p className="text-sm text-black">No shipping address provided</p>
                  )}
                </div>
              </div>
            )}
          </div> */}
        </div>
      ) : (
        // <p>test</p>
        <div className="max-w-2xl mx-auto p-4 space-y-1">
          {activities.map((activity) => {
            const config = getActivityConfig(activity.type);
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 py-2 dark:hover:bg-dark-hover-bg hover:bg-gray-50 rounded-lg px-2 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 `}
                >
                  <div className={config.iconColor}>{config.icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm dark:text-dark-text text-gray-900">
                      {activity.user}
                    </span>
                    <span className="text-xs dark:text-dark-text text-gray-500">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-sm dark:text-dark-text text-gray-600 mt-0.5 leading-tight">
                    {activity.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
