import { useSelector } from "react-redux";
import { Currencies, useNumberToWords } from "./number-to-words";
import { isNullOrUndefinedOrEmpty } from "./Utils";
import { useNumberFormat } from "./hooks/use-number-format";

// ==================== STRICT TYPESCRIPT INTERFACES ====================

export interface TransactionMasterRow {
  readonly CreatedDate: string;
  readonly GrandTotal: string;
  readonly VatAmount: string;
  readonly IQR: string;
  readonly EInvoiceQRCode: string;
  readonly SRAmount: string;
  readonly BillDiscount: string;
  readonly CouponAmt: string;
  readonly VehicleNumber: string;
  readonly PartyDisplayName: string;
  readonly VehicleName: string;
  readonly VehicleModel: string;
  readonly VehicleCapacity: string;
  readonly VehicleManufacturer: string;
  readonly VehicleOwner: string;
  readonly VehicleColor: string;
  readonly VehicleOdometer: string;
  readonly VehicleRemarks: string;
  readonly OldInvTransactionID: string;
  readonly InOut: string;
  readonly CashReturned: string;
}

export interface ApplicationSettings {
  readonly mainSettings: {
    readonly CountryID: number;
    readonly currency: number;
    readonly showNumberFormat: "Millions" | "Lakhs";
    readonly decimalPoints: number;
    readonly MaintainKSAEInvoice: boolean;
    readonly BusinessType: string;
  };
  readonly accountsSettings: {
    readonly DefaultCustomerLedgerID: number;
  };
}

export interface HeaderFooterSettings {
  readonly Header1: string;
  readonly Header2: string;
  readonly Header3: string;
  readonly Header4: string;
  readonly Header5: string;
  readonly Header6: string;
  readonly Header7: string;
  readonly Header8: string;
  readonly Header9: string;
  readonly Header10: string;
  readonly Footer1: string;
  readonly Footer2: string;
  readonly Footer3: string;
  readonly Footer4: string;
  readonly Footer5: string;
  readonly Footer6: string;
  readonly Footer7: string;
  readonly Footer8: string;
  readonly Footer9: string;
  readonly Footer10: string;
}

export interface CommonValuesData {
  readonly dtTranMaster: TransactionMasterRow[];
  readonly GrantTotal: number;
  readonly FldLength: number;
  readonly mBarcode: string;
  readonly AutoBarcode: string;
  readonly BillNumberBarcode: string;
  readonly Transactionbarcode: string;
  readonly DeliveryAddress3: string;
  readonly BILLNUMBER_PREF_BARCODE: string;
  readonly TokenBarcode: string;
  readonly VoucherNumberBarcode: string;
  readonly LastGroupName: string;
  readonly TransactionTime: Date;
  readonly PrintinCopy: number;
  readonly SalesBillNumbers: string;
  readonly SalesRetBillNumbers: string;
  readonly BillAmounts: string;
  readonly RetBillAmounts: string;
  readonly TotalItems: number;
  readonly TotalQty: number;
  readonly TotalPageQty: number;
  readonly TotalFree: number;
  readonly TotalQtyFree: number;
  readonly PageTotFree: number;
  readonly SumOfCGST: number;
  readonly SumOfSGST: number;
  readonly SumOfIGST: number;
  readonly SumOfCessAmt: number;
  readonly SumOfAddCessAmt: number;
  readonly SumOfGST: number;
  readonly SumGST: number;
  readonly ZeroTaxable: number;
  readonly ZeroSGSTAmt: number;
  readonly ZeroCGSTAmt: number;
  readonly ZeroIGSTAmt: number;
  readonly ZeroTotal: number;
  readonly ThreeTaxable: number;
  readonly ThreeSGST: number;
  readonly ThreeCGST: number;
  readonly ThreeIGST: number;
  readonly ThreeTotal: number;
  readonly FiveTaxable: number;
  readonly FiveSGSTAmt: number;
  readonly FiveCGSTAmt: number;
  readonly FiveIGSTAmt: number;
  readonly FiveTotal: number;
  readonly TwelveTaxable: number;
  readonly TwelveSGSTAmt: number;
  readonly TwelveCGSTAmt: number;
  readonly TwelveIGSTAmt: number;
  readonly TwelveTotal: number;
  readonly EighteenTaxable: number;
  readonly EighteenSGSTAmt: number;
  readonly EighteenCGSTAmt: number;
  readonly EighteenIGSTAmt: number;
  readonly EighteenTotal: number;
  readonly TwentyEightTaxable: number;
  readonly TwentyEightSGSTAmt: number;
  readonly TwentyEightCGSTAmt: number;
  readonly TwentyEightIGSTAmt: number;
  readonly TwentyEightTotal: number;
  readonly MRPTOTAL: number;
  readonly MRPDifference: number;
  readonly QRpay: number;
  readonly BankCard: number;
  readonly SumOfGross: number;
  readonly SumOfGrossfc: number;
  readonly SumOfDisc: number;
  readonly SumOfTax: number;
  readonly SumOfNetAmt: number;
  readonly SumOfVAT: number;
  readonly SumOfTotDisc: number;
  readonly SumOfCST: number;
  readonly SumOfNetValue: number;
  readonly SumOfMRP: number;
  readonly SumOfNosQty: number;
  readonly SumOfMRPRate: number;
  readonly SumOfSchemDisc: number;
  readonly SumOfNetWeight: number;
  readonly StateName: string;
  readonly StateCode: string;
  readonly totalSavedAmt: number;
  readonly TotalNetAmount: number;
  readonly BillDiscount: number;
  readonly PageTotalofGross: number;
  readonly PageTotalofDisc: number;
  readonly PageTotalofTax: number;
  readonly PageTotalofNetAmt: number;
  readonly PageTotalofSchmeDisc: number;
  readonly PageTotalofVAT: number;
  readonly PageTotalofTotDisc: number;
  readonly PageTotalofCST: number;
  readonly PageTotalofNetValue: number;
  readonly PageTotalofNosQty: number;
  readonly PageNo: number;
  readonly NoOfPages: number;
  readonly PageTotDebit: number;
  readonly PageTotAmount: number;
  readonly FreeString: string;
  readonly R: number;
  readonly ProductUnitRemarksOrProductName: string;
  readonly PARTYNAME: string;
  readonly ProdName: string;
  readonly ProdDescription: string;
  readonly ProductCode: string;
  readonly ModelNoKOT: string;
  readonly ProductBatchID: number;
  readonly InvQty: number;
  readonly PartyLedgerID: number;
  readonly CashReceived: number;
  readonly CashReturned: number;
  readonly BankAmt: number;
  readonly QtyWithUnit: number;
  readonly UnitNetValue: number;
  readonly LoyaltyCardNo: string;
  readonly CHEQUE_CHEQUEDATE: string;
  readonly CHEQUE_PAYTOACCOUNTNAME: string;
  readonly CHEQUE_AMOUNT: string;
  readonly CHEQUE_REMARKS: string;
  readonly CHEQUE_AMOUNTINWORDS: string;
  readonly VOUCHERTYPE: string;
  readonly CashPaidOrRcvd: number;
  readonly TransDate: Date;
  readonly TransactionDate: Date;
  readonly OpeningBalance: number;
  readonly StockTransferTotalSalesValue: number;
  readonly PageTotalBarcode: string;
  readonly JVTotalDebit: number;
  readonly JVTotalCredit: number;
  readonly InvoiceNumberAndPageTotalBarcode: string;
  readonly PWidth: string;
  readonly PHeight: string;
  readonly Non_Height_Width: string;
  readonly PrintCount: number;
  readonly FCAmount: number;
  readonly IN_OUT: string;
  readonly KM_KitchenRemarks: string;
  readonly KM_Waiter: string;
  readonly KM_OrderNumber: string;
  readonly KM_TableNo: string;
  readonly KM_SeatNo: string;
  readonly KM_TokenNumber: string;
  readonly KM_ServeType: string;
  readonly Narration: string;
  readonly TotalBillQty: number;
  readonly TotalBillItemNos: number;
  readonly BankCardName: string;
  readonly ServiceItems: string[];
  readonly ServiceItemsAMT: string[];
  readonly productnamegatepass: string;
  readonly Qtygatepass: number;
  readonly TransactionTimeGate: Date;
  readonly TotalItemsGate: number;
  readonly TokenBarcodeGate: string;
  readonly GatePass: boolean;
  readonly _InvTransactionMasterID: number;
  readonly Total5PerctaxableValue: number;
  readonly Total5PercTaxValue: number;
  readonly Total15PerctaxableValue: number;
  readonly Total15PercTaxValue: number;
  readonly ZeroPercentTaxableValue: number;
  readonly ZeroPercentTaxValue: number;
  readonly TotalOtherTaxableValue: number;
  readonly TotalOtherTaxValue: number;
  readonly GT: boolean;
}

export interface RootState {
  readonly ApplicationState: ApplicationSettings;
  readonly HeaderFooter: HeaderFooterSettings;
}

// ==================== COUNTRY ID TO CURRENCY MAPPING ====================

const COUNTRY_ID_TO_CURRENCY: Record<number, Currencies> = {
  1: Currencies.SaudiArabia, // Saudi Arabia
  124: Currencies.Qatar, // Qatar
  120: Currencies.UAE, // UAE
  122: Currencies.Bahrain, // Bahrain
  104: Currencies.Oman, // Oman
  118: Currencies.Kuwait, // Kuwait
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

export const useCommonValues = () => {
  const applicationSettings = useSelector(
    (state: RootState) => state.ApplicationState
  );
  const headerFooter = useSelector((state: RootState) => state.HeaderFooter);
  const { convertAmountToEnglish, convertAmountToArabic } = useNumberToWords();
const{posRoundAmount} = useNumberFormat()
  const getCommonValues = (
    fieldName: string,
    master: any,
    details: any[],
    detail: any,
    copyCount: number,
    options?: {
      fieldLength?: number;
      isCashInHandLedger?: boolean;
      isLedgerUnderBank?: boolean;
    }
  ): { value: string; result: boolean } => {
    let result = false;
    let value = "";
    const fieldLength = options?.fieldLength ?? 0;
    const isCashInHandLedger = options?.isCashInHandLedger ?? false;
    const isLedgerUnderBank = options?.isLedgerUnderBank ?? false;
    const transMasterID =
      master?.accTransactionMasterID ?? master?.invTransactionMasterID ?? 0;
    try {
      switch (fieldName.toUpperCase()) {
        case "AMOUNTINWORDS":
          value = convertAmountToEnglish(master?.grantTotal);
          break;

        case "AMOUNTINWORDSLINE2":
          const amountInWords = convertAmountToEnglish(master?.grantTotal);
          if (amountInWords.length > fieldLength) {
            value = amountInWords.substring(fieldLength);
          } else {
            value = "";
          }
          break;

        case "AMOUNTINWORDSINARABIC":
          const countryId = applicationSettings.mainSettings.CountryID;
          const currency =
            COUNTRY_ID_TO_CURRENCY[countryId] ?? Currencies.Other;
          value = convertAmountToArabic(master?.grantTotal, currency);
          break;

        case "MANNUALORAUTOBARCODE":
          value =
            isNullOrUndefinedOrEmpty(detail?.mBarcode) ? detail?.mBarcode : detail?.AutoBarcode;
          break;

        case "BILLNUMBERBARCODE":
          value = `(1${master?.voucherType}${master?.voucherNumber})`;
          break;

        case "TRANSACTIONBARCODE":
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

        case "TOKENBARCODE":
          value = `(${master?.voucherNumber})`;
          break;

        case "VOUCHERNUMBERBARCODE":
          value =
            master.voucherNumber.length < 2
              ? `(00${master.voucherNumber})`
              : master.voucherNumber.length < 3
              ? `(0${master.voucherNumber})`
              : `(${master.voucherNumber})`;
          break;

        case "GROUPNAMEHEAD":
          value = details?.findLast(x => x != undefined)?.groupName;
          break;

        case "PRINTTIME":
          value = formatTime(new Date());
          break;

        // case "TRANSACTIONTIME":
        //   value = formatTime(data.TransactionTime);
        //   break;

        case "PRINTDATE":
          value = formatDate(new Date());
          break;

        case "DATE":
          value = new Date().toString();
          break;

        case "PRINTCOPYSTATUS":
          value = getPrintCopyStatus(copyCount);
          break;

        case "PRINTCOPYSTATUS2":
          value = getPrintCopyStatus2(copyCount);
          break;

        case "SALESBILLNUMBERS":
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
        case "TOTALITEMS":
          value = details?.length.toString();
          break;
        case "SUM OF QTY":
          value = details?.reduce((acc, x) => acc + (x?.qty ?? 0), 0);
          break;
        // case "PAGE TOTAL OF QTY": value = data.TotalPageQty.toString(); break;
        case "SUM OF FREE":
          value = details?.reduce((acc, x) => acc + (x?.free ?? 0), 0);
          break;
        case "SUM OF QTY+FREE":
        case "TOTAL QTY AND FREE":
          const totalQtyFree = details?.reduce(
            (acc, x) => acc + (x?.qty ?? 0) + (x?.free ?? 0),
            0
          );
          break;
          value = totalQtyFree.toString();
          break;

        // case "PAGE TOTAL OF FREE": value = data.PageTotFree.toString(); break;

        // GST fields
        case "SUM OF CGST":
          value = details?.reduce((acc, x) => acc + (x?.cgst ?? 0), 0);
          break;
        case "SUM OF SGST":
          value = details?.reduce((acc, x) => acc + (x?.sgst ?? 0), 0);
          break;
        case "SUM OF IGST":
          value = details?.reduce((acc, x) => acc + (x?.igst ?? 0), 0);
          break;
        case "SUM OF CESSAMT":
          value = details?.reduce((acc, x) => acc + (x?.cessAmt ?? 0), 0);
          break;
        case "SUM OF ADDCESSAMT":
          value = details?.reduce(
            (acc, x) => acc + (x?.additionalCess ?? 0),
            0
          );
          break;
        case "SUM OF GST":
          value = details?.reduce(
            (acc, x) =>
              acc +
              (x?.cgst ?? 0) +
              (x?.sgst ?? 0) +
              (x?.igst ?? 0) +
              (x?.cessAmt ?? 0) +
              (x?.additionalCess ?? 0),
            0
          );
          break;

        // Tax rate specific fields
        case "TAXABLE 0%":
          value = details?.filter(x => x.sGSTPerc == 0 && x.cGSTPerc == 0 && x.iGSTPerc == 0).reduce((acc, x) => acc + (x?.netValue ?? 0), 0);
          break;
        case "SGST 0%":
         value = details?.filter(x => x.sGSTPerc == 0 && x.cGSTPerc == 0 && x.iGSTPerc == 0).reduce((acc, x) => acc + (x?.sGST ?? 0), 0);
          break;
        case "CGST 0%":
          value = details?.filter(x => x.sGSTPerc == 0 && x.cGSTPerc == 0 && x.iGSTPerc == 0).reduce((acc, x) => acc + (x?.cGST ?? 0), 0);
          break;
        case "IGST 0%":
          value = details?.filter(x => x.sGSTPerc == 0 && x.cGSTPerc == 0 && x.iGSTPerc == 0).reduce((acc, x) => acc + (x?.iGST ?? 0), 0);
          break;
        case "TOTAL 0%":
          value = details?.filter(x => x.sGSTPerc == 0 && x.cGSTPerc == 0 && x.iGSTPerc == 0).reduce((acc, x) => acc + (x?.sGST ?? 0)+ (x?.cGST ?? 0)+ (x?.iGST ?? 0), 0);
          break;

        case "TAXABLE 3%":
          value = details?.filter(x => x.sGSTPerc == 3 && x.cGSTPerc == 3 && x.iGSTPerc == 3).reduce((acc, x) => acc + (x?.netValue ?? 0), 0);
          break;
        case "SGST 3%":
         value = details?.filter(x => x.sGSTPerc == 3 && x.cGSTPerc == 3 && x.iGSTPerc == 3).reduce((acc, x) => acc + (x?.sGST ?? 0), 0);
          break;
        case "CGST 3%":
          value = details?.filter(x => x.sGSTPerc == 3 && x.cGSTPerc == 3 && x.iGSTPerc == 3).reduce((acc, x) => acc + (x?.cGST ?? 0), 0);
          break;
        case "IGST 3%":
          value = details?.filter(x => x.sGSTPerc == 3 && x.cGSTPerc == 3 && x.iGSTPerc == 3).reduce((acc, x) => acc + (x?.iGST ?? 0), 0);
          break;
        case "TOTAL 3%":
          value = details?.filter(x => x.sGSTPerc == 3 && x.cGSTPerc == 3 && x.iGSTPerc == 3).reduce((acc, x) => acc + (x?.sGST ?? 0)+ (x?.cGST ?? 0)+ (x?.iGST ?? 0), 0);
          break;

        // 5% GST Cases
        case "TAXABLE 5%":
          value = details?.filter(x => x.sGSTPerc == 5 && x.cGSTPerc == 5 && x.iGSTPerc == 5).reduce((acc, x) => acc + (x?.netValue ?? 0), 0);
          break;
        case "SGST 5%":
          value = details?.filter(x => x.sGSTPerc == 5 && x.cGSTPerc == 5 && x.iGSTPerc == 5).reduce((acc, x) => acc + (x?.sGST ?? 0), 0);
          break;
        case "CGST 5%":
          value = details?.filter(x => x.sGSTPerc == 5 && x.cGSTPerc == 5 && x.iGSTPerc == 5).reduce((acc, x) => acc + (x?.cGST ?? 0), 0);
          break;
        case "IGST 5%":
          value = details?.filter(x => x.sGSTPerc == 5 && x.cGSTPerc == 5 && x.iGSTPerc == 5).reduce((acc, x) => acc + (x?.iGST ?? 0), 0);
          break;
        case "TOTAL 5%":
          value = details?.filter(x => x.sGSTPerc == 5 && x.cGSTPerc == 5 && x.iGSTPerc == 5).reduce((acc, x) => acc + (x?.sGST ?? 0) + (x?.cGST ?? 0) + (x?.iGST ?? 0), 0);
          break;

        // 12% GST Cases
        case "TAXABLE 12%":
          value = details?.filter(x => x.sGSTPerc == 12 && x.cGSTPerc == 12 && x.iGSTPerc == 12).reduce((acc, x) => acc + (x?.netValue ?? 0), 0);
          break;
        case "SGST 12%":
          value = details?.filter(x => x.sGSTPerc == 12 && x.cGSTPerc == 12 && x.iGSTPerc == 12).reduce((acc, x) => acc + (x?.sGST ?? 0), 0);
          break;
        case "CGST 12%":
          value = details?.filter(x => x.sGSTPerc == 12 && x.cGSTPerc == 12 && x.iGSTPerc == 12).reduce((acc, x) => acc + (x?.cGST ?? 0), 0);
          break;
        case "IGST 12%":
          value = details?.filter(x => x.sGSTPerc == 12 && x.cGSTPerc == 12 && x.iGSTPerc == 12).reduce((acc, x) => acc + (x?.iGST ?? 0), 0);
          break;
        case "TOTAL 12%":
          value = details?.filter(x => x.sGSTPerc == 12 && x.cGSTPerc == 12 && x.iGSTPerc == 12).reduce((acc, x) => acc + (x?.sGST ?? 0) + (x?.cGST ?? 0) + (x?.iGST ?? 0), 0);
          break;

        // 18% GST Cases
        case "TAXABLE 18%":
          value = details?.filter(x => x.sGSTPerc == 18 && x.cGSTPerc == 18 && x.iGSTPerc == 18).reduce((acc, x) => acc + (x?.netValue ?? 0), 0);
          break;
        case "SGST 18%":
          value = details?.filter(x => x.sGSTPerc == 18 && x.cGSTPerc == 18 && x.iGSTPerc == 18).reduce((acc, x) => acc + (x?.sGST ?? 0), 0);
          break;
        case "CGST 18%":
          value = details?.filter(x => x.sGSTPerc == 18 && x.cGSTPerc == 18 && x.iGSTPerc == 18).reduce((acc, x) => acc + (x?.cGST ?? 0), 0);
          break;
        case "IGST 18%":
          value = details?.filter(x => x.sGSTPerc == 18 && x.cGSTPerc == 18 && x.iGSTPerc == 18).reduce((acc, x) => acc + (x?.iGST ?? 0), 0);
          break;
        case "TOTAL 18%":
          value = details?.filter(x => x.sGSTPerc == 18 && x.cGSTPerc == 18 && x.iGSTPerc == 18).reduce((acc, x) => acc + (x?.sGST ?? 0) + (x?.cGST ?? 0) + (x?.iGST ?? 0), 0);
          break;

        // 28% GST Cases
        case "TAXABLE 28%":
          value = details?.filter(x => x.sGSTPerc == 28 && x.cGSTPerc == 28 && x.iGSTPerc == 28).reduce((acc, x) => acc + (x?.netValue ?? 0), 0);
          break;
        case "SGST 28%":
          value = details?.filter(x => x.sGSTPerc == 28 && x.cGSTPerc == 28 && x.iGSTPerc == 28).reduce((acc, x) => acc + (x?.sGST ?? 0), 0);
          break;
        case "CGST 28%":
          value = details?.filter(x => x.sGSTPerc == 28 && x.cGSTPerc == 28 && x.iGSTPerc == 28).reduce((acc, x) => acc + (x?.cGST ?? 0), 0);
          break;
        case "IGST 28%":
          value = details?.filter(x => x.sGSTPerc == 28 && x.cGSTPerc == 28 && x.iGSTPerc == 28).reduce((acc, x) => acc + (x?.iGST ?? 0), 0);
          break;
        case "TOTAL 28%":
          value = details?.filter(x => x.sGSTPerc == 28 && x.cGSTPerc == 28 && x.iGSTPerc == 28).reduce((acc, x) => acc + (x?.sGST ?? 0) + (x?.cGST ?? 0) + (x?.iGST ?? 0), 0);
          break;

        

        // case "MRPDIFFERENCE":
        //   value = data.MRPDifference.toString();
        //   break;
        // case "QRPAY":
        //   value = data.QRpay.toString();
        //   break;
        // case "BANKCARD":
        //   value = data.BankCard.toString();
        //   break;


        // case "STATENAME":
        //   value = data.StateName;
        //   break;
        // case "STATECODE":
        //   value = data.StateCode;
        //   break;

        case "YOU SAVED":
          const bill = master.netAmount - master.billDiscount;
          const totalSaved = details?.reduce((acc, x) => acc + (x?.mrp ?? 0), 0) - bill;
          const roundSaved = posRoundAmount(totalSaved);
          value = roundSaved.toString();
          break;

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

    return { value, result };
  };

  return {
    getCommonValues,
    formatNumericValue,
    formatCurrencyValue,
    roundAmount,
    parseAddress,
    formatDate,
    formatTime,
    getPrintCopyStatus,
    getPrintCopyStatus2,
    getInOutArabic,
    getModeOfPayment,
    getModeOfPaymentArabic,
  };
};

// ==================== EXPORT TYPES ====================

export type UseCommonValuesReturn = ReturnType<typeof useCommonValues>;
export type GetCommonValuesFunction = UseCommonValuesReturn["getCommonValues"];
export type CommonValuesResult = ReturnType<GetCommonValuesFunction>;

// ==================== EXAMPLE USAGE COMPONENT ====================

// export const CommonValuesExample: React.FC = () => {
//   const { getCommonValues } = useCommonValues();

//   // Example data structure
//   const exampleData: CommonValuesData = {
//     dtTranMaster: [
//       {
//         CreatedDate: "2024-01-01T10:00:00",
//         GrandTotal: "1234.56",
//         VatAmount: "123.45",
//         IQR: "sample-iqr",
//         EInvoiceQRCode: "sample-qr",
//         SRAmount: "0",
//         BillDiscount: "50.00",
//         CouponAmt: "0",
//         VehicleNumber: "ABC123",
//         PartyDisplayName: "John Doe",
//         VehicleName: "Toyota Camry",
//         VehicleModel: "2024",
//         VehicleCapacity: "5",
//         VehicleManufacturer: "Toyota",
//         VehicleOwner: "John Doe",
//         VehicleColor: "White",
//         VehicleOdometer: "15000",
//         VehicleRemarks: "Good condition",
//         OldInvTransactionID: "0",
//         InOut: "DINE IN",
//         CashReturned: "0"
//       }
//     ],
//     GrantTotal: 1234.56,
//     FldLength: 50,
//     // ... other required fields would be initialized here
//   } as CommonValuesData;

//   const result = getCommonValues("AMOUNTINWORDS", exampleData);

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Common Values Example</h2>
//       <div className="bg-gray-50 p-4 rounded">
//         <p><strong>Field:</strong> AMOUNTINWORDS</p>
//         <p><strong>Value:</strong> {result.value}</p>
//         <p><strong>Result:</strong> {result.result.toString()}</p>
//       </div>
//     </div>
//   );
// };
