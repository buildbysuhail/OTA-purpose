import { Currencies } from "../utilities/number-to-words";
import { HeaderFooter } from "../redux/slices/user-session/reducer";
import Urls from "../redux/urls";
import { APIClient } from "../helpers/api-client";
import { DeepPartial } from "redux";
import {
  getAmountInWords,
  getArabicNumber,
  isNullOrUndefinedOrEmpty,
  isNullOrUndefinedOrZero,
  val,
} from "../utilities/Utils";
import {
  PrintResponse,
  PrintDetailDto,
  PrintMasterDto,
  CompanyDetailsForPrint,
  PartyDetailsForPrint,
  InvDetail2ForPrint,
  LedgerReportDataForPrint,
  PrintData,
  ledgerDataPrint,
  ChequeDataPrint,
} from "./use-print-type";
import {
  initialPrintCustomFields,
  initialPrintResponse,
} from "./use-print-type-data";
import { merge } from "lodash";
import { TemplateState } from "./InvoiceDesigner/Designer/interfaces";
import {
  getStorageString,
  removeStorageString,
  setStorageString,
} from "../utilities/storage-utils";
import {
  base64UnicodeToModel,
  modelToBase64Unicode,
  toCamelCase,
} from "../utilities/jsonConverter";
import { decompressData } from "../utilities/compression";
import { templateInitialState } from "../redux/reducers/TemplateReducer";
import localforage from "localforage";
import { de } from "date-fns/locale";

// type VoucherType = {
//   voucherType: string;
//   transactionType: string;
// };

interface ProcessPrintOptions {
  MasterIDParam: number;
  voucherTypeParam: string;
  isInvTrans?: boolean;
  isSalesView?: boolean;
  isServiceTrans?: boolean;
  transDate?: string;
  printCopies?: number;
  isReprint?: boolean;
  isPOSPrinting?: boolean;
  isFromSalesReceipt?: boolean;
  isPackingSlipPrint?: boolean;
  warehouseID?: number;
  kitchenIDParam?: number;
  kitchenPrinterNameParam?: string;
  kitchenNameParam?: string;
  commonKitchenProductGroupIDParam?: number;
  dbIdValue?: string;
  isAppGlobal?: boolean;
}

export function getKsaQrCode(
  transDate: Date,
  totalWithVat: string,
  vat: string,
  companyData: CompanyDetailsForPrint
): string {
  const sellerName = companyData.registeredName; // replace with config/company profile
  const vatRegNo = companyData.taxRegNo; // replace with config/company profile

  // format datetime like "YYYY-MM-DDTHH:mm:ssZ"
  const dateStr =
    transDate.getUTCFullYear().toString().padStart(4, "0") +
    "-" +
    (transDate.getUTCMonth() + 1).toString().padStart(2, "0") +
    "-" +
    transDate.getUTCDate().toString().padStart(2, "0");

  const timeStr =
    transDate.getUTCHours().toString().padStart(2, "0") +
    ":" +
    transDate.getUTCMinutes().toString().padStart(2, "0") +
    ":" +
    transDate.getUTCSeconds().toString().padStart(2, "0");

  const datetime = `${dateStr}T${timeStr}Z`;

  // Tag-Length-value (TLV) encoding
  const tlv: [number, string][] = [
    [1, sellerName],
    [2, vatRegNo],
    [3, datetime],
    [4, totalWithVat],
    [5, vat],
  ];

  // Encode TLV into bytes
  let bytes: number[] = [];
  for (const [tag, value] of tlv) {
    const valueBytes = new TextEncoder().encode(value);
    bytes.push(tag); // tag
    bytes.push(valueBytes.length); // length
    bytes.push(...valueBytes); // value
  }

  // Convert to Base64
  return btoa(String.fromCharCode(...bytes));
}
// const { posRoundAmount } = useNumberFormat();
// const userSession = useSelector((state: RootState) => state.UserSession)

const getDeliveryAddressPart = (address: string, index: number) => {
  if (!address) return "";
  const parts = address.split(", ");
  return parts[index] || "";
};

const updateDetailsAndSummary = async (
  printData: PrintResponse,
  fields: (keyof DeepPartial<PrintDetailDto>)[],
  voucherType: string,
  isAppGlobal: boolean
) => {
  const dtTransDetails = printData.details;
  if (!dtTransDetails) return;

  for (let i = 0; i < dtTransDetails.length; i++) {
    const row: PrintDetailDto = dtTransDetails[i];

    if (fields && fields.length > 0) {
      const customFields = fields.filter((f) =>
        ["groupNameHead", "mannualOrAutoBarcode"].includes(f as string)
      );
      for (let j = 0; j < customFields.length; j++) {
        switch (voucherType) {
          case "groupNameHead":
            dtTransDetails[i].groupNameHead = dtTransDetails[i].groupName;
          case "mannualOrAutoBarcode":
            dtTransDetails[i].mannualAutoBarcode =
              dtTransDetails[i].mannualBarcode || dtTransDetails[i].autoBarcode;
        }
      }
    }

    if (
      !printData.custom.isInvTrans &&
      !printData.custom.isSalesView &&
      !printData.custom.isServiceTrans
    ) {
      printData.custom.pageTotDebit += row.debit ?? 0;
      const amt = (row.debit ?? 0) + (row.credit ?? 0);
      printData.custom.narration = row.narration || "";
      printData.custom.cashPaidOrRcvd = amt;

      // Set party ledger ID based on voucher type
      switch (voucherType) {
        case "CR":
        case "CN":
        case "BR":
          printData.custom.partyLedgerID = row.relatedLedgerID ?? 0;
          break;
        case "JV":
        case "OB":
        case "CB":
          if (row.debit ?? 0 > 0) {
            printData.custom.partyLedgerID = row.ledgerID ?? 0;
          } else {
            printData.custom.partyLedgerID = row.relatedLedgerID ?? 0;
          }
          break;
        case "CP":
        case "DN":
        case "BP":
          printData.custom.partyLedgerID = row.ledgerID ?? 0;
          break;
      }
      // Set final grant total
      return;
    }
    // Group header
    if (
      row.groupName?.toUpperCase() !==
      printData.custom.lastGroupName?.toUpperCase()
    ) {
      printData.custom.lastGroupName = row.groupName?.toUpperCase() || "";
      printData.hasGroupHeaderPrinting = true;
    } else {
      printData.hasGroupHeaderPrinting = false;
    }

    // Running totals
    printData.custom.pageTotDebit += row.netAmount || 0;
    printData.custom.totalPageQty += row.quantity || 0;
    printData.custom.totalNetAmount += row.netAmount || 0;
    printData.custom.totalNetValue += row.netAmount || 0;

    // Product info
    printData.custom.prodName = row.productName || "";
    printData.custom.prodDescription = row.productDescription || "";
    printData.custom.productCode = row.productCode || "";
    printData.custom.modelNoKOT = row.modelNo || "";

    // Gate pass
    if (row.specification === "Y") {
      printData.custom.productNameGatePass = row.productName || "";
      printData.custom.qtyGatePass = row.quantity ?? 0;
      printData.custom.totalItemsGate += row.quantity ?? 0;
      printData.custom.gt = true;
    }

    // GST calculations
    if (isAppGlobal) {
      const cgst = row.detail2Data.cgst ?? 0;
      const sgst = row.detail2Data.sgst ?? 0;
      const igst = row.detail2Data.igst ?? 0;
      const cessAmt = row.detail2Data.cessAmt ?? 0;
      const addCess = row.detail2Data.additionalCess ?? 0;

      printData.custom.sumOfCGST += cgst;
      printData.custom.sumOfSGST += sgst;
      printData.custom.sumOfIGST += igst;
      printData.custom.sumOfCessAmt += cessAmt;
      printData.custom.sumOfAddCessAmt += addCess;
      printData.custom.sumOfGST += cgst + sgst + igst + cessAmt + addCess;

      const totalGSTPerc =
        (row.detail2Data.sgstPerc ?? 0) +
        (row.detail2Data.cgstPerc ?? 0) +
        (row.detail2Data.igstPerc ?? 0);

      const netValue = row.netValue ?? 0;

      if (totalGSTPerc === 0) {
        printData.custom.zeroTaxable += netValue;
        printData.custom.sGST_0_Perc += sgst;
        printData.custom.cGST_0_Perc += cgst;
        printData.custom.iGST_0_Perc += igst;
        printData.custom.total_0_Perc += cgst + sgst + igst;
      } else if (totalGSTPerc === 3) {
        printData.custom.taxable_3_Perc += netValue;
        printData.custom.sGST_3_Perc += sgst;
        printData.custom.cGST_3_Perc += cgst;
        printData.custom.iGST_3_Perc += igst;
        printData.custom.total_3_Perc += cgst + sgst + igst;
      } else if (totalGSTPerc === 5) {
        printData.custom.taxable_5_Perc += netValue;
        printData.custom.sGST_5_Perc += sgst;
        printData.custom.cGST_5_Perc += cgst;
        printData.custom.iGST_5_Perc += igst;
        printData.custom.total_5_Perc += cgst + sgst + igst;
      } else if (totalGSTPerc === 12) {
        printData.custom.taxable_12_Perc += netValue;
        printData.custom.sGST_12_Perc += sgst;
        printData.custom.cGST_12_Perc += cgst;
        printData.custom.iGST_12_Perc += igst;
        printData.custom.total_12_Perc += cgst + sgst + igst;
      } else if (totalGSTPerc === 18) {
        printData.custom.taxable_18_Perc += netValue;
        printData.custom.sGST_18_Perc += sgst;
        printData.custom.cGST_18_Perc += cgst;
        printData.custom.iGST_18_Perc += igst;
        printData.custom.total_18_Perc += cgst + sgst + igst;
      } else if (totalGSTPerc === 28) {
        printData.custom.taxable_28_Perc += netValue;
        printData.custom.sGST_28_Perc += sgst;
        printData.custom.cGST_28_Perc += cgst;
        printData.custom.iGST_28_Perc += igst;
        printData.custom.total_28_Perc += cgst + sgst + igst;
      }
    }

    // Other totals
    printData.custom.sumOfGross += row.grossValue ?? 0;
    printData.custom.sumOfDisc += row.discountAmt1 ?? 0;
    printData.custom.sumOfNetAmt += row.netAmount ?? 0;
    printData.custom.sumOfNetValue += row.netValue ?? 0;
    printData.custom.totalQty += row.quantity ?? 0;
    printData.custom.totalFree += row.free ?? 0;

    // MRP calc
    const mrp = row.mrp ?? 0;
    const qty = row.quantity ?? 0;
    const rateWithTax = row.rateWithTax ?? 0;
    if (mrp > 0) {
      printData.custom.mrpDifference += mrp * qty - rateWithTax * qty;
      printData.custom.mrpTotal += mrp * qty;
    }

    // currentRow = i + 1;
  }
  printData.details = dtTransDetails;

  if (
    !printData.custom.isInvTrans &&
    !printData.custom.isSalesView &&
    !printData.custom.isServiceTrans
  ) {
    const debit = printData.master.totalDebit || 0;
    const credit = printData.master.totalCredit || 0;
    printData.master.grandTotal = debit > 0 ? debit : credit;
  }
  // Finalize
  let grantTotal = 0;
  let exchangeRateVal = 1;
  let sumOfGrossfc = 0;
  if (printData.custom.isInvTrans && printData.master) {
    grantTotal = printData.master.grandTotal ?? 0;
    exchangeRateVal = printData.master.exchangeRate ?? 1;
    printData.custom.sumOfGrossfc =
      printData.custom.sumOfGross / exchangeRateVal;
  }

  return printData;
};

export const processPrintResponse = async (
  printData: PrintResponse,
  options: ProcessPrintOptions
): Promise<PrintResponse> => {
  const {
    MasterIDParam,
    voucherTypeParam,
    isInvTrans = false,
    isSalesView = false,
    isServiceTrans = false,
    transDate = "2014-1-1",
    printCopies = 1,
    isReprint = false,
    isPOSPrinting = false,
    isFromSalesReceipt = false,
    isPackingSlipPrint = false,
    warehouseID = 0,
    kitchenIDParam = 0,
    kitchenPrinterNameParam = "",
    kitchenNameParam = "",
    commonKitchenProductGroupIDParam = 0,
    dbIdValue = "",
    isAppGlobal = false,
  } = options;

  let returnData: PrintResponse = merge({}, initialPrintResponse, printData);
  returnData.custom = returnData.custom ?? initialPrintCustomFields;

  if (isNullOrUndefinedOrEmpty(printData?.master)) return returnData;
  //template decode if it from in token

  // Kitchen Print
  const isKitchenPrint =
    !isNullOrUndefinedOrZero(kitchenIDParam) ||
    !isNullOrUndefinedOrZero(commonKitchenProductGroupIDParam) ||
    !isNullOrUndefinedOrEmpty(kitchenPrinterNameParam) ||
    !isNullOrUndefinedOrEmpty(kitchenNameParam);

  if (isKitchenPrint) {
    returnData.custom.kitchenID = kitchenIDParam;
    returnData.custom.kitchenPrinterName = kitchenPrinterNameParam ?? "";
    returnData.custom.printerName = kitchenPrinterNameParam ?? "";
    returnData.custom.kitchenName = kitchenNameParam;
    returnData.custom.commonKitchenProductGroupID =
      commonKitchenProductGroupIDParam;
  }

  // Barcode
  let barcode = "";
  if (MasterIDParam < 10) barcode = `*00000${MasterIDParam}*`;
  else if (MasterIDParam < 100) barcode = `*0000${MasterIDParam}*`;
  else if (MasterIDParam < 1000) barcode = `*000${MasterIDParam}*`;
  else barcode = `*${MasterIDParam}*`;

  returnData.custom.transactionBarcode = barcode;

  // Skip kitchen-only prints
  if (isKitchenPrint) {
    returnData.custom.transactionTime =
      printData?.master?.systemDateTime.toString();
    return returnData;
  }

  if (isServiceTrans) return returnData;

  if (printData && printData.master) {
    const voucherNumber = printData.master?.voucherNumber || "";
    const voucherTypeCode = printData.master?.voucherType || "";
    const voucherPrefix = printData.master?.voucherPrefix || "";

    returnData.custom.billNumberBarcode = `(1${voucherTypeCode}${voucherNumber})`;
    returnData.custom.tokenBarcode = `(${voucherNumber})`;

    if (voucherNumber.toString().length < 2)
      returnData.custom.voucherNumberBarcode = `(00${voucherNumber})`;
    else if (voucherNumber.toString().length < 3)
      returnData.custom.voucherNumberBarcode = `(0${voucherNumber})`;
    else returnData.custom.voucherNumberBarcode = `(${voucherNumber})`;

    returnData.custom.billNumberPrefBarcode = `(${voucherPrefix}.1${voucherTypeCode}${voucherNumber})`;
    returnData.custom.transactionTimeGate = new Date(
      printData.master?.transactionDateWithTime || new Date()
    ).toISOString();

    returnData.custom.isFromSalesReceipt = isFromSalesReceipt;
    if (printCopies > 0) returnData.custom.noOfCopies = printCopies;
    returnData.custom.transactionDate = transDate;
    returnData.custom.isPOSPrinting = isPOSPrinting;
    returnData.custom.isInvTrans = isInvTrans;
    returnData.custom.isSalesView = isSalesView;
    returnData.custom.isReprint = isReprint;

    // Inventory
    if (isInvTrans) {
      if (isPackingSlipPrint) {
        let totalBillQtyCalc = 0;
        if (printData.details) {
          for (let i = 0; i < printData.details.length; i++) {
            totalBillQtyCalc += printData.details[i].quantity || 0;
          }
        }
        returnData.custom.totalBillQty = totalBillQtyCalc;
        returnData.custom.billDiscount = printData.details
          ? printData.details.length
          : 0;

        if (dbIdValue === "SUBAI_SWEETS") {
          const sorted = [...(printData.details || [])].sort((a, b) => {
            const groupCompare = (a.groupName || "").localeCompare(
              b.groupName || ""
            );
            if (groupCompare !== 0) return groupCompare;
            const unitCompare = (a.unitName || "").localeCompare(
              b.unitName || ""
            );
            if (unitCompare !== 0) return unitCompare;
            return (
              (a.invTransactionDetailID || 0) - (b.invTransactionDetailID || 0)
            );
          });
          returnData.details = sorted;
        } else if (warehouseID > 0) {
          const filtered = (printData.details || []).filter(
            (item: PrintDetailDto) => (item.warehouseID || 0) === warehouseID
          );
          returnData.details = filtered;
        }
      }
    } else {
      returnData.custom.totalItems = printData.details
        ? printData.details.length
        : 0;
      const grandTotalValue =
        printData.master?.totalDebit && printData.master?.totalDebit > 0
          ? printData.master.totalDebit
          : printData.master?.totalCredit || 0;
      returnData.master.grandTotal = grandTotalValue;
      returnData.custom.jvTotalDebit = 0;
      returnData.custom.jvTotalCredit = 0;

      if (voucherTypeParam === "JV" && printData?.master) {
        if (printData.master.drCr === "Dr") {
          returnData.custom.jvTotalCredit = grandTotalValue;
        } else {
          returnData.custom.jvTotalDebit = grandTotalValue;
        }
      }
    }
  }

  return returnData;
};

export const loadPrintData = async (
  MasterIDParam: number,
  voucherTypeParam: string,
  isInvTrans = false,
  isSalesView = false,
  isServiceTrans = false,
  transDate = "2014-1-1",
  printCopies = 1,
  isReprint = false,
  isPOSPrinting = false,
  isFromSalesReceipt = false,
  isPackingSlipPrint = false,
  warehouseID = 0,
  kitchenIDParam = 0,
  kitchenPrinterNameParam?: string,
  kitchenNameParam = "",
  commonKitchenProductGroupIDParam = 0,
  transactionType: string = "",
  dbIdValue: string = "",
  voucherType: string = "",
  isAppGlobal: boolean = false,
  template?: TemplateState<unknown>
): Promise<PrintResponse> => {
  const api = new APIClient();
  // let returnData: PrintResponse = initialPrintResponse;

  try {
    console.log(`${MasterIDParam}-MasterIDParam`);
    let fields: (keyof any)[] = []; // deepPartial PrintResponse
    const multiPayment =
      fields.includes("custom.bankCard") || fields.includes("qrPay");
    const printCount = fields.includes("printCount");
    const privilageCardBalance = fields.includes("privilageCardBalance"); //&& PrivCardNumber
    const taxAmountIncludingTaxOnDiscount =
      fields.includes("total5PercTaxValue") ||
      fields.includes("total15PercTaxValue") ||
      fields.includes("totalzeroPercentTaxValue");
    const taxableAmountIncludingTaxOnDiscount =
      fields.includes("total5PerctaxableValue") ||
      fields.includes("total15PerctaxableValue") ||
      fields.includes("totalzeroPercentTaxableValue");
    const printData: PrintResponse = await api.getAsync(`${
      isInvTrans ? Urls.inv_transaction_base : Urls.acc_transaction_base
    }${transactionType}/print/?
        KitchenId=${0}&CommonKitchenProductGroupId=${0}&IncludeStockDetails=${true}&IncludePreviousLedgerBalance=${true}
        &IncludeLoyaltyCardBalance=${true}&masterId=${MasterIDParam}&multiPayment=${multiPayment}
                                            &printCount= ${printCount}
                                            &taxableAmountIncludingTaxOnDiscount= ${taxableAmountIncludingTaxOnDiscount}
                                            &taxAmountIncludingTaxOnDiscount= ${taxAmountIncludingTaxOnDiscount}
                                            &privilageCardBalance= ${privilageCardBalance}`);
    const processed = await processPrintResponse(printData, {
      MasterIDParam,
      voucherTypeParam,
      isInvTrans,
      isSalesView,
      isServiceTrans,
      transDate,
      printCopies,
      isReprint,
      isPOSPrinting,
      isFromSalesReceipt,
      isPackingSlipPrint,
      warehouseID,
      kitchenIDParam,
      kitchenPrinterNameParam,
      kitchenNameParam,
      commonKitchenProductGroupIDParam,
      dbIdValue,
    });

    return processed;
  } catch (error) {
    console.error("Error loading print data:", error);
    throw error;
  }
};

export const fetchDefaultTemplateFromToken = async (token: string) => {
  try {
    const api = new APIClient();
    const res = await api.postAsync(Urls.print_helper_byToken, {
      token: token,
    });
    // const { createdUser, modifiedUser, ...template } = Data;

    const resDate = res.item.printData;
    const { template, ...rest } = resDate;
    let Template = template;
    const PrintResponse: PrintResponse = rest;
    const resTokenInfo = res.item.token;
    if (res.isOk && resDate) {
      const processed = await processPrintResponse(PrintResponse, {
        MasterIDParam: resTokenInfo?.masterId || 0,
        voucherTypeParam: resTokenInfo?.voucherType || "",
        isInvTrans: resTokenInfo?.type == "inv" ? true : false,
        isSalesView: resTokenInfo?.isSalesView,
        isServiceTrans: resTokenInfo.isServiceTrans,
        transDate: new Date(resTokenInfo?.transactionDate).toISOString(),
        printCopies: resTokenInfo?.printCopies,
        isReprint: resTokenInfo?.isReprint,
        isPOSPrinting: resTokenInfo?.isPOSPrinting,
        isFromSalesReceipt: resTokenInfo?.isFromSalesReceipt,
        isPackingSlipPrint: resTokenInfo?.isPackingSlipPrint,
        warehouseID: resTokenInfo?.warehouseID,
        kitchenIDParam: resTokenInfo?.kitchenId,
        kitchenPrinterNameParam: resTokenInfo?.kitchenPrinterName,
        kitchenNameParam: resTokenInfo?.kitchenName,
        commonKitchenProductGroupIDParam:
          resTokenInfo?.commonKitchenProductGroupId,
        dbIdValue: resTokenInfo?.dbIdValue,
        isAppGlobal: resTokenInfo?.isAppGlobal,
      });

      if (Template) {
        if (Template == "" || !Template.id || Template.id <= 0) {
          console.warn("No default template response received.");
          return (Template = null);
        }
        const templateContent = await decompressData(Template.content);
        const parsedTemplate = parseTemplateContent<TemplateState<unknown>>(
          Template,
          templateContent
        );
        if (!parsedTemplate) {
          console.warn("Failed to parse default template.");
          Template = null;
        }
        const initial = templateInitialState().activeTemplate;
        const merged = merge({}, initial, parsedTemplate);

        Template = merged;
      }
      return {
        data: processed,
        template: Template,
      };
    }
  } catch (error) {
    console.error("Error fetching default template:", error);
    return null;
  }
};
// Check if field should be hidden based on hide codes
// const checkForHide = useCallback((fldHideCodes: string, data: any) => {
//   let result = false;

//   switch (fldHideCodes) {
//     case "RETAMT":
//       if (totReturnAmount === 0) result = true;
//       break;
//     case "ROUNDAMT":
//       if (roundAmt === 0) result = true;
//       break;
//     case "ADDAMT":
//       if (adjustmentAmount === 0) result = true;
//       break;
//     case "IN":
//       if (inOut === "DINE IN" || inOut === "PARCEL") result = true;
//       break;
//     case "OUT":
//       if (inOut === "TAKE AWAY" || inOut === "DELIVERY") result = true;
//       break;
//     case "TAKE AWAY":
//       if (inOut === "TAKE AWAY") result = true;
//       break;
//     case "DELIVERY":
//       if (inOut === "DELIVERY") result = true;
//       break;
//     case "DINE IN":
//       if (inOut === "DINE IN") result = true;
//       break;
//     case "PARCEL":
//       if (inOut === "PARCEL") result = true;
//       break;
//     case "TOTDISC":
//       if (billDiscount + sumOfTotDisc === 0) result = true;
//       break;
//     case "BILLDISCOUNT":
//       if (billDiscount === 0) result = true;
//       break;
//     case "BALPAID":
//       if (balancePaid === 0) result = true;
//       break;
//     case "LASTPAGE":
//       if (pageNo === noOfPages) result = true;
//       break;
//     case "CASHACC":
//       if (isCashInHandLedger(partyLedgerID)) result = true;
//       break;
//     case "BANKACC":
//       if (isBankLedger(partyLedgerID)) result = true;
//       break;
//     case "CASHBANKACC":
//       if (checkIsLedgerUnderCashOrBank(partyLedgerID)) result = true;
//       break;
//     case "PARTYACC":
//       if (!checkIsLedgerUnderCashOrBank(partyLedgerID)) result = true;
//       break;
//     case "SALEBILLNOS":
//       if (salesBillNumbers === "") result = true;
//       break;
//     case "SALERETBILLNOS":
//       if (salesRetBillNumbers === "") result = true;
//       break;
//     case "PRIVLEGEAMT":
//       if (privilegeCardID === 0) result = true;
//       break;
//     case "ISREPRINT":
//       if (isReprint === false) result = true;
//       break;
//     case "5%TAXABLE":
//       if (total5PerctaxableValue === 0) result = true;
//       break;
//     case "0%TAXABLE":
//       if (zeroPercentTaxableValue === 0) result = true;
//       break;
//     case "15%TAXABLE":
//       if (total15PerctaxableValue === 0) result = true;
//       break;
//     // Delivery address parts
//     case "DELIVERYPHONE":
//       result = getDeliveryAddressPart(deliveryAddress3, 0) === "";
//       break;
//     case "DELIVERYSTREET":
//       result = getDeliveryAddressPart(deliveryAddress3, 1) === "";
//       break;
//     case "DELIVERYLANDMARK":
//       result = getDeliveryAddressPart(deliveryAddress3, 2) === "";
//       break;
//     case "DELIVERYREMARKS":
//       result = getDeliveryAddressPart(deliveryAddress3, 3) === "";
//       break;
//     // GST taxable amounts
//     case "TAXABLE 0%":
//       if (zeroTaxable === 0) {
//         result = true;
//         setSkipLineHeight(prev => prev + 12);
//       }
//       break;
//     case "TAXABLE 3%":
//       if (threeTaxable === 0) {
//         result = true;
//         setSkipLineHeight(prev => prev + 12);
//       }
//       break;
//     case "TAXABLE 5%":
//       if (fiveTaxable === 0) {
//         result = true;
//         setSkipLineHeight(prev => prev + 12);
//       }
//       break;
//     case "TAXABLE 12%":
//       if (twelveTaxable === 0) {
//         result = true;
//         setSkipLineHeight(prev => prev + 12);
//       }
//       break;
//     case "TAXABLE 18%":
//       if (eighteenTaxable === 0) {
//         result = true;
//         setSkipLineHeight(prev => prev + 12);
//       }
//       break;
//     case "TAXABLE 28%":
//       if (twentyEightTaxable === 0) {
//         result = true;
//         setSkipLineHeight(prev => prev + 12);
//       }
//       break;
//     case "GST 0%":
//       if (zeroTaxable === 0) result = true;
//       break;
//     case "GST 3%":
//       if (threeTaxable === 0) result = true;
//       break;
//     case "GST 5%":
//       if (fiveTaxable === 0) result = true;
//       break;
//     case "GST 12%":
//       if (twelveTaxable === 0) result = true;
//       break;
//     case "GST 18%":
//       if (eighteenTaxable === 0) result = true;
//       break;
//     case "GST 28%":
//       if (twentyEightTaxable === 0) result = true;
//       break;
//     default:
//       result = false;
//       break;
//   }

//   return result;
// }, [
// ]);

// Get field value - this is the massive function with 200+ cases

// Get common values - massive function with 200+ field calculations

export const getCommonValues = (
  field: string,

  data: PrintResponse,
  convertAmountToArabic: any
) => {
  let v = "";
  switch (field) {
    case "amountInWords":
      v = getAmountInWords(data.master.grandTotal);
      break;
    // case "amountInWordsLine2":
    //   const ln = field.le ?? 0;
    //   v = getAmountInWords(data.master.grandTotal);
    //   if (v.length > ln) {
    //     v = v.substring(ln);
    //   } else {
    //     v = "";
    //   }
    //   break;
    case "amountInWordsInArabic":
      v = convertAmountToArabic(data.master.grandTotal);
      break;
    case "billNumberBarcode":
      v = data.custom?.billNumberBarcode;
      break;
    case "transactionBarcode":
      v = data.custom?.transactionBarcode;
      break;
    case "eInvoiceQRCode":
      v = data.master?.eInvoiceData?.eInvoiceQRCode;
      break;
    case "qrcodeKsaEinvoicePhase1":
      v = getKsaQrCode(
        data.master?.transactionDate,
        data.master.grandTotal.toFixed(2),
        data.master.vatAmount.toFixed(2),
        data.master.companyData
      );
      break;
    case "qrcodeKsaEinvoice":
    case "qrcodeKsaEinvoiceNotEncrypted":
      if (data.productionReqId) {
        v = data.master?.eInvoiceData?.iqr;
      }
      if ((v = "")) {
        v = getKsaQrCode(
          data.master.transactionDate,
          data.master.grandTotal.toFixed(2),
          data.master.vatAmount.toFixed(2),
          data.master.companyData
        );
      }
      break;
    case "qrcodeKsaEinvoicePhase2":
      v = data.master?.eInvoiceData?.iqr;
      if ((v = "")) {
        v = getKsaQrCode(
          data.master.transactionDate,
          data.master.grandTotal.toFixed(2),
          data.master.vatAmount.toFixed(2),
          data.master.companyData
        );
      }
      break;
    case "deliveryPhone":
      v = getDeliveryAddressPart(data.custom?.deliveryAddress3, 0);
      break;
    case "deliveryStreet":
      v = getDeliveryAddressPart(data.custom?.deliveryAddress3, 1);
      break;
    case "deliveryLandmark":
      v = getDeliveryAddressPart(data.custom?.deliveryAddress3, 2);
      break;
    case "deliveryRemarks":
      v = getDeliveryAddressPart(data.custom?.deliveryAddress3, 3);
      break;
    case "billNumberPrefBarcode":
      v = data.custom?.billNumberPrefBarcode;
      break;
    case "tokenBarcode":
      v = data.custom?.tokenBarcode;
      break;
    case "voucherNumberBarcode":
      v = data.custom?.voucherNumberBarcode;
      break;
      break;
    case "printTime":
      v = new Date().toLocaleTimeString();
      break;
    case "transactionTime":
      v = data.custom?.transactionTime;
      break;
    case "printDate":
      v = new Date().toLocaleDateString();
      break;
    case "date":
      v = new Date().toDateString();
      break;
    case "printCopyStatus":
      switch (data.custom?.noOfCopies) {
        case 1:
          v = "Original";
          break;
        case 2:
          v = "Duplicate";
          break;
        case 3:
          v = "Triplicate";
          break;
        case 4:
          v = "Quadriplicate";
          break;
        default:
          v = `${data.custom.noOfCopies} Th Copy`;
          break;
      }
      break;
    case "printCopyStatus2":
      switch (data.custom?.noOfCopies) {
        case 1:
          v = "Customers Copy";
          break;
        case 2:
          v = "Office Copy";
          break;
        case 3:
          v = "Store Copy";
          break;
        case 4:
          v = "Sales man Copy";
          break;
        default:
          v = `${data.custom.noOfCopies} Th Copy`;
          break;
      }
      break;
    case "salesBillNumbers":
      v = data.custom?.salesBillNumbers.slice(0, -1);
      break;
    case "salesRetBillNumbers":
      v = data.custom?.salesRetBillNumbers.slice(0, -1);
      break;
    case "billAmounts":
      v = data.custom?.billAmounts.slice(0, -1);
      break;
    case "retBillAmounts":
      v = data.custom?.retBillAmounts
        ? data.custom?.retBillAmounts.slice(0, -1)
        : "";
      break;
    // case "HEADER1":
    // case "HEADER2":
    // case "HEADER3":
    // case "HEADER4":
    // case "HEADER5":
    // case "HEADER6":
    // case "HEADER7":
    // case "HEADER8":
    // case "HEADER9":
    // case "HEADER10":
    //   v = getHeaderFooterValue(fieldNameUpper);
    //   break;
    // case "FOOTER1":
    // case "FOOTER2":
    // case "FOOTER3":
    // case "FOOTER4":
    // case "FOOTER5":
    // case "FOOTER6":
    // case "FOOTER7":
    // case "FOOTER8":
    // case "FOOTER9":
    // case "FOOTER10":
    //   v = getHeaderFooterValue(fieldNameUpper);
    //   break;
    case "totalItems":
      v = data.custom?.totalItems.toString();
      break;
    case "sumOfQty":
      v = data.custom?.totalQty.toString();
      break;
    case "pageTotalOfQty":
      v = data.custom?.totalPageQty.toString();
      break;
    case "sumOfFree":
      v = data.custom?.totalFree.toString();
      break;
    case "sumOfQtyFree":
    // case "totalQtyAndFree":
    //   setTotalQtyFree(data.custom?.totalFree + data.custom?.totalQty);
    //   v = data.custom?.totalQtyFree.toString();
    //   break;
    case "pageTotalOfFree":
      v = data.custom?.pageTotFree.toString();
      break;
    // GST calculations
    case "sumOfCGST":
      v = data.custom?.sumOfCGST.toString();
      break;
    case "sumOfSGST":
      v = data.custom?.sumOfSGST.toString();
      break;
    case "sumOfIGST":
      v = data.custom?.sumOfIGST.toString();
      break;
    case "sumOfCessAmt":
      v = data.custom?.sumOfCessAmt.toString();
      break;
    case "sumOfAddCessAmt":
      v = data.custom?.sumOfAddCessAmt.toString();
      break;
    case "sumOfGST":
      v = data.custom?.sumOfGST.toString();
      break;
    case "gst":
      v = data.custom?.sumGST.toString();
      break;
    case "totalTaxableValue0Percent":
      v = data.custom?.zeroTaxable.toString();
      break;
    case "sGST_0_Perc":
      v = data.custom?.sGST_0_Perc.toString();
      break;
    case "cGST_0_Perc":
      v = data.custom?.cGST_0_Perc.toString();
      break;
    case "iGST_0_Perc":
      v = data.custom?.iGST_0_Perc.toString();
      break;
    case "total_0_Perc":
      v = data.custom?.total_0_Perc.toString();
      break;
    case "taxable_3_Perc":
      v = data.custom?.taxable_3_Perc.toString();
      break;
    case "sGST_3_Perc":
      v = data.custom?.sGST_3_Perc.toString();
      break;
    case "cGST_3_Perc":
      v = data.custom?.cGST_3_Perc.toString();
      break;
    case "iGST_3_Perc":
      v = data.custom?.iGST_3_Perc.toString();
      break;
    case "total_3_Perc":
      v = data.custom?.total_3_Perc.toString();
      break;
    case "taxable_5_Perc":
      v = data.custom?.taxable_5_Perc.toString();
      break;
    case "sGST_5_Perc":
      v = data.custom?.sGST_5_Perc.toString();
      break;
    case "cGST_5_Perc":
      v = data.custom?.cGST_5_Perc.toString();
      break;
    case "iGST_5_Perc":
      v = data.custom?.iGST_5_Perc.toString();
      break;
    case "total_5_Perc":
      v = data.custom?.total_5_Perc.toString();
      break;
    case "taxable_12_Perc":
      v = data.custom?.taxable_12_Perc.toString();
      break;
    case "sGST_12_Perc":
      v = data.custom?.sGST_12_Perc.toString();
      break;
    case "cGST_12_Perc":
      v = data.custom?.cGST_12_Perc.toString();
      break;
    case "iGST_12_Perc":
      v = data.custom?.iGST_12_Perc.toString();
      break;
    case "total_12_Perc":
      v = data.custom?.total_12_Perc.toString();
      break;
    case "taxable_18_Perc":
      v = data.custom?.taxable_18_Perc.toString();
      break;
    case "sGST_18_Perc":
      v = data.custom?.sGST_18_Perc.toString();
      break;
    case "cGST_18_Perc":
      v = data.custom?.cGST_18_Perc.toString();
      break;
    case "iGST_18_Perc":
      v = data.custom?.iGST_18_Perc.toString();
      break;
    case "total_18_Perc":
      v = data.custom?.total_18_Perc.toString();
      break;
    case "taxable_28_Perc":
      v = data.custom?.taxable_28_Perc.toString();
      break;
    case "sGST_28_Perc":
      v = data.custom?.sGST_28_Perc.toString();
      break;
    case "cGST_28_Perc":
      v = data.custom?.cGST_28_Perc.toString();
      break;
    case "iGST_28_Perc":
      v = data.custom?.iGST_28_Perc.toString();
      break;
    case "total_28_Perc":
      v = data.custom?.total_28_Perc.toString();
      break;
    case "gST_0_Perc":
      v = (data.custom?.sGST_0_Perc + data.custom?.cGST_0_Perc).toString();
      break;
    case "gST_3_Perc":
      v = (data.custom?.sGST_3_Perc + data.custom?.cGST_3_Perc).toString();
      break;
    case "gST_5_Perc":
      v = (data.custom?.sGST_5_Perc + data.custom?.cGST_5_Perc).toString();
      break;
    case "gST_12_Perc":
      v = (data.custom?.sGST_12_Perc + data.custom?.cGST_12_Perc).toString();
      break;
    case "gST_18_Perc":
      v = (data.custom?.sGST_18_Perc + data.custom?.cGST_18_Perc).toString();
      break;
    case "gST_28_Perc":
      v = (data.custom?.sGST_28_Perc + data.custom?.cGST_28_Perc).toString();
      break;
    case "mrpTotal":
      v = data.custom?.mrpTotal.toString();
      break;
    case "mrpDifference":
      v = data.custom?.mrpDifference.toString();
      break;
    case "qrPay":
      v = data.custom?.qrPay.toString();
      break;
    case "bankCard":
      v = data.custom?.bankCard.toString();
      break;
    case "sumOfGross":
      v = data.custom?.sumOfGross.toString();
      break;
    case "totalGrossFc":
      v = data.custom?.sumOfGrossfc.toString();
      break;
    case "sumOfDisc":
      v = data.custom?.sumOfDisc.toString();
      break;
    case "sumOfTax":
      v = data.custom?.sumOfTax.toString();
      break;
    case "sumOfNetAmt":
      v = data.custom?.sumOfNetAmt.toString();
      break;
    case "sumOfVAT":
      v = data.custom?.sumOfVAT.toString();
      break;
    case "sumOfTotDisc":
      v = data.custom?.sumOfTotDisc.toString();
      break;
    case "sumOfCST":
      v = data.custom?.sumOfCST.toString();
      break;
    case "sumOfNetValue":
      v = data.custom?.sumOfNetValue.toString();
      break;
    case "sumOfMRP":
      v = data.custom?.sumOfMRP.toString();
      break;
    case "sumOfNosQty":
      v = data.custom?.sumOfNosQty.toString();
      break;
    case "sumOfMRPRate":
      v = data.custom?.sumOfMRPRate.toString();
      break;
    case "sumOfSchemDisc":
      v = data.custom?.sumOfSchemDisc.toString();
      break;
    case "sumOfNetWeight":
      v = data.custom?.sumOfNetWeight.toString();
      break;
    case "stateName":
      v = data.custom?.stateName;
      break;
    case "stateCode":
      v = data.custom?.stateCode;
      break;
    // case "youSaved":
    //   const bill = data.custom?.totalNetAmount - data.custom?.billDiscount;
    //   setTotalSavedAmt(data.custom?.mrpTotal - bill);
    //   const roundSave = posRoundAmount(data.custom?.totalSavedAmt);
    //   v = roundSave.toString();
    //   break;
    // Page totals
    case "pageTotalofGross":
      v = data.custom?.pageTotalofGross.toString();
      break;
    case "pageTotalofDisc":
      v = data.custom?.pageTotalofDisc.toString();
      break;
    case "pageTotalofTax":
      v = data.custom?.pageTotalofTax.toString();
      break;
    case "pageTotalofNetAmt":
      v = data.custom?.pageTotalofNetAmt.toString();
      break;
    case "pageTotalofSchmeDisc":
      v = data.custom?.pageTotalofSchmeDisc.toString();
      break;
    case "pageTotalofVAT":
      v = data.custom?.pageTotalofVAT.toString();
      break;
    case "pageTotalofTotDisc":
      v = data.custom?.pageTotalofTotDisc.toString();
      break;
    case "pageTotalofCST":
      v = data.custom?.pageTotalofCST.toString();
      break;
    case "pageTotalofNetValue":
      v = data.custom?.pageTotalofNetValue.toString();
      break;
    case "pageTotalofNosQty":
      v = data.custom?.pageTotalofNosQty.toString();
      break;
    case "pageNo":
      v = data.custom?.pageNo.toString();
      break;
    case "pageNoOfM":
      v = `Page ${data.custom.pageNo} Of ${data.custom.noOfPages}`;
      break;
    case "noOfPages":
      v = data.custom?.noOfPages.toString();
      break;
    case "totalQty":
      v = data.custom?.totalQty.toString();
      break;
    case "totalPageQty":
      v = data.custom?.totalPageQty.toString();
      break;
    case "pageTotDebit":
      v = data.custom?.pageTotDebit.toString();
      break;
    case "totalNetAmount":
      v = data.custom?.totalNetAmount.toString();
      break;
    case "pageTotAmount":
      v = data.custom?.pageTotAmount.toString();
      break;
    case "freeString":
      v = data.custom?.freeString;
      break;
    case "groupWiseSiNo":
    case "siNo":
      v = data.custom?.currentRow.toString();
      break;
    case "productUnitRemarksOrProductName":
      v = data.custom?.productUnitRemarksOrProductName;
      break;
    // case "partyNameLine2":
    //   const flen = fldLength || 0;
    //   if (data.custom?.partyName.length > flen) {
    //     v = data.custom?.partyName.substring(flen);
    //   } else {
    //     v = "";
    //   }
    //   break;
    // case "productName2":
    //   let len = parseInt(fldLength || 0);
    //   if (data.custom?.prodName.length > len) {
    //     v = data.custom?.prodName.substring(len);
    //   } else {
    //     v = "";
    //   }
    //   break;
    // case "productName3":
    //   len = parseInt(data.custom?.fldLength || "0");
    //   if (data.custom?.prodName.length > len * 2) {
    //     v = data.custom?.prodName.substring(len * 2);
    //   } else {
    //     v = "";
    //   }
    //   break;
    // case "productDescription2":
    //   len = parseInt(data.custom?.fldLength || "0");
    //   if (data.custom?.prodDescription.length > len) {
    //     v = data.custom?.prodDescription.substring(len);
    //   } else {
    //     v = "";
    //   }
    //   break;
    // case "productDescription3":
    //   len = parseInt(data.custom?.fldLength || "0");
    //   if (data.custom?.prodDescription.length > len * 2) {
    //     v = data.custom?.prodDescription.substring(len * 2);
    //   } else {
    //     v = "";
    //   }
    //   break;
    // case "productDescription4":
    //   len = parseInt(data.custom?.fldLength || "0");
    //   if (data.custom?.prodDescription.length > len * 3) {
    //     v = data.custom?.prodDescription.substring(len * 3);
    //   } else {
    //     v = "";
    //   }
    //   break;
    // case "productDescription5":
    //   len = parseInt(data.custom?.fldLength || "0");
    //   if (data.custom?.prodDescription.length > len * 4) {
    //     v = data.custom?.prodDescription.substring(len * 4);
    //   } else {
    //     v = "";
    //   }
    //   break;
    case "productNameOrOpenProductName":
      v = data.custom?.prodName;
      if (data.custom?.productCode === "0") {
        v = data.custom?.modelNoKOT;
      }
      break;
    case "productDescriptionOrName":
      v = data.custom?.prodDescription || data.custom?.prodName;
      break;
    // case "qtyDetails":
    //   v = getProductStockDetails(data.custom?.productBatchID.toString(), data.custom?.invQty);
    //   break;
    case "inOutArabic":
      if (data.master) {
        const inOutValue = data.master.inout;
        if (inOutValue === "DINE IN") {
          v = "محلي";
        } else if (inOutValue === "TAKE AWAY") {
          v = "سفري";
        } else if (inOutValue === "PARCEL") {
          v = "قطعة";
        } else if (inOutValue === "DELIVERY") {
          v = "توصيل";
        }
      }
      break;
    // case "modeOfPayment":
    //   if (isCashInHandLedger(data.custom?.partyLedgerID)) {
    //     if (data.custom?.grantTotal === data.custom?.cashReceived) {
    //       v = "CASH";
    //     } else if (data.custom?.grantTotal === data.custom?.cashReturned) {
    //       v = "CASH";
    //     } else if (data.custom?.grantTotal === data.custom?.bankAmt) {
    //       v = "BANK";
    //     } else {
    //       v = "CASH/BANK";
    //     }
    //   } else if (checkIsLedgerUnderBank(data.custom?.partyLedgerID)) {
    //     v = "BANK";
    //   } else if (data.custom?.grantTotal === data.custom?.cashReceived) {
    //     v = "CASH";
    //   } else if (data.custom?.grantTotal === data.custom?.cashReturned) {
    //     v = "CASH";
    //   } else if (data.custom?.grantTotal === data.custom?.bankAmt) {
    //     v = "BANK";
    //   } else if (data.custom?.grantTotal === data.custom?.cashReceived + data.custom?.bankAmt) {
    //     v = "CASH+BANK";
    //   } else {
    //     v = "CREDIT";
    //   }
    //   break;
    // case "modeOfPaymentArabic":
    //   if (isCashInHandLedger(data.custom?.partyLedgerID)) {
    //     if (data.custom?.grantTotal === data.custom?.cashReceived) {
    //       v = "نقدي";
    //     } else if (data.custom?.grantTotal === data.custom?.cashReturned) {
    //       v = "نقدي";
    //     } else if (data.custom?.grantTotal === data.custom?.bankAmt) {
    //       v = "شبكة";
    //     } else {
    //       v = "نقدي/شبكة";
    //     }
    //   } else if (checkIsLedgerUnderBank(data.custom?.partyLedgerID)) {
    //     v = "شبكة";
    //   } else if (data.custom?.grantTotal === data.custom?.cashReceived) {
    //     v = "نقدي";
    //   } else if (data.custom?.grantTotal === data.custom?.cashReceived + data.custom?.bankAmt) {
    //     v = "نقدي+شبكة";
    //   } else if (data.custom?.grantTotal === data.custom?.cashReturned) {
    //     v = "نقدي";
    //   } else if (data.custom?.grantTotal === data.custom?.bankAmt) {
    //     v = "شبكة";
    //   } else {
    //     v = "آجل";
    //   }
    //   break;
    case "paidOrNot":
      v = data.custom?.cashReceived > 0 ? "Paid" : "Not Paid";
      break;
    // Tax calculations with discount
    // case "totalTaxableValue_5_Perc":
    //   const taxableAmt5 = getTaxableAmountIncludingTaxOnDiscount(data.custom?.invTransactionMasterID, 5);
    //   if (taxableAmt5 > 0) {
    //     setTotal5PerctaxableValue(taxableAmt5);
    //   }
    //   v = data.custom?.total5PerctaxableValue.toString();
    //   break;
    // case "totalTaxValue_5_Perc":
    //   const taxAmt5 = getTaxAmountIncludingTaxOnDiscount(data.custom?.invTransactionMasterID, 5);
    //   if (taxAmt5 > 0) {
    //     setTotal5PercTaxValue(taxAmt5);
    //   }
    //   v = data.custom?.total5PercTaxValue.toString();
    //   break;
    // case "totalTaxableValue_15_Perc":
    //   const taxableAmt15 = getTaxableAmountIncludingTaxOnDiscount(data.custom?.invTransactionMasterID, 15.0);
    //   if (taxableAmt15 > 0) {
    //     setTotal15PerctaxableValue(taxableAmt15);
    //   }
    //   v = data.custom?.total15PerctaxableValue.toString();
    //   break;
    // case "totalTaxValue_15_Perc":
    //   const taxAmt15 = getTaxAmountIncludingTaxOnDiscount(data.custom?.invTransactionMasterID, 15.0);
    //   if (taxAmt15 > 0) {
    //     setTotal15PercTaxValue(taxAmt15);
    //   }
    //   v = data.custom?.total15PercTaxValue.toString();
    //   break;
    // case "totalTaxableValue_0_Perc":
    //   const taxableAmt0 = getTaxableAmountIncludingTaxOnDiscount(data.custom?.invTransactionMasterID, 0);
    //   if (taxableAmt0 > 0) {
    //     setZeroPercentTaxableValue(taxableAmt0);
    //   }
    //   v = zeroPercentTaxableValue.toString();
    //   break;
    // case "totalTaxValue_0_Perc":
    //   setZeroPercentTaxValue(0);
    //   v = zeroPercentTaxValue.toString();
    //   break;
    case "amountInWordsPayable":
      const payableAmount =
        data.custom?.grantTotal - (data.master ? data.master.srAmount || 0 : 0);
      v = getAmountInWords(payableAmount);
      break;
    // Balance calculations
    // case "obCashRcvd":
    //   if (!isCashInHandLedger(data.custom?.partyLedgerID)) {
    //     setOpeningBalance(getLedgerBalance(data.custom?.partyLedgerID, data.custom?.transDate));
    //     v = (data.custom?.openingBalance - data.custom?.cashReceived).toString();
    //   }
    //   break;
    // case "runningBalance":
    //   if (!isCashInHandLedger(data.custom?.partyLedgerID)) {
    //     const runningBal = getLedgerBalance(data.custom?.partyLedgerID, data.custom?.transDate);
    //     v = runningBal.toString();
    //   }
    //   break;
    // case "ledgerBalance":
    //   if (!isCashInHandLedger(data.custom?.partyLedgerID)) {
    //     const ledgerBal = getLedgerBalance(data.custom?.partyLedgerID);
    //     v = ledgerBal.toString();
    //   }
    //   break;
    // case "previousDayLedgerBalance":
    //   if (!isCashInHandLedger(data.custom?.partyLedgerID)) {
    //     if (getDBIDValue().trim() === "543140180640") {
    //       if (getDefaultCustomerLedgerID() === data.custom?.partyLedgerID) {
    //         v = "0";
    //       } else {
    //         const ledgerBal = getPreviousDayLedgerBalance(data.custom?.partyLedgerID, data.custom?.transactionDate);
    //         v = ledgerBal.toString();
    //       }
    //     } else {
    //       const ledgerBal = getPreviousDayLedgerBalance(data.custom?.partyLedgerID, data.custom?.transactionDate);
    //       v = ledgerBal.toString();
    //     }
    //   }
    //   break;
    // case "ledgerBalanceAndGrandTotal":
    //   if (!isCashInHandLedger(data.custom?.partyLedgerID)) {
    //     setOpeningBalance(getLedgerBalance(data.custom?.partyLedgerID, data.custom?.transDate));
    //     const adjustedBalance = data.custom?.openingBalance - (data.custom?.grantTotal - data.custom?.cashReceived);
    //     v = (Math.abs(adjustedBalance) + data.custom?.grantTotal).toString();
    //   }
    //   break;
    // case "ledgerBalanceAmountInWords":
    //   if (!isCashInHandLedger(data.custom?.partyLedgerID)) {
    //     const ledgerBal = getLedgerBalance(data.custom?.partyLedgerID);
    //     v = getAmountInWords(Math.abs(ledgerBal));
    //   }
    //   break;
    case "currentBillBalance":
      v = data.custom?.cashReturned.toString();
      break;
    case "totalAdvance":
      v = (
        data.custom?.grantTotal -
        data.custom?.cashReceived -
        data.custom?.bankAmt
      ).toString();
      break;
    case "totNetValueBillDisc":
      v = (data.custom?.sumOfNetValue - data.custom?.billDiscount).toString();
      break;
    case "grandTotalBillDisc":
      v = (data.custom?.grantTotal - data.custom?.billDiscount).toString();
      break;
    case "grandTotalCouponAmt":
      const couponAmt = data.master ? data.master.couponAmt || 0 : 0;
      v = (data.custom?.grantTotal - couponAmt).toString();
      break;
    case "qtyWithUnit":
      v = data.custom?.qtyWithUnit;
      break;
    case "unitNetValue":
      v = data.custom?.unitNetValue.toString();
      break;
    case "vehicleNumber":
      v = data.master ? data.master.vehicleData.vehicleNumber || "" : "";
      break;
    case "billDiscountPlusDiscount":
      v = (data.custom?.billDiscount + data.custom?.sumOfDisc).toString();
      break;
    case "partyDisplayName":
      v = data.master ? data.master.partyData.partyDisplayName || "" : "";
      break;
    // Vehicle details
    case "vehicleName":
      v = data.master ? data.master.vehicleData.vehicleName || "" : "";
      break;
    case "vehicleModel":
      v = data.master ? data.master.vehicleData.vehicleModel || "" : "";
      break;
    case "vehicleCapacity":
      v = data.master ? data.master.vehicleData.vehicleCapacity || "" : "";
      break;
    case "vehicleManufacturer":
      v = data.master ? data.master.vehicleData.vehicleManufacturer || "" : "";
      break;
    case "vehicleOwner":
      v = data.master ? data.master.vehicleData.vehicleOwner || "" : "";
      break;
    case "vehicleColor":
      v = data.master ? data.master.vehicleData.vehicleColor || "" : "";
      break;
    case "vehicleOdometer":
      v = data.master ? data.master.vehicleData.vehicleOdometer || "" : "";
      break;
    case "vehicleRemarks":
      v = data.master ? data.master.vehicleData.vehicleRemarks || "" : "";
      break;
    case "balanceAmtPayable":
      const srAmount = data.master ? data.master.srAmount || 0 : 0;
      v = (data.custom?.grantTotal - srAmount).toString();
      break;
    // case "privilageCardBalance":
    //   v = data.custom?.loyaltyCardNo.trim() === "" ? "0" : getLoyaltyCardBalance(data.custom?.loyaltyCardNo).toString();
    //   break;
    // Cheque printing fields
    case "chequeDate":
      v = data.custom?.chequeDate;
      break;
    case "chequePaytoAccountName":
      v = data.custom?.chequePaytoAccountName;
      break;
    case "chequeAmount":
      v = `***${parseFloat(data.custom?.chequeAmount).toFixed(2)}/-***`;
      break;
    case "chequeRemarks":
      v = data.custom?.chequeRemarks;
      break;
    case "chequeAmountInWordsLine":
      v = `***${getAmountInWords(parseFloat(data.custom?.chequeAmount))}***`;

      break;
    // case "chequeAmountInWordsLine2":
    //   if (!data.custom.chequeAmountInWords) {
    //     setChequeAmountInWords(`***${getAmountInWords(parseFloat(data.custom?.chequeAmount))}***`);
    //   }
    //   len = parseInt(data.custom?.fldLength || "0");
    //   if (data.custom?.chequeAmountInWords.length > len) {
    //     v = data.custom?.chequeAmountInWords.substring(len);
    //   } else {
    //     v = "";
    //   }
    //   break;
    // case "chequeAmountInWordsLine3":
    //   if (!data.custom.chequeAmountInWords) {
    //     setChequeAmountInWords(`***${getAmountInWords(parseFloat(data.custom?.chequeAmount))}***`);
    //   }
    //   len = parseInt(data.custom?.fldLength || "0");
    //   if (data.custom?.chequeAmountInWords.length > len * 2) {
    //     v = data.custom?.chequeAmountInWords.substring(len * 2);
    //   } else {
    //     v = "";
    //   }
    //   break;
    // case "previousBalance":
    //   if (voucherType === "CP" || voucherType === "BP") {
    //     if (!isCashInHandLedger(data.custom?.partyLedgerID)) {
    //       setOpeningBalance(getLedgerBalance(data.custom?.partyLedgerID, data.custom?.transDate));
    //       const adjustedBalance = data.custom?.openingBalance - data.custom?.cashPaidOrRcvd;
    //       v = adjustedBalance.toString();
    //     }
    //   } else if (voucherType === "CR" || voucherType === "BR") {
    //     if (!isCashInHandLedger(data.custom?.partyLedgerID)) {
    //       setOpeningBalance(getLedgerBalance(data.custom?.partyLedgerID, data.custom?.transDate));
    //       const adjustedBalance = data.custom?.openingBalance + data.custom?.cashPaidOrRcvd;
    //       v = adjustedBalance.toString();
    //     }
    //   } else {
    //     if (!isCashInHandLedger(data.custom?.partyLedgerID)) {
    //       if (voucherType === "SR") {
    //         setOpeningBalance(getLedgerBalance(data.custom?.partyLedgerID, data.custom?.transDate));
    //         const adjustedBalance = data.custom?.openingBalance + (data.custom?.grantTotal + data.custom?.cashReturned);
    //         v = adjustedBalance.toString();
    //       } else {
    //         setOpeningBalance(getLedgerBalance(data.custom?.partyLedgerID, data.custom?.transDate));
    //         const adjustedBalance = data.custom?.openingBalance - (data.custom?.grantTotal - data.custom?.cashReceived);
    //         v = adjustedBalance.toString();
    //       }
    //     }
    //   }
    //   break;
    // case "closingBalance":
    //   if (!isCashInHandLedger(data.custom?.partyLedgerID)) {
    //     setOpeningBalance(getLedgerBalance(data.custom?.partyLedgerID, data.custom?.transDate));
    //     v = data.custom?.openingBalance.toString();
    //   }
    //   break;
    case "invoiceStatus":
      const oldInvTrID = data.master ? data.master.oldInvTransactionID || 0 : 0;
      v = oldInvTrID === 0 ? "NEW" : "EDITED";
      break;
    case "netAmount":
      v = (data.custom?.grantTotal + data.custom?.billDiscount).toString();
      break;
    // case "grantTotal":
    //   if (isapp() && getBusinessType() === "Restaurant") {
    //     v = posRoundAmount(data.custom?.grantTotal).toString();
    //   } else {
    //     v = data.custom?.grantTotal.toString();
    //   }
    //   break;
    case "totalSalesValue":
      v = data.custom?.stockTransferTotalSalesValue.toString();
      break;
    case "pageTotalBarcode":
      v = data.custom?.pageTotalBarcode;
      break;
    case "jvTotalDebit":
      v = data.custom?.jvTotalDebit.toString();
      break;
    case "jvTotalCredit":
      v = data.custom?.jvTotalCredit.toString();
      break;
    case "invoiceNumberAndPageTotalBarcode":
      v = data.custom?.invoiceNumberAndPageTotalBarcode;
      break;
    case "width":
      v = data.custom?.pWidth;
      break;
    case "height":
      v = data.custom?.pHeight;
      break;
    case "nonHeightAndWidthUnit":
      v = data.custom?.nonHeightWidth;
      break;
    case "printCount":
      v = data.custom?.printCount;
      break;
    // case "specialLedgerBalance":
    //   if (fileExistsSync("SpecialLedgerID.txt")) {
    //     const specialLedgerID = readFileSync("SpecialLedgerID.txt");
    //     if (specialLedgerID) {
    //       const ledgerBal = getLedgerBalance(parseInt(specialLedgerID));
    //       v = ledgerBal.toString();
    //     }
    //   }
    //   break;
    // case "specialLedgerBalance2":
    //   if (fileExistsSync("SpecialLedgerID2.txt")) {
    //     const specialLedgerID = readFileSync("SpecialLedgerID2.txt");
    //     if (specialLedgerID) {
    //       const ledgerBal = getLedgerBalance(parseInt(specialLedgerID));
    //       v = ledgerBal.toString();
    //     }
    //   }
    //   break;
    case "loggedUsername":
      // v = getLoggedUsername();
      break;
    // Kitchen message fields
    case "kmKitchenRemarks":
      v = data.custom?.kmKitchenRemarks;
      break;
    case "kmWaiter":
      v = data.custom?.kmWaiter;
      break;
    case "kmOrderNumber":
      v = data.custom?.kmOrderNumber;
      break;
    case "kmTableNo":
      v = data.custom?.kmTableNo;
      break;
    case "kmSeatNo":
      v = data.custom?.kmSeatNo;
      break;
    case "kmTokenNumber":
      v = data.custom?.kmTokenNumber;
      break;
    case "kmServeType":
      v = data.custom?.kmServeType;
      break;
    // case "kmKitchenRemarks1":
    //   len = parseInt(data.custom?.fldLength || "0");
    //   if (data.custom?.kmKitchenRemarks.length > len) {
    //     v = data.custom?.kmKitchenRemarks.substring(len);
    //   } else {
    //     v = "";
    //   }
    //   break;
    // case "kmKitchenRemarks2":
    //   len = parseInt(data.custom?.fldLength || "0");
    //   if (data.custom?.kmKitchenRemarks.length > len * 2) {
    //     v = data.custom?.kmKitchenRemarks.substring(len * 2);
    //   } else {
    //     v = "";
    //   }
    //   break;
    // case "kmKitchenRemarks3":
    //   len = parseInt(data.custom?.fldLength || "0");
    //   if (data.custom?.kmKitchenRemarks.length > len * 3) {
    //     v = data.custom?.kmKitchenRemarks.substring(len * 3);
    //   } else {
    //     v = "";
    //   }
    //   break;
    // case "kmKitchenRemarks4":
    //   len = parseInt(data.custom?.fldLength || "0");
    //   if (data.custom?.kmKitchenRemarks.length > len * 4) {
    //     v = data.custom?.kmKitchenRemarks.substring(len * 4);
    //   } else {
    //     v = "";
    //   }
    //   break;
    // case "narration2":
    //   len = parseInt(data.custom?.fldLength || "0");
    //   if (data.custom?.narration.length > len) {
    //     v = data.custom?.narration.substring(len);
    //   } else {
    //     v = "";
    //   }
    //   break;
    case "totalBillQty":
      v = data.custom?.totalBillQty.toString();
      break;
    case "totalBillItemNos":
      v = data.custom?.totalBillItemNos.toString();
      break;
    case "bankCardName":
      v = data.custom?.bankCardName;
      break;
    // Service items
    case "serviceItemOne":
      v =
        data.custom?.serviceItems.length > 0
          ? data.custom?.serviceItems[0]
          : "";
      break;
    case "serviceItemTwo":
      v =
        data.custom?.serviceItems.length > 1
          ? data.custom?.serviceItems[1]
          : "";
      break;
    case "serviceItemThree":
      v =
        data.custom?.serviceItems.length > 2
          ? data.custom?.serviceItems[2]
          : "";
      break;
    case "serviceItemOneAmt":
      v =
        data.custom?.serviceItemsAMT.length > 0
          ? data.custom?.serviceItemsAMT[0]
          : "";
      break;
    case "serviceItemTwoAmt":
      v =
        data.custom?.serviceItemsAMT.length > 1
          ? data.custom?.serviceItemsAMT[1]
          : "";
      break;
    case "serviceItemThreeAmt":
      v =
        data.custom?.serviceItemsAMT.length > 2
          ? data.custom?.serviceItemsAMT[2]
          : "";
      break;
    case "grandTotalReturn":
      const grandTot = data.custom?.grantTotal;
      const srAmt = data.master ? data.master.srAmount || 0 : 0;
      v = (grandTot - srAmt).toString();
      break;
    // Gate pass fields
    // case "productsGatePass":
    //   setGt(true);
    //   if (data.custom?.productNameGatePass && data.custom?.gatePass) {
    //     v = data.custom?.productNameGatePass;
    //   }
    //   break;
    case "qtyGatePass":
      if (data.custom?.qtyGatePass > 0 && data.custom?.gatePass) {
        v = data.custom?.qtyGatePass.toString();
      }
      break;
    // case "transactionTimeDateWithTimeGate":
    //   if (data.custom?.gatePass) {
    //     v = data.custom?.transactionTimeGate.toLocaleTimeString();
    //   }
    //   break;
    case "printDateGate":
      if (data.custom?.gatePass) {
        v = new Date().toLocaleDateString();
      }
      break;
    case "totalItemsGate":
      if (data.custom?.gatePass) {
        v = data.custom?.totalItemsGate.toString();
      }
      break;
    case "voucherNumberGate":
      if (data.custom?.gatePass) {
        v = data.custom?.tokenBarcodeGate;
      }
      break;
    case "tokenGate":
      if (data.custom?.gatePass) {
        v = "PLEASE KEEP YOUR TOKEN";
      }
      break;
    case "voucherNoGate":
      if (data.custom?.gatePass) {
        v = "*** VOUCHER NO ***";
      }
      break;
    case "nameGate":
      if (data.custom?.gatePass) {
        v = "GATEPASS";
      }
      break;
    default:
      break;
  }

  return v;
};

// export function bindDataForPrint(
//   field: string,
//   printData: PrintData,
//   format: string = "NONE",
//   convertAmountToEnglish?: (
//     amount: number,
//     currency?: Currencies | undefined
//   ) => string,
//   convertAmountToArabic?: (
//     amount: number,
//     currency?: Currencies | undefined
//   ) => string,
//   rowIndex: number = 0
// ): any {
//     if (!field) return "";
//     if (!printData) return "";

//   const splitData = field.split("___");
//   const group = splitData[0] as any;
//   const key = splitData[1];

//   const master = printData?.master;
//   const details = printData?.details;
//   let val;

//   if (!field?.includes("___")) {
//     console.log(`col.field-1`);
//     if (
//       ![
//         "cgst",
//         "cgstPerc",
//         "sgst",
//         "sgstPerc",
//         "igst",
//         "igstPerc",
//         "cessAmt",
//         "cessPerc",
//         "additionalCess",
//         "additionalCessPerc",
//         "gstPerc",
//       ].includes(field)
//     ) {
//       console.log(`col.field-2`);
//       if (group == "master") {
//         val = master[field as keyof PrintMasterDto];
//       } else if (group == "details") {
//         val = details?.[rowIndex]?.[field as keyof PrintDetailDto];
//       } else if (group == "details2") {
//         val =
//           details?.[rowIndex]?.detail2Data?.[field as keyof InvDetail2ForPrint];
//       } else if (group == "custom") {
//         val = getCommonValues(field as any, printData, convertAmountToArabic);
//       }
//       // else if (group == "branch") {
//       //   return userSession.currentBranchDetails?.[key as keyof BranchDetails]
//       // }
//       else if (group == "org") {
//         val = printData.companyDetails?.[field as keyof CompanyDetailsForPrint];
//       } else if (group == "headerFooter") {
//         val = printData.headerFooter?.[field as keyof HeaderFooter];
//       } else if (group == "customer") {
//         val =
//           printData?.master?.partyData?.[field as keyof PartyDetailsForPrint];
//       }
//     } else {
//       val =
//         details?.[rowIndex]?.detail2Data?.[field as keyof InvDetail2ForPrint];
//     }
//   } else {
//     if (group == "master") {
//       val = master[key as keyof PrintMasterDto];
//     } else if (group == "details") {
//       val = details?.[rowIndex]?.[key as keyof PrintDetailDto];
//     } else if (group == "details2") {
//       val = details?.[rowIndex]?.detail2Data?.[key as keyof InvDetail2ForPrint];
//     } else if (group == "custom") {
//       val = getCommonValues(key as any, printData, convertAmountToArabic);
//     }

//     else if (group == "ledgerReportDataForPrint") {
//      val = printData.led?.[key as keyof HeaderFooter];
//     }
//     else if (group == "org") {
//       val = printData.companyDetails?.[key as keyof CompanyDetailsForPrint];
//     } else if (group == "headerFooter") {
//       val = printData.headerFooter?.[key as keyof HeaderFooter];
//     } else if (group == "customer") {
//       val = printData?.master?.partyData?.[key as keyof PartyDetailsForPrint];
//     }
  
//   }
//       if (isNullOrUndefinedOrEmpty(val)) {
//       return "";
//     }
//    return  formatValue(val, format);
// }
export function bindDataForPrint(
  field: string,
  printData: PrintData,
  format: string = "NONE",
  convertAmountToEnglish?: (
    amount: number,
    currency?: Currencies
  ) => string,
  convertAmountToArabic?: (
    amount: number,
    currency?: Currencies
  ) => string,
  rowIndex: number = 0
): any {
  
  if (!field) return "";
  if (!printData) return "";

  const splitData = field.split("___");
  const group = splitData[0];
  const key = splitData[1];

  let val: any;

  // ----------------------------
  // VOUCHER FLOW
  // ----------------------------
  if (printData.kind === "voucher") {
    const data = printData.data;
    const master = data.master;
    const details = data.details;

    if (!field.includes("___")) {
      if (
        ![
          "cgst",
          "cgstPerc",
          "sgst",
          "sgstPerc",
          "igst",
          "igstPerc",
          "cessAmt",
          "cessPerc",
          "additionalCess",
          "additionalCessPerc",
          "gstPerc",
        ].includes(field)
      ) {
        if (group === "master") {
          val = master?.[field as keyof PrintMasterDto];
        } else if (group === "details") {
          val = details?.[rowIndex]?.[field as keyof PrintDetailDto];
        } else if (group === "details2") {
          val =
            details?.[rowIndex]?.detail2Data?.[
              field as keyof InvDetail2ForPrint
            ];
        } else if (group === "custom") {
          val = getCommonValues(field as any, data, convertAmountToArabic);
        } else if (group === "org") {
          val = data.companyDetails?.[
            field as keyof CompanyDetailsForPrint
          ];
        } else if (group === "headerFooter") {
          val = data.headerFooter?.[field as keyof HeaderFooter];
        } else if (group === "customer") {
          val =
            master?.partyData?.[
              field as keyof PartyDetailsForPrint
            ];
        }
      } else {
        val =
          details?.[rowIndex]?.detail2Data?.[
            field as keyof InvDetail2ForPrint
          ];
      }
    } else {
      if (group === "master") {
        val = master?.[key as keyof PrintMasterDto];
      } else if (group === "details") {
        val = details?.[rowIndex]?.[key as keyof PrintDetailDto];
      } else if (group === "details2") {
        val =
          details?.[rowIndex]?.detail2Data?.[
            key as keyof InvDetail2ForPrint
          ];
      } else if (group === "custom") {
        val = getCommonValues(key as any, data, convertAmountToArabic);
      } else if (group === "org") {
        val =
          data.companyDetails?.[
            key as keyof CompanyDetailsForPrint
          ];
      } else if (group === "headerFooter") {
        val = data.headerFooter?.[key as keyof HeaderFooter];
      } else if (group === "customer") {
        val =
          master?.partyData?.[
            key as keyof PartyDetailsForPrint
          ];
      }
    }
  }
// ----------------------------
  // CHEQUE FLOW
  // ----------------------------
  else if (printData.kind === "cheque") {
  const cheque = printData.data 

  if (group === "cheque") {
    val = cheque[rowIndex]?.[key as keyof ChequeDataPrint];
  }
}

  // ----------------------------
  // LEDGER REPORT FLOW
  // ----------------------------
  else if (printData.kind === "ledgerReport") {
    const data = printData.data;

    if (group === "ledgerReportDataForPrint") {
      val = data.ledgerData?.[
        key as keyof ledgerDataPrint
      ];
    } else if (group === "org") {
      val =
        data.companyDetails?.[
          key as keyof CompanyDetailsForPrint
        ];
    } else if (group === "headerFooter") {
      val = data.headerFooter?.[key as keyof HeaderFooter];
    }
  }

  if (isNullOrUndefinedOrEmpty(val)) return "";

  return formatValue(val, format);
}

export const addTemplateToStore = async (
  data: TemplateState<unknown>,
  id?: number
) => {
  if (!data) {
    return;
  }
  let key = btoa(`${data.templateGroup}-${data.customerType}-${data.formType}`);
  let idKey = getTemplateStoreKey(
    id ?? data.id ?? 0,
    data.templateGroup ?? "",
    data.customerType,
    data.formType
  );
  const prnt = getTemplateStoreKeyParent(
    data.templateGroup ?? "",
    data.customerType,
    data.formType
  );
  const keys = (await localforage.keys())
    .map((x) => {
      try {
        return atob(x);
      } catch {
        return null; // skip invalid base64 keys
      }
    })
    .filter((x) => x && x.startsWith(prnt));
  
  for (const x of keys ?? []) {
    if (!x) continue; // skip null or undefined
    const base64 = btoa(x);
    await removeStorageString(base64);
  }
  const base64 = modelToBase64Unicode(data);
  await setStorageString(key, base64);
  await setStorageString(idKey, key);
};
export const getTemplateFromStore = async (
  templateGroup: string,
  customerType: string = "",
  formType: string = ""
) => {
  let key = btoa(`${templateGroup}-${customerType}-${formType}`);
  let _template = (await getStorageString(key)) ?? "";
  if (isNullOrUndefinedOrEmpty(_template)) {
    return;
  }
  const template = base64UnicodeToModel(_template);
  return template;
};

export const getTemplateStoreKeyParent = (
  templateGroup: string,
  customerType: string = "",
  formType: string = ""
) => {
  return `store_temp_${templateGroup}-${customerType}-${formType}-`;
};
export const getTemplateStoreKey = (
  id: number,
  templateGroup: string,
  customerType: string = "",
  formType: string = ""
) => {
  return btoa(
    `${getTemplateStoreKeyParent(templateGroup, customerType, formType)}${id}_`
  );
};
export const getTemplateFromStoreById = async (
  id: number,
  templateGroup: string,
  customerType: string = "",
  formType: string = ""
) => {
  const key = await getStorageString(
    getTemplateStoreKey(id, templateGroup, customerType, formType)
  );
  let _template = (await getStorageString(key ?? "")) ?? "";
  if (isNullOrUndefinedOrEmpty(_template)) {
    return null;
  }
  const template = base64UnicodeToModel(_template);
  return template;
};

export const fetchDefaultTemplateFromApi = async (
  voucherType: string,
  formType?: string,
  customerType?: string
): Promise<TemplateState<unknown> | null> => {
  debugger
  try {
    const api = new APIClient();
    const res = await api.postAsync(`${Urls.default_template}`, {
      template_group: voucherType,
      formType: formType,
      customerType: customerType,
    });
    const isValidTemplateResponse =
      res &&
      typeof res === "object" &&
      typeof res.id === "number" &&
      res.id > 0 &&
      res.content != null;

    if (!isValidTemplateResponse) {
      console.warn("No default template response received.", res);
      return null;
    }

    const templateContent = await decompressData(res.content);
    const parsedTemplate = parseTemplateContent<TemplateState<unknown>>(
      res,
      templateContent
    );
    if (!parsedTemplate) {
      console.warn("Failed to parse default template.");
      return null;
    }
    const initial = templateInitialState().activeTemplate;
    const merged = merge({}, initial, parsedTemplate);
    return merged;
  } catch (error) {
    console.error("Error fetching default template:", error);
    return null;
  }
};
 
export const fetchTemplateById = async (
  id: any,
  templateGroup: string,
  customerType: string ,
  formType: string
): Promise<TemplateState<unknown> | null> => {
  try {
    
    const template = await getTemplateFromStoreById(
      id,
      templateGroup,
      customerType,
      formType
    );
    if (template) {
      return template;
    } else {
      if (id > 0) {
        return fetchTemplateFromApiById(id);
      } else if (id < 0) {
        console.log("fetchCRMTemplateFromApiByIdSafvan");

        return fetchCRMTemplateFromApiById(-1 * id);
      } else return null;
    }
  } catch (error) {
    console.error("Error fetching template:", error);
    return null;
  }
};

export const fetchCRMTemplateFromApiById = async (
  id: any
): Promise<TemplateState<unknown> | null> => {
  try {
    const api = new APIClient();
    const res = await api.getAsync(`${Urls.crm_templates}${id}`);
    const templateContent = await decompressData(res.content);
    const parsed = parseTemplateContent<TemplateState<unknown>>(
      res,
      templateContent
    );
    if (!parsed) {
      console.warn("⚠️ Failed to parse template content.");
      return null;
    }

    const initial = templateInitialState().activeTemplate;
    const _merged = merge({}, initial, parsed);
    return _merged;
  } catch (error) {
    console.error("Error fetching template:", error);
    return null;
  }
};

export const fetchTemplateFromApiById = async (
  id: any
): Promise<TemplateState<unknown> | null> => {
  try {
    
    const api = new APIClient();
    const res = await api.getAsync(`${Urls.templates}${id}`);
    const templateContent = await decompressData(res.content);
    const parsed = parseTemplateContent<TemplateState<unknown>>(
      res,
      templateContent
    );
    if (!parsed) {
      console.warn("⚠️ Failed to parse template content.");
      return null;
    }

    const initial = templateInitialState().activeTemplate;
    const _merged = merge({}, initial, parsed);
    return _merged;
  } catch (error) {
    console.error("Error fetching template:", error);
    return null;
  }
};

export function parseTemplateContent<T extends object>(
  templateRes: any,
  parsed: any
): T | null {
  try {
    let cc = parsed;

    // If for some reason it's still a string, parse it
    if (typeof cc === "string") {
      cc = JSON.parse(cc);
    }

    const convertToCamelCase = (obj: any): any => {
      if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        const newObj: { [key: string]: any } = {};
        for (const k in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, k)) {
            newObj[toCamelCase(k)] = convertToCamelCase(obj[k]);
          }
        }
        return newObj;
      }
      return obj;
    };
    
    const camelCasedContent = convertToCamelCase(cc);
    const _template = {
      ...camelCasedContent,
      id: templateRes.id,
      background_image: templateRes?.background_image as string | undefined,
      background_image_header: templateRes?.background_image_header as
        | string
        | undefined,
      background_image_footer: templateRes?.background_image_footer as
        | string
        | undefined,
      signature_image: templateRes?.signature_image as string | undefined,
      branchId: templateRes.branchId,
      content: templateRes.content,
      isCurrent: templateRes.isCurrent,
      templateGroup: templateRes.templateGroup,
      templateKind: templateRes.templateKind,
      templateName: templateRes.templateName,
      templateType: templateRes.templateType,
      thumbImage: templateRes.thumbImage as string | undefined,
      formType: templateRes.formType,
      customerType: templateRes.customerType,
    };
    return _template as T;
  } catch (error) {
    console.error("Error parsing template content:", error);
    return null;
  }
}

export const fetchDefaultTemplate = async (
  voucherType: string,
  formType?: string,
  customerType?: string
) => {
   debugger
  try {
    const _template = await fetchDefaultTemplateFromApi(
      voucherType,
      formType,
      customerType
    );
   
    if (!_template) return null;
    await addTemplateToStore(_template);
    return _template;
  } catch (error) {
    console.error("Error fetching Default templates:", error);
  }
};

export const getOrFetchTemplate = async (
  voucherType: string,
  formType?: string,
  customerType?: string
) => {
  debugger
  const template = await getTemplateFromStore(
    voucherType,
    customerType,
    formType
  );
  if (template) {
    return template;
  } else {
    return await fetchDefaultTemplate(voucherType, formType, customerType);
  }
};
// export const formatValue = (value: any, format: string) => {
//   let t = "";
//   const ws = " ".repeat(400); // Same as long ws string in C#
//   // const { fldFont, fldAlign, fldLength } = opts;

//   // QR Code fonts: return directly
//   // if (fldFont === 'QR Code-Polosys' || fldFont === 'QR Code-Polosys-2') return value;
//   if (!format) return value;
//   const fmt = format.toUpperCase();

//   try {
//     if (fmt === "C###0.00") {
//       t = val(value).toFixed(2);
//     } else if (fmt === "C###0.000") {
//       t = val(value).toFixed(3);
//     } else if (format.includes("#") && !format.includes("**")) {
//       t = val(value).toString();
//     } else if (fmt === "QTY") {
//       t = val(value).toFixed(0);
//     } else if (fmt === "QTY1") {
//       const t1 = val(value);
//       const t2 = Math.trunc(t1);
//       t = t1 !== t2 ? t1.toFixed(1) : t1.toFixed(0);
//     } else if (fmt === "QTY2") {
//       const t1 = val(value);
//       const t2 = Math.trunc(t1);
//       t = t1 !== t2 ? t1.toFixed(2) : t1.toFixed(0);
//     } else if (fmt === "QTY3") {
//       const t1 = val(value);
//       const t2 = Math.trunc(t1);
//       t = t1 !== t2 ? t1.toFixed(3) : t1.toFixed(0);
//     } else if (fmt === "AR_NUM") {
//       t = getArabicNumber(val(value).toFixed(0));
//     } else if (fmt === "SHRINK") {
//       t = value;
//     } else if (fmt === "AR_DIG2") {
//       t = getArabicNumber(val(value).toFixed(2));
//     } else if (fmt === "AR_DATE") {
//       // const date = TransDate ? TransDate : new Date(value);
//       // const formatted = date.toLocaleDateString('en-GB', {
//       //   day: '2-digit',
//       //   month: '2-digit',
//       //   year: 'numeric',
//       // });
//       // t = GetArabicDateNumer(formatted.replace(/\//g, '-'));
//     } else if (fmt === "AR_DIG3") {
//       t = getArabicNumber(val(value).toFixed(3));
//     } else if (
//       format.includes("d") ||
//       format.includes("M") ||
//       format.includes("y") ||
//       format.includes("H") ||
//       format.includes("h") ||
//       format.includes("m") ||
//       format.includes("s")
//     ) {
//       const date = new Date(value);
//       if (!isNaN(date.getTime())) {
//         // interpret C#-style format tokens manually
//         const pad = (n: number) => n.toString().padStart(2, "0");
//         const replacements: Record<string, string> = {
//           dd: pad(date.getDate()),
//           MM: pad(date.getMonth() + 1),
//           yyyy: date.getFullYear().toString(),
//           HH: pad(date.getHours()),
//           mm: pad(date.getMinutes()),
//           ss: pad(date.getSeconds()),
//         };
//         t = format.replace(/dd|MM|yyyy|HH|mm|ss/g, (m) => replacements[m] || m);
//       } else {
//         t = value;
//       }
//     } else if (fmt === "NONE") {
//       t = value;
//     } else if (fmt === "BIZ") {
//       const v = val(value);
//       t = v === 0 ? "" : v.toFixed(2);
//     } else {
//       t = value;
//     }

//     // Apply alignment and field length
//     // if (fldAlign === 'Left') {
//     //   t = (t + ws).substring(0, fldLength);
//     // } else if (fldAlign === 'Right' || fldAlign === 'Right Justify') {
//     //   t = (ws + t).slice(-fldLength);
//     // } else if (fldAlign === 'Center') {
//     //   const total = ws + t + ws;
//     //   const start = Math.max(0, Math.floor(total.length / 2 - fldLength / 2));
//     //   t = total.substring(start, start + fldLength);
//     // } else {
//     //   try {
//     //     t = (t + ws).substring(0, fldLength);
//     //   } catch {
//     //     // ignore
//     //   }
//     // }
//   } catch {
//     t = value;
//   }

//   return t;
// };
export const formatValue = (value: any, format: string) => {
  if (!format || format === "NONE") return value?.toString() || "";
  
  const fmt = format.toUpperCase();

  try {
    // Handle null/undefined
    if (value === null || value === undefined || value === "") {
      return "";
    }

    // Number parsing helper
    const parseNumber = (val: any): number => {
      if (typeof val === 'number') return val;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Arabic number conversion helper
    const getArabicNumber = (num: string): string => {
      const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return num.replace(/\d/g, (digit) => arabicDigits[parseInt(digit)]);
    };

    // Arabic date conversion helper
    const getArabicDateNumber = (dateStr: string): string => {
      const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return dateStr.replace(/\d/g, (digit) => arabicDigits[parseInt(digit)]);
    };

    // NUMBER FORMATS
    if (fmt === "###") {
      return Math.round(parseNumber(value)).toString();
    }
    
    if (fmt === "###0") {
      return Math.round(parseNumber(value)).toString();
    }
    
    if (fmt === "###0.0") {
      return parseNumber(value).toFixed(1);
    }
    
    if (fmt === "###0.00") {
      return parseNumber(value).toFixed(2);
    }
    
    if (fmt === "C###0.00") {
      return parseNumber(value).toFixed(2);
    }
    
    if (fmt === "###0.000") {
      return parseNumber(value).toFixed(3);
    }
    
    if (fmt === "###0.0000") {
      return parseNumber(value).toFixed(4);
    }
    
    if (fmt === "###,###0.00") {
      const num = parseNumber(value);
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    
    if (fmt === "***###0.00/-***") {
      const num = parseNumber(value);
      const formatted = num.toFixed(2);
      return num < 0 ? `***${formatted}/-***` : `***${formatted}***`;
    }

    // QUANTITY FORMATS
    if (fmt === "QTY") {
      return Math.round(parseNumber(value)).toString();
    }
    
    if (fmt === "QTY1") {
      const num = parseNumber(value);
      const truncated = Math.trunc(num);
      return num !== truncated ? num.toFixed(1) : truncated.toString();
    }
    
    if (fmt === "QTY2") {
      const num = parseNumber(value);
      const truncated = Math.trunc(num);
      return num !== truncated ? num.toFixed(2) : truncated.toString();
    }
    
    if (fmt === "QTY3") {
      const num = parseNumber(value);
      const truncated = Math.trunc(num);
      return num !== truncated ? num.toFixed(3) : truncated.toString();
    }

    // ARABIC NUMBER FORMATS
    if (fmt === "AR_NUM") {
      return getArabicNumber(Math.round(parseNumber(value)).toString());
    }
    
    if (fmt === "AR_DIG2") {
      return getArabicNumber(parseNumber(value).toFixed(2));
    }
    
    if (fmt === "AR_DIG3") {
      return getArabicNumber(parseNumber(value).toFixed(3));
    }

    // ARABIC DATE FORMAT
    if (fmt === "AR_DATE") {
      const date = value instanceof Date ? value : new Date(value);
      if (!isNaN(date.getTime())) {
        const formatted = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        return getArabicDateNumber(formatted.replace(/\//g, '-'));
      }
      return value?.toString() || "";
    }

    // DATE & TIME FORMATS
    if (fmt === "HH:MM:SS TT" || fmt === "HH:MM:SS") {
      const date = value instanceof Date ? value : new Date(value);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        
        if (fmt === "HH:MM:SS TT") {
          const period = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;
          return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
        } else {
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
      }
      return value?.toString() || "";
    }

    // Generic date/time format handling
    if (
      format.includes("d") ||
      format.includes("M") ||
      format.includes("y") ||
      format.includes("H") ||
      format.includes("h") ||
      format.includes("m") ||
      format.includes("s") ||
      format.includes("t")
    ) {
      const date = value instanceof Date ? value : new Date(value);
      if (!isNaN(date.getTime())) {
        const pad = (n: number) => n.toString().padStart(2, "0");
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        
        const replacements: Record<string, string> = {
          yyyy: date.getFullYear().toString(),
          yy: (date.getFullYear() % 100).toString().padStart(2, '0'),
          MMM: date.toLocaleString('en-US', { month: 'short' }),
          MM: pad(date.getMonth() + 1),
          M: (date.getMonth() + 1).toString(),
          dd: pad(date.getDate()),
          d: date.getDate().toString(),
          HH: pad(hours),
          hh: pad(hours % 12 || 12),
          h: (hours % 12 || 12).toString(),
          mm: pad(minutes),
          m: minutes.toString(),
          ss: pad(seconds),
          s: seconds.toString(),
          tt: hours >= 12 ? 'PM' : 'AM',
        };
        
        // Sort by length (longest first) to avoid partial replacements
        const pattern = Object.keys(replacements)
          .sort((a, b) => b.length - a.length)
          .join('|');
        
        return format.replace(
          new RegExp(pattern, 'g'),
          (match) => replacements[match] || match
        );
      }
      return value?.toString() || "";
    }

    // SPECIAL FORMATS
    if (fmt === "BIZ") {
      const num = parseNumber(value);
      return num === 0 ? "" : num.toFixed(2);
    }
    
    if (fmt === "SHRINK") {
      return value?.toString() || "";
    }

    // Default: return as string
    return value?.toString() || "";

  } catch (error) {
    console.error('Error formatting value:', error);
    return value?.toString() || "";
  }
};

const formatDate = (value: any, format: string) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value.toString();

  const pad = (n: number) => n.toString().padStart(2, "0");

  const map: Record<string, string> = {
    dd: pad(date.getDate()),
    d: date.getDate().toString(),
    MM: pad(date.getMonth() + 1),
    yy: date.getFullYear().toString().slice(2),
    yyyy: date.getFullYear().toString(),
    HH: pad(date.getHours()),
    hh: pad(date.getHours() % 12 || 12),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    a: date.getHours() >= 12 ? "PM" : "AM",
    MMM: date.toLocaleString("en-US", { month: "short" }),
  };

  return format.replace(
    /(yyyy|yy|dd|d|MM|HH|hh|mm|ss|a|MMM)/g,
    (token) => map[token] || token
  );
};
