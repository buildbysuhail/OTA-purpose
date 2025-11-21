import React, { useEffect, useState } from 'react';
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { togglePrivilegeCardPopup } from "../../../../redux/slices/popup-reducer";
import { useAppDispatch } from '../../../../utilities/hooks/useAppDispatch';
import { useRootState } from '../../../../utilities/hooks/useRootState';
import PrivilegeCardManage from '../../../accounts/masters/account-privilege-card/privilege-card-manage';
interface PrivilegeCardEntryProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  data: string;
}

interface PrivilegeCardData {
  cardNo: string;
  customerName: string;
  address: string;
  mobileNo: string;
  oldBalance: string;
  add: string;
  redeem: string;
  balance: string;
}

const PrivilegeCardEntry: React.FC<PrivilegeCardEntryProps> = ({
  isOpen,
  onClose,
  t,
  data
}) => {
  const [cardData, setCardData] = useState<PrivilegeCardData>({
    cardNo: "",
    customerName: "",
    address: "",
    mobileNo: "",
    oldBalance: "0.00",
    add: "0.00",
    redeem: "0.00",
    balance: "0.00",
  });

  const [redeemPoints, setRedeemPoints] = useState({
    point200: 0,
    point150: 0,
    point100: 0,
    point50: 0,
    point0: 0,
  });
    const dispatch = useAppDispatch();
    const rootState = useRootState();
    const [addNewEntry, setAddNewEntry] = useState(false)

  useEffect(() => {
    if (data && data !== "") {
      try {
        const parsedData = JSON.parse(data);
        setCardData(parsedData);
      } catch (e) {
        console.error("Error parsing privilege card data:", e);
      }
    }
  }, [data]);

  const handleFieldChange = (field: string, value: any) => {
    setCardData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };

      // Auto-calculate balance
      if (field === 'oldBalance' || field === 'add' || field === 'redeem') {
        const oldBal = parseFloat(field === 'oldBalance' ? value : updated.oldBalance) || 0;
        const addAmt = parseFloat(field === 'add' ? value : updated.add) || 0;
        const redeemAmt = parseFloat(field === 'redeem' ? value : updated.redeem) || 0;
        updated.balance = (oldBal + addAmt - redeemAmt).toFixed(2);
      }

      return updated;
    });
  };

  const handleRedeemPointClick = (points: number) => {
    const pointField = `point${points}` as keyof typeof redeemPoints;
    setRedeemPoints(prev => ({
      ...prev,
      [pointField]: prev[pointField] + 1
    }));

    // Add to redeem amount
    const currentRedeem = parseFloat(cardData.redeem) || 0;
    handleFieldChange('redeem', (currentRedeem + points).toFixed(2));
  };

  const handleReset = () => {
    setRedeemPoints({
      point200: 0,
      point150: 0,
      point100: 0,
      point50: 0,
      point0: 0,
    });
    handleFieldChange('redeem', '0.00');
  };

  const handleApply = () => {
    onClose();
  };

  const handleAddNew = () => {
    setAddNewEntry(true)
    setCardData({
      cardNo: "",
      customerName: "",
      address: "",
      mobileNo: "",
      oldBalance: "0.00",
      add: "0.00",
      redeem: "0.00",
      balance: "0.00",
    });
    setRedeemPoints({
      point200: 0,
      point150: 0,
      point100: 0,
      point50: 0,
      point0: 0,
    });
  };

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("privilege_card_entry")}
      width={500}
      height={400}
      content={
        <div className="w-full modal-content">
          <div className="flex flex-col gap-3">
            {/* Left side - Form Fields */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {/* Left Column */}
              <div className="flex flex-col gap-3">
                {/* Card No */}
                <div className="flex items-center gap-2">
                  <label className="w-28 text-xs font-semibold">
                    {t("card_no")}
                  </label>
                  <ERPInput
                    id="cardNo"
                    value={cardData.cardNo}
                    className="flex-1 h-7 text-xs"
                    noLabel={true}
                    onChange={(e) => handleFieldChange('cardNo', e.target.value)}
                  />
                </div>

                {/* Customer Name */}
                <div className="flex items-center gap-2">
                  <label className="w-28 text-xs font-semibold">
                    {t("customer_name")}
                  </label>
                  <ERPInput
                    id="customerName"
                    value={cardData.customerName}
                    className="flex-1 h-7 text-xs"
                    noLabel={true}
                    onChange={(e) => handleFieldChange('customerName', e.target.value)}
                  />
                </div>

                {/* Address */}
                <div className="flex items-center gap-2">
                  <label className="w-28 text-xs font-semibold">
                    {t("address")}
                  </label>
                  <ERPInput
                    id="address"
                    value={cardData.address}
                    className="flex-1 h-7 text-xs"
                    noLabel={true}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                  />
                </div>

                {/* Mobile No */}
                <div className="flex items-center gap-2">
                  <label className="w-28 text-xs font-semibold">
                    {t("mobile_no")}
                  </label>
                  <ERPInput
                    id="mobileNo"
                    value={cardData.mobileNo}
                    className="flex-1 h-7 text-xs"
                    noLabel={true}
                    onChange={(e) => handleFieldChange('mobileNo', e.target.value)}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-3">
                {/* Old Balance */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-xs font-semibold text-right">
                    {t("old_balance")}
                  </label>
                  <ERPInput
                    id="oldBalance"
                    value={cardData.oldBalance}
                    className="w-24 h-7 text-xs text-right"
                    noLabel={true}
                    onChange={(e) => handleFieldChange('oldBalance', e.target.value)}
                  />
                </div>

                {/* Add */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-xs font-semibold text-right">
                    {t("add")}
                  </label>
                  <ERPInput
                    id="add"
                    value={cardData.add}
                    className="w-24 h-7 text-xs text-right"
                    noLabel={true}
                    onChange={(e) => handleFieldChange('add', e.target.value)}
                  />
                </div>

                {/* Redeem */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-xs font-semibold text-right">
                    {t("redeem")}
                  </label>
                  <ERPInput
                    id="redeem"
                    value={cardData.redeem}
                    className="w-24 h-7 text-xs text-right"
                    noLabel={true}
                    onChange={(e) => handleFieldChange('redeem', e.target.value)}
                  />
                </div>

                {/* Balance */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-xs font-semibold text-right">
                    {t("balance")}
                  </label>
                  <ERPInput
                    id="balance"
                    value={cardData.balance}
                    className="w-24 h-7 text-xs text-right"
                    noLabel={true}
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            {/* Redeem Points Section */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-600">
                  {t("redeem_points")}
                </span>
                <ERPButton
                  title={t('add_new')}
                  onClick={()=>handleAddNew()}
                  variant='secondary'
                  className="h-7 text-xs px-3"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                {[200, 150, 100, 50, 0].map((points) => (
                  <button
                    key={points}
                    onClick={() => handleRedeemPointClick(points)}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded px-2 py-2 text-sm font-semibold transition-colors"
                  >
                    {points}
                  </button>
                ))}
              </div>

              {/* Display selected points count */}
              <div className="flex items-center justify-between gap-2 mt-2 text-xs text-gray-600">
                {[200, 150, 100, 50, 0].map((points) => {
                  const pointField = `point${points}` as keyof typeof redeemPoints;
                  return (
                    <div key={points} className="flex-1 text-center">
                      {redeemPoints[pointField] > 0 && `×${redeemPoints[pointField]}`}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Privilege manage modal */}
            {addNewEntry &&
            <ERPModal
                isOpen={addNewEntry}
                title={t("privilege_card")}
                width={800}
                height={280}
                isForm={true}
                closeModal={() =>  setAddNewEntry(false)}
                // closeModal={() => { dispatch(togglePrivilegeCardPopup({ isOpen: false, key: null, reload: false })) }}
                content={<PrivilegeCardManage />}
              />
          }

            {/* Action Buttons */}
            <div className='flex items-center justify-end gap-2 mt-2'>
              <ERPButton
                title={t('reset')}
                onClick={handleReset}
                variant='secondary'
              />
              <ERPButton
                title={t('apply')}
                onClick={handleApply}
                variant='primary'
              />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default PrivilegeCardEntry;