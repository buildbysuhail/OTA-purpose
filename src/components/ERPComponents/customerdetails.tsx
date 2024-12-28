"use client";

import { Dispatch, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, SetStateAction, useState } from "react";
import { ChevronRight, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { Address } from "./address";
import { ContactPersons } from "./contact-persons";
import { ActivityLog } from "./erp-activitylog";
import { useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";

interface CustomerDetailsProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CustomerDetails({ setIsOpen }: CustomerDetailsProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [showContactPersons, setShowContactPersons] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const ledgerData = useAppSelector(
    (state: RootState) => state.AccTransaction.ledgerData
  );

  function getFormattedValue(value: number | string): string {
    if (typeof value === "number") {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    }
    return String(value);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 overflow-auto h-svh">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
            <img className="text-lg font-medium" src={ledgerData?.partyPhoto} ></img>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">{ledgerData?.partyName}</div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{ledgerData?.partyCategory}</span>
              <CheckCircle2 className="w-4 h-4 text-white " color="blue" />
            </div>
          </div>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
        <button
          className={`px-1 py-2 text-sm ${activeTab === "details"
            ? "border-b-2 border-primary font-medium"
            : "text-muted-foreground"
            }`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        <button
          className={`px-1 py-2 text-sm ${activeTab === "activity"
            ? "border-b-2 border-primary font-medium"
            : "text-muted-foreground"
            }`}
          onClick={() => setActiveTab("activity")}
        >
          Activity Log
        </button>
      </div>

      {activeTab === "details" ? (
        <div className="space-y-6">
          {/* Financial Overview */}
          {ledgerData?.partyType == "Supp" ||
            (ledgerData?.partyType == "Cust" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 text-amber-500 mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Receivables</span>
                  </div>
                  <div className="text-xl font-semibold">
                    {getFormattedValue(ledgerData?.outstandingReceivables)}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-500 mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Total Sales Amount</span>
                  </div>
                  <div className="text-xl font-semibold">
                    {getFormattedValue(ledgerData?.totalSalesAmount)}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-500 mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Total Purchase Amount</span>
                  </div>
                  <div className="text-xl font-semibold">
                    {getFormattedValue(ledgerData?.totalPurchaseAmount)}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-500 mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Total Sales Count</span>
                  </div>
                  <div className="text-xl font-semibold">
                    {ledgerData?.totalSalesCount}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-500 mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Total Purchase Count</span>
                  </div>
                  <div className="text-xl font-semibold">
                    {ledgerData?.totalPurchaseCount}
                  </div>
                </div>
              </div>
            ))}

          {/* Contact Details */}
          <div className="p-4 shadow rounded-lg">
            <div className="space-y-6">
              {/* <h2 className="text-lg font-semibold">Contact Details</h2> */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                      <p className="text-[#8c8c8c]">Party Type</p>
                      <div className="w-1/2">{ledgerData?.partyType}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                      <p className="text-[#8c8c8c]">Party Category</p>
                      <div className="w-1/2">{ledgerData?.partyCategory}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                      <p className="text-[#8c8c8c]">Price Category</p>
                      <div className="w-1/2">{ledgerData?.priceCategory}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                      <p className="text-[#8c8c8c]">Tax Number</p>
                      <div className="w-1/2">{ledgerData?.taxNumber}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                      <p className="text-[#8c8c8c]">Credit Amount</p>
                      <div className="w-1/2">{getFormattedValue(ledgerData?.creditAmount)}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                      <p className="text-[#8c8c8c]">Credit Days</p>
                      <div className="w-1/2">{ledgerData?.creditDays}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                      <p className="text-[#8c8c8c]">Billwise Applicable</p>
                      <div className="w-1/2">{ledgerData?.billwiseApplicable}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                      <p className="text-[#8c8c8c]">Route Name</p>
                      <div className="w-1/2">{ledgerData?.routeName}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                      <p className="text-[#8c8c8c]">Created Date</p>
                      <div className="w-1/2">{new Date(ledgerData?.createdDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                      <p className="text-[#8c8c8c]">Expiry Date</p>
                      <div className="w-1/2">{new Date(ledgerData?.expiryDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Details */}
          <div className="p-4 shadow rounded-lg">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Billing Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-sm text-muted-foreground flex flex-col items-start space-y-1">
                    {ledgerData?.billingAddress?.length > 0 ? (
                      ledgerData?.billingAddress?.map((line: any, index: Key | null | undefined) => (
                        <div key={index}>{line || "\u00A0"}</div>
                      ))
                    ) : (
                      <div>No Billing Address Provided</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-4 shadow rounded-lg">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-sm text-muted-foreground flex flex-col items-start space-y-1">
                    {ledgerData?.shippingAddress?.length > 0 ? (
                      ledgerData.shippingAddress.map((line: any, index: Key | null | undefined) => (
                        <div key={index}>{line || "\u00A0"}</div>
                      ))
                    ) : (
                      <div>No Shipping Address Provided</div>
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
                    <p className="text-sm text-muted-foreground">No shipping address provided</p>
                  )}
                </div>
              </div>
            )}
          </div> */}
        </div>
      ) : (
        <ActivityLog activities={[]} />
      )}
    </div>
  );
}
