import { useSelector } from "react-redux";
import { Currencies,  useNumberToWords } from "./number-to-words";
import { isNullOrUndefinedOrEmpty } from "./Utils";
import { useNumberFormat } from "./hooks/use-number-format";
import { RootState } from "../redux/store";
import { UserModel } from "../redux/slices/user-session/reducer";

// ==================== COUNTRY ID TO CURRENCY MAPPING ====================

const COUNTRY_ID_TO_CURRENCY: Record<number, Currencies> = {
  1: Currencies.SAUDI_ARABIA, // Saudi Arabia
  124: Currencies.QATAR, // Qatar
  120: Currencies.UAE, // UAE
  122: Currencies.BAHRAIN, // Bahrain
  104: Currencies.OMAN, // Oman
  118: Currencies.KUWAIT, // Kuwait
} as const;

// ==================== UTILITY FUNCTIONS ====================

export const formatNumericValue = (value: number): string => {
  return value.toFixed(2);
};

export const formatCurrencyValue = (value: number): string => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const roundAmount = (amount: number): number => {
  return Math.round(amount * 100) / 100;
};

export const parseAddress = (address: string): string[] => {
  const separators = [", "];
  return address.split(separators[0]).map((part) => part.trim());
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US");
};

export const getPrintCopyStatus = (copyNumber: number): string => {
  switch (copyNumber) {
    case 1:
      return "Original";
    case 2:
      return "Duplicate";
    case 3:
      return "Triplicate";
    case 4:
      return "Quadriplicate";
    default:
      return `${copyNumber} Th Copy`;
  }
};

export const getPrintCopyStatus2 = (copyNumber: number): string => {
  switch (copyNumber) {
    case 1:
      return "Customers Copy";
    case 2:
      return "Office Copy";
    case 3:
      return "Store Copy";
    case 4:
      return "Sales man Copy";
    default:
      return `${copyNumber} Th Copy`;
  }
};

export const getInOutArabic = (inOut: string): string => {
  switch (inOut) {
    case "DINE IN":
      return "محلي";
    case "TAKE AWAY":
      return "سفري";
    case "PARCEL":
      return "قطعة";
    case "DELIVERY":
      return "توصيل";
    default:
      return inOut;
  }
};

export const getModeOfPayment = (
  grandTotal: number,
  cashReceived: number,
  cashReturned: number,
  bankAmt: number,
  partyLedgerID: number,
  isCashInHandLedger: boolean,
  isLedgerUnderBank: boolean
): string => {
  if (isCashInHandLedger) {
    if (grandTotal === cashReceived) return "CASH";
    if (grandTotal === cashReturned) return "CASH";
    if (grandTotal === bankAmt) return "BANK";
    return "CASH/BANK";
  }

  if (isLedgerUnderBank) return "BANK";

  if (grandTotal === cashReceived) return "CASH";
  if (grandTotal === cashReturned) return "CASH";
  if (grandTotal === bankAmt) return "BANK";
  if (grandTotal === cashReceived + bankAmt) return "CASH+BANK";

  return "CREDIT";
};

export const getModeOfPaymentArabic = (
  grandTotal: number,
  cashReceived: number,
  cashReturned: number,
  bankAmt: number,
  partyLedgerID: number,
  isCashInHandLedger: boolean,
  isLedgerUnderBank: boolean
): string => {
  if (isCashInHandLedger) {
    if (grandTotal === cashReceived) return "نقدي";
    if (grandTotal === cashReturned) return "نقدي";
    if (grandTotal === bankAmt) return "شبكة";
    return "نقدي/شبكة";
  }

  if (isLedgerUnderBank) return "شبكة";

  if (grandTotal === cashReceived) return "نقدي";
  if (grandTotal === cashReturned) return "نقدي";
  if (grandTotal === bankAmt) return "شبكة";
  if (grandTotal === cashReceived + bankAmt) return "نقدي+شبكة";

  return "آجل";
};

// ==================== MAIN HOOK ====================
export interface PrintCustomFields {
  amountInWords: string;
  amountInWordsLine2: string;
  amountInWordsInArabic: string;
  mannualOrAutoBarcode: string;
  billNumberBarcode: string;
  transactionBarcode: string;
  qrCodeKsaEinvoicePhase1: string;
  billNumberPrefBarcode: string;
  tokenBarcode: string;
  voucherNumberBarcode: string;
  groupNameHead: string;
  printTime: string;
  printDate: string;
  date: string;
  printCopyStatus: string;
  printCopyStatus2: string;
  salesBillNumbers: string;

  totalItems: string;
  sumOfQty: string;
  sumOfFree: string;
  sumOfQtyAndFree: string;
  sumOfCgst: string;
  sumOfSgst: string;
  sumOfIgst: string;
  sumOfCessAmt: string;
  sumOfAddCessAmt: string;
  sumOfGst: string;

  taxable0: string;
  sgst0: string;
  cgst0: string;
  igst0: string;
  total0: string;

  taxable3: string;
  sgst3: string;
  cgst3: string;
  igst3: string;
  total3: string;

  taxable5: string;
  sgst5: string;
  cgst5: string;
  igst5: string;
  total5: string;

  taxable12: string;
  sgst12: string;
  cgst12: string;
  igst12: string;
  total12: string;

  taxable18: string;
  sgst18: string;
  cgst18: string;
  igst18: string;
  total18: string;

  taxable28: string;
  sgst28: string;
  cgst28: string;
  igst28: string;
  total28: string;

  youSaved: string;

  // Commented-out page totals
  pageTotalOfGross: string;
  pageTotalOfDisc: string;
  pageTotalOfTax: string;
  pageTotalOfNetAmt: string;
  pageTotalOfSchemeDisc: string;
  pageTotalOfVat: string;
  pageTotalOfTotDisc: string;
  pageTotalOfCst: string;
  pageTotalOfNetValue: string;
  pageTotalOfNosQty: string;

  pageTotAmount: string;
  totalNetAmount: string;
  totalQty: string;
  totalPageQty: string;
  pageTotDebit: string;

  // Additional totals
  totalAmount: string;
  totalDiscount: string;
  totalTax: string;
  totalPayable: string;
  roundOff: string;
  QRCODE_KSA_EINVOICE_PHASE1: string;
  BILLNUMBER_PREF_BARCODE: string;
}
export const initialPrintCustomFields: PrintCustomFields = {
  amountInWords: "",
  amountInWordsLine2: "",
  amountInWordsInArabic: "",
  mannualOrAutoBarcode: "",
  billNumberBarcode: "",
  transactionBarcode: "",
  qrCodeKsaEinvoicePhase1: "",
  billNumberPrefBarcode: "",
  tokenBarcode: "",
  voucherNumberBarcode: "",
  groupNameHead: "",
  printTime: "",
  printDate: "",
  date: "",
  printCopyStatus: "",
  printCopyStatus2: "",
  salesBillNumbers: "",

  totalItems: "",
  sumOfQty: "",
  sumOfFree: "",
  sumOfQtyAndFree: "",
  sumOfCgst: "",
  sumOfSgst: "",
  sumOfIgst: "",
  sumOfCessAmt: "",
  sumOfAddCessAmt: "",
  sumOfGst: "",

  taxable0: "",
  sgst0: "",
  cgst0: "",
  igst0: "",
  total0: "",

  taxable3: "",
  sgst3: "",
  cgst3: "",
  igst3: "",
  total3: "",

  taxable5: "",
  sgst5: "",
  cgst5: "",
  igst5: "",
  total5: "",

  taxable12: "",
  sgst12: "",
  cgst12: "",
  igst12: "",
  total12: "",

  taxable18: "",
  sgst18: "",
  cgst18: "",
  igst18: "",
  total18: "",

  taxable28: "",
  sgst28: "",
  cgst28: "",
  igst28: "",
  total28: "",

  youSaved: "",

  pageTotalOfGross: "",
  pageTotalOfDisc: "",
  pageTotalOfTax: "",
  pageTotalOfNetAmt: "",
  pageTotalOfSchemeDisc: "",
  pageTotalOfVat: "",
  pageTotalOfTotDisc: "",
  pageTotalOfCst: "",
  pageTotalOfNetValue: "",
  pageTotalOfNosQty: "",

  pageTotAmount: "",
  totalNetAmount: "",
  totalQty: "",
  totalPageQty: "",
  pageTotDebit: "",

  totalAmount: "",
  totalDiscount: "",
  totalTax: "",
  totalPayable: "",
  roundOff: "",
  
  QRCODE_KSA_EINVOICE_PHASE1: "",
  BILLNUMBER_PREF_BARCODE: ""
};

  export const getCommonValues = (
    fieldName: keyof PrintCustomFields,
    master: any,
    details: any[],
    detail: any,
    copyCount: number,
    userSession: UserModel,
    convertAmountToEnglish: (amount: number, currency?: Currencies | undefined) => string,
    convertAmountToArabic: (amount: number, currency?: Currencies | undefined) => string,
    options?: {
      fieldLength?: number;
      isCashInHandLedger?: boolean;
      isLedgerUnderBank?: boolean;
    }
  ):string => {
    let result = false;
    let value = "";
    const fieldLength = options?.fieldLength ?? 0;
    const isCashInHandLedger = options?.isCashInHandLedger ?? false;
    const isLedgerUnderBank = options?.isLedgerUnderBank ?? false;
    const transMasterID =
      master?.accTransactionMasterID ?? master?.invTransactionMasterID ?? 0;
    try {
      switch (fieldName) {
        case "amountInWords":
          value = convertAmountToEnglish(master?.grantTotal);
          break;

        case "amountInWordsLine2":
          const amountInWords = convertAmountToEnglish(master?.grantTotal);
          if (amountInWords.length > fieldLength) {
            value = amountInWords.substring(fieldLength);
          } else {
            value = "";
          }
          break;

        case "amountInWordsInArabic":
          const countryId = userSession.countryId??0;
          const currency =
            COUNTRY_ID_TO_CURRENCY[countryId] ?? Currencies.OTHER;
          value = convertAmountToArabic(master?.grantTotal, currency);
          break;

        case "mannualOrAutoBarcode":
          value =
            isNullOrUndefinedOrEmpty(detail?.mBarcode) ? detail?.mBarcode : detail?.AutoBarcode;
          break;

        case "billNumberBarcode":
          value = `(1${master?.voucherType}${master?.voucherNumber})`;
          break;

        case "transactionBarcode":
          value = `*${
            transMasterID < 10
              ? "00000" + transMasterID
              : transMasterID < 100
              ? "0000" + transMasterID
              : transMasterID < 1000
              ? "000" + transMasterID
              : transMasterID
          }*`;
          break;

        case "QRCODE_KSA_EINVOICE_PHASE1":
          value = "";
          const _createdDate = master?.createdDate;
          const _grandTotal = master?.grandTotal.toFixed(2);
          const _vatAmount = master?.vatAmount.toFixed(2);
          let qrString = "";
          let dateStr = "";
          let timeStr = "";
          let datetime = "";
          let sellerName = "";
          let vatRegno = "";

          try {
            dateStr =
              _createdDate.getFullYear().toString().padStart(4, "0") +
              "-" +
              (_createdDate.getMonth() + 1).toString().padStart(2, "0") +
              "-" +
              _createdDate.getDate().toString().padStart(2, "0");
            timeStr =
              _createdDate.getHours().toString().padStart(2, "0") +
              ":" +
              _createdDate.getMinutes().toString().padStart(2, "0") +
              ":" +
              _createdDate.getSeconds().toString().padStart(2, "0");
            datetime = dateStr + "T" + timeStr + "Z";

            // You'll need to replace these with your actual company profile values
            sellerName = "Your Company Name"; // Replace with actual seller name
            vatRegno = "Your VAT Registration Number"; // Replace with actual VAT reg number
          } catch (ex) {
            // Handle exception
          }

          // Tag Length value Tuples
          const listTuple: Array<{ tag: number; name: string; value: string }> =
            [
              { tag: 1, name: "Seller", value: sellerName },
              { tag: 2, name: "VatNumber", value: vatRegno },
              { tag: 3, name: "TimeStamp", value: datetime },
              { tag: 4, name: "InvoiceTotal", value: _grandTotal },
              { tag: 5, name: "VatTotal", value: _vatAmount },
            ];

          const bytes: number[] = [];
          const encoder = new TextEncoder();

          for (const tuple of listTuple) {
            // Tag into byte
            bytes.push(tuple.tag);

            // Convert value into UTF-8 byte array
            const utf8Bytes = encoder.encode(tuple.value);

            // Get length of the value byte array and convert it into byte
            bytes.push(utf8Bytes.length);

            // Append value UTF-8 byte array into stream
            bytes.push(...Array.from(utf8Bytes));
          }

          // Convert to Uint8Array
          const data = new Uint8Array(bytes);

          // Convert into base64 string
          value = btoa(String.fromCharCode(...data));
          break;

        // case "QRCODE_KSA_EINVOICE":
        // case "QRCODE_KSA_EINVOICE_NOT_ENCRYPTED":
        //   value = master?.IQR || "";
        //   break;

        // case "QRCODE_KSA_EINVOICE_PHASE2":
        //   value = master?.IQR || "";
        //   break;

        // case "EInvoiceQRCode":
        //   value = data.dtTranMaster[0]?.eInvoiceQRCode || "";
        //   break;

        // case "DELIVERYPHONE":
        // case "DELIVERYSTREET":
        // case "DELIVERYLANDMARK":
        // case "DELIVERYREMARKS":
        //   const addressParts = parseAddress(data.DeliveryAddress3);
        //   const addressIndex = fieldName === "DELIVERYPHONE" ? 0 :
        //                      fieldName === "DELIVERYSTREET" ? 1 :
        //                      fieldName === "DELIVERYLANDMARK" ? 2 : 3;
        //   value = addressParts[addressIndex] || "";
        //   break;

        case "BILLNUMBER_PREF_BARCODE":
          value = `(${master?.voucherPrefix}.1${master?.voucherType}${master?.voucherNumber})`;
          break;

        case "tokenBarcode":
          value = `(${master?.voucherNumber})`;
          break;

        case "voucherNumberBarcode":
          value =
            master.voucherNumber.length < 2
              ? `(00${master.voucherNumber})`
              : master.voucherNumber.length < 3
              ? `(0${master.voucherNumber})`
              : `(${master.voucherNumber})`;
          break;

        case "groupNameHead":
          value = details?.findLast(x => x != undefined)?.groupName;
          break;

        case "printTime":
          value = formatTime(new Date());
          break;

        // case "TRANSACTIONTIME":
        //   value = formatTime(data.TransactionTime);
        //   break;

        case "printDate":
          value = formatDate(new Date());
          break;

        case "date":
          value = new Date().toString();
          break;

        case "printCopyStatus":
          value = getPrintCopyStatus(copyCount);
          break;

        case "printCopyStatus2":
          value = getPrintCopyStatus2(copyCount);
          break;

        case "salesBillNumbers":
          value =
            details?.flatMap(x => x?.fieldName ? [x.fieldName] : []).join(",") ?? "";
          break;

        // case "SALESRETBILLNUMBERS":
        //   value =
        //     data.SalesRetBillNumbers.length > 0
        //       ? data.SalesRetBillNumbers.substring(
        //           0,
        //           data.SalesRetBillNumbers.length - 1
        //         )
        //       : "";
        //   break;

        // case "BILLAMOUNTS":
        //   value =
        //     data.BillAmounts.length > 0
        //       ? data.BillAmounts.substring(0, data.BillAmounts.length - 1)
        //       : "";
        //   break;

        // case "RETBILLAMOUNTS":
        //   value =
        //     data.RetBillAmounts.length > 0
        //       ? data.RetBillAmounts.substring(0, data.RetBillAmounts.length - 1)
        //       : "";
        //   break;

        // Quantity and totals
        case "totalItems":
          value = details?.length.toString();
          break;
        // case "SumOfQty":
        //   value = details?.reduce((acc, x) => acc + (x?.qty ?? 0), 0);
        //   break;
        // // case "PAGE TOTAL OF QTY": value = data.TotalPageQty.toString(); break;
        // case "SUM OF FREE":
        //   value = details?.reduce((acc, x) => acc + (x?.free ?? 0), 0);
        //   break;
        // case "SUM OF QTY+FREE":
        // case "TOTAL QTY AND FREE":
        //   const totalQtyFree = details?.reduce(
        //     (acc, x) => acc + (x?.qty ?? 0) + (x?.free ?? 0),
        //     0
        //   );
        //   break;
        //   value = totalQtyFree.toString();
        //   break;

        // // case "PAGE TOTAL OF FREE": value = data.PageTotFree.toString(); break;

        // // GST fields
        // case "SUM OF CGST":
        //   value = details?.reduce((acc, x) => acc + (x?.cgst ?? 0), 0);
        //   break;
        // case "SUM OF SGST":
        //   value = details?.reduce((acc, x) => acc + (x?.sgst ?? 0), 0);
        //   break;
        // case "SUM OF IGST":
        //   value = details?.reduce((acc, x) => acc + (x?.igst ?? 0), 0);
        //   break;
        // case "SUM OF CESSAMT":
        //   value = details?.reduce((acc, x) => acc + (x?.cessAmt ?? 0), 0);
        //   break;
        // case "SUM OF ADDCESSAMT":
        //   value = details?.reduce(
        //     (acc, x) => acc + (x?.additionalCess ?? 0),
        //     0
        //   );
        //   break;
        // case "SUM OF GST":
        //   value = details?.reduce(
        //     (acc, x) =>
        //       acc +
        //       (x?.cgst ?? 0) +
        //       (x?.sgst ?? 0) +
        //       (x?.igst ?? 0) +
        //       (x?.cessAmt ?? 0) +
        //       (x?.additionalCess ?? 0),
        //     0
        //   );
        //   break;

        // // Tax rate specific fields
        // case "TAXABLE 0%":
        //   value = details?.filter(x => x.sGSTPerc == 0 && x.cGSTPerc == 0 && x.iGSTPerc == 0).reduce((acc, x) => acc + (x?.netValue ?? 0), 0);
        //   break;
        // case "SGST 0%":
        //  value = details?.filter(x => x.sGSTPerc == 0 && x.cGSTPerc == 0 && x.iGSTPerc == 0).reduce((acc, x) => acc + (x?.sGST ?? 0), 0);
        //   break;
        // case "CGST 0%":
        //   value = details?.filter(x => x.sGSTPerc == 0 && x.cGSTPerc == 0 && x.iGSTPerc == 0).reduce((acc, x) => acc + (x?.cGST ?? 0), 0);
        //   break;
        // case "IGST 0%":
        //   value = details?.filter(x => x.sGSTPerc == 0 && x.cGSTPerc == 0 && x.iGSTPerc == 0).reduce((acc, x) => acc + (x?.iGST ?? 0), 0);
        //   break;
        // case "TOTAL 0%":
        //   value = details?.filter(x => x.sGSTPerc == 0 && x.cGSTPerc == 0 && x.iGSTPerc == 0).reduce((acc, x) => acc + (x?.sGST ?? 0)+ (x?.cGST ?? 0)+ (x?.iGST ?? 0), 0);
        //   break;

        // case "TAXABLE 3%":
        //   value = details?.filter(x => x.sGSTPerc == 3 && x.cGSTPerc == 3 && x.iGSTPerc == 3).reduce((acc, x) => acc + (x?.netValue ?? 0), 0);
        //   break;
        // case "SGST 3%":
        //  value = details?.filter(x => x.sGSTPerc == 3 && x.cGSTPerc == 3 && x.iGSTPerc == 3).reduce((acc, x) => acc + (x?.sGST ?? 0), 0);
        //   break;
        // case "CGST 3%":
        //   value = details?.filter(x => x.sGSTPerc == 3 && x.cGSTPerc == 3 && x.iGSTPerc == 3).reduce((acc, x) => acc + (x?.cGST ?? 0), 0);
        //   break;
        // case "IGST 3%":
        //   value = details?.filter(x => x.sGSTPerc == 3 && x.cGSTPerc == 3 && x.iGSTPerc == 3).reduce((acc, x) => acc + (x?.iGST ?? 0), 0);
        //   break;
        // case "TOTAL 3%":
        //   value = details?.filter(x => x.sGSTPerc == 3 && x.cGSTPerc == 3 && x.iGSTPerc == 3).reduce((acc, x) => acc + (x?.sGST ?? 0)+ (x?.cGST ?? 0)+ (x?.iGST ?? 0), 0);
        //   break;

        // // 5% GST Cases
        // case "TAXABLE 5%":
        //   value = details?.filter(x => x.sGSTPerc == 5 && x.cGSTPerc == 5 && x.iGSTPerc == 5).reduce((acc, x) => acc + (x?.netValue ?? 0), 0);
        //   break;
        // case "SGST 5%":
        //   value = details?.filter(x => x.sGSTPerc == 5 && x.cGSTPerc == 5 && x.iGSTPerc == 5).reduce((acc, x) => acc + (x?.sGST ?? 0), 0);
        //   break;
        // case "CGST 5%":
        //   value = details?.filter(x => x.sGSTPerc == 5 && x.cGSTPerc == 5 && x.iGSTPerc == 5).reduce((acc, x) => acc + (x?.cGST ?? 0), 0);
        //   break;
        // case "IGST 5%":
        //   value = details?.filter(x => x.sGSTPerc == 5 && x.cGSTPerc == 5 && x.iGSTPerc == 5).reduce((acc, x) => acc + (x?.iGST ?? 0), 0);
        //   break;
        // case "TOTAL 5%":
        //   value = details?.filter(x => x.sGSTPerc == 5 && x.cGSTPerc == 5 && x.iGSTPerc == 5).reduce((acc, x) => acc + (x?.sGST ?? 0) + (x?.cGST ?? 0) + (x?.iGST ?? 0), 0);
        //   break;

        // // 12% GST Cases
        // case "TAXABLE 12%":
        //   value = details?.filter(x => x.sGSTPerc == 12 && x.cGSTPerc == 12 && x.iGSTPerc == 12).reduce((acc, x) => acc + (x?.netValue ?? 0), 0);
        //   break;
        // case "SGST 12%":
        //   value = details?.filter(x => x.sGSTPerc == 12 && x.cGSTPerc == 12 && x.iGSTPerc == 12).reduce((acc, x) => acc + (x?.sGST ?? 0), 0);
        //   break;
        // case "CGST 12%":
        //   value = details?.filter(x => x.sGSTPerc == 12 && x.cGSTPerc == 12 && x.iGSTPerc == 12).reduce((acc, x) => acc + (x?.cGST ?? 0), 0);
        //   break;
        // case "IGST 12%":
        //   value = details?.filter(x => x.sGSTPerc == 12 && x.cGSTPerc == 12 && x.iGSTPerc == 12).reduce((acc, x) => acc + (x?.iGST ?? 0), 0);
        //   break;
        // case "TOTAL 12%":
        //   value = details?.filter(x => x.sGSTPerc == 12 && x.cGSTPerc == 12 && x.iGSTPerc == 12).reduce((acc, x) => acc + (x?.sGST ?? 0) + (x?.cGST ?? 0) + (x?.iGST ?? 0), 0);
        //   break;

        // // 18% GST Cases
        // case "TAXABLE 18%":
        //   value = details?.filter(x => x.sGSTPerc == 18 && x.cGSTPerc == 18 && x.iGSTPerc == 18).reduce((acc, x) => acc + (x?.netValue ?? 0), 0);
        //   break;
        // case "SGST 18%":
        //   value = details?.filter(x => x.sGSTPerc == 18 && x.cGSTPerc == 18 && x.iGSTPerc == 18).reduce((acc, x) => acc + (x?.sGST ?? 0), 0);
        //   break;
        // case "CGST 18%":
        //   value = details?.filter(x => x.sGSTPerc == 18 && x.cGSTPerc == 18 && x.iGSTPerc == 18).reduce((acc, x) => acc + (x?.cGST ?? 0), 0);
        //   break;
        // case "IGST 18%":
        //   value = details?.filter(x => x.sGSTPerc == 18 && x.cGSTPerc == 18 && x.iGSTPerc == 18).reduce((acc, x) => acc + (x?.iGST ?? 0), 0);
        //   break;
        // case "TOTAL 18%":
        //   value = details?.filter(x => x.sGSTPerc == 18 && x.cGSTPerc == 18 && x.iGSTPerc == 18).reduce((acc, x) => acc + (x?.sGST ?? 0) + (x?.cGST ?? 0) + (x?.iGST ?? 0), 0);
        //   break;

        // // 28% GST Cases
        // case "TAXABLE 28%":
        //   value = details?.filter(x => x.sGSTPerc == 28 && x.cGSTPerc == 28 && x.iGSTPerc == 28).reduce((acc, x) => acc + (x?.netValue ?? 0), 0);
        //   break;
        // case "SGST 28%":
        //   value = details?.filter(x => x.sGSTPerc == 28 && x.cGSTPerc == 28 && x.iGSTPerc == 28).reduce((acc, x) => acc + (x?.sGST ?? 0), 0);
        //   break;
        // case "CGST 28%":
        //   value = details?.filter(x => x.sGSTPerc == 28 && x.cGSTPerc == 28 && x.iGSTPerc == 28).reduce((acc, x) => acc + (x?.cGST ?? 0), 0);
        //   break;
        // case "IGST 28%":
        //   value = details?.filter(x => x.sGSTPerc == 28 && x.cGSTPerc == 28 && x.iGSTPerc == 28).reduce((acc, x) => acc + (x?.iGST ?? 0), 0);
        //   break;
        // case "TOTAL 28%":
        //   value = details?.filter(x => x.sGSTPerc == 28 && x.cGSTPerc == 28 && x.iGSTPerc == 28).reduce((acc, x) => acc + (x?.sGST ?? 0) + (x?.cGST ?? 0) + (x?.iGST ?? 0), 0);
        //   break;

        

        // // case "MRPDIFFERENCE":
        // //   value = data.MRPDifference.toString();
        // //   break;
        // // case "QRPAY":
        // //   value = data.QRpay.toString();
        // //   break;
        // // case "BANKCARD":
        // //   value = data.BankCard.toString();
        // //   break;


        // // case "STATENAME":
        // //   value = data.StateName;
        // //   break;
        // // case "STATECODE":
        // //   value = data.StateCode;
        // //   break;

        // case "YOU SAVED":
        //   const bill = master.netAmount - master.billDiscount;
        //   const totalSaved = details?.reduce((acc, x) => acc + (x?.mrp ?? 0), 0) - bill;
        //   const roundSaved = posRoundAmount(totalSaved);
        //   value = roundSaved.toString();
        //   break;

        // // Page totals
        // case "PAGE TOTAL OF GROSS":
        //   value = data.PageTotalofGross.toString();
        //   break;
        // case "PAGE TOTAL OF DISC":
        //   value = data.PageTotalofDisc.toString();
        //   break;
        // case "PAGE TOTAL OF TAX":
        //   value = data.PageTotalofTax.toString();
        //   break;
        // case "PAGE TOTAL OF NETAMT":
        //   value = data.PageTotalofNetAmt.toString();
        //   break;
        // case "PAGE TOTAL OF SCHEMEDISC":
        //   value = data.PageTotalofSchmeDisc.toString();
        //   break;
        // case "PAGE TOTAL OF VAT":
        //   value = data.PageTotalofVAT.toString();
        //   break;
        // case "PAGE TOTAL OF TOTDISC":
        //   value = data.PageTotalofTotDisc.toString();
        //   break;
        // case "PAGE TOTAL OF CST":
        //   value = data.PageTotalofCST.toString();
        //   break;
        // case "PAGE TOTAL OF NETVAKUE":
        //   value = data.PageTotalofNetValue.toString();
        //   break;
        // case "PAGE TOTAL OF NOSQTY":
        //   value = data.PageTotalofNosQty.toString();
        //   break;

        // // Pagination
        // case "PAGENO":
        //   value = data.PageNo.toString();
        //   break;
        // case "PAGE N OF M":
        //   value = `Page ${data.PageNo} Of ${data.NoOfPages}`;
        //   break;
        // case "NOOFPAGES":
        //   value = data.NoOfPages.toString();
        //   break;

        // case "TOTALQTY":
        //   value = data.TotalQty.toString();
        //   break;
        // case "TOTALPAGEQTY":
        //   value = data.TotalPageQty.toString();
        //   break;
        // case "PAGETOTDEBIT":
        //   value = data.PageTotDebit.toString();
        //   break;
        // case "TOTALNETAMOUNT":
        //   value = data.TotalNetAmount.toString();
        //   break;
        // case "PAGETOTAMOUNT":
        //   value = data.PageTotAmount.toString();
        //   break;
        // case "FREESTRING":
        //   value = data.FreeString;
        //   break;
        // case "GROUPWISESINO":
        //   value = data.R.toString();
        //   break;
        // case "SI_NO":
        //   value = data.R.toString();
        //   break;
        // case "PRODUCTUNITREMARKSORPRODUCTNAME":
        //   value = data.ProductUnitRemarksOrProductName;
        //   break;

        // // Product name lines
        // case "PARTYNAMELINE2":
        //   if (data.PARTYNAME.length > fieldLength) {
        //     value = data.PARTYNAME.substring(fieldLength);
        //   } else {
        //     value = "";
        //   }
        //   break;

        // case "PRODUCTNAME2":
        //   if (data.ProdName.length > fieldLength) {
        //     value = data.ProdName.substring(fieldLength);
        //   } else {
        //     value = "";
        //   }
        //   break;

        // case "PRODUCTNAME3":
        //   if (data.ProdName.length > fieldLength * 2) {
        //     value = data.ProdName.substring(fieldLength * 2);
        //   } else {
        //     value = "";
        //   }
        //   break;

        // case "PRODUCTDESCRIPTION2":
        //   if (data.ProdDescription.length > fieldLength) {
        //     value = data.ProdDescription.substring(fieldLength);
        //   } else {
        //     value = "";
        //   }
        //   break;

        // case "PRODUCTDESCRIPTION3":
        //   if (data.ProdDescription.length > fieldLength * 2) {
        //     value = data.ProdDescription.substring(fieldLength * 2);
        //   } else {
        //     value = "";
        //   }
        //   break;

        // case "PRODUCTDESCRIPTION4":
        //   if (data.ProdDescription.length > fieldLength * 3) {
        //     value = data.ProdDescription.substring(fieldLength * 3);
        //   } else {
        //     value = "";
        //   }
        //   break;

        // case "PRODUCTDESCRIPTION5":
        //   if (data.ProdDescription.length > fieldLength * 4) {
        //     value = data.ProdDescription.substring(fieldLength * 4);
        //   } else {
        //     value = "";
        //   }
        //   break;

        // case "PRODUCTNAMEOROPENPRODUCTNAME":
        //   value = data.ProdName;
        //   if (data.ProductCode === "0") {
        //     value = data.ModelNoKOT;
        //   }
        //   break;

        // case "PRODUCTDESCRIPTIONORNAME":
        //   value = data.ProdDescription;
        //   if (value === "") value = data.ProdName;
        //   break;

        // case "INOUTARABIC":
        //   value = getInOutArabic(data.dtTranMaster[0]?.InOut || "");
        //   break;

        // case "MODEOFPAYMENT":
        //   const grandTotal = parseFloat(
        //     data.dtTranMaster[0]?.GrandTotal || "0"
        //   );
        //   value = getModeOfPayment(
        //     grandTotal,
        //     data.CashReceived,
        //     data.CashReturned,
        //     data.BankAmt,
        //     data.PartyLedgerID,
        //     isCashInHandLedger,
        //     isLedgerUnderBank
        //   );
        //   break;

        // case "MODEOFPAYMENTARABIC":
        //   const grandTotalArabic = parseFloat(
        //     data.dtTranMaster[0]?.GrandTotal || "0"
        //   );
        //   value = getModeOfPaymentArabic(
        //     grandTotalArabic,
        //     data.CashReceived,
        //     data.CashReturned,
        //     data.BankAmt,
        //     data.PartyLedgerID,
        //     isCashInHandLedger,
        //     isLedgerUnderBank
        //   );
        //   break;

        // case "PAIDORNOT":
        //   value = data.CashReceived > 0 ? "Paid" : "Not Paid";
        //   break;

        // case "AMOUNTINWORDSPAYABLE":
        //   const grandTotalParsed = parseFloat(
        //     data.dtTranMaster[0]?.GrandTotal || "0"
        //   );
        //   const srAmount = parseFloat(data.dtTranMaster[0]?.SRAmount || "0");
        //   value = convertAmountToEnglish(grandTotalParsed - srAmount);
        //   break;

        // case "QTYWITHUNIT":
        //   value = data.QtyWithUnit.toString();
        //   break;
        // case "UNITNETVALUE":
        //   value = data.UnitNetValue.toString();
        //   break;
        // case "VEHICLENUMBER":
        //   value = data.dtTranMaster[0]?.VehicleNumber || "";
        //   break;

        // case "BILLDISCOUNTPLUSDISCOUNT":
        //   const billDiscountParsed = parseFloat(
        //     data.dtTranMaster[0]?.BillDiscount || "0"
        //   );
        //   value = formatNumericValue(billDiscountParsed + data.SumOfDisc);
        //   break;

        // case "PartyDisplayName":
        //   value = data.dtTranMaster[0]?.PartyDisplayName || "";
        //   break;

        // // Vehicle information
        // case "VEHICLENAME":
        //   value = data.dtTranMaster[0]?.VehicleName || "";
        //   break;
        // case "VEHICLEMODEL":
        //   value = data.dtTranMaster[0]?.VehicleModel || "";
        //   break;
        // case "VEHICLECAPACITY":
        //   value = data.dtTranMaster[0]?.VehicleCapacity || "";
        //   break;
        // case "VEHICLEMANUFACTURER":
        //   value = data.dtTranMaster[0]?.VehicleManufacturer || "";
        //   break;
        // case "VEHICLEOWNER":
        //   value = data.dtTranMaster[0]?.VehicleOwner || "";
        //   break;
        // case "VEHICLECOLOR":
        //   value = data.dtTranMaster[0]?.VehicleColor || "";
        //   break;
        // case "VEHICLEODOMETER":
        //   value = data.dtTranMaster[0]?.VehicleOdometer || "";
        //   break;
        // case "VEHICLEREMARKS":
        //   value = data.dtTranMaster[0]?.VehicleRemarks || "";
        //   break;

        // case "BALANCE AMT PAYABLE":
        //   const balanceGrandTotal = parseFloat(
        //     data.dtTranMaster[0]?.GrandTotal || "0"
        //   );
        //   const balanceSrAmount = parseFloat(
        //     data.dtTranMaster[0]?.SRAmount || "0"
        //   );
        //   value = formatNumericValue(balanceGrandTotal - balanceSrAmount);
        //   break;

        // case "PRIVILAGECARDBALANCE":
        //   value = data.LoyaltyCardNo.trim() === "" ? "0" : "0"; // Would need loyalty card service
        //   break;

        // // Cheque fields
        // case "CHEQUE_CHEQUEDATE":
        //   value = data.CHEQUE_CHEQUEDATE;
        //   break;
        // case "CHEQUE_PAYTOACCOUNTNAME":
        //   value = data.CHEQUE_PAYTOACCOUNTNAME;
        //   break;
        // case "CHEQUE_AMOUNT":
        //   value = `***${formatCurrencyValue(
        //     parseFloat(data.CHEQUE_AMOUNT)
        //   )}/-***`;
        //   break;
        // case "CHEQUE_REMARKS":
        //   value = data.CHEQUE_REMARKS;
        //   break;

        // case "CHEQUE_AMOUNTINWORDSLINE1":
        //   const chequeAmountInWords = `***${convertAmountToEnglish(
        //     parseFloat(data.CHEQUE_AMOUNT)
        //   )}***`;
        //   if (chequeAmountInWords.length > fieldLength) {
        //     value = chequeAmountInWords.substring(0, fieldLength);
        //   } else {
        //     value = chequeAmountInWords;
        //   }
        //   break;

        // case "CHEQUE_AMOUNTINWORDSLINE2":
        //   const chequeAmountInWords2 = `***${convertAmountToEnglish(
        //     parseFloat(data.CHEQUE_AMOUNT)
        //   )}***`;
        //   if (chequeAmountInWords2.length > fieldLength) {
        //     value = chequeAmountInWords2.substring(fieldLength);
        //   } else {
        //     value = "";
        //   }
        //   break;

        // case "CHEQUE_AMOUNTINWORDSLINE3":
        //   const chequeAmountInWords3 = `***${convertAmountToEnglish(
        //     parseFloat(data.CHEQUE_AMOUNT)
        //   )}***`;
        //   if (chequeAmountInWords3.length > fieldLength * 2) {
        //     value = chequeAmountInWords3.substring(fieldLength * 2);
        //   } else {
        //     value = "";
        //   }
        //   break;

        // case "INVOICE STATUS":
        //   const oldInvTransactionId = parseFloat(
        //     data.dtTranMaster[0]?.OldInvTransactionID || "0"
        //   );
        //   value = oldInvTransactionId === 0 ? "NEW" : "EDITED";
        //   break;

        // case "NETAMOUNT":
        //   const netGrandTotal = parseFloat(
        //     data.dtTranMaster[0]?.GrandTotal || "0"
        //   );
        //   const netBillDiscount = parseFloat(
        //     data.dtTranMaster[0]?.BillDiscount || "0"
        //   );
        //   value = (netGrandTotal + netBillDiscount).toString();
        //   break;

        // case "GRANTTOTAL":
        //   const finalGrandTotal = parseFloat(
        //     data.dtTranMaster[0]?.GrandTotal || "0"
        //   );
        //   if (applicationSettings.mainSettings.BusinessType === "Restaurant") {
        //     value = roundAmount(finalGrandTotal).toString();
        //   } else {
        //     value = finalGrandTotal.toString();
        //   }
        //   break;

        // case "TOTALSALESVALUE":
        //   value = data.StockTransferTotalSalesValue.toString();
        //   break;
        // case "PAGETOTALBARCODE":
        //   value = data.PageTotalBarcode;
        //   break;
        // case "JVTOTALDEBIT":
        //   value = data.JVTotalDebit.toString();
        //   break;
        // case "JVTOTALCREDIT":
        //   value = data.JVTotalCredit.toString();
        //   break;
        // case "INVOICENUMBERANDPAGETOTALBARCODE":
        //   value = data.InvoiceNumberAndPageTotalBarcode;
        //   break;
        // case "WIDTH":
        //   value = data.PWidth;
        //   break;
        // case "HEIGHT":
        //   value = data.PHeight;
        //   break;
        // case "NON HEIGHT AND WIDTH UNIT":
        //   value = data.Non_Height_Width;
        //   break;
        // case "PRINTCOUNT":
        //   value = data.PrintCount.toString();
        //   break;

        // // Conditional fields
        // case "FCAMOUNT":
        //   if (data.FCAmount === 0) {
        //     result = true;
        //   }
        //   break;

        // case "IN":
        //   if (data.IN_OUT === "DINE IN" || data.IN_OUT === "PARCEL") {
        //     result = true;
        //   }
        //   break;

        // case "OUT":
        //   if (data.IN_OUT === "TAKE AWAY" || data.IN_OUT === "DELIVERY") {
        //     result = true;
        //   }
        //   break;

        // // Kitchen management fields
        // case "KM_KITCHENREMARKS":
        //   value = data.KM_KitchenRemarks;
        //   break;
        // case "KM_WAITER":
        //   value = data.KM_Waiter;
        //   break;
        // case "KM_ORDERNUMBER":
        //   value = data.KM_OrderNumber;
        //   break;
        // case "KM_TABLENO":
        //   value = data.KM_TableNo;
        //   break;
        // case "KM_SEATNO":
        //   value = data.KM_SeatNo;
        //   break;
        // case "KM_TOKENNUMBER":
        //   value = data.KM_TokenNumber;
        //   break;
        // case "KM_SERVETYPE":
        //   value = data.KM_ServeType;
        //   break;

        // // Kitchen remarks lines
        // case "KM_KITCHENREMARKS1":
        //   if (data.KM_KitchenRemarks.length > fieldLength) {
        //     value = data.KM_KitchenRemarks.substring(fieldLength);
        //   } else {
        //     value = "";
        //   }
        //   break;

        // case "KM_KITCHENREMARKS2":
        //   if (data.KM_KitchenRemarks.length > fieldLength * 2) {
        //     value = data.KM_KitchenRemarks.substring(fieldLength * 2);
        //   } else {
        //     value = "";
        //   }
        //   break;

        // case "KM_KITCHENREMARKS3":
        //   if (data.KM_KitchenRemarks.length > fieldLength * 3) {
        //     value = data.KM_KitchenRemarks.substring(fieldLength * 3);
        //   } else {
        //     value = "";
        //   }
        //   break;

        // case "KM_KITCHENREMARKS4":
        //   if (data.KM_KitchenRemarks.length > fieldLength * 4) {
        //     value = data.KM_KitchenRemarks.substring(fieldLength * 4);
        //   } else {
        //     value = "";
        //   }
        //   break;

        // case "NARRATION2":
        //   if (data.Narration.length > fieldLength) {
        //     value = data.Narration.substring(fieldLength);
        //   } else {
        //     value = "";
        //   }
        //   break;

        // case "TOTALBILLQTY":
        //   value = data.TotalBillQty.toString();
        //   break;
        // case "TOTALBILLITEMNOS":
        //   value = data.TotalBillItemNos.toString();
        //   break;
        // case "BANKCARDNAME":
        //   value = data.BankCardName;
        //   break;

        // // Service items
        // case "SERVICEITEMONE":
        //   value = data.ServiceItems.length > 0 ? data.ServiceItems[0] : "";
        //   break;
        // case "SERVICEITEMTWO":
        //   value = data.ServiceItems.length > 1 ? data.ServiceItems[1] : "";
        //   break;
        // case "SERVICEITEMTHREE":
        //   value = data.ServiceItems.length > 2 ? data.ServiceItems[2] : "";
        //   break;
        // case "SERVICEITEMONEAMT":
        //   value =
        //     data.ServiceItemsAMT.length > 0 ? data.ServiceItemsAMT[0] : "";
        //   break;
        // case "SERVICEITEMTWOAMT":
        //   value =
        //     data.ServiceItemsAMT.length > 1 ? data.ServiceItemsAMT[1] : "";
        //   break;
        // case "SERVICEITEMTHREEAMT":
        //   value =
        //     data.ServiceItemsAMT.length > 2 ? data.ServiceItemsAMT[2] : "";
        //   break;

        // case "GRANDTOTAL-RETRUN":
        //   const grandTotalReturn = parseFloat(
        //     data.dtTranMaster[0]?.GrandTotal || "0"
        //   );
        //   const srAmountReturn = parseFloat(
        //     data.dtTranMaster[0]?.SRAmount || "0"
        //   );
        //   value = (grandTotalReturn - srAmountReturn).toString();
        //   break;

        // // Gate pass fields
        // case "PRODUCTSGATEPASS":
        //   if (data.productnamegatepass && data.GatePass) {
        //     value = data.productnamegatepass;
        //   }
        //   break;

        // case "QTYGATEPASS":
        //   if (data.Qtygatepass > 0 && data.GatePass) {
        //     value = data.Qtygatepass.toString();
        //   }
        //   break;

        // case "TRANSACTIONTIMEDATEWITHTIME_GATE":
        //   if (data.GatePass) {
        //     value = formatTime(data.TransactionTimeGate);
        //   }
        //   break;

        // case "PRINTDATE_GATE":
        //   if (data.GatePass) {
        //     value = formatDate(new Date());
        //   }
        //   break;

        // case "TOTALITEMS_GATE":
        //   if (data.GatePass) {
        //     value = data.TotalItemsGate.toString();
        //   }
        //   break;

        // case "VOUCHERNUMBER_GATE":
        //   if (data.GatePass) {
        //     value = data.TokenBarcodeGate;
        //   }
        //   break;

        // case "TOKEN_GATE":
        //   if (data.GatePass) {
        //     value = "PLEASE KEEP YOUR TOKEN";
        //   }
        //   break;

        // case "VOUCGER_NO_GATE":
        //   if (data.GatePass) {
        //     value = "*** VOUCHER NO ***";
        //   }
        //   break;

        // case "NAME_GATE":
        //   if (data.GatePass) {
        //     value = "GATEPASS";
        //   }
        //   break;

        default:
          value = "";
          break;
      }
    } catch (error) {
      console.error(`Error processing field ${fieldName}:`, error);
      value = "";
    }

    return value;
  };

