'use client'

import { CircleDot, Receipt, CreditCard, UserPlus } from 'lucide-react'
import React, { useState } from 'react'

interface Activity {
  id: string
  type: 'payment' | 'invoice' | 'contact'
  message: string
  timestamp: string
  user: string
}

interface ActivityLogProps {
  customerName?: string
  activities: Activity[]
}

export function ActivityLog({ customerName = 'Unknown', activities }: ActivityLogProps) {
  const [activeTab, setActiveTab] = useState('activity')

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="h-4 w-4 text-[#22c55e]" />
      case 'invoice':
        return <Receipt className="h-4 w-4 text-[#3b82f6]" />
      case 'contact':
        return <UserPlus className="h-4 w-4 text-[#8b5cf6]" />
      default:
        return <CircleDot className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="w-full max-w-2xl border rounded-lg shadow-sm">
      <div className="border-b p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            {customerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold">Customer</h2>
            <p className="text-sm text-gray-600">{customerName}</p>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'details' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'activity' ? 'border-b-2 border-[#3b82f6]' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity Log
          </button>
        </div>
        <div className="p-4">
          {activeTab === 'details' && (
            <p className="text-sm text-gray-600">Customer details would go here</p>
          )}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  {getIcon(activity.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-sm text-gray-600">
                        {activity.timestamp}
                      </span>
                    </div>
                    <p className="text-sm">{activity.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

