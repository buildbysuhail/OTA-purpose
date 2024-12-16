import { ActivityLog } from "./erp-activitylog"


export default function Demo() {
    

  return (
    <div className="p-4 pt-[67px]">
      <ActivityLog 
        customerName="xcvxcxc"
        activities={[
            {
                id: '1',
                type: 'payment',
                message: 'Payment of amount ₹255.00 received and applied for INV-000001',
                timestamp: '13/12/2024 12:29 PM',
                user: 'Safvan'
            },
            {
                id: '2',
                type: 'invoice',
                message: 'Invoice INV-000001 marked as sent',
                timestamp: '09/12/2024 01:27 PM',
                user: 'Safvan'
            },
            {
                id: '3',
                type: 'invoice',
                message: 'Invoice INV-000001 of amount ₹255.00 created',
                timestamp: '09/12/2024 01:26 PM',
                user: 'Safvan'
            },
            {
                id: '4',
                type: 'contact',
                message: 'Contact person xcvxc has been created',
                timestamp: '09/12/2024 01:26 PM',
                user: 'Safvan'
            },
            {
                id: '5',
                type: 'contact',
                message: 'Contact created',
                timestamp: '09/12/2024 01:26 PM',
                user: 'Safvan'
            }
        ]}
      />
    </div>
  )
}

