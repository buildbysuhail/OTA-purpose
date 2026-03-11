import React, { useEffect, useState } from 'react';
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { useAppDispatch, useAppSelector } from '../../../../utilities/hooks/useAppDispatch';
import { useRootState } from '../../../../utilities/hooks/useRootState';
import PrivilegeCardManage from '../../../accounts/masters/account-privilege-card/privilege-card-manage';
import { RootState } from '../../../../redux/store';
import { PrivilegeCardDetails, SummaryItems, TransactionFormState } from '../transaction-types';
import { APIClient } from '../../../../helpers/api-client';
import Urls from '../../../../redux/urls';
import { formStateHandleFieldChangeKeysOnly } from '../reducer';
import { merge } from 'lodash';
import { initialUserConfig } from '../transaction-type-data';
import VoucherType from '../../../../enums/voucher-types';
interface PrivilegeCardEntryProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  data: string;
  formState: TransactionFormState;
  calculateTotal: any;
}

const api = new APIClient();
const PrivilegeCardEntry: React.FC<PrivilegeCardEntryProps> = ({
  isOpen,
  onClose,
  t,
  data,
  formState,
  calculateTotal
}) => {

  const [redeemPoints,setRedeemPoints] = useState(0)
  const [selectedPoint,setSelectedPoint] = useState(0)
  const [confirToken,setConfirToken] = useState("")
  const [showInvalidOtpMessage, setShowInvalidOtpMessage] = useState(false)
  const [addAmount, setAddAmount] = useState(0)
    const dispatch = useAppDispatch();
    const [addNewEntry, setAddNewEntry] = useState(false)
    const [otpModalOpen, setOtpModalOpen] =  useState(false)
    const [otpValue, setOtpValue ] = useState("")
    const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);

    // In some voucher types - the design have difference
    const design2VoucherTypes: VoucherType[] = [
      VoucherType.SalesQuotation,
      VoucherType.GoodsDeliveryNote,
      VoucherType.GoodsDeliveryReturn,
      VoucherType.GoodsReceiptReturn,
    ];

    const isDesign2 = design2VoucherTypes.includes(
      formState.transaction.master.voucherType as VoucherType
    );

    useEffect(() => {
      if(formState.formElements.btnPrivilegeCard.visible){
        const PrivilegePercentage = applicationSettings.mainSettings?.previlegeCardPerc;
        if(PrivilegePercentage> 0 ){
          const grandTotal = Number(formState.transaction.master.grandTotal) || 0;
          const addPrvAmount = (grandTotal * (PrivilegePercentage / 100)).toFixed(2);
          setAddAmount(Number(addPrvAmount))
      }}
    },[formState.transaction.master.grandTotal])

  const handleReset = () => {
    dispatch(
             formStateHandleFieldChangeKeysOnly({
              fields: {
                transaction:{
                  privilegeCardDetails:{
                    cardNumber:"",
                    cardHolderName:"",
                    address1:"",
                    mobile:"",
                }
                }
              },
            }) 
          );
          setAddAmount(0)
          setRedeemPoints(0)
  };
  

  const handleApply = () => {
    onClose();
  };
  const handleAddNew = () => {
    // onClose();
    setAddNewEntry(true)
  };

  const handlePrivilegeCardSubmit = (submittedData: any) => {
    dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: {
                transaction: {
                  privilegeCardDetails: {
                    cardNumber: submittedData.cardNumber ?? "",
                    cardHolderName: submittedData.cardHolderName ?? "",
                    address1: submittedData.address1 ?? "",
                    mobile: submittedData.mobile ?? "",
                    oBalance: submittedData.oBalance ?? 0,
                  },
                  master: {
                    partyName: submittedData.cardHolderName ?? "",
                    address1: submittedData.address1 ?? "",
                    address4: submittedData.mobile ?? "",
                    gatePassNo: submittedData.cardNumber ?? "",
                    privCardID: submittedData.privilegeCardsID ?? ""
                  }
                },
              },
            })
          );
    };
    
    // Function for handling clicking enter on card number field
    const handleCardNumberKeydown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const enteredCardNumber = formState.transaction.privilegeCardDetails?.cardNumber;
        if(enteredCardNumber !== ""){
          const res = await api.getAsync(`${Urls.inv_transaction_base}${formState.transactionType}/PrivilegeCard/${enteredCardNumber}`);
          if(res.cardType !== "Privilege"){
            return;
          }
          dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: {
                transaction: {
                  privilegeCardDetails: {
                    cardHolderName: res.cardHolderName,
                    address1: res.address1,
                    phone: res.phone,
                    mobile:res.mobile,
                    oBalance: res.oBalance + res.cardBalance,
                    privilegeCardsID: res.privilegeCardsID,
                    cardNumber:res.cardNumber,
                    cardBalance:res.cardBalance,
                    priceCategoryID:res.priceCategoryID
                  },
                  master: {
                    partyName: res.cardHolderName,
                    address1: res.address1,
                    address4: res.mobile,
                    gatePassNo: res.cardNumber,
                    privCardID: res.privilegeCardsID
                  }
                },
              },
            })
          );
        }}
    }
     
    // Function handle redeem value button click - OTP Send
    const handleRedeemPointClick = async (points: number) => {
        setRedeemPoints(0);
        
        if((formState.transaction.privilegeCardDetails.oBalance ?? 0) >= points) {
          try{
            setSelectedPoint(points)
            const phone = formState.transaction.privilegeCardDetails.mobile ?? "";
            const response = await api.postAsync(
              `${Urls.inv_transaction_base}${formState.transactionType}/SendPointRedeemOTP`,{toPhone:phone});

            if(response.isOk === true ){
              setConfirToken(response.item)
              setOtpModalOpen(true)
            }
          }catch{
            console.error("Error in redeem points api call")
          }
        }else{
            setRedeemPoints(0);
        }
    };

    // Verify otp details function
    const handleVerifyOtpNumber = async () =>{
      try{
         const phone = formState.transaction.privilegeCardDetails.mobile ?? "";
         const res = await api.postAsync(`${Urls.inv_transaction_base}${formState.transactionType}/ValidatePointRedeemOTP`,{otp:otpValue,confirmToken:confirToken,toPhone:phone});
         if(res.isOk === true ){
          const oldBalanceValue = formState.transaction.privilegeCardDetails.oBalance;
          setRedeemPoints(selectedPoint)

          const res = await calculateTotal({ ...formState.transaction.master, billDiscount: selectedPoint }, formState.summary as SummaryItems, formState.formElements,{
            result: {
              transaction: {
                privilegeCardDetails: {
                  totalBalance: (oldBalanceValue ?? 0) - selectedPoint,
                },
                master: {
                  billDiscount: selectedPoint,
                  privAddAmount: addAmount,
                  privRedeem: selectedPoint
                }
              }
            }
          }
        );

        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: res
          })
        );

          // dispatch(
          //   formStateHandleFieldChangeKeysOnly({
          //     fields: {
          //       transaction: {
          //         privilegeCardDetails: {
          //           totalBalance: (oldBalanceValue ?? 0) - selectedPoint,
          //         },
          //         master: {
          //           billDiscount: selectedPoint,
          //             // privCardID: Already dispatch in keydown
          //             privAddAmount: addAmount,
          //             privRedeem: selectedPoint   
          //         }
          //       },
          //     },
          //   })
          // );
          setOtpModalOpen(false)
          setShowInvalidOtpMessage(false)
          setRedeemPoints(selectedPoint)
 
         }else{
              // Invalid otp message
              setShowInvalidOtpMessage(true)
         }
      }catch{
        console.error("Error in verifying Otp")
      }
    }

    // In "P" Button Case - need to make the code correct
    const handleRedeemChangeDesign2 = (redeem: number) => {
      setRedeemPoints(redeem);
      
      if (redeem > 0) {
        const grandTotal = Number(formState.transaction.master.grandTotal || 0);
        const prevOldBalance = Number(formState.transaction.privilegeCardDetails.oBalance || 0);

        // ------------The below logic is found in 1050--------------
        // const calculatedAddAmount = grandTotal / redeem;
        // setAddAmount(calculatedAddAmount);
        // const newBalance = prevOldBalance + calculatedAddAmount - redeem;
        // dispatch(
        //   formStateHandleFieldChangeKeysOnly({
        //     fields: {
        //       transaction: {
        //         privilegeCardDetails: {
        //           totalBalance: newBalance,
        //         },
        //         master:{
        //           billDiscount: redeem,
        //         }
        //       },
        //     },
        //   })
        // );
        // ------------The above logic is found in 1050--------------
        // The below Code is not the correct logic - make the code correct after discussion with sir
        const calculatedAddAmount = (grandTotal * (applicationSettings.mainSettings?.previlegeCardPerc / 100)).toFixed(2);
        setAddAmount(Number(calculatedAddAmount));
        const newBalance = prevOldBalance + Number(calculatedAddAmount) - redeem;
         dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: {
              transaction: {
                privilegeCardDetails: {
                  totalBalance: newBalance,
                },
                master:{
                  billDiscount: redeem,
                }
              },
            },
          })
        );
      }
    };
  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("privilege_card_entry")}
      width={500}
      height={isDesign2 ? 250 :360}
      content={
        <div className="w-full modal-content">
          <div className="flex flex-col gap-3 p-2">
            {/* Left side - Form Fields */}
            <div className="flex flex-row gap-3 justify-between">
              {/* Left Column */}
              <div className="flex flex-col gap-3">
                {/* Card No */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-xs font-semibold">
                    {t("card_no")}
                  </label>
                  <ERPInput
                    id="cardNumber"
                    className="flex-1 h-7 text-xs"
                    noLabel={true}
                    value={formState.transaction.privilegeCardDetails.cardNumber}             
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: {  transaction:{
                              privilegeCardDetails:{
                                cardNumber:e.target?.value
                            }
                            }},
                        })
                      )
                    }
                    onKeyDown={(e) => handleCardNumberKeydown(e)}
                    disableEnterNavigation
                  />
                </div>

                {/* Customer Name */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-xs font-semibold">
                    {t("customer_name")}
                  </label>
                  <ERPInput
                    id="cardHolderName"
                    value={formState.transaction.privilegeCardDetails.cardHolderName}             
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: { 
                            transaction:{
                              privilegeCardDetails:{
                                  cardHolderName:e.target?.value
                              }
                            }
                           },
                        })
                      )
                    }
                    className="flex-1 h-7 text-xs"
                    noLabel={true}
                  />
                </div>

                {/* Address */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-xs font-semibold">
                    {t("address")}
                  </label>
                  <ERPInput
                    id="address1"
                    value={formState.transaction.privilegeCardDetails.address1}
                    className="flex-1 h-7 text-xs"
                    noLabel={true}
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: { 
                            transaction:{
                              privilegeCardDetails:{
                                  address1:e.target?.value
                              }
                            }
                           },
                        })
                      )
                    }
                  />
                </div>

                {/* Mobile No */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-xs font-semibold">
                    {t("mobile_no")}
                  </label>
                  <ERPInput
                    id="mobile"
                    value={formState.transaction.privilegeCardDetails.mobile}
                    className="flex-1 h-7 text-xs"
                    noLabel={true}
                    placeholder={t(" eg: +911234322345 ")}
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: { 
                            transaction:{
                              privilegeCardDetails:{
                                  mobile:e.target?.value
                              }
                            }
                           },
                        })
                      )
                    }
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-3">
                {/* Old Balance */}
                <div className="flex items-center gap-2">
                  <label className="w-20 text-xs font-semibold text-right">
                    {t("old_balance")}
                  </label>
                  <ERPInput
                    id="oBalance"
                    value={formState.transaction.privilegeCardDetails.oBalance}
                    className="w-28 h-7 text-xs text-right"
                    noLabel={true}
                    readOnly={true}
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: { 
                            transaction:{
                              privilegeCardDetails:{
                                  oBalance:e.target?.value
                              }
                            }
                           },
                        })
                      )
                    }
                  />
                </div>

                {/* Add */}
                <div className="flex items-center gap-2">
                  <label className="w-20 text-xs font-semibold text-right">
                    {t("add")}
                  </label>
                  <ERPInput
                    id="pAddAmount"
                    value={addAmount}
                    className="w-28 h-7 text-xs text-right"
                    noLabel={true}
                    readOnly={true}
                    onChange={(e) => setAddAmount(Number(e.target?.value)) }
                  />
                </div>

                {!isDesign2 ? (
                 <>
                {/* Redeem */}
                <div className="flex items-center gap-2">
                  <label className="w-20 text-xs font-semibold text-right">
                    {t("redeem")}
                  </label>
                  <ERPInput
                    id="pRedeem"
                    value={redeemPoints}
                    className="w-28 h-7 text-xs text-right"
                    noLabel={true}
                    onChange={(e) => setRedeemPoints(Number(e.target?.value))}
                  />
                </div>

                {/* Balance */}
                <div className="flex items-center gap-2">
                  <label className="w-20 text-xs font-semibold text-right">
                    {t("balance")}
                  </label>
                  <ERPInput
                    id="totalBalance"
                    value={formState.transaction.privilegeCardDetails.totalBalance}
                    className="w-28 h-7 text-xs text-right"
                    noLabel={true}
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: { 
                            transaction:{
                              privilegeCardDetails:{
                                  totalBalance:e.target?.value
                              }
                            }
                           },
                        })
                      )
                    }
                  />
                </div>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <label className="w-20 text-xs font-semibold text-right">
                    {t("redeem")}
                  </label>
                  <ERPInput
                    id="pRedeem"
                    value={redeemPoints}
                    className="w-28 h-7 text-xs text-right"
                    noLabel={true}
                    onChange={(e) => handleRedeemChangeDesign2(Number(e.target?.value))}
                  />
                </div>

                {/* Balance */}
                <div className="flex items-center gap-2">
                  <label className="w-20 text-xs font-semibold text-right">
                    {t("balance")}
                  </label>
                  <ERPInput
                    id="totalBalance"
                    value={formState.transaction.privilegeCardDetails.totalBalance}
                    className="w-28 h-7 text-xs text-right"
                    noLabel={true}
                    onChange={(e) =>
                      dispatch(
                        formStateHandleFieldChangeKeysOnly({
                          fields: { 
                            transaction:{
                              privilegeCardDetails:{
                                  totalBalance:e.target?.value
                              }
                            }
                           },
                        })
                      )
                    }
                  />
                </div>
              </div>
            )}
              </div>
            </div>
            {/* Redeem Points Section */}
          {!isDesign2 && (
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-red-600">
                  {redeemPoints ===0 ? t("redeem_points") : t(`Redeem : ${redeemPoints}`)}
                </span>
                <button
                  onClick={() => handleAddNew()}
                  className="h-7 text-sm px-3 font-semibold underline"
                >{t("add_new")}
                </button>
                <div className="flex gap-2">
                  <ERPButton
                title={t("reset")}
                onClick={handleReset}
                variant="secondary"
                />
                <ERPButton
                  title={t("apply")}
                  onClick={handleApply}
                  variant="primary"
                />
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                {[200, 150, 100, 50, 0].map((points) => (
                  <button
                    key={points}
                    onClick={() => handleRedeemPointClick(points)}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 border mt-2 border-blue-300 rounded-lg px-2 py-2 text-sm font-semibold transition-colors"
                  >
                    {points}
                  </button>
                ))}
              </div>
            </div>
          )}
            {/* Otp enter Modal */}
            <ERPModal
                isOpen={otpModalOpen}
                title={t("verify_otp")}
                width={320}
                height={150}
                closeModal={() => setOtpModalOpen(false)}
                content={
                  <div className='flex flex-col gap-2'>
                  <div className='flex items-end justify-center gap-3'>
                    <ERPInput
                       localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:20, marginBottom: 0, fontColor:"255, 0, 0", borderColor: '200, 200, 200'})}
                      customSize="customize"
                      id="otp"
                      value={otpValue}
                      label = {t("please_enter_otp")}
                      onChange={(e) => setOtpValue(e.target.value)}
                    />
                    <ERPButton
                      title = {t("verify")}
                      variant = "primary"
                      onClick={() => handleVerifyOtpNumber() }
                    />
                  </div>
                  {showInvalidOtpMessage === true && (
                    <div className='text-sm w-full text-red-500 text-center'>{t("please_enter_valid_otp")}</div>
                  )}
                  </div>
                }
              />
            
            {/* Privilege manage modal */}
            {addNewEntry &&
            <ERPModal
                isOpen={addNewEntry}
                title={t("privilege_card")}
                width={800}
                height={280}
                isForm={true}
                closeModal={() => setAddNewEntry(false)}
                // closeModal={() => { dispatch(togglePrivilegeCardPopup({ isOpen: false, key: null, reload: false })) }}
                content={<PrivilegeCardManage isPrivilegeCardEntry={addNewEntry} onClose ={() =>setAddNewEntry(false)} onSubmitData={handlePrivilegeCardSubmit}/>}
              />
          }  
          </div>
        </div>
      }
    />
  );
};

export default PrivilegeCardEntry;