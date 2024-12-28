'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { ChevronRight, X, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Address } from './address'
import { ContactPersons } from './contact-persons'
import { ActivityLog } from './erp-activitylog'
import { useAppSelector } from '../../utilities/hooks/useAppDispatch'
import { RootState } from '../../redux/store'

interface CustomerDetailsProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CustomerDetails({ setIsOpen }: CustomerDetailsProps) {
  const [activeTab, setActiveTab] = useState('details')
  const [showContactPersons, setShowContactPersons] = useState(false)
  const [showAddress, setShowAddress] = useState(false);
  const ledgerData = useAppSelector((state: RootState) => state.AccTransaction.ledgerData);

  function getFormattedValue(value: number | string): string {
    if (typeof value === 'number') {
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    return String(value);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 overflow-auto h-svh">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-lg font-medium">X</span>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Customer</div>
            <div className="flex items-center gap-2">
              <span className="font-medium">XCVXCXC</span>
              <CheckCircle2 className="w-4 h-4 text-blue-500"  />
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700" onClick={() => { setIsOpen(false)}} >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
        <button
          className={`px-1 py-2 text-sm ${
            activeTab === 'details'
              ? 'border-b-2 border-primary font-medium'
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`px-1 py-2 text-sm ${
            activeTab === 'activity'
              ? 'border-b-2 border-primary font-medium'
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('activity')}
        >
          Activity Log
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className="space-y-6">
          {/* Financial Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Outstanding Receivables</span>
              </div>
              <div className="text-xl font-semibold">{getFormattedValue(ledgerData.OutstandingReceivables)}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-emerald-500 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Total Sales Count</span>
              </div>
              <div className="text-xl font-semibold">{ledgerData.TotalSalesCount}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-emerald-500 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Total Sales Amount</span>
              </div>
              <div className="text-xl font-semibold">{getFormattedValue(ledgerData.TotalSalesAmount)}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-emerald-500 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Total Purchase Count</span>
              </div>
              <div className="text-xl font-semibold">{ledgerData.TotalPurchaseCount}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-emerald-500 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Total Purchase Amount</span>
              </div>
              <div className="text-xl font-semibold">{getFormattedValue(ledgerData.TotalPurchaseAmount)}</div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Contact Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Party Type</div>
                  <div>{ledgerData.PartyType}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Party Category</div>
                  <div>{ledgerData.PartyCategory}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Price Category</div>
                  <div>{ledgerData.PriceCategory}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Tax Number</div>
                  <div>{ledgerData.TaxNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Credit Amount</div>
                  <div>{getFormattedValue(ledgerData.CreditAmount)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Credit Days</div>
                  <div>{ledgerData.CreditDays}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Billwise Applicable</div>
                  <div>{ledgerData.BillwiseApplicable}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Route Name</div>
                  <div>{ledgerData.RouteName}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Additional Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Created Date</div>
                  <div>{new Date(ledgerData.CreatedDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Expiry Date</div>
                  <div>{new Date(ledgerData.ExpiryDate).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Persons */}
          <div>
            <button 
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
              onClick={() => setShowContactPersons(!showContactPersons)}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">Contact Persons</span>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">1</span>
              </div>
              <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${showContactPersons ? 'rotate-90' : ''}`} />
            </button>
            {showContactPersons && <ContactPersons />}
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
                  {ledgerData.BillingAddress.map((line, index) => (
                    <p key={index} className="text-sm">{line}</p>
                  ))}
                </div>
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  {ledgerData.ShippingAddress.length > 0 ? (
                    ledgerData.ShippingAddress.map((line, index) => (
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
  )
}

