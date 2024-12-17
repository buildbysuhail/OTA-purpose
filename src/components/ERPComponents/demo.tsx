import { Dispatch, SetStateAction } from "react";
import { ActivityLog } from "./erp-activitylog"
import { X } from "lucide-react";

interface DemoProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>; // Prop for controlling sidebar visibility
}


export default function Demo({ setIsOpen }: DemoProps) {
    

  return (
    <div className="p-4 ">
      <button className="text-gray-500 hover:text-gray-700" onClick={() => {debugger; setIsOpen(false)}} >
          <X className="h-5 w-5" />
        </button>
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

