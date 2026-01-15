import React, { useState } from "react";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { Plus, Trash2 } from "lucide-react";
import { TransactionFormState } from "../transaction-types";
import { formStateHandleFieldChangeKeysOnly } from "../reducer";
import { useDispatch } from "react-redux";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";

interface GiftOrCashCouponSelectorProps {
  closeModal: () => void;
  t: any;
  formState: TransactionFormState;
}

interface CouponRow {
  cardID: string;
  name: string;
  amount: number;
  cNumber: string;
  type: string;
}


const api = new APIClient();
const GiftOrCashCouponSelector: React.FC<GiftOrCashCouponSelectorProps> = ({ closeModal, t, formState }) => {
  //   const formState = useSelector((state: RootState) => state.InventoryTransaction);
  const dispatch = useDispatch()
  const billAmount = formState.transaction.master.grandTotal;
  const lblTotalAmt = formState.transaction.couponDetails.totalAmount;
  const [couponRows, setCouponRows] = useState<CouponRow[]>([]);

  // Calculate total amount from grid rows
  const totalAmount = couponRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);

  const handleDeleteClick = (rowIndex: number) => {
    setCouponRows(prevRows => prevRows.filter((_, index) => index !== rowIndex));
    // CalculateTotal();
  };


  const gridColumns: DevGridColumn[] = [
    {
      dataField: "cardID",
      caption: t("card_id"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "type",
      caption: t("type"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "name",
      caption: t("name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "cNumber",
      caption: t("c_number"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "amount",
      caption: t("amount"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "actions",
      caption: t("actions"),
      dataType: "string",
      allowSorting: false,
      allowSearch: false,
      allowFiltering: false,
      width: 80,
      cellRender: (params: any,) => {
        const rowIndex = params.rowIndex;
        return (
          <div className="flex flex-row gap-2">
            <button
              onClick={() => handleDeleteClick(rowIndex)}
              className="p-1 text-red-600 hover:text-white hover:bg-red rounded-xl"
              title={t("delete")}
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
    },

  ];

  const handleCouponNumberKeydown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && formState.transaction.couponDetails?.cardNumber.trim() !== "" ) {
          const enteredCardNumber = formState.transaction.couponDetails?.cardNumber;
          const res = await api.getAsync(`${Urls.inv_transaction_base}${formState.transactionType}/PrivilegeCard/${enteredCardNumber}`);
          if(res){
            if(res.cardType === "Gift Card" || res.cardType === "Cash Card" || res.cardType === "Voucher"){
              if(res.cardBalance <=0 ){
                ERPAlert.show({
                  icon: "info",
                  title: t("no_balance_amount_in_this_card/coupon"),
                  confirmButtonText: t("ok"),
                  showCancelButton: false,
                });
               return;
              }
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: {
                    transaction: {
                      couponDetails: {
                        cardHolderName: res.cardHolderName,
                        cardType: res.cardType,
                        cardID: res.privilegeCardsID,
                        amount: res.cardBalance,
                        oBalance: res.oBalance
                      },
                    },
                  },
                })
              );
              if(billAmount - lblTotalAmt <= 0 ){
                ERPAlert.show({
                  icon: "info",
                  title: t("bill_amount_is_too_low_to_add_this_coupon"),
                  confirmButtonText: t("ok"),
                  showCancelButton: false,
                });
                return;
              }
              debugger;
              if(billAmount - totalAmount < billAmount){
                dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: {
                    transaction: {
                      couponDetails: {
                        amount: billAmount -totalAmount,
                      },
                    },
                  },
                })
              );

              }
            }else{
              ERPAlert.show({
                  icon: "info",
                  title: t("invalid_card_number"),
                  confirmButtonText: t("ok"),
                  showCancelButton: false,
                });
            }
          }else{
              ERPAlert.show({
                  icon: "info",
                  title: t("invalid_card_number"),
                  confirmButtonText: t("ok"),
                  showCancelButton: false,
                });
            }
          }
    }
      

        const handleAddBtnClick = () => { 
            const exists = couponRows.some(
              row =>
                row.cardID === String(formState.transaction.couponDetails.cardID) &&
                formState.transaction.couponDetails.cardType !== "Voucher"
            );

            if (exists) {
              ERPAlert.show({
                icon: "info",
                title: t("info"),
                text: t("coupon_added_to_list"),
              });
              return;
            }

            const newRow: CouponRow = {
              cardID: String(formState.transaction.couponDetails.cardID),
              name: formState.transaction.couponDetails.cardHolderName,
              amount: formState.transaction.couponDetails.amount,
              cNumber: formState.transaction.couponDetails.cardNumber,
              type: formState.transaction.couponDetails.cardType,
            };

            setCouponRows(prev => [...prev, newRow]);

            dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: {  transaction:{
                      couponDetails:{
                        cardNumber: "",
                        amount: 0,
                        cardHolderName: "",
                        cardType: "",
                        oBalance: 0,
                    }
                    }},
                })
              )
        }

     const handleApplyClick =()=>{
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {  transaction:{
              master:{
                couponAmt: totalAmount
                
            }
            }},
        })
      )
      closeModal?.()

     }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 px-4">
        <div className="flex items-end justify-between w-full">
          <div className="flex flex-col items-center text-blue-700">
            <div className="text-md font-bold">{t('bill_amount')}</div>
            <div className="text-md font-bold">{Number(billAmount).toFixed(2)}</div>
          </div>
          <ERPInput
            id="couponCardNumber"
            type="number"
            className="w-60"
            label={t("coupon_card_number")}
            onKeyDown={(e) => handleCouponNumberKeydown(e)}
            value={formState.transaction.couponDetails.cardNumber}     
            disableEnterNavigation        
            onChange={(e) =>
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: {  transaction:{
                      couponDetails:{
                        cardNumber:e.target?.value
                    }
                    }},
                })
              )
            }
          />
          <ERPInput
            id="amount"
            type="number"
            className="w-60"
            label={t("amount")}
            value={formState.transaction.couponDetails.amount}             
            onChange={(e) =>
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: {  transaction:{
                      couponDetails:{
                        amount:e.target?.value
                    }
                    }},
                })
              )
            }
          />
          <div>
            <button
              onClick={()=> handleAddBtnClick()}
              className="p-2 rounded-md 
               bg-blue-600 text-white 
               border border-blue-300 
               shadow-sm
               transition-all duration-200 
               flex items-center justify-center
               hover:bg-white hover:text-blue-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

        </div>
        <div className="flex flex-row justify-around w-full">
          {/* <div className="text-[#ff0000] font-medium">{formState.transaction.couponDetails.cardID === 0 ? t("card_id") : formState.transaction.couponDetails.cardID }</div> */}
          <div className="text-[#ff0000] font-medium">
            {formState.transaction.couponDetails.cardHolderName === ""
              ? t("name")
              : `${t("name")} : ${formState.transaction.couponDetails.cardHolderName}`}
          </div>

          <div className="text-[#ff0000] font-medium">
            {formState.transaction.couponDetails.cardType === ""
              ? t("type")
              : `${t("type")} : ${formState.transaction.couponDetails.cardType}`}
          </div>

          <div className="text-[#ff0000] font-medium">
            {formState.transaction.couponDetails.oBalance === 0
              ? t("ob")
              : `${t("ob")} : ${Number(formState.transaction.couponDetails.oBalance).toFixed(2)}`}
          </div>

        </div>
        <div className="">
          <ErpDevGrid
            columns={gridColumns}
            keyExpr="cardID"
            data={couponRows}
            //   dataUrl={`${Urls.inv_transaction_base}${formState.transactionType}/LedgerList/${salesRoute && mainSalesRoute ? mainSalesRoute : 0}`}
            gridId="ledgerDetailsGrid"
            height={300}
            hideGridAddButton={true}
            columnHidingEnabled={true}
            hideDefaultExportButton={true}
            hideDefaultSearchPanel={true}
            allowSearching={false}
            allowExport={false}
            hideGridHeader={false}
            enablefilter={false}
            hideToolbar={true}
            remoteOperations={false}
            enableScrollButton={false}
            ShowGridPreferenceChooser={false}
            showPrintButton={false}
            focusedRowEnabled={true}
            tabIndex={0}
            selectionMode="single"
            keyboardNavigation={{
              editOnKeyPress: false,
              enabled: true,
              enterKeyDirection: "row",
            }}
          />
        </div>
        <div className="w-full flex flex-row justify-end gap-4 font-bold text-lg px-2 text-blue-700">
          <div className="text-lg font-bold">{t('total')}</div>
          <div  className="text-lg font-bold">{totalAmount.toFixed(2)}</div>
        </div>
        <div className="flex items-center justify-end gap-2 w-full">
          
          <ERPButton
            title={t("cancel")}
            variant="secondary"
            className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
            onClick={closeModal}
          />
          <ERPButton
            title={t("apply")}
            variant="primary"
            className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
            onClick={()=> handleApplyClick()}
          />
        </div>
      </div>
    </>
  );
};

export default GiftOrCashCouponSelector;
