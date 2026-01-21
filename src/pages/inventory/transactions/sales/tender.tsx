import React, { useState, useRef, useEffect } from "react";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPDataComboBox from "../../../../components/ERPComponents/erp-data-combobox";
import { ChevronDown, Trash2, CreditCard, Smartphone } from "lucide-react";
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
  const [discEnabled, setDiscEnabled] = useState<boolean>(true);
  const [ledgerEnabled, setLedgerEnabled] = useState<boolean>(false);
  const [discAmount, setDiscAmount] = useState<number>(0);
  const [discPercent, setDiscPercent] = useState<number>(0);
  const [taxOnDiscAmount, setTaxOnDiscAmount] = useState<number>(0);
  const [cardAmt, setCardAmt] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const formState = useSelector((state:RootState) => state.InventoryTransaction)
  const discAmountRef = useRef<HTMLInputElement>(null);

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
      console.log(err)
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
    // Attach the master cash received value
    if(Number(formState.transaction.master.cashReceived) > 0 ){
      setCashRcvd(Number(formState.transaction.master.cashReceived))
    }
    // Attach the master discount value
    if(Number(formState.transaction.master.billDiscount) > 0 ){
      setDiscAmount(Number(formState.transaction.master.billDiscount))
    }
    

  }, [
    formState.transaction.master.couponAmt,
    formState.summary.netValue,
    formState.transaction.master.srAmount,
    formState.transaction.master.roundAmount
  ]);

    useEffect(() => {
    let calculatedNetTotal = (total + addAmount + roundOf) - (couponAmt);
    calculatedNetTotal = total - discAmount + taxOnDiscAmount;
    setNetTotal(calculatedNetTotal);
    // Calculate balance
    const totalReceived = cashRcvd;
    setBalance(calculatedNetTotal-(totalReceived + totalQrPayAmount + totalBankCardAmount));
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
      caption: t("card_type_id"),
      dataType: "string",
      allowSorting: true,
      width: 45,
      visible: false,
    },
    {
      dataField: "paymentName",
      caption: t("card_type"),
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
      caption: t("upi_type_id"),
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

  const upiValidate = () =>{
    if(uPIDetails?.amount > balance ){
      ERPAlert.show({
        icon: "info",
        title: t("upi_amount_greater_than_balance_amount"),
        showCancelButton: false,
        text: t(""),
        confirmButtonText: t("ok"),
      });
      return false;
    }
    return true;
  }

  const handleQRPayAddClick = () => {
    const validate = upiValidate()
    if(validate){
      if(uPIDetails?.amount > 0 ){
      dispatch(formStateTransactionUpiAddRowsAddSingle(uPIDetails));
    }else{
      ERPAlert.show({
        icon: "info",
        title: t("please_check_balance_amount"),
        showCancelButton: false,
        text: t(""),
        confirmButtonText: t("ok"),
        onConfirm: ()=> { return false }
      });
      return false;
    }
  }
  }

  const handleBankCardAddClick =()=> {
    if(bankCardDetails?.amount > balance ){
      ERPAlert.show({
        icon: "info",
        title: t("card_amount_is_greater_than_balance_amount"),
        text: t(""),
        confirmButtonText: t("ok"),
        showCancelButton: false,
        onConfirm: ()=> { return false }
      });
      return false;
    }
    if(bankCardDetails?.amount > 0 ){
      dispatch(formStateTransactionBankCardAddRowsAddSingle(bankCardDetails));
    }else{
      ERPAlert.show({
        icon: "info",
        title: t("please_check_balance_amount"),
        showCancelButton: false,
        text: t(""),
        confirmButtonText: t("ok"),
        onConfirm: ()=> { return false }
      });
      return false;
    }
    
  }

  const validateAmount = () => {
    if (isNaN(balance)) {
      ERPAlert.show({
        icon: "info",
        title: t("invalid_balance_amount!"),
        showCancelButton: false,
        text: t(""),
        confirmButtonText: t("ok"),
        onConfirm: ()=> { return false; }
      });
      return false;
    }
    if(!isCreditable && balance > 0 ){
      ERPAlert.show({
        icon: "info",
        title: t("balance_amount_is_pending!"),
        showCancelButton: false,
        text: t(""),
        confirmButtonText: t("ok"),
        onConfirm: ()=> { return false}
      });
      return false;
    }
    if(isCreditable && !isExcessCashRcpt && balance < 0 ){
      ERPAlert.show({
        icon: "info",
        title: t("excess_amount_entered!"),
        showCancelButton: false,
        text: t(""),
        confirmButtonText: t("ok"),
        onConfirm: ()=> { return false; }
      });
      return false;
    }
    if(total > 0){
        if(discAmount > total){
          ERPAlert.show({
            icon: "info",
            title: t("wrong_discount_entered"),
            showCancelButton: false,
            text: t(""),
            confirmButtonText: t("ok"),
            onConfirm: ()=> { return false; }
          });
          return false
        }
      }
      if(isCreditable === false){
        if(balance > 0 && (cashRcvd + totalBankCardAmount + totalQrPayAmount) > 0){
          ERPAlert.show({
            icon: "info",
            title: t("insufficient_amount_received!"),
            showCancelButton: false,
            text: t(""),
            confirmButtonText: t("ok"),
            onConfirm: ()=> { return false; }
          });
          return false;
        }
      }
      if(cashRcvd === 0){
        if(isCreditable && clientSession.isAppGlobal){
          setCashRcvd(0)
        }
      }
      return true;
  }
  const handleApply = () => {
    const validate = validateAmount()
    if(validate){
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            // tenderApplied: true,  // Just checking a condition test-purpose
            transaction:{
              master:{
                cashReceived: cashRcvd,
                bankAmt: totalBankCardAmount + totalQrPayAmount,
                billDiscount: discAmount
              }
            },
          },
        })
      )
      onClose();
    }
  };

  return (
    <ERPModal
      key={paymentMode || "none"}
      isOpen={isOpen}
      closeModal={onClose}
      title={""}
      width={(paymentMode === "CARD" || paymentMode === "UPI") ? 930 : 480}
      height={(paymentMode==="CARD" || paymentMode==="UPI") ? 700 : 700}
      content={
        <div className="flex flex-row gap-4">
          {/* Left Section - Form */}
          <div className="flex-1 w-1/2 max-w-1/2 bg-white rounded-xl px-4">
            <h1 className="text-2xl font-bold text-black my-2 text-center">{t("tender").toUpperCase()}</h1>

            {/* Total */}
            <div className="mb-2">
              <label className="text-black text-xs font-medium mb-1 block">{t("total")}</label>
              <input
                type="text"
                value={total.toFixed(2)}
                readOnly
                className="w-full bg-gray-100 text-red-500 text-right text-2xl font-bold px-3 py-2 rounded-md border border-gray-200 outline-none"
              />
            </div>

            {/* Discount Row */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={discEnabled}
                  onChange={(e) => setDiscEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-black text-xs font-medium">{t('disc')}</span>
              </div>
              <div className="flex gap-2 w-full">
                <input
                  type="number"
                  min="0"
                  value={Number(discPercent.toFixed(2))}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    handleDiscPercentChange(val < 0 ? 0 : val);
                  }}
                  disabled={!discEnabled}
                  placeholder="%"
                  className="w-1/2 min-w-0 bg-gray-100 text-black text-right text-lg font-semibold px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-blue-400 disabled:bg-gray-200 disabled:opacity-60"
                />
                <input
                  ref={discAmountRef}
                  type="number"
                  min="0"
                  value={discAmount}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    handleDiscAmountChange(val < 0 ? 0 : val);
                  }}
                  disabled={!discEnabled}
                  className="w-1/2 min-w-0 bg-gray-100 text-black text-right text-lg font-semibold px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-blue-400 disabled:bg-gray-200 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Tax on Disc */}
            <div className="mb-2">
              <label className="text-black text-xs font-medium mb-1 block">{t('tax_on_disc')}</label>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 p-2 rounded-md transition-colors flex-shrink-0"
                  onClick={handleBillDiscountDownTaxRate}
                >
                  <ChevronDown size={16} color="#fff" />
                </button>
                <input
                  type="text"
                  value={taxOnDiscAmount.toFixed(2)}
                  readOnly
                  className="flex-1 min-w-0 bg-gray-100 text-red-500 text-right text-base font-medium px-3 py-2 rounded-md border border-gray-200 outline-none"
                />
              </div>
            </div>

            {/* Net Total */}
            <div className="mb-2">
              <label className="text-black text-xs font-medium mb-1 block">{t('net_total')}</label>
              <input
                type="text"
                value={netTotal.toFixed(2)}
                readOnly
                className="w-full bg-gray-100 text-black text-right text-2xl font-bold px-3 py-2 rounded-md border border-gray-200 outline-none"
              />
            </div>

            {/* Cash Received */}
            <div className="mb-2">
              <label className="text-black text-xs font-medium mb-1 block">{t('cash_received')}</label>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-2 rounded-md transition-colors flex-shrink-0"
                  onClick={()=> handleAddCashClick()}
                >
                  {t("add")}
                </button>
                <input
                  type="number"
                  min="0"
                  value={cashRcvd}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setCashRcvd(val < 0 ? 0 : val);
                  }}
                  className="flex-1 min-w-0 bg-gray-100 text-black text-right text-xl font-semibold px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Bank Card */}
            <div
              className={`flex items-center justify-between p-3 mb-2 rounded-md border cursor-pointer transition-colors ${
                paymentMode === "CARD"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-100 hover:bg-gray-50"
              }`}
              onClick={() => setPaymentMode(paymentMode === "CARD" ? null : "CARD")}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={paymentMode === "CARD"}
                  onChange={() => {}}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <CreditCard size={18} className="text-gray-500" />
                <span className="text-black text-sm font-medium">{t("bank_card")}</span>
              </div>
              <span className="text-blue-500 font-bold text-lg">{totalBankCardAmount.toFixed(1)}</span>
            </div>

            {/* UPI */}
            <div
              className={`flex items-center justify-between p-3 mb-3 rounded-md border cursor-pointer transition-colors ${
                paymentMode === "UPI"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-100 hover:bg-gray-50"
              }`}
              onClick={() => setPaymentMode(paymentMode === "UPI" ? null : "UPI")}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={paymentMode === "UPI"}
                  onChange={() => {}}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <Smartphone size={18} className="text-gray-500" />
                <span className="text-black text-sm font-medium">{t("qr_pay")}</span>
              </div>
              <span className="text-blue-500 text-lg font-semibold">{totalQrPayAmount.toFixed(1)}</span>
            </div>

            {/* Balance */}
            <div className="mb-2">
              <label className="text-black text-xs font-medium mb-1 block">{t('balance')}</label>
              <input
                type="text"
                value={balance.toFixed(2)}
                readOnly
                className="w-full bg-gray-100 text-red-500 text-right text-2xl font-bold px-3 py-2 rounded-md border border-gray-200 outline-none"
              />
            </div>

            {/* Apply Button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleApply}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-base"
              >
                {t("apply")}
              </button>
            </div>
          </div>
          {/* Right Section */}
            {paymentMode === "UPI" &&(
            <div className="flex flex-col flex-1 w-1/2">
              <h1 className="text-2xl font-bold text-purple-800 my-2 text-center">{t("qr_pay")}</h1>

              {/* Add New Payment Card */}
              <div className="bg-gray-50 rounded-lg p-4 mb-2">

                {/* QR Pay Type */}
                <div className="mb-3">
                  <label className="text-black text-xs font-medium mb-1 block">{t("qr_pay_type")}</label>
                  <ERPDataComboBox
                    id="QrPayType"
                    noLabel={true}
                    variant="outlined"
                    className="tender-combobox"
                    style={{ backgroundColor: 'white', borderRadius: '6px' }}
                    field={{
                      id: "id",
                      getListUrl: `${Urls.inv_transaction_base}${formState.transactionType}/Data/UPIs`,
                      valueKey: "id",
                      labelKey: "name",
                      nameKey: "alias",
                    }}
                    value={uPIDetails.paymentTypeID || -2}
                    onChange={(e) =>
                      setUPIDetails((prev: any) => {
                        return {
                          ...prev,
                          paymentTypeID: e?.value,
                          paymentName: e?.label,
                          ledgerId: Number(e?.name)
                        }
                      })
                    }
                  />
                </div>

                {/* Amount */}
                <div className="mb-3">
                  <label className="text-black text-xs font-medium mb-1 block">{t("amount")}</label>
                  <input
                    type="number"
                    value={Number(Number(uPIDetails?.amount).toFixed(2))}
                    onChange={(e) =>
                      setUPIDetails((prev: any) => {
                        return {
                          ...prev,
                          amount: e.target?.value
                        }
                      })
                    }
                    className="w-full bg-white text-black text-right text-base font-medium px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-blue-400"
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="text-black text-xs font-medium mb-1 block">{t("description")}</label>
                  <input
                    type="text"
                    value={uPIDetails?.description || ''}
                    onChange={(e) =>
                      setUPIDetails((prev: any) => {
                        return {
                          ...prev,
                          description: e.target?.value
                        }
                      })
                    }
                    className="w-full bg-white text-black text-base font-medium px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-blue-400"
                  />
                </div>

                {/* Add Payment Button */}
                <button
                  type="button"
                  onClick={handleQRPayAddClick}
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>+</span> {t("add_payment")}
                </button>
              </div>

              {/* Grid */}
              <div className="flex-1">
                <ErpDevGrid
                  columns={gridColumnsUpi}
                  showChooserOnGridHead
                  chooserClass="absolute z-10 pointer-events-auto mt-4"
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

            {/* Bank Card */}
            {paymentMode === "CARD" &&(
            <div className="flex flex-col flex-1 w-1/2">
              <h1 className="text-2xl font-bold text-purple-800 my-2 text-center">{t("bank_cards")}</h1>

              {/* Add New Payment Card */}
              <div className="bg-gray-50 rounded-lg p-4 mb-2">

                {/* Card Type */}
                <div className="mb-2">
                  <label className="text-black text-xs font-medium mb-1 block">{t("card_type")}</label>
                  <ERPDataComboBox
                    id="cardType"
                    noLabel={true}
                    variant="outlined"
                    className="tender-combobox"
                    style={{ backgroundColor: 'white', borderRadius: '6px' }}
                    field={{
                      id: "id",
                      getListUrl: `${Urls.inv_transaction_base}${formState.transactionType}/Data/BankCards`,
                      valueKey: "id",
                      labelKey: "name",
                      nameKey: "alias",
                    }}
                    value={bankCardDetails.paymentTypeID || -2}
                    onChange={(e) =>
                      setBankCardDetails((prev: any) => {
                        return {
                          ...prev,
                          paymentTypeID: e?.value,
                          paymentName: e?.name,
                          ledgerId: Number(e?.name)
                        }
                      })
                    }
                  />
                </div>
                {/* Ledger Row */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={ledgerEnabled}
                      onChange={(e) => setLedgerEnabled(e.target.checked)}
                      className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-black text-xs font-medium">{t('ledger')}</label>
                  </div>
                  <ERPDataComboBox
                    id="ledgerCombo"
                    noLabel={true}
                    variant="outlined"
                    className="tender-combobox"
                    style={{ backgroundColor: 'white', borderRadius: '6px' }}
                    field={{
                      id: "ledgerID",
                      required: true,
                      getListUrl: Urls.data_BankAccounts,
                      valueKey: "id",
                      labelKey: "name",
                    }}
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
                </div>

                {/* Amount */}
                <div className="mb-2">
                  <label className="text-black text-xs font-medium mb-1 block">{t("amount")}</label>
                  <input
                    type="number"
                    value={bankCardDetails?.amount || 0}
                    onChange={(e) =>
                      setBankCardDetails((prev: any) => {
                        return {
                          ...prev,
                          amount: e.target?.value
                        }
                      })
                    }
                    className="w-full bg-white text-black text-right text-base font-medium px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-blue-400"
                  />
                </div>

                {/* Description */}
                <div className="mb-2">
                  <label className="text-black text-xs font-medium mb-1 block">{t("description")}</label>
                  <input
                    type="text"
                    value={bankCardDetails?.description || ''}
                    onChange={(e) =>
                      setBankCardDetails((prev: any) => {
                        return {
                          ...prev,
                          description: e.target?.value
                        }
                      })
                    }
                    className="w-full bg-white text-black text-base font-medium px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-blue-400"
                  />
                </div>

                

                {/* Add Payment Button */}
                <button
                  type="button"
                  onClick={handleBankCardAddClick}
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>+</span> {t("add_payment")}
                </button>
              </div>

              {/* Grid */}
              <div className="flex-1">
                <ErpDevGrid
                  columns={gridColumnsBankCard}
                  showChooserOnGridHead
                  chooserClass="absolute z-10 pointer-events-auto mt-4"
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