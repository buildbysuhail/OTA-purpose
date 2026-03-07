import React, { useState, useRef, useEffect } from "react";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPDataComboBox from "../../../../components/ERPComponents/erp-data-combobox";
import { ChevronDown, Trash2, CreditCard, Smartphone, ChevronUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { initialSettlement } from "../transaction-type-data";
import Urls from "../../../../redux/urls";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { formStateHandleFieldChangeKeysOnly, formStateTransactionBankCardAddRowsAddSingle, formStateTransactionBankCardRemoveRow, formStateTransactionUpiAddRowsAddSingle, formStateTransactionUpiRemoveRow } from "../reducer";
import { SettlementDetails } from "../transaction-types";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { APIClient } from "../../../../helpers/api-client";
import { resolveTenderPromise } from "./use-transaction";

interface TenderProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const api = new APIClient();
const Tender: React.FC<TenderProps> = ({ isOpen, onClose, t}) => {
  const dispatch = useAppDispatch();
  const formState = useSelector((state:RootState) => state.InventoryTransaction);
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
  const clientSession = useAppSelector((state: RootState) => state.ClientSession);
  const [discEnabled, setDiscEnabled] = useState<boolean>(true);
  const [ledgerEnabled, setLedgerEnabled] = useState<boolean>(false);
  const [discAuthModalOpen, setDiscAuthModalOpen] = useState<boolean>(false);
  const [initialDiscount, setInitialDiscount] = useState<number>(0);
  const [discAmount, setDiscAmount] = useState<number>(0);
  const [discPercent, setDiscPercent] = useState<number>(0);
  const [taxOnDiscAmount, setTaxOnDiscAmount] = useState<number>(0);
  const [cardAmt, setCardAmt] = useState<number>(0);
  const [cardEnabled, setCardEnabled] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const discAmountRef = useRef<HTMLInputElement | null>(null);
  const cashRcvdRef = useRef<HTMLInputElement | null>(null);
  const applyBtnRef = useRef<HTMLButtonElement | null>(null);

  const [couponAmt, setCouponAmt] = useState(0);
  const [addAmount, setAddAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [roundOf, setRoundOf] = useState(0);
  const [maxTaxPercentage, setMaxTaxPercentage] = useState(0);
  const [netTotal, setNetTotal] = useState<number>(0);
  const [cashRcvd, setCashRcvd] = useState<number>(0);
  const [uPIDetails, setUPIDetails] = useState<SettlementDetails>(initialSettlement);
  const [bankCardDetails, setBankCardDetails] = useState<SettlementDetails>(initialSettlement);
  const [paymentMode, setPaymentMode] = useState<"CARD" | "UPI" | null>(null);
  const [disableSettlement, setDisableSettlement] = useState(false);
  let isBillEdited = formState.transaction.master.invTransactionMasterID > 0  // Found in 1050, but check is using
  let isCreditable = false   // Found in 1050, but check is using!
  let isExcessCashRcpt = false  // Found in 1050, but check is using
  const allowMultiPayment = applicationSettings.accountsSettings.allowMultiPayments;
  const [isCashOrBank, setIsCashOrBank] = useState(false)
  const [discAuthPassword, setDiscAuthPassword] = useState("")
  const authResolveRef = useRef<((value: boolean) => void) | null>(null);

  // Calculate total Qr and Bank card amount in tender Global
  const totalQrPayAmount =formState.transaction.uPIDetails?.reduce((sum: number, row: SettlementDetails) => sum + Number(row.amount || 0), 0 ) || 0;
  const totalBankCardAmount =formState.transaction.bankCardDetails?.reduce((sum: number, row: SettlementDetails) => sum + Number(row.amount || 0), 0 ) || 0;

  const [upiList, setUpiList] = useState([]);
  const [bankCards, setBankCards] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        discAmountRef.current?.focus();
        discAmountRef.current?.select();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Load Banc Card Details
  useEffect(() => {
    const loadBankCards = async () => {
      const response = await api.getAsync(
        `${Urls.inv_transaction_base}${formState.transactionType}/Data/BankCards`
      );
      const data = await response;
      if (data && data.length > 0) {
        setBankCards(data);
        const defaultCard = data[0];
        setBankCardDetails((prev: any) => ({
          ...prev,
          paymentTypeID: defaultCard.id,
          paymentName: defaultCard.name,
          ledgerId: Number(defaultCard.alias)
        }));
      }
    };

    loadBankCards();
  }, []);

  // Load UPI details
  useEffect(() => {
    const loadUPIs = async () => {
      const response = await api.getAsync(
        `${Urls.inv_transaction_base}${formState.transactionType}/Data/UPIs`
      );
      const data = await response;
      if (data && data.length > 0) {
        setUpiList(data);
        const defaultUPI = data[0];
        setUPIDetails((prev: any) => ({
          ...prev,
          paymentTypeID: defaultUPI.id,
          paymentName: defaultUPI.name,
          ledgerId: Number(defaultUPI.alias)
        }));
      }
    };
    loadUPIs();
  }, []);


  // Function For getting maximum vat percentage for tax on disc
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

  // Password Encryption test concept function - Code is pending
  const testEncryptFunction = (password : string) => {
    let encryptedPassword = password;
    return encryptedPassword;
  }

  // Discount amount authorize click function
  const handleAuthorize = async (action: string)=>{
    if(discAuthPassword === ""){
      ERPAlert.show({
        icon: "info",
        title: t("authorization_required"),
        showCancelButton: false,
        text: t(""),
        confirmButtonText: t("ok"),
      });
      authResolveRef.current?.(false);
      authResolveRef.current = null;
      return false;
    }else{
      const encryptPassword = testEncryptFunction(discAuthPassword) 
      try{
        // Finalize the end point after discussion - the end point is not correct
        const res = await api.postAsync(`${Urls.authorization_settings}`,{password: encryptPassword,action: action,formCode: "",});

        if(res.isOk === true){
          setDiscAuthModalOpen(false);
          setDiscAuthPassword("");
          authResolveRef.current?.(true);
          authResolveRef.current = null;
          return true;
        }else{
          ERPAlert.show({
            icon: "info",
            title: t("authorization_failed"),
            showCancelButton: false,
            text: t(""),
            confirmButtonText: t("ok"),
          });
          authResolveRef.current?.(false);
          authResolveRef.current = null;
          return false;
        }


      }catch{
         console.log("Error in discount Authorization")
         authResolveRef.current?.(false);
         authResolveRef.current = null;
      }
    }
  }

  useEffect(() => {
    const additionalAmt = formState.transaction.master.adjustmentAmount; // Additional amount
    const couponAmt = formState.transaction.master.couponAmt || 0;  // Coupon anount
    const initialCardAmount = formState.transaction.master.bankAmt;
    const isFromSave = formState.tenderWindow?.isFromSave;

    const round = formState.transaction.master.roundAmount || 0; // round amount
    const taxOnDiscValue = Number(formState.transaction.master.taxOnDiscount) || 0;
    let totalNet = 0;
    if(allowMultiPayment){
      totalNet = (formState.summary.total || 0) - (formState.transaction.master.srAmount || 0); // Total summary value is using Now check It
      totalNet = totalNet + additionalAmt + round - couponAmt;
    }else{
      if(isFromSave){
        totalNet = (formState.summary.total || 0) - (formState.transaction.master.srAmount || 0)
        totalNet = totalNet + additionalAmt + round - couponAmt;
      }else{
        totalNet = formState.summary.netValue || 0;
        totalNet = totalNet + additionalAmt;
      }
    }

    if(isFromSave && !allowMultiPayment){
       if(initialCardAmount > 0){
        setCardEnabled(true)
       }
       setCardAmt(initialCardAmount)
    }
    // Set the values into state initially
    setAddAmount(additionalAmt)
    setCouponAmt(couponAmt);
    setTotal(totalNet);
    setRoundOf(round);
    setTaxOnDiscAmount(taxOnDiscValue)
    // Set maxTaxPercentage from settings
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
      setInitialDiscount(Number(formState.transaction.master.billDiscount)) // Storing the master value for auth use
    }
    

  }, [formState.transaction.master.couponAmt,formState.summary.netValue,formState.transaction.master.srAmount,formState.transaction.master.roundAmount]);
    // Calculating the balance amount
    useEffect(() => {
      // Net total calculation
      let calculatedNetTotal = (total + addAmount + roundOf) - (couponAmt);
      calculatedNetTotal = total - discAmount - taxOnDiscAmount;
      // Set net Total value
      setNetTotal(Number(calculatedNetTotal.toFixed(applicationSettings.mainSettings.decimalPoints)));
      const totalReceived = cashRcvd;
      const cardAmount = cardEnabled ? cardAmt : 0;
      // Calculate balance value
      const calculatedBalance = calculatedNetTotal-(totalReceived + totalQrPayAmount + totalBankCardAmount + cardAmount)
      setBalance(Number(calculatedBalance.toFixed(applicationSettings.mainSettings.decimalPoints)));
      if(allowMultiPayment){
        const initialCardAmount = formState.transaction.master.bankAmt;
        const isFromSave = formState.tenderWindow?.isFromSave;
        if(initialCardAmount > 0){
          if(isFromSave){
            setBankCardDetails((prev: any) => {
            return {
              ...prev,
              amount: calculatedBalance
            }
          })
          }

        setPaymentMode("CARD")
      }
      }
    }, [total, discAmount, taxOnDiscAmount, cashRcvd, totalQrPayAmount, totalBankCardAmount, cardAmt, cardEnabled]);

  // cash received button click 
  const handleAddCashClick =()=>{
    if (balance > 0) {
      if (isBillEdited) {
        setCashRcvd(balance);
      } else {
        setCashRcvd(cashRcvd + balance);
      }
    }
  }

  // Initially setting the isCashOrBank from - CheckIsLedgerUnderCashOrBank
  useEffect(() => {
    const ledgerId = formState.transaction.master.ledgerID;
    if (!ledgerId || ledgerId === 0) return;
    const checkCashOrBank = async () => {
      const isCashOrBank = await api.getAsync(`${Urls.inv_transaction_base}${formState.transactionType}/IsCashOrBank/${ledgerId}`);
      setIsCashOrBank(isCashOrBank)
    };
    checkCashOrBank();
  }, [formState.transaction.master.ledgerID]);

  // Tax on bill discount button click function
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

  // Discount amount value change function
  const handleDiscAmountChange = (value: number) => {
    setDiscAmount(value);
    if (total > 0) {
      setDiscPercent(0);
    }
  };

  // Discount percentage value change function
  const handleDiscPercentChange = (value: number) => {
    setDiscPercent(value);
    setDiscAmount(Number(((total * value) / 100).toFixed(applicationSettings.mainSettings.decimalPoints)));
  };

  // Delete row from upi details grid
  const handleDeleteUpiRow = (rowIndex: number) => {
      dispatch(formStateTransactionUpiRemoveRow({index: rowIndex}))
  };

  // Delete row from bank card details grid
  const handleDeleteBankCardRow = (rowIndex: number) => {
      dispatch(formStateTransactionBankCardRemoveRow({index: rowIndex}))
  };
    // Bank card grid columns
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

  // Upi grid columns
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

  // Upi add click validate function
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

  // Function for add click in QRPay
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

  // Validate Bank card Section
  const validateCardTypeAndLedger = (): boolean => {
    if (!ledgerEnabled) {
      // Card type not selected
      if (bankCardDetails.paymentTypeID === 0) {
        ERPAlert.show({
          icon: "info",
          title: t("please_specify_the_cardType!"),
          showCancelButton: false,
          text: "",
          confirmButtonText: t("ok"),
        });

        setDisableSettlement(true);
        return false;
      }else{
        setDisableSettlement(false)
      }
      // Card selected but ledger not found
      if (bankCardDetails.ledgerId <= 0) {
        ERPAlert.show({
          icon: "info",
          title: t("ledger_not_found_please_check!"),
          showCancelButton: false,
          text: "",
          confirmButtonText: t("ok"),
        });
        return false;
      }
    }
    else {
      if (bankCardDetails.paymentTypeID === 0) {
        ERPAlert.show({
          icon: "info",
          title: t("please_specify_the_cardType!"),
          showCancelButton: false,
          text: "",
          confirmButtonText: t("ok"),
        });

        setDisableSettlement(true);
        return false;
      }else{
        setDisableSettlement(false)
      }
    }
    return true;
  };

  // Validate UPI section
  const validateUPIAndLedger = (): boolean => {
      if (bankCardDetails.paymentTypeID === 0) {
        if(clientSession.isAppGlobal){
          ERPAlert.show({
          icon: "info",
          title: t("please_specify_the_upi_type!"),
          showCancelButton: false,
          text: "",
          confirmButtonText: t("ok"),
        });
        setDisableSettlement(true);
        return false;
        }else{
          ERPAlert.show({
          icon: "info",
          title: t("please_specify_the_qr_type_type!"),
          showCancelButton: false,
          text: "",
          confirmButtonText: t("ok"),
        });

        setDisableSettlement(true);
        return false;
        }
      }else{
      setDisableSettlement(false)
      }
      // Check the below ledger is need to be in gcc and global
      // if (bankCardDetails.ledgerId <= 0) {
      //   ERPAlert.show({
      //     icon: "info",
      //     title: t("ledger_not_found_please_check!"),
      //     showCancelButton: false,
      //     text: "",
      //     confirmButtonText: t("ok"),
      //   });

      //   return false;
      // }

    return true;
  };


  // Function for add click in BAnk card
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
      if (!validateCardTypeAndLedger()) {
        return false;
      }
    if(bankCardDetails?.amount > 0 ){
      dispatch(formStateTransactionBankCardAddRowsAddSingle(bankCardDetails));
      setBankCardDetails((prev: any) => {
          return {
            ...prev,
            amount: 0
          }
        })
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

  // Discount auth modal open
  const openAuthModal = (): Promise<boolean> => {
    return new Promise((resolve) => {
      authResolveRef.current = resolve;
      setDiscAuthModalOpen(true);
    });
  };

  let updatedCash = cashRcvd;
  const validateAmount = async () => {
    // Common validation condition for tender, tender global
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
    // if tender global condition true
    if(allowMultiPayment){
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
    // Tender not global condition
    }else{
      // authorization - frm tender - complete the working and check it
      if(initialDiscount === 0 || initialDiscount !== discAmount ){
        if(applicationSettings.inventorySettings.blockBillDiscount === "If Authentication Fails"){
          if(discAmount > 0 && discAmount > applicationSettings.inventorySettings.discontAuthorizationIfDiscountAbove){
            const isAuthorized = await openAuthModal();
            if (!isAuthorized) {
              return false;
            }
          }
        }
      }
      if(cardAmt> netTotal){
        if(cardAmt>0){
          ERPAlert.show({
            icon: "info",
            title: t("excess_card_amount_entered"),
            showCancelButton: false,
            text: t(""),
            confirmButtonText: t("ok"),
            onConfirm: ()=> { return false; }
          });
          return false;

        }

      }
      if (!isCashOrBank && applicationSettings.accountsSettings.showTenderDialogForParty){
        if(!isExcessCashRcpt && (cashRcvd+cardAmt > netTotal)){
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
      }
      if (isCreditable === false && isCashOrBank === true){
        if(balance > 0 && (cashRcvd + cardAmt) > 0){
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
          updatedCash = 0;
        }else if(isCashOrBank){
          updatedCash = netTotal;
        }
      }
    }
      return true;
  }
  // Apply button function in tender both
  const handleApply = async () => {
    const validate = await validateAmount()
    if(validate){
      const cardAmount = cardEnabled ? cardAmt : 0;
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            transaction:{
              master:{
                cashReceived: updatedCash,
                bankAmt: totalBankCardAmount + totalQrPayAmount + cardAmount,
                billDiscount: discAmount
              }
            },
          },
        })
      )
      resolveTenderPromise({
        bankCardDetails:formState.transaction.bankCardDetails,
        upiDetails: formState.transaction.uPIDetails,
        cashReceived: updatedCash,
        bankAmt: totalBankCardAmount + totalQrPayAmount + cardAmount,
        billDiscount: discAmount
      });
      onClose();
    }
  };

  return (
    <>
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
                value={Number(total??0).toFixed(2)}
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
                  value={Number(Number(discPercent??0))}
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      setTimeout(() => {
                        if (cashRcvdRef.current) {
                          cashRcvdRef.current.focus();
                          cashRcvdRef.current.select();
                        }
                      }, 0);
                    }
                  }}
                  type="number"
                  min="0"
                  value={discAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
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
                  type="number"
                  value={Number(taxOnDiscAmount??0).toFixed(2)}
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
                value={Number(netTotal??0).toFixed(2)}
                readOnly
                className="w-full bg-gray-100 text-black text-right text-2xl font-bold px-3 py-2 rounded-md border border-gray-200 outline-none"
              />
            </div>

            {/* Cash Received */}
            <div className="mb-2">
              <label className="text-black text-xs font-medium mb-1 block">{t('cash_received')}</label>
              <div className="flex gap-2 items-center">
                {allowMultiPayment && (
                  <button
                    type="button"
                    className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-2 rounded-md transition-colors flex-shrink-0"
                    onClick={handleAddCashClick}
                  >
                  {t("add").toUpperCase()}
                  </button>
                )}
                <input
                  ref={cashRcvdRef}
                  type="number"
                  min="0"
                  value={Number(cashRcvd)}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setCashRcvd(val < 0 ? 0 : val);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      setTimeout(() => {
                        applyBtnRef.current?.focus();
                      }, 0);
                    }
                  }}
                  className="flex-1 min-w-0 bg-gray-100 text-black text-right text-xl font-semibold px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Bank Card */}
            {allowMultiPayment === true ?
            <div>
            <div
              className={`flex items-center justify-between p-3 mb-2 rounded-md border cursor-pointer transition-colors ${
                paymentMode === "CARD"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-100 hover:bg-gray-50"
              }`}
              onClick={() => {
                setPaymentMode(paymentMode === "CARD" ? null : "CARD");
                if(paymentMode !== "CARD"){
                  if (!validateCardTypeAndLedger()) {
                    return false;
                  }
                }
              }}
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
              <span className="text-blue-500 font-bold text-lg">{(totalBankCardAmount??0).toFixed(1)}</span>
            </div>

            {/* UPI */}
            <div
              className={`flex items-center justify-between p-3 mb-3 rounded-md border cursor-pointer transition-colors ${
                paymentMode === "UPI"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-100 hover:bg-gray-50"
              }`}
              onClick={() => {
                setPaymentMode(paymentMode === "UPI" ? null : "UPI");
                if(paymentMode !== "UPI"){
                  if (!validateUPIAndLedger()) {
                    return false;
                  }
                }
              }}
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
              <span className="text-blue-500 text-lg font-semibold">{(totalQrPayAmount??0).toFixed(1)}</span>
            </div></div>
            : 
            <div>
              {/* CARD AMOUNT ROW */}
              <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={cardEnabled}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setCardEnabled(checked);
                    if (checked && balance > 0) {
                      setCardAmt(balance);
                    } else if (!checked) {
                      setCardAmt(0);
                    }
                  }}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-black text-xs font-medium">{t('card_amount_tender')}</span>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-2 rounded-md transition-colors flex-shrink-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() => alert("Need to manage this section - btnSendToBankPOS_Click")}
                  disabled={!cardEnabled}
                >
                  <ChevronUp size={16} color="#fff"/>
                </button>
                <input
                  type="number"
                  min="0"
                  value={Number(cardAmt || 0).toFixed(2)}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setCardAmt(val < 0 ? 0 : val);
                  }}
                  disabled={!cardEnabled}
                  className="flex-1 min-w-0 bg-gray-100 text-black text-right text-xl font-semibold px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-blue-400 disabled:bg-gray-200 disabled:opacity-60"
                />
              </div>
            </div>
            {/* BANK AC ROW */}
            <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={ledgerEnabled}
                      onChange={(e) => setLedgerEnabled(e.target.checked)}
                      className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-black text-xs font-medium">{t('bank_ac')}</label>
                  </div>
                  <ERPDataComboBox
                    id="bank_ac"
                    noLabel={true}
                    variant="outlined"
                    className="tender-combobox"
                    noPlaceholder
                    style={{ backgroundColor: 'white', borderRadius: '6px' }}
                    field={{
                      id: "ledgerID",
                      required: true,
                      getListUrl: Urls.data_BankAccounts,
                      valueKey: "id",
                      labelKey: "name",
                    }}
                    value={bankCardDetails.ledgerId}
                    // value={bankCardDetails.ledgerId || -2}  // Use This if need to select the first item initially
                    onChange={(e) =>
                      setBankCardDetails((prev: any) => {
                        return {
                          ...prev,
                          ledgerId: e?.value
                        }
                      })
                    }
                    disabled={!ledgerEnabled || formState.tenderWindow?.isFromSave}
                  />
                </div>
            </div>}

            {/* Balance */}
            <div className="mb-2">
              <label className="text-black text-xs font-medium mb-1 block">{t('balance')}</label>
              <input
                type="text"
                value={Number(balance??0).toFixed(2)}
                readOnly
                className="w-full bg-gray-100 text-red-500 text-right text-2xl font-bold px-3 py-2 rounded-md border border-gray-200 outline-none"
              />
            </div>

            {/* Apply Button */}
            <div className="flex justify-center pt-2">
              <button
                ref={applyBtnRef}
                type="button"
                onClick={handleApply}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApply();
                  }
                }}
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
                    disabled={disableSettlement}
                    options={upiList}
                    field={{
                      id: "id",
                      // getListUrl: `${Urls.inv_transaction_base}${formState.transactionType}/Data/UPIs`,  // Loaded Using useEffect
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
                    value={Number(Number(uPIDetails?.amount || 0).toFixed(2))}
                    onChange={(e) =>
                      setUPIDetails((prev: any) => {
                        return {
                          ...prev,
                          amount: e.target?.value
                        }
                      })
                    }
                    disabled={disableSettlement}
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
                    disabled={disableSettlement}
                    className="w-full bg-white text-black text-base font-medium px-3 py-2 rounded-md border border-gray-200 outline-none focus:border-blue-400"
                  />
                </div>

                {/* Add Payment Button */}
                <button
                  type="button"
                  onClick={handleQRPayAddClick}
                  disabled={disableSettlement}
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
                    options={bankCards}
                    field={{
                      id: "id",
                      // getListUrl: `${Urls.inv_transaction_base}${formState.transactionType}/Data/BankCards`,  // Loaded Using useEffect
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
                      disabled={disableSettlement}
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
                    disabled={!ledgerEnabled || disableSettlement}
                  />
                </div>

                {/* Amount */}
                <div className="mb-2">
                  <label className="text-black text-xs font-medium mb-1 block">{t("amount")}</label>
                  <input
                    type="number"
                    value={bankCardDetails?.amount || 0}
                    disabled={disableSettlement}
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
                    disabled={disableSettlement}
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
                  disabled={disableSettlement}
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
      {/* Authorization Modal */}
      <ERPModal
        isOpen={discAuthModalOpen}
        closeModal={()=>false}
        title={t("authorizations")}
        width={400}
        height={220}
        content={
          <div className="flex flex-col gap-4 p-4">
            <ERPInput
              id="authPassword"
              label= {t("authentication_password")} 
              type="password"
              value={discAuthPassword}
              onChange={(e:any) => setDiscAuthPassword(e.target.value)}
            />
            <div className="flex justify-center">
              <ERPButton
                title={t("apply")}
                variant="primary"
                className="w-40"
                onClick={() => handleAuthorize(`Are you sure to allow discount : ${discAmount} in SI`)}
              />
            </div>
          </div>
        }
      />
    </>
  );
};

export default Tender;