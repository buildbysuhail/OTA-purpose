import React, { useState, useRef, useEffect } from "react";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPDataComboBox from "../../../../components/ERPComponents/erp-data-combobox";
import { ChevronUp, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { initialSettlement, initialUserConfig } from "../transaction-type-data";
import { merge } from 'lodash';
import Urls from "../../../../redux/urls";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { formStateHandleFieldChangeKeysOnly, formStateTransactionBankCardAddRowsAddSingle, formStateTransactionBankCardRemoveRow, formStateTransactionUpiAddRowsAddSingle, formStateTransactionUpiRemoveRow } from "../reducer";
import { SettlementDetails } from "../transaction-types";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";

interface TenderProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const Tender: React.FC<TenderProps> = ({ isOpen, onClose, t}) => {
  const [discEnabled, setDiscEnabled] = useState<boolean>(false);
  const [ledgerEnabled, setLedgerEnabled] = useState<boolean>(false);
  const [discAmount, setDiscAmount] = useState<number>(0);
  const [discPercent, setDiscPercent] = useState<number>(0);
  // const [taxOnDisc, setTaxOnDisc] = useState<string>("");
  const [taxOnDiscAmount, setTaxOnDiscAmount] = useState<number>(0);

  // const [upiEnabled, setUpiEnabled] = useState<boolean>(false);
  const [cardAmt, setCardAmt] = useState<number>(0);
  // const [bankAcEnabled, setBankAcEnabled] = useState<boolean>(false);
  // const [bankAc, setBankAc] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const formState = useSelector((state:RootState) => state.InventoryTransaction)
  const discAmountRef = useRef<HTMLInputElement>(null);

  // Newly added for tender
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
  const clientSession = useAppSelector((state: RootState) => state.ClientSession);
  const [couponAmt, setCouponAmt] = useState(0);
  const [addAmount, setAddAmount] = useState(0);
  const dispatch = useAppDispatch();
  const [total, setTotal] = useState(0);
  const [roundOf, setRoundOf] = useState(0);
  const [maxTaxPercentage, setMaxTaxPercentage] = useState(0);
  const [netTotal, setNetTotal] = useState<number>(0);
  const [cashRcvd, setCashRcvd] = useState<number>(0);
  const [uPIDetails, setUPIDetails] = useState<SettlementDetails>(initialSettlement);
  const [bankCardDetails, setBankCardDetails] = useState<SettlementDetails>(initialSettlement);
  const [paymentMode, setPaymentMode] = useState<"CARD" | "UPI" | null>(null);
  const [selectedLedgerId, setSelectedLedgerId] = useState<number | null>(null);
  const totalQrPayAmount =formState.transaction.uPIDetails?.reduce((sum: number, row: SettlementDetails) => sum + Number(row.amount || 0), 0 ) || 0;
  const totalBankCardAmount =formState.transaction.bankCardDetails?.reduce((sum: number, row: SettlementDetails) => sum + Number(row.amount || 0), 0 ) || 0;
  let isBillEdited = formState.transaction.master.invTransactionMasterID > 0  // Found in 1050, but check is using
  let isCreditable = false   // Found in 1050, but check is using!
  let isExcessCashRcpt = false  // Found in 1050, but check is using

  function getMaxTaxPercInItemList(): number {
    let maxTaxPerc = 0;
    try {
      const details = formState.transaction.details;
      for (let i = 0; i < details.length; i++) {
        const row = details[i];
        if (!row) continue;
        const vatPerc = Number(row.vatPerc ?? 0);
        if (vatPerc > maxTaxPerc) {
          maxTaxPerc = vatPerc;
        }
      }
    } catch (err) {
      // silent catch – same as C#
    }
    return maxTaxPerc;
  }

  useEffect(() => {
    const additionalAmt = formState.transaction.master.adjustmentAmount;
    const couponAmt = formState.transaction.master.couponAmt || 0;
    // Net total value of the grid
    const totalNet = (formState.summary.netValue || 0) - (formState.transaction.master.srAmount || 0);
    const round = formState.transaction.master.roundAmount || 0;
    setAddAmount(additionalAmt)
    setCouponAmt(couponAmt);
    setTotal(totalNet);
    setRoundOf(round);
    if(applicationSettings.branchSettings.enableTaxOnBillDiscount){
      const maxTaxPercentage = getMaxTaxPercInItemList()
      setMaxTaxPercentage(maxTaxPercentage)
    }else{
      setMaxTaxPercentage(0);
    }
    if(Number(formState.transaction.master.cashReceived) > 0 ){
      setCashRcvd(Number(formState.transaction.master.cashReceived))
    }
    

  }, [
    formState.transaction.master.couponAmt,
    formState.summary.netValue,
    formState.transaction.master.srAmount,
    formState.transaction.master.roundAmount
  ]);

    useEffect(() => {
    let calculatedNetTotal = (total + addAmount + roundOf) - (couponAmt);
    if (discEnabled) {
      calculatedNetTotal = total - discAmount + taxOnDiscAmount;
    }
    setNetTotal(calculatedNetTotal);
    // Calculate balance
    const totalReceived = cashRcvd;
    setBalance(Math.abs(calculatedNetTotal-(totalReceived + totalQrPayAmount + totalBankCardAmount)));
  }, [total, discAmount, taxOnDiscAmount, cashRcvd, totalQrPayAmount, totalBankCardAmount]);

  const handleAddCashClick =()=>{
    if (balance > 0) {
      if (isBillEdited) {
        setCashRcvd(balance);
      } else {
        setCashRcvd(cashRcvd + balance);
      }
    }
  }

  const handleBillDiscountDownTaxRate = () => {
    if ( !applicationSettings.branchSettings.enableTaxOnBillDiscount || !applicationSettings.branchSettings.maintainKSA_EInvoice){
      return;
    }
    try {
      const taxPercentage = Number(maxTaxPercentage) || 0;
      let billDisc = Number(discAmount) || 0;

      if (taxPercentage > 0) {
        billDisc = billDisc / (1 + taxPercentage / 100);
        billDisc = Number(billDisc.toFixed(4));
        setTaxOnDiscAmount(billDisc);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDiscAmountChange = (value: number) => {
    setDiscAmount(value);
    if (total > 0) {
      setDiscPercent((value / total) * 100);
    }
  };

  const handleDiscPercentChange = (value: number) => {
    setDiscPercent(value);
    setDiscAmount((total * value) / 100);
  };

  const handleDeleteUpiRow = (rowIndex: number) => {
      dispatch(formStateTransactionUpiRemoveRow({index: rowIndex}))
  };

  const handleDeleteBankCardRow = (rowIndex: number) => {
      dispatch(formStateTransactionBankCardRemoveRow({index: rowIndex}))
  };

  useEffect(() => {
    setNetTotal(total-discAmount)
  }, [discAmount]);


    const gridColumnsBankCard: DevGridColumn[] = [
    {
      dataField: "ledgerId",
      caption: t("ledger"),
      dataType: "number",
      allowSorting: true,
      width: 45,
      alignment: "left",
    },
    {
      dataField: "description",
      caption: t("description"),
      dataType: "string",
      allowSorting: true,
      width: 45,
    },
    {
      dataField: "amount",
      caption: t("amount"),
      dataType: "number",
      allowSorting: true,
      width: 45,
    },
    {
      dataField: "paymentTypeID",
      caption: t("upi_type_id"),
      dataType: "string",
      allowSorting: true,
      width: 45,
    },
    {
      dataField: "paymentType",
      caption: t("upi_type"),
      dataType: "string",
      allowSorting: true,
      visible: false,
      width: 45,
    },
    {
      dataField: "paymentName",
      caption: t("upi_type"),
      dataType: "string",
      allowSorting: true,
      width: 45,
    },
    {
    dataField: "x",
    caption: t("actions"),
    dataType: "string",
    alignment: "right",
    width: 80,
    cellRender: (params: any) => {
      const rowIndex = params.rowIndex;
      return (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => handleDeleteBankCardRow(rowIndex)}
            className="p-1 hover:bg-[#FEE2E2] !rounded"
            title={t("delete")}
          >
            <Trash2 size={16} className="text-[#DC2626]" />
          </button>
        </div>
      );
    },
  },
  ]


  const gridColumnsUpi: DevGridColumn[] = [
    {
      dataField: "ledgerId",
      caption: t("ledger"),
      dataType: "number",
      allowSorting: true,
      width: 45,
      alignment: "left",
    },
    {
      dataField: "description",
      caption: t("description"),
      dataType: "string",
      allowSorting: true,
      width: 45,
    },
    {
      dataField: "amount",
      caption: t("amount"),
      dataType: "number",
      allowSorting: true,
      width: 45,
    },
    {
      dataField: "paymentTypeID",
      caption: t("upi_type"),
      dataType: "string",
      allowSorting: true,
      width: 45,
      visible: false
    },
    {
      dataField: "paymentName",
      caption: t("upi_type"),
      dataType: "string",
      allowSorting: true,
      width: 45,
    },
    {
    dataField: "x",
    caption: t("actions"),
    dataType: "string",
    alignment: "right",
    width: 80,
    cellRender: (params: any) => {
      const rowIndex = params.rowIndex;
      return (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => handleDeleteUpiRow(rowIndex)}
            className="p-1 hover:bg-[#FEE2E2] !rounded"
            title={t("delete")}
          >
            <Trash2 size={16} className="text-[#DC2626]" />
          </button>
        </div>
      );
    },
  },
  ]

  const handleQRPayAddClick = () => {
    if(uPIDetails?.amount > balance ){
      ERPAlert.show({
        icon: "info",
        title: t(""),
        showCancelButton: false,
        text: t("upi_amount_greater_than_balance_amount"),
        confirmButtonText: t("ok"),
        onConfirm: ()=> { return }
      });
      return;
    }
    if(uPIDetails?.amount > 0 ){
      const newUpiRow: SettlementDetails = {
        ...uPIDetails,
        ledgerId: formState.transaction.master.ledgerID
      };
      dispatch(formStateTransactionUpiAddRowsAddSingle(newUpiRow));
    }else{
      ERPAlert.show({
        icon: "info",
        title: t(""),
        showCancelButton: false,
        text: t("please_check_balance_amount"),
        confirmButtonText: t("ok"),
        onConfirm: ()=> { return }
      });
    }
  }

  const handleBankCardAddClick =()=> {
    if(bankCardDetails?.amount > balance ){
      ERPAlert.show({
        icon: "info",
        title: t(""),
        text: t("card_amount_is_greater_than_balance_amount"),
        confirmButtonText: t("ok"),
        showCancelButton: false,
        onConfirm: ()=> { return }
      });
      return;
    }
    if(bankCardDetails?.amount > 0 ){
      dispatch(formStateTransactionBankCardAddRowsAddSingle(bankCardDetails));
    }else{
      ERPAlert.show({
        icon: "info",
        title: t(""),
        showCancelButton: false,
        text: t("please_check_balance_amount"),
        confirmButtonText: t("ok"),
        onConfirm: ()=> { return }
      });
    }
    
  }

  const validateAmount = () => {
    if (isNaN(balance)) {
      ERPAlert.show({
        icon: "info",
        title: t(""),
        showCancelButton: false,
        text: t("invalid_balance_amount!"),
        confirmButtonText: t("ok"),
        onConfirm: ()=> { return false; }
      });
    }
    if(!isCreditable && balance > 0 ){
      ERPAlert.show({
        icon: "info",
        title: t(""),
        showCancelButton: false,
        text: t("balance_amount_is_pending!"),
        confirmButtonText: t("ok"),
        onConfirm: ()=> { return false;}
      });
    }
    if(isCreditable && !isExcessCashRcpt && balance < 0 ){
      ERPAlert.show({
        icon: "info",
        title: t(""),
        showCancelButton: false,
        text: t("excess_amount_entered!"),
        confirmButtonText: t("ok"),
        onConfirm: ()=> { return false; }
      });
    }
    return true;
  }



  const handleApply = () => {
    const validate = validateAmount()
    if(validate){
      if(total > 0){
        if(discAmount > total){
          ERPAlert.show({
            icon: "info",
            title: t(""),
            showCancelButton: false,
            text: t("wrong_discount_entered"),
            confirmButtonText: t("ok"),
            onConfirm: ()=> { return false; }
          });
          return
        }
      }
      if(isCreditable === false){
        if(balance > 0 && (cashRcvd + totalBankCardAmount + totalQrPayAmount) > 0){
          ERPAlert.show({
            icon: "info",
            title: t(""),
            showCancelButton: false,
            text: t("insufficient_amount_received!"),
            confirmButtonText: t("ok"),
            onConfirm: ()=> { return false; }
          });
          return;
        }
      }
      if(cashRcvd === 0){
        if(isCreditable && clientSession.isAppGlobal){
          setCashRcvd(0)
        }
      }
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            transaction:{
              master:{
                cashReceived: cashRcvd,
                bankAmt: totalBankCardAmount + totalQrPayAmount,
                billDiscount: discAmount
              }
            },
            formElements: {
              lblBillBalance: {
                ...formState.formElements.lblBillBalance,
                label: balance.toFixed(2)
              }
            }
          },
        })
      )
    }
    onClose();
  };

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={""}
      width={800}
      height={650}
      content={
        <div className="flex flex-row gap-4">
          {/* Left Section - Form */}
          <div className="flex-1 px-4 w-1/2 max-w-1/2">
          <h1 className="text-2xl font-bold text-purple-800 my-3 text-center">{t("tender")}</h1>
            {/* Total */}
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <label className="text-left sm:text-[10px] leading-[12px] font-bold md:text-lg  text-black">{t("total").toUpperCase()}</label>
              <ERPInput
                localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:30, fontColor:"255, 0, 0", borderColor: '200, 200, 200'})}
                id=""
                customSize="customize"
                type="number"
                value={total}
                noLabel={true}
              />
            </div>

            {/* Discount Row */}
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <div className="flex items-center gap-2">
                <ERPCheckbox
                  id="discEnabled"
                  checked={discEnabled}
                  label={t('disc').toUpperCase()}
                  onChange={(e) => setDiscEnabled(e.target.checked)}
                  labelClassName="font-bold text-lg text-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ERPInput
                  localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:25, fontColor:"0, 0, 0", borderColor: '200, 200, 200'})}
                  id="discPercent"
                  customSize="customize"
                  type="number"
                  noLabel={true}
                  value={discPercent}
                  onChange={(e) => handleDiscPercentChange(parseFloat(e.target.value) || 0)}
                  disabled={!discEnabled}
                />
                <ERPInput
                  localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:25, fontColor:"0, 0, 0", borderColor: '200, 200, 200'})}
                  ref={discAmountRef}
                  id="discAmount"
                  customSize="customize"
                  type="number"
                  noLabel={true}
                  value={discAmount}
                  onChange={(e) => handleDiscAmountChange(parseFloat(e.target.value) || 0)}
                  disabled={!discEnabled}
                />
              </div>
            </div>

            {/* Tax on Disc */}
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <label className="text-left text-[10px] leading-[12px] font-semibold md:text-[12px] text-black">{t('tax_on_disc').toUpperCase()}</label>
              <div className="flex gap-2 items-center">
                {/* <ERPDataComboBox
                  id="taxOnDisc"
                  noLabel={true}
                  value={taxOnDisc}
                  onChange={(value) => setTaxOnDisc(value)}
                  options={taxOptions}
                  disabled={!discEnabled}
                /> */}
                {/* This button component is available in footer, can use that component if needed */}
                <button
                  type="button"
                  style={{
                    background: "#8080809c",
                    border: "none",
                    borderRadius: "6px 6px 6px 6px",
                    padding: "0px 0px",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={handleBillDiscountDownTaxRate}
                  >
                  <ChevronUp size={20} color="#fff" />
                </button>

                <ERPInput
                  localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:20, fontColor:"255, 0, 0", borderColor: '200, 200, 200'})}
                  id="taxOnDisc"
                  customSize="customize"
                  type="number"
                  noLabel={true}
                  value={taxOnDiscAmount.toFixed(2)}
                  readOnly={true}
                />
              </div>
            </div>

            {/* Net Total */}
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <label className="text-left text-[10px] leading-[12px] font-semibold md:text-[12px] text-black">{t('net_total').toUpperCase()}</label>
              <ERPInput
                localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:30, fontColor:"255, 0, 0", borderColor: '200, 200, 200'})}
                id="netTotal"
                customSize="customize"
                type="number"
                noLabel={true}
                value={netTotal.toFixed(2)}
                readOnly
              />
            </div>

            {/* Cash Received */}
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <label className="text-left text-[10px] leading-[12px] font-semibold md:text-[12px] text-black">{t('cash_received').toUpperCase()}</label>
              <div className="flex gap-2 items-center">
                <ERPButton
                  className="h-8 bg-[#8080809c] text-blaxk"
                  title={t("add")}
                  onClick={()=> handleAddCashClick() }
                />
              <ERPInput
                localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:25, fontColor:"0, 0, 0", borderColor: '200, 200, 200'})}
                customSize="customize"
                id="cashRcvd"
                type="number"
                noLabel={true}
                value={cashRcvd}
                onChange={(e) => setCashRcvd(parseFloat(e.target.value) || 0)}
              />
              </div>
            </div>

            {/* Card Amount */}
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <div className="flex flex-col items-left">
                <ERPCheckbox
                  id="cardAmtEnabled"
                  label={t("bank_card")}
                  checked={paymentMode === "CARD"}
                  onChange={() => setPaymentMode("CARD")}
                  labelClassName="font-bold text-lg text-black"
                />

                <ERPCheckbox
                  id="upiEnabled"
                  label={t("qr_pay")}
                  checked={paymentMode === "UPI"}
                  onChange={() => setPaymentMode("UPI")}
                  labelClassName="font-bold text-lg text-black"
                />
              </div>

              <div className="flex gap-2 items-center">
                {/* <button className="px-2 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded">
                  <ChevronUp size={16} />
                </button> */}
                <ERPInput
                  localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:25, fontColor:"0, 0, 0", borderColor: '200, 200, 200'})}
                  customSize="customize"
                  id="cardAmt"
                  type="number"
                  noLabel={true}
                  value={totalQrPayAmount+totalBankCardAmount}
                  onChange={(e) => setCardAmt(parseFloat(e.target.value) || 0)}
                  readOnly={true}
                />
              </div>
            </div>

            {/* Balance */}
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <label className="text-left text-[10px] leading-[12px] font-bold md:text-lg text-black">{t('balance').toUpperCase()}</label>
              <ERPInput
                id="balance"
                localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:30, fontColor:"255, 0, 0", borderColor: '200, 200, 200'})}
                customSize="customize"
                type="number"
                noLabel={true}
                value={balance.toFixed(2)}
                readOnly
              />
            </div>

            {/* Apply Button */}
            <div className="flex justify-center py-4">
              <ERPButton
                title={t("apply")}
                onClick={handleApply}
                variant="primary"
                className="w-60"
              />
            </div>
          </div>
        {/* 😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁 */}
          {/* Right Section */}
            {paymentMode === "UPI" &&(
            <div className="flex flex-col flex-1 px-4 w-1/2">

            <h1 className="text-2xl font-bold text-purple-800 my-2 text-center">{t("qrpay")}</h1>
            <div className="flex flex-col">
              <ERPDataComboBox
                id="QrPayType"
                label={t("qr_pay_type")}
                field={{
                  id: "id",
                  getListUrl: `${Urls.inv_transaction_base}${formState.transactionType}/Data/UPIs`,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChange={(e) =>
                  setUPIDetails((prev: any) => {
                    return {
                      ...prev,
                      paymentTypeID : e?.value,
                      paymentName: e?.name
                    }
                  })
                }
              />
              <ERPInput
                id="QrAmount"
                localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:30, marginBottom:0, fontColor:"255, 0, 0", borderColor: '200, 200, 200'})}
                customSize="customize"
                type="number"
                label={t("qrpay_amount")}
                value={uPIDetails?.amount}             
                onChange={(e) =>
                  setUPIDetails((prev: any) => {
                    return {
                      ...prev,
                       amount: e.target?.value
                    }
                  })
                }
              />

              <ERPInput
                id="description"
                type="string"
                label={t("description")}
                className="mb-2"
                value={uPIDetails?.description}             
                onChange={(e) =>
                  setUPIDetails((prev: any) => {
                    return {
                      ...prev,
                       description: e.target?.value
                    }
                  })
                }
              />
              <div className="flex justify-center mt-2">
                <ERPButton
                  title={t("add")}
                  variant="primary"
                  className="w-40"
                  onClick={handleQRPayAddClick}
                />
              </div>
            </div>
            <div className="flex-1">
              <ErpDevGrid
                columns={gridColumnsUpi}
                showChooserOnGridHead
                data={formState.transaction.uPIDetails}
                gridId="TenderUpiGrid"
                height={250}
                hideGridAddButton={true}
                columnHidingEnabled={true}
                hideDefaultExportButton={true}
                hideDefaultSearchPanel={true}
                allowSearching={false}
                allowExport={false}
                hideGridHeader={true}
                enablefilter={false}
                enableScrollButton={false}
                ShowGridPreferenceChooser={false}
                showPrintButton={false}
              />
            </div>
            </div>
            )}

            {/* upi */}
            {paymentMode === "CARD" &&(
            <div className="flex flex-col flex-1 px-4 w-1/2">

            <h1 className="text-2xl font-bold text-purple-800 my-2 text-center">{t("bank_cards")}</h1>
            <div className="flex flex-col">
              <ERPDataComboBox
                id="cardType"
                label={t("card_type")}
                field={{
                  id: "id",
                  getListUrl: `${Urls.inv_transaction_base}${formState.transactionType}/Data/BankCards`,
                  valueKey: "id",
                  labelKey: "name",
                }}
                
                onChange={(e) =>
                  
                  setBankCardDetails((prev: any) => {
                    return {
                      ...prev,
                      paymentTypeID : e?.value,
                      paymentName: e?.name
                    }
                  })
                }
              />
              <ERPCheckbox
                  id="ledgerId"
                  checked={ledgerEnabled}
                  label={t('ledger')}
                  onChange={(e) => setLedgerEnabled(e.target.checked)}
                  labelClassName="font-bold text-lg text-black"
                />
              <ERPDataComboBox
                  id=""
                  field={{
                    id: "ledgerID",
                    required: true,
                    getListUrl: Urls.data_BankAccounts,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  label={t("ledger")}
                  value={bankCardDetails.ledgerId || -2}
                  onChange={(e) =>
                    setBankCardDetails((prev: any) => {
                      return {
                        ...prev,
                        ledgerId: e?.value
                      }
                    })
                  }
                  disabled={!ledgerEnabled}
                />
              <ERPInput
                id="CardAmount"
                localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:30, fontColor:"255, 0, 0", borderColor: '200, 200, 200'})}
                customSize="customize"
                type="number"
                label={t("card_amount")}
                value={bankCardDetails?.amount}
                onChange={(e) =>
                  setBankCardDetails((prev: any) => {
                    return {
                      ...prev,
                       amount: e.target?.value
                    }
                  })
                }
              />
              <ERPInput
                id="description"
                type="string"
                label={t("description")}
                value={bankCardDetails?.description}
                onChange={(e) =>
                  setBankCardDetails((prev: any) => {
                    return {
                      ...prev,
                       description: e.target?.value
                    }
                  })
                }
              />
              <div className="flex justify-center mt-2">
                <ERPButton
                  title={t("add")}
                  variant="primary"
                  className="w-40"
                  onClick={handleBankCardAddClick}
                />
              </div>
            </div>
            <div className="flex-1">
              <ErpDevGrid
                columns={gridColumnsBankCard}
                data={formState.transaction.bankCardDetails}
                gridId="TenderBankCardPaymentGrid"
                height={250}
                hideGridAddButton={true}
                columnHidingEnabled={true}
                hideDefaultExportButton={true}
                hideDefaultSearchPanel={true}
                allowSearching={false}
                allowExport={false}
                hideGridHeader={true}
                enablefilter={false}
                enableScrollButton={false}
                ShowGridPreferenceChooser={false}
                showPrintButton={false}
              />
            </div>
            </div>
            )}
        </div>
      }
    />
  );
};

export default Tender;