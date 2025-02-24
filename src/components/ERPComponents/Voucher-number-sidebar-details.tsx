import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAppSelector } from '../../utilities/hooks/useAppDispatch';
import { RootState } from '../../redux/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faPrint,
  faPlus,
  faTrash,
  faCheck,
  faSync,
  faClock,
  faFile,
  faLock,
  faUnlock,
  faEye,
  faSave,
  faSearch,
  faDollarSign,
} from '@fortawesome/free-solid-svg-icons';
import { APIClient } from '../../helpers/api-client';
import Urls from '../../redux/urls';

interface Activity {
  userName: string;
  actionPerformed: string;
  dateTimeOfAction: string;
  actionName: string;
  systemName: string;
  icon?: React.ReactNode; // Optional icon for the activity
}

interface VoucherNumberDetailsProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const activities: Activity[] = [
  {
    userName: 'admin',
    actionPerformed: 'User Edited The Account Transaction and changed...',
    dateTimeOfAction: '11/02/2025 11:12',
    actionName: 'Edit',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faEdit} />,
  },
  {
    userName: 'admin',
    actionPerformed: 'User Printed The Account Transaction CP: CP2...',
    dateTimeOfAction: '11/02/2025 11:12',
    actionName: 'Print',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faPrint} />,
  },
  {
    userName: 'user1',
    actionPerformed: 'User Created a New Account Transaction...',
    dateTimeOfAction: '12/02/2025 10:30',
    actionName: 'Create',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faPlus} />,
  },
  {
    userName: 'user2',
    actionPerformed: 'User Deleted an Existing Account Transaction...',
    dateTimeOfAction: '13/02/2025 09:45',
    actionName: 'Delete',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faTrash} />,
  },
  {
    userName: 'user3',
    actionPerformed: 'User Authorized the Transaction...',
    dateTimeOfAction: '14/02/2025 12:00',
    actionName: 'Authorize',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faCheck} />,
  },
  {
    userName: 'user4',
    actionPerformed: 'BTI Accepted the Transaction...',
    dateTimeOfAction: '15/02/2025 13:00',
    actionName: 'BTI Accept',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faSync} />,
  },
  {
    userName: 'user5',
    actionPerformed: 'BTI Pending for the Transaction...',
    dateTimeOfAction: '16/02/2025 14:00',
    actionName: 'BTI Pending',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faClock} />,
  },
  {
    userName: 'user6',
    actionPerformed: 'BTO Pending for the Transaction...',
    dateTimeOfAction: '17/02/2025 15:00',
    actionName: 'BTO Pending',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faClock} />,
  },
  {
    userName: 'user7',
    actionPerformed: 'Cheque Printed for the Transaction...',
    dateTimeOfAction: '18/02/2025 16:00',
    actionName: 'Cheque Print',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faFile} />,
  },
  {
    userName: 'user8',
    actionPerformed: 'Transaction Closed...',
    dateTimeOfAction: '19/02/2025 17:00',
    actionName: 'Close',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faLock} />,
  },
  {
    userName: 'user9',
    actionPerformed: 'Transaction Loaded...',
    dateTimeOfAction: '20/02/2025 18:00',
    actionName: 'Load',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faSync} />,
  },
  {
    userName: 'user10',
    actionPerformed: 'Transaction Opened...',
    dateTimeOfAction: '21/02/2025 19:00',
    actionName: 'Open',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faUnlock} />,
  },
  {
    userName: 'user11',
    actionPerformed: 'PDT Transaction...',
    dateTimeOfAction: '22/02/2025 20:00',
    actionName: 'PDT Trans',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faSync} />,
  },
  {
    userName: 'user12',
    actionPerformed: 'PO Approved...',
    dateTimeOfAction: '23/02/2025 21:00',
    actionName: 'PO Approve',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faCheck} />,
  },
  {
    userName: 'user13',
    actionPerformed: 'Price Changed...',
    dateTimeOfAction: '24/02/2025 22:00',
    actionName: 'Price Change',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faDollarSign} />,
  },
  {
    userName: 'user14',
    actionPerformed: 'Transaction Saved...',
    dateTimeOfAction: '25/02/2025 23:00',
    actionName: 'Save',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faSave} />,
  },
  {
    userName: 'user15',
    actionPerformed: 'Transaction Shown...',
    dateTimeOfAction: '26/02/2025 00:00',
    actionName: 'Show',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faSearch} />,
  },
  {
    userName: 'user16',
    actionPerformed: 'Transaction Viewed...',
    dateTimeOfAction: '27/02/2025 01:00',
    actionName: 'View',
    systemName: 'QRASYS',
    icon: <FontAwesomeIcon icon={faEye} />,
  },
];

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => (
  <div className="relative flex items-center p-4 bg-white rounded-lg  hover:bg-gray-50 transition-shadow w-full">
    <div className="absolute left-[-32px] w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
      {activity.icon || <FontAwesomeIcon icon={faFile} />}
    </div>
    <div className="flex-1 pl-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500">{activity.dateTimeOfAction}</span>
        <span className="font-medium text-gray-800">{activity.userName}</span>
      </div>
      <p className="text-sm text-gray-700 text-left">{activity.actionPerformed}</p>
    </div>
  </div>
);

const api = new APIClient()
const VoucherNumberDetails: React.FC<VoucherNumberDetailsProps> = ({ setIsOpen }) => {
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchActivities = async () => {
      debugger;
      try {
        const params: Record<any, any> = {
          VoucherNumber: formState.transaction.master.voucherNumber, // Ensuring it's always a string
          voucherPrefix:(formState.transaction?.master?.voucherPrefix || ""),
          voucherType:(formState.transaction?.master?.voucherType || ""),
          formType: (formState.transaction?.master?.formType || ""),
          MannualInvoiceNumber: "", // Convert undefined to an empty string or appropriate string value
          SearchUsingMannualInvNo:false, // Convert boolean to string
        };
        const response = await api.getAsync(Urls.voucher_history, new URLSearchParams(params).toString()); // Replace with actual API URL
        if (!response.ok) throw new Error('Failed to fetch data');
        const data: Activity[] = await response.json();
        setActivities(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [formState.transaction.master.voucherNumber]);
  return (
    <div className="p-6  rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-3">
        {/* <h6 className="text-xl font-semibold text-gray-900">Voucher Number Log</h6> */}
        <button
          className="text-gray-600 hover:text-gray-800 focus:outline-none transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <p className="mb-6 text-lg text-gray-700 font-medium">
        Voucher Number: <span className="text-xl font-bold">{formState.transaction.master.voucherNumber}</span>
      </p>
      <div className="relative pl-8 space-y-3">
        <div className="absolute left-4 top-0 h-full border-l-2 border-gray-300"></div>
        {activities.map((activity, index) => (
          <ActivityCard key={index} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default VoucherNumberDetails;
