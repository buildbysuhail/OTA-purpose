import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNumberToWords } from '../utilities/number-to-words';
import { useNumberFormat } from '../utilities/hooks/use-number-format';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { HeaderFooter } from '../redux/slices/user-session/reducer';
import Urls from '../redux/urls';
import { APIClient } from '../helpers/api-client';
import { DeepPartial } from 'redux';
import { isNullOrUndefinedOrEmpty, isNullOrUndefinedOrZero } from '../utilities/Utils';
import { getArabicNumber } from './inventory/reports/tax-reports-ksa/vat-return-form/Vat-Return-Form-arabic';
import { TransactionMasterInitialData } from './inventory/transactions/purchase/transaction-type-data';
import merge from "lodash.merge";
import { InvDataForPrint, InvDetailForPrint, InvMasterForPrint, PrintCustomFields } from './use-print-type';
import { initialInvDataForPrint, initialPrintCustomFields } from './use-print-type-data';


type VoucherType = {
  voucherType: string;
  transactionType: string;
};

const api = new APIClient();

export const usePrintTrans = ({ voucherType, transactionType }: VoucherType) => {
  // Core class variables - exact match to C#


  const [showPreview, setShowPreview] = useState(false);
  const [pdfPrintPath, setPdfPrintPath] = useState("");

  // Print processing refs
  const printDesignRef = useRef("");
  const draftPrinterRef = useRef(null);
  const printEventArgsRef = useRef(null);


  // Utility functions
  const getBranchID = useCallback(() => 1, []); // Mock
  const getDBID = useCallback(() => "MOCK_DB", []); // Mock
  const getIsAppGlobal = useCallback(() => true, []); // Mock
  const getBusinessType = useCallback(() => "Restaurant", []); // Mock
  const getUseTemplateSelectionForPrinting = useCallback(() => false, []); // Mock
  const getShowPrinterSelection = useCallback(() => false, []); // Mock
  const getIsGroupedPrintofProductQuantity = useCallback(() => false, []); // Mock
  const getTempFileName = useCallback(() => "temp.txt", []); // Mock
  const getDBIDValue = useCallback(() => "MOCK_DB_ID", []); // Mock
  const getDefaultCustomerLedgerID = useCallback(() => 1, []); // Mock
  const getLoggedUsername = useCallback(() => "user", []); // Mock

  const { convertAmountToEnglish, convertAmountToArabic, toArabicNumber, getArabicDateNumber } = useNumberToWords();
  const { posRoundAmount } = useNumberFormat();
  const userSession = useSelector((state: RootState) => state.UserSession)

  // const getDeliveryAddressPart = useCallback((address: string, index: number) => {
  //   if (!address) return "";
  //   const parts = address.split(", ");
  //   return parts[index] || "";
  // }, []);

  // const getHeaderFooterValue = useCallback((fieldName: string) => {

  //   const values = userSession.headerFooter;
  //   return values[fieldName as keyof HeaderFooter] || "";
  // }, []);


  // const updateDetailsAndSummary = useCallback(async (printData: InvDataForPrint) => {
  //   const dtTransDetails = printData.details;
  //   if (!dtTransDetails) return;

  //   // Local accumulators
  //   //  

  //   let currentRow = 0;

  //   // Process each detail row
  //   for (let i = 0; i < dtTransDetails.length; i++) {
  //     const row: InvDetailForPrint = dtTransDetails[i];
  //     if (!printData.custom.isInvTrans && !printData.custom.isSalesView && !printData.custom.isServiceTrans) {
  //       printData.custom.pageTotDebit += row.debit ?? 0;
  //       const amt = row.debit ?? 0 + row.credit ?? 0;
  //       printData.custom.narration = row.narration || "";
  //       printData.custom.cashPaidOrRcvd = amt;

  //       // Set party ledger ID based on voucher type
  //       switch (voucherType) {
  //         case "CR":
  //         case "CN":
  //         case "BR":
  //           printData.custom.partyLedgerID = row.relatedLedgerID ?? 0;
  //           break;
  //         case "JV":
  //         case "OB":
  //         case "CB":
  //           if (row.debit ?? 0 > 0) {
  //             printData.custom.partyLedgerID = row.ledgerID ?? 0;
  //           } else {
  //             printData.custom.partyLedgerID = row.relatedLedgerID ?? 0;
  //           }
  //           break;
  //         case "CP":
  //         case "DN":
  //         case "BP":
  //           printData.custom.partyLedgerID = row.ledgerID ?? 0;
  //           break;
  //       }
  //       // Set final grant total
  //       return
  //     }
  //     // Group header
  //     if (row.groupName?.toUpperCase() !== printData.custom.lastGroupName?.toUpperCase()) {
  //       printData.custom.lastGroupName = row.groupName?.toUpperCase() || "";
  //       printData.hasGroupHeaderPrinting = true;
  //     } else {
  //       printData.hasGroupHeaderPrinting = false;
  //     }

  //     // Running totals
  //     printData.custom.pageTotDebit += (row.netAmount || 0);
  //     printData.custom.totalPageQty += (row.quantity || 0)
  //     printData.custom.totalNetAmount += (row.netAmount || 0)
  //     printData.custom.totalNetValue += (row.netAmount || 0)

  //     // Product info
  //     printData.custom.prodName = row.productName || "";
  //     printData.custom.prodDescription = row.productDescription || "";
  //     printData.custom.productCode = row.productCode || "";
  //     printData.custom.modelNoKOT = row.modelNo || "";

  //     // Gate pass
  //     if (row.specification === "Y") {
  //       printData.custom.productNameGatePass = row.productName || "";
  //       printData.custom.qtyGatePass = row.quantity ?? 0;
  //       printData.custom.totalItemsGate += row.quantity ?? 0;
  //       printData.custom.gt = true;
  //     }

  //     // GST calculations
  //     if (getIsAppGlobal()) {
  //       const cgst = row.cgst ?? 0;
  //       const sgst = row.sgst ?? 0;
  //       const igst = row.igst ?? 0;
  //       const cessAmt = row.cessAmt ?? 0;
  //       const addCess = row.additionalCess ?? 0;

  //       printData.custom.sumOfCGST += cgst;
  //       printData.custom.sumOfSGST += sgst;
  //       printData.custom.sumOfIGST += igst;
  //       printData.custom.sumOfCessAmt += cessAmt;
  //       printData.custom.sumOfAddCessAmt += addCess;
  //       printData.custom.sumOfGST += cgst + sgst + igst + cessAmt + addCess;

  //       const totalGSTPerc =
  //         (row.sgstPerc ?? 0) +
  //         (row.cgstPerc ?? 0) +
  //         (row.igstPerc ?? 0);

  //       const netValue = row.netValue ?? 0;

  //       if (totalGSTPerc === 0) {
  //         printData.custom.zeroTaxable += netValue;
  //         printData.custom.zeroSGSTAmt += sgst;
  //         printData.custom.zeroCGSTAmt += cgst;
  //         printData.custom.zeroIGSTAmt += igst;
  //         printData.custom.zeroTotal += cgst + sgst + igst;
  //       } else if (totalGSTPerc === 3) {
  //         printData.custom.threeTaxable += netValue;
  //         printData.custom.threeSGST += sgst;
  //         printData.custom.threeCGST += cgst;
  //         printData.custom.threeIGST += igst;
  //         printData.custom.threeTotal += cgst + sgst + igst;
  //       } else if (totalGSTPerc === 5) {
  //         printData.custom.fiveTaxable += netValue;
  //         printData.custom.fiveSGSTAmt += sgst;
  //         printData.custom.fiveCGSTAmt += cgst;
  //         printData.custom.fiveIGSTAmt += igst;
  //         printData.custom.fiveTotal += cgst + sgst + igst;
  //       } else if (totalGSTPerc === 12) {
  //         printData.custom.twelveTaxable += netValue;
  //         printData.custom.twelveSGSTAmt += sgst;
  //         printData.custom.twelveCGSTAmt += cgst;
  //         printData.custom.twelveIGSTAmt += igst;
  //         printData.custom.twelveTotal += cgst + sgst + igst;
  //       } else if (totalGSTPerc === 18) {
  //         printData.custom.eighteenTaxable += netValue;
  //         printData.custom.eighteenSGSTAmt += sgst;
  //         printData.custom.eighteenCGSTAmt += cgst;
  //         printData.custom.eighteenIGSTAmt += igst;
  //         printData.custom.eighteenTotal += cgst + sgst + igst;
  //       } else if (totalGSTPerc === 28) {
  //         printData.custom.twentyEightTaxable += netValue;
  //         printData.custom.twentyEightSGSTAmt += sgst;
  //         printData.custom.twentyEightCGSTAmt += cgst;
  //         printData.custom.twentyEightIGSTAmt += igst;
  //         printData.custom.twentyEightTotal += cgst + sgst + igst;
  //       }
  //     }

  //     // Other totals
  //     printData.custom.sumOfGross += row.grossValue ?? 0;
  //     printData.custom.sumOfDisc += row.discountAmt1 ?? 0;
  //     printData.custom.sumOfNetAmt += row.netAmount ?? 0;
  //     printData.custom.sumOfNetValue += row.netValue ?? 0;
  //     printData.custom.totalQty += row.quantity ?? 0;
  //     printData.custom.totalFree += row.free ?? 0;

  //     // MRP calc
  //     const mrp = row.mrp??0;
  //     const qty = row.quantity??0;
  //     const rateWithTax = row.rateWithTax??0;
  //     if (mrp > 0) {
  //       printData.custom.mrpDifference += (mrp * qty) - (rateWithTax * qty);
  //       printData.custom.mrpTotal += mrp * qty;
  //     }

  //     currentRow = i + 1;
  //   }

  //   if (!printData.custom.isInvTrans && !printData.custom.isSalesView && !printData.custom.isServiceTrans) {
  //     const debit = parseFloat(printData.master.totalDebit || 0);
  //     const credit = parseFloat(printData.master.totalCredit || 0);
  //     printData.custom.grandTotal = debit > 0 ? debit : credit;
  //     printData.master.grandTotal = debit > 0 ? debit : credit;
  //   }
  //   // Finalize
  //   let grantTotal = 0;
  //   let exchangeRateVal = 1;
  //   let sumOfGrossfc = 0;
  //   if (printData.custom.isInvTrans && printData.master) {
  //     grantTotal = printData.master.grandTotal ?? 0;
  //     exchangeRateVal = printData.master.exchangeRate ?? 1;
  //     printData.custom.sumOfGrossfc = printData.custom.sumOfGross / exchangeRateVal;
  //   }

  //   return printData;
  // }, []);





  // const loadPrintData = useCallback(async (invTransMasterIDParam: number, fields: (keyof PrintCustomFields)[], voucherTypeParam: string,
  //   formType: string,
  //   isInvTrans = false,
  //   isSalesView = false,
  //   isServiceTrans = false,
  //   transDate = "2014-1-1",
  //   showPreview = false,
  //   printCopies = 1,
  //   isReprint = false,
  //   printDesignType = "",
  //   isPOSPrinting = false,
  //   isFromSalesReceipt = false,
  //   isPackingSlipPrint = false,
  //   warehouseID = 0,
  //   isReprintFlag = false,
  //   isPdf = false,
  //   filepath = "",
  //   gatePassItems = [],
  //   kitchenIDParam = 0,
  //   kitchenPrinterNameParam?: string,
  //   kitchenNameParam = "",
  //   commonKitchenProductGroupIDParam = 0): Promise<InvDataForPrint> => {
  //   const multiPayment = fields.includes("bankCard") || fields.includes("qrPay")
  //   const printCount = fields.includes("printCount")
  //   const privilageCardBalance = fields.includes("privilageCardBalance") //&& PrivCardNumber
  //   const taxAmountIncludingTaxOnDiscount = fields.includes("total5PercTaxValue") || fields.includes("total15PercTaxValue") || fields.includes("totalzeroPercentTaxValue")
  //   const taxableAmountIncludingTaxOnDiscount = fields.includes("total5PerctaxableValue") || fields.includes("total15PerctaxableValue") || fields.includes("totalzeroPercentTaxableValue")
  //   let returnData: InvDataForPrint = initialInvDataForPrint;
  //   try {

  //     // PrevoiusDayLedgerBalance
  //     // LedgerBalance
  //     // IsLedgerUnderBank
  //     // IsLedgerUnderCashOrBank
  //     // IsCashInHandLedger
  //     // IsBankLedger
  //     // ProductStockdetails
  //     const printData: InvDataForPrint = await api.getAsync(`${Urls.inv_transaction_base}${transactionType}/printData/?
  //                                           invTransactionMasterID=${invTransMasterIDParam}
  //                                           &multiPayment=${multiPayment}
  //                                           &printCount= ${printCount}
  //                                           &taxableAmountIncludingTaxOnDiscount= ${taxableAmountIncludingTaxOnDiscount}
  //                                           &taxAmountIncludingTaxOnDiscount= ${taxAmountIncludingTaxOnDiscount}
  //                                           &privilageCardBalance= ${privilageCardBalance}`);
  //     returnData = merge({}, returnData, printData);
  //     returnData.custom = returnData.custom ?? initialPrintCustomFields;
  //     const isKitchenPrint = !isNullOrUndefinedOrZero(kitchenIDParam) || !isNullOrUndefinedOrZero(commonKitchenProductGroupIDParam) ||
  //       !isNullOrUndefinedOrEmpty(kitchenPrinterNameParam) || !isNullOrUndefinedOrEmpty(kitchenNameParam)
  //     if (isKitchenPrint) {
  //       returnData.custom.kitchenID = kitchenIDParam;
  //       returnData.custom.kitchenPrinterName = kitchenPrinterNameParam ?? "";
  //       returnData.custom.printerName = kitchenPrinterNameParam ?? "";
  //       returnData.custom.kitchenName = kitchenNameParam;
  //       returnData.custom.commonKitchenProductGroupID = commonKitchenProductGroupIDParam;
  //     }
  //     let barcode = "";
  //     if (invTransMasterIDParam < 10) {
  //       barcode = `*00000${invTransMasterIDParam}*`;
  //     } else if (invTransMasterIDParam < 100) {
  //       barcode = `*0000${invTransMasterIDParam}*`;
  //     } else if (invTransMasterIDParam < 1000) {
  //       barcode = `*000${invTransMasterIDParam}*`;
  //     } else {
  //       barcode = `*${invTransMasterIDParam}*`;
  //     }

  //     returnData.custom.transactionBarcode = barcode;

  //     if (isKitchenPrint) {
  //       returnData.custom.transactionTime = printData?.master?.systemDateTime;
  //       return returnData;
  //     }
  //     if (isServiceTrans) {
  //       return returnData;
  //     }
  //     if (printData && printData.master && printData.master) {
  //       const voucherNumber = printData.master?.voucherNumber || "";
  //       const voucherTypeCode = printData.master?.voucherType || "";
  //       const voucherPrefix = printData.master?.voucherPrefix || "";

  //       returnData.custom.billNumberBarcode = `(1${voucherTypeCode}${voucherNumber})`
  //       returnData.custom.tokenBarcode = `(${voucherNumber})`

  //       if (voucherNumber.toString().length < 2) {
  //         returnData.custom.voucherNumberBarcode = `(00${voucherNumber})`
  //       } else if (voucherNumber.toString().length < 3) {
  //         returnData.custom.voucherNumberBarcode = `(0${voucherNumber})`
  //       } else {
  //         returnData.custom.voucherNumberBarcode = `(${voucherNumber})`
  //       }

  //       returnData.custom.billNumberPrefBarcode = `(${voucherPrefix}.1${voucherTypeCode}${voucherNumber})`

  //       returnData.custom.transactionTimeGate = new Date(printData.master?.transactionDateWithTime || new Date()).toISOString()

  //       returnData.custom.isFromSalesReceipt = isFromSalesReceipt
  //       if (printCopies > 0) {
  //         returnData.custom.noOfCopies = printCopies
  //       }
  //       returnData.custom.transactionDate = transDate
  //       returnData.custom.isPOSPrinting = isPOSPrinting
  //       returnData.custom.isInvTrans = isInvTrans
  //       returnData.custom.isSalesView = isSalesView
  //       returnData.custom.isReprint = isReprint


  //       if (isInvTrans) {

  //         // Handle packing slip print
  //         if (isPackingSlipPrint) {
  //           let totalBillQtyCalc = 0;
  //           if (printData.details) {
  //             for (let i = 0; i < printData.details.length; i++) {
  //               totalBillQtyCalc += parseFloat(printData.details[i].Quantity || 0);
  //             }
  //           }
  //           returnData.custom.totalBillQty = totalBillQtyCalc;
  //           returnData.custom.billDiscount = printData.details ? printData.details.length : 0;

  //           // Filter by warehouse or sort by group
  //           if (userSession.dbIdValue === "SUBAI_SWEETS") {
  //             const sorted = [...(printData.details || [])].sort((a, b) => {
  //               const groupCompare = (a.GroupName || "").localeCompare(b.GroupName || "");
  //               if (groupCompare !== 0) return groupCompare;
  //               const unitCompare = (a.UnitName || "").localeCompare(b.UnitName || "");
  //               if (unitCompare !== 0) return unitCompare;
  //               return (a.InvTransactionDetailID || 0) - (b.InvTransactionDetailID || 0);
  //             });

  //             returnData.details = sorted;
  //           } else {
  //             if (warehouseID > 0) {
  //               const filtered = (printData.details || []).filter((item: TransactionDetail) =>
  //                 (item.warehouseID || 0) === warehouseID
  //               );
  //               returnData.printData.details = filtered;
  //             }
  //           }
  //         }

  //       } else {
  //         returnData.custom.totalItems = printData.details ? printData.details.length : 0;

  //         const grandTotalValue = printData?.master ?
  //           (parseFloat(printData?.master.TotalDebit || 0) > 0 ?
  //             parseFloat(printData?.master.TotalDebit || 0) :
  //             parseFloat(printData?.master.TotalCredit || 0)) : 0;
  //         returnData.custom.grantTotal = grandTotalValue;
  //         returnData.custom.jvTotalDebit = 0;
  //         returnData.custom.jvTotalCredit = 0;

  //         if (printData?.maste) {
  //           returnData.custom.drCr = printData?.master.DrCr || "";
  //           if (voucherTypeParam === "JV") {
  //             if (printData?.master.DrCr === "Dr") {
  //               returnData.custom.jvTotalCredit = grandTotalValue;
  //               returnData.custom.jvTotalCredit = 0;
  //             } else {
  //               returnData.custom.jvTotalCredit = 0;
  //               returnData.custom.jvTotalCredit = grandTotalValue;
  //             }
  //           }
  //         }
  //       }

  //       return returnData;
  //     }

  //   } catch (error) {
  //     console.error("Error loading inventory data:", error);
  //     throw error;
  //   } finally {
  //     return returnData;
  //   }
  // }, []);

  // // Check if field should be hidden based on hide codes
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

  // // Get field value - this is the massive function with 200+ cases


  // // Get common values - massive function with 200+ field calculations
  // const getCommonValues = useCallback((fieldName: keyof PrintCustomFields) => {
  //   let v = "";
  //   switch (fieldName) {
  //     case "AMOUNTINWORDS":
  //       v = getAmountInWords(grantTotal);
  //       break;
  //     case "AMOUNTINWORDSLINE2":
  //       const ln = parseInt(fldLength || "0");
  //       v = getAmountInWords(grantTotal);
  //       if (v.length > ln) {
  //         v = v.substring(ln);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "AMOUNTINWORDSINARABIC":
  //       v = getAmountInWordsInArabic(grantTotal);
  //       break;
  //     case "MANNUALORAUTOBARCODE":
  //       v = mannualBarcode || autoBarcode;
  //       break;
  //     case "BILLNUMBERBARCODE":
  //       v = billNumberBarcode;
  //       break;
  //     case "TRANSACTIONBARCODE":
  //       v = transactionBarcode;
  //       break;
  //     case "QRCODE_KSA_EINVOICE_PHASE1":
  //     case "QRCODE_KSA_EINVOICE":
  //     case "QRCODE_KSA_EINVOICE_NOT_ENCRYPTED":
  //       v = getQRCodeKSA();
  //       break;
  //     case "DELIVERYPHONE":
  //       v = getDeliveryAddressPart(deliveryAddress3, 0);
  //       break;
  //     case "DELIVERYSTREET":
  //       v = getDeliveryAddressPart(deliveryAddress3, 1);
  //       break;
  //     case "DELIVERYLANDMARK":
  //       v = getDeliveryAddressPart(deliveryAddress3, 2);
  //       break;
  //     case "DELIVERYREMARKS":
  //       v = getDeliveryAddressPart(deliveryAddress3, 3);
  //       break;
  //     case "BILLNUMBER_PREF_BARCODE":
  //       v = billNumberPrefBarcode;
  //       break;
  //     case "TOKENBARCODE":
  //       v = tokenBarcode;
  //       break;
  //     case "VOUCHERNUMBERBARCODE":
  //       v = voucherNumberBarcode;
  //       break;
  //     case "GROUPNAMEHEAD":
  //       v = lastGroupName;
  //       break;
  //     case "PRINTTIME":
  //       v = new Date().toLocaleTimeString();
  //       break;
  //     case "TRANSACTIONTIME":
  //       v = transactionTime.toLocaleTimeString();
  //       break;
  //     case "PRINTDATE":
  //       v = new Date().toLocaleDateString();
  //       break;
  //     case "DATE":
  //       v = new Date().toDateString();
  //       break;
  //     case "PRINTCOPYSTATUS":
  //       switch (printInCopy) {
  //         case 1: v = "Original"; break;
  //         case 2: v = "Duplicate"; break;
  //         case 3: v = "Triplicate"; break;
  //         case 4: v = "Quadriplicate"; break;
  //         default: v = `${printInCopy} Th Copy`; break;
  //       }
  //       break;
  //     case "PRINTCOPYSTATUS2":
  //       switch (printInCopy) {
  //         case 1: v = "Customers Copy"; break;
  //         case 2: v = "Office Copy"; break;
  //         case 3: v = "Store Copy"; break;
  //         case 4: v = "Sales man Copy"; break;
  //         default: v = `${printInCopy} Th Copy`; break;
  //       }
  //       break;
  //     case "SALESBILLNUMBERS":
  //       v = salesBillNumbers.slice(0, -1);
  //       break;
  //     case "SALESRETBILLNUMBERS":
  //       v = salesRetBillNumbers.slice(0, -1);
  //       break;
  //     case "BILLAMOUNTS":
  //       v = billAmounts.slice(0, -1);
  //       break;
  //     case "RETBILLAMOUNTS":
  //       v = retBillAmounts ? retBillAmounts.slice(0, -1) : "";
  //       break;
  //     case "HEADER1":
  //     case "HEADER2":
  //     case "HEADER3":
  //     case "HEADER4":
  //     case "HEADER5":
  //     case "HEADER6":
  //     case "HEADER7":
  //     case "HEADER8":
  //     case "HEADER9":
  //     case "HEADER10":
  //       v = getHeaderFooterValue(fieldNameUpper);
  //       break;
  //     case "FOOTER1":
  //     case "FOOTER2":
  //     case "FOOTER3":
  //     case "FOOTER4":
  //     case "FOOTER5":
  //     case "FOOTER6":
  //     case "FOOTER7":
  //     case "FOOTER8":
  //     case "FOOTER9":
  //     case "FOOTER10":
  //       v = getHeaderFooterValue(fieldNameUpper);
  //       break;
  //     case "TOTALITEMS":
  //       v = totalItems.toString();
  //       break;
  //     case "SUM OF QTY":
  //       v = totalQty.toString();
  //       break;
  //     case "PAGE TOTAL OF QTY":
  //       v = totalPageQty.toString();
  //       break;
  //     case "SUM OF FREE":
  //       v = totalFree.toString();
  //       break;
  //     case "SUM OF QTY+FREE":
  //     case "TOTAL QTY AND FREE":
  //       setTotalQtyFree(totalFree + totalQty);
  //       v = totalQtyFree.toString();
  //       break;
  //     case "PAGE TOTAL OF FREE":
  //       v = pageTotFree.toString();
  //       break;
  //     // GST calculations
  //     case "SUM OF CGST":
  //       v = sumOfCGST.toString();
  //       break;
  //     case "SUM OF SGST":
  //       v = sumOfSGST.toString();
  //       break;
  //     case "SUM OF IGST":
  //       v = sumOfIGST.toString();
  //       break;
  //     case "SUM OF CESSAMT":
  //       v = sumOfCessAmt.toString();
  //       break;
  //     case "SUM OF ADDCESSAMT":
  //       v = sumOfAddCessAmt.toString();
  //       break;
  //     case "SUM OF GST":
  //       v = sumOfGST.toString();
  //       break;
  //     case "GST":
  //       v = sumGST.toString();
  //       break;
  //     case "TAXABLE 0%":
  //       v = zeroTaxable.toString();
  //       break;
  //     case "SGST 0%":
  //       v = zeroSGSTAmt.toString();
  //       break;
  //     case "CGST 0%":
  //       v = zeroCGSTAmt.toString();
  //       break;
  //     case "IGST 0%":
  //       v = zeroIGSTAmt.toString();
  //       break;
  //     case "TOTAL 0%":
  //       v = zeroTotal.toString();
  //       break;
  //     case "TAXABLE 3%":
  //       v = threeTaxable.toString();
  //       break;
  //     case "SGST 3%":
  //       v = threeSGST.toString();
  //       break;
  //     case "CGST 3%":
  //       v = threeCGST.toString();
  //       break;
  //     case "IGST 3%":
  //       v = threeIGST.toString();
  //       break;
  //     case "TOTAL 3%":
  //       v = threeTotal.toString();
  //       break;
  //     case "TAXABLE 5%":
  //       v = fiveTaxable.toString();
  //       break;
  //     case "SGST 5%":
  //       v = fiveSGSTAmt.toString();
  //       break;
  //     case "CGST 5%":
  //       v = fiveCGSTAmt.toString();
  //       break;
  //     case "IGST 5%":
  //       v = fiveIGSTAmt.toString();
  //       break;
  //     case "TOTAL 5%":
  //       v = fiveTotal.toString();
  //       break;
  //     case "TAXABLE 12%":
  //       v = twelveTaxable.toString();
  //       break;
  //     case "SGST 12%":
  //       v = twelveSGSTAmt.toString();
  //       break;
  //     case "CGST 12%":
  //       v = twelveCGSTAmt.toString();
  //       break;
  //     case "IGST 12%":
  //       v = twelveIGSTAmt.toString();
  //       break;
  //     case "TOTAL 12%":
  //       v = twelveTotal.toString();
  //       break;
  //     case "TAXABLE 18%":
  //       v = eighteenTaxable.toString();
  //       break;
  //     case "SGST 18%":
  //       v = eighteenSGSTAmt.toString();
  //       break;
  //     case "CGST 18%":
  //       v = eighteenCGSTAmt.toString();
  //       break;
  //     case "IGST 18%":
  //       v = eighteenIGSTAmt.toString();
  //       break;
  //     case "TOTAL 18%":
  //       v = eighteenTotal.toString();
  //       break;
  //     case "TAXABLE 28%":
  //       v = twentyEightTaxable.toString();
  //       break;
  //     case "SGST 28%":
  //       v = twentyEightSGSTAmt.toString();
  //       break;
  //     case "CGST 28%":
  //       v = twentyEightCGSTAmt.toString();
  //       break;
  //     case "IGST 28%":
  //       v = twentyEightIGSTAmt.toString();
  //       break;
  //     case "TOTAL 28%":
  //       v = twentyEightTotal.toString();
  //       break;
  //     case "GST 0%":
  //       v = (zeroSGSTAmt + zeroCGSTAmt).toString();
  //       break;
  //     case "GST 3%":
  //       v = (threeSGST + threeCGST).toString();
  //       break;
  //     case "GST 5%":
  //       v = (fiveSGSTAmt + fiveCGSTAmt).toString();
  //       break;
  //     case "GST 12%":
  //       v = (twelveSGSTAmt + twelveCGSTAmt).toString();
  //       break;
  //     case "GST 18%":
  //       v = (eighteenSGSTAmt + eighteenCGSTAmt).toString();
  //       break;
  //     case "GST 28%":
  //       v = (twentyEightSGSTAmt + twentyEightCGSTAmt).toString();
  //       break;
  //     case "MRPTOTAL":
  //       v = mrpTotal.toString();
  //       break;
  //     case "MRPDIFFERENCE":
  //       v = mrpDifference.toString();
  //       break;
  //     case "QRPAY":
  //       v = qrPay.toString();
  //       break;
  //     case "BANKCARD":
  //       v = bankCard.toString();
  //       break;
  //     case "SUM OF GROSS":
  //       v = sumOfGross.toString();
  //       break;
  //     case "TOTALGROSSFC":
  //       v = sumOfGrossfc.toString();
  //       break;
  //     case "SUM OF DISC":
  //       v = sumOfDisc.toString();
  //       break;
  //     case "SUM OF TAX":
  //       v = sumOfTax.toString();
  //       break;
  //     case "SUM OF NETAMT":
  //       v = sumOfNetAmt.toString();
  //       break;
  //     case "SUM OF VAT":
  //       v = sumOfVAT.toString();
  //       break;
  //     case "SUM OF TOTDISC":
  //       v = sumOfTotDisc.toString();
  //       break;
  //     case "SUM OF CST":
  //       v = sumOfCST.toString();
  //       break;
  //     case "SUM OF NETVALUE":
  //       v = sumOfNetValue.toString();
  //       break;
  //     case "SUM OF MRP":
  //       v = sumOfMRP.toString();
  //       break;
  //     case "SUM OF NOSQTY":
  //       v = sumOfNosQty.toString();
  //       break;
  //     case "SUM OF MRPRATE":
  //       v = sumOfMRPRate.toString();
  //       break;
  //     case "SUM OF SCHEMEDISC":
  //       v = sumOfSchemDisc.toString();
  //       break;
  //     case "SUM OF NETWEIGHT":
  //       v = sumOfNetWeight.toString();
  //       break;
  //     case "STATENAME":
  //       v = stateName;
  //       break;
  //     case "STATECODE":
  //       v = stateCode;
  //       break;
  //     case "YOU SAVED":
  //       const bill = totalNetAmount - billDiscount;
  //       setTotalSavedAmt(mrpTotal - bill);
  //       const roundSave = posRoundAmount(totalSavedAmt);
  //       v = roundSave.toString();
  //       break;
  //     // Page totals
  //     case "PAGE TOTAL OF GROSS":
  //       v = pageTotalofGross.toString();
  //       break;
  //     case "PAGE TOTAL OF DISC":
  //       v = pageTotalofDisc.toString();
  //       break;
  //     case "PAGE TOTAL OF TAX":
  //       v = pageTotalofTax.toString();
  //       break;
  //     case "PAGE TOTAL OF NETAMT":
  //       v = pageTotalofNetAmt.toString();
  //       break;
  //     case "PAGE TOTAL OF SCHEMEDISC":
  //       v = pageTotalofSchmeDisc.toString();
  //       break;
  //     case "PAGE TOTAL OF VAT":
  //       v = pageTotalofVAT.toString();
  //       break;
  //     case "PAGE TOTAL OF TOTDISC":
  //       v = pageTotalofTotDisc.toString();
  //       break;
  //     case "PAGE TOTAL OF CST":
  //       v = pageTotalofCST.toString();
  //       break;
  //     case "PAGE TOTAL OF NETVAKUE":
  //       v = pageTotalofNetValue.toString();
  //       break;
  //     case "PAGE TOTAL OF NOSQTY":
  //       v = pageTotalofNosQty.toString();
  //       break;
  //     case "PAGENO":
  //       v = pageNo.toString();
  //       break;
  //     case "PAGE N OF M":
  //       v = `Page ${pageNo} Of ${noOfPages}`;
  //       break;
  //     case "NOOFPAGES":
  //       v = noOfPages.toString();
  //       break;
  //     case "TOTALQTY":
  //       v = totalQty.toString();
  //       break;
  //     case "TOTALPAGEQTY":
  //       v = totalPageQty.toString();
  //       break;
  //     case "PAGETOTDEBIT":
  //       v = pageTotDebit.toString();
  //       break;
  //     case "TOTALNETAMOUNT":
  //       v = totalNetAmount.toString();
  //       break;
  //     case "PAGETOTAMOUNT":
  //       v = pageTotAmount.toString();
  //       break;
  //     case "FREESTRING":
  //       v = freeString;
  //       break;
  //     case "GROUPWISESINO":
  //     case "SI_NO":
  //       v = currentRow.toString();
  //       break;
  //     case "PRODUCTUNITREMARKSORPRODUCTNAME":
  //       v = productUnitRemarksOrProductName;
  //       break;
  //     case "PARTYNAMELINE2":
  //       const flen = parseInt(fldLength || "0");
  //       if (partyName.length > flen) {
  //         v = partyName.substring(flen);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "PRODUCTNAME2":
  //       let len = parseInt(fldLength || "0");
  //       if (prodName.length > len) {
  //         v = prodName.substring(len);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "PRODUCTNAME3":
  //       len = parseInt(fldLength || "0");
  //       if (prodName.length > len * 2) {
  //         v = prodName.substring(len * 2);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "PRODUCTDESCRIPTION2":
  //       len = parseInt(fldLength || "0");
  //       if (prodDescription.length > len) {
  //         v = prodDescription.substring(len);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "PRODUCTDESCRIPTION3":
  //       len = parseInt(fldLength || "0");
  //       if (prodDescription.length > len * 2) {
  //         v = prodDescription.substring(len * 2);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "PRODUCTDESCRIPTION4":
  //       len = parseInt(fldLength || "0");
  //       if (prodDescription.length > len * 3) {
  //         v = prodDescription.substring(len * 3);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "PRODUCTDESCRIPTION5":
  //       len = parseInt(fldLength || "0");
  //       if (prodDescription.length > len * 4) {
  //         v = prodDescription.substring(len * 4);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "PRODUCTNAMEOROPENPRODUCTNAME":
  //       v = prodName;
  //       if (productCode === "0") {
  //         v = modelNoKOT;
  //       }
  //       break;
  //     case "PRODUCTDESCRIPTIONORNAME":
  //       v = prodDescription || prodName;
  //       break;
  //     case "QTYDETAILS":
  //       v = getProductStockDetails(productBatchID.toString(), invQty);
  //       break;
  //     case "INOUTARABIC":
  //       if (dtTranMaster && dtTranMaster[0]) {
  //         const inOutValue = dtTranMaster[0].InOut;
  //         if (inOutValue === "DINE IN") {
  //           v = "محلي";
  //         } else if (inOutValue === "TAKE AWAY") {
  //           v = "سفري";
  //         } else if (inOutValue === "PARCEL") {
  //           v = "قطعة";
  //         } else if (inOutValue === "DELIVERY") {
  //           v = "توصيل";
  //         }
  //       }
  //       break;
  //     case "MODEOFPAYMENT":
  //       if (isCashInHandLedger(partyLedgerID)) {
  //         if (grantTotal === cashReceived) {
  //           v = "CASH";
  //         } else if (grantTotal === cashReturned) {
  //           v = "CASH";
  //         } else if (grantTotal === bankAmt) {
  //           v = "BANK";
  //         } else {
  //           v = "CASH/BANK";
  //         }
  //       } else if (checkIsLedgerUnderBank(partyLedgerID)) {
  //         v = "BANK";
  //       } else if (grantTotal === cashReceived) {
  //         v = "CASH";
  //       } else if (grantTotal === cashReturned) {
  //         v = "CASH";
  //       } else if (grantTotal === bankAmt) {
  //         v = "BANK";
  //       } else if (grantTotal === cashReceived + bankAmt) {
  //         v = "CASH+BANK";
  //       } else {
  //         v = "CREDIT";
  //       }
  //       break;
  //     case "MODEOFPAYMENTARABIC":
  //       if (isCashInHandLedger(partyLedgerID)) {
  //         if (grantTotal === cashReceived) {
  //           v = "نقدي";
  //         } else if (grantTotal === cashReturned) {
  //           v = "نقدي";
  //         } else if (grantTotal === bankAmt) {
  //           v = "شبكة";
  //         } else {
  //           v = "نقدي/شبكة";
  //         }
  //       } else if (checkIsLedgerUnderBank(partyLedgerID)) {
  //         v = "شبكة";
  //       } else if (grantTotal === cashReceived) {
  //         v = "نقدي";
  //       } else if (grantTotal === cashReceived + bankAmt) {
  //         v = "نقدي+شبكة";
  //       } else if (grantTotal === cashReturned) {
  //         v = "نقدي";
  //       } else if (grantTotal === bankAmt) {
  //         v = "شبكة";
  //       } else {
  //         v = "آجل";
  //       }
  //       break;
  //     case "PAIDORNOT":
  //       v = cashReceived > 0 ? "Paid" : "Not Paid";
  //       break;
  //     // Tax calculations with discount
  //     case "5%TOTALTAXABLEVALUE":
  //       const taxableAmt5 = getTaxableAmountIncludingTaxOnDiscount(invTransactionMasterID, 5);
  //       if (taxableAmt5 > 0) {
  //         setTotal5PerctaxableValue(taxableAmt5);
  //       }
  //       v = total5PerctaxableValue.toString();
  //       break;
  //     case "5%TOTALTAXVALUE":
  //       const taxAmt5 = getTaxAmountIncludingTaxOnDiscount(invTransactionMasterID, 5);
  //       if (taxAmt5 > 0) {
  //         setTotal5PercTaxValue(taxAmt5);
  //       }
  //       v = total5PercTaxValue.toString();
  //       break;
  //     case "15%TOTALTAXABLEVALUE":
  //       const taxableAmt15 = getTaxableAmountIncludingTaxOnDiscount(invTransactionMasterID, 15.0);
  //       if (taxableAmt15 > 0) {
  //         setTotal15PerctaxableValue(taxableAmt15);
  //       }
  //       v = total15PerctaxableValue.toString();
  //       break;
  //     case "15%TOTALTAXVALUE":
  //       const taxAmt15 = getTaxAmountIncludingTaxOnDiscount(invTransactionMasterID, 15.0);
  //       if (taxAmt15 > 0) {
  //         setTotal15PercTaxValue(taxAmt15);
  //       }
  //       v = total15PercTaxValue.toString();
  //       break;
  //     case "0%TOTALTAXABLEVALUE":
  //       const taxableAmt0 = getTaxableAmountIncludingTaxOnDiscount(invTransactionMasterID, 0);
  //       if (taxableAmt0 > 0) {
  //         setZeroPercentTaxableValue(taxableAmt0);
  //       }
  //       v = zeroPercentTaxableValue.toString();
  //       break;
  //     case "0%TOTALTAXVALUE":
  //       setZeroPercentTaxValue(0);
  //       v = zeroPercentTaxValue.toString();
  //       break;
  //     case "AMOUNTINWORDSPAYABLE":
  //       const payableAmount = grantTotal - (dtTranMaster && dtTranMaster[0] ? parseFloat(dtTranMaster[0].SRAmount || 0) : 0);
  //       v = getAmountInWords(payableAmount);
  //       break;
  //     // Balance calculations
  //     case "OB-CASH RCVD":
  //       if (!isCashInHandLedger(partyLedgerID)) {
  //         setOpeningBalance(getLedgerBalance(partyLedgerID, transDate));
  //         v = (openingBalance - cashReceived).toString();
  //       }
  //       break;
  //     case "RUNNING BALANCE":
  //       if (!isCashInHandLedger(partyLedgerID)) {
  //         const runningBal = getLedgerBalance(partyLedgerID, transDate);
  //         v = runningBal.toString();
  //       }
  //       break;
  //     case "LEDGER BALANCE":
  //       if (!isCashInHandLedger(partyLedgerID)) {
  //         const ledgerBal = getLedgerBalance(partyLedgerID);
  //         v = ledgerBal.toString();
  //       }
  //       break;
  //     case "PREVIOUS DAY LEDGER BALANCE":
  //       if (!isCashInHandLedger(partyLedgerID)) {
  //         if (getDBIDValue().trim() === "543140180640") {
  //           if (getDefaultCustomerLedgerID() === partyLedgerID) {
  //             v = "0";
  //           } else {
  //             const ledgerBal = getPreviousDayLedgerBalance(partyLedgerID, transactionDate);
  //             v = ledgerBal.toString();
  //           }
  //         } else {
  //           const ledgerBal = getPreviousDayLedgerBalance(partyLedgerID, transactionDate);
  //           v = ledgerBal.toString();
  //         }
  //       }
  //       break;
  //     case "LEDGERBALANCEANDGRANDTOTAL":
  //       if (!isCashInHandLedger(partyLedgerID)) {
  //         setOpeningBalance(getLedgerBalance(partyLedgerID, transDate));
  //         const adjustedBalance = openingBalance - (grantTotal - cashReceived);
  //         v = (Math.abs(adjustedBalance) + grantTotal).toString();
  //       }
  //       break;
  //     case "LEDGER BALANCE AMOUNT IN WORDS":
  //       if (!isCashInHandLedger(partyLedgerID)) {
  //         const ledgerBal = getLedgerBalance(partyLedgerID);
  //         v = getAmountInWords(Math.abs(ledgerBal));
  //       }
  //       break;
  //     case "CURRENT BILL BALANCE":
  //       v = cashReturned.toString();
  //       break;
  //     case "TOTAL-ADVANCE":
  //       v = (grantTotal - cashReceived - bankAmt).toString();
  //       break;
  //     case "TOTNETVALUE-BILLDISC":
  //       v = (sumOfNetValue - billDiscount).toString();
  //       break;
  //     case "GRANDTOTAL-BILLDISC":
  //       v = (grantTotal - billDiscount).toString();
  //       break;
  //     case "GRANDTOTAL-COUPONAMT":
  //       const couponAmt = dtTranMaster && dtTranMaster[0] ? parseFloat(dtTranMaster[0].CouponAmt || 0) : 0;
  //       v = (grantTotal - couponAmt).toString();
  //       break;
  //     case "QTYWITHUNIT":
  //       v = qtyWithUnit;
  //       break;
  //     case "UNITNETVALUE":
  //       v = unitNetValue.toString();
  //       break;
  //     case "VEHICLENUMBER":
  //       v = dtTranMaster && dtTranMaster[0] ? (dtTranMaster[0].VehicleNumber || "") : "";
  //       break;
  //     case "BILLDISCOUNTPLUSDISCOUNT":
  //       v = (billDiscount + sumOfDisc).toString();
  //       break;
  //     case "PARTYDISPLAYNAME":
  //       v = dtTranMaster && dtTranMaster[0] ? (dtTranMaster[0].PartyDisplayName || "") : "";
  //       break;
  //     // Vehicle details
  //     case "VEHICLENAME":
  //       v = dtTranMaster && dtTranMaster[0] ? (dtTranMaster[0].VehicleName || "") : "";
  //       break;
  //     case "VEHICLEMODEL":
  //       v = dtTranMaster && dtTranMaster[0] ? (dtTranMaster[0].VehicleModel || "") : "";
  //       break;
  //     case "VEHICLECAPACITY":
  //       v = dtTranMaster && dtTranMaster[0] ? (dtTranMaster[0].VehicleCapacity || "") : "";
  //       break;
  //     case "VEHICLEMANUFACTURER":
  //       v = dtTranMaster && dtTranMaster[0] ? (dtTranMaster[0].VehicleManufacturer || "") : "";
  //       break;
  //     case "VEHICLEOWNER":
  //       v = dtTranMaster && dtTranMaster[0] ? (dtTranMaster[0].VehicleOwner || "") : "";
  //       break;
  //     case "VEHICLECOLOR":
  //       v = dtTranMaster && dtTranMaster[0] ? (dtTranMaster[0].VehicleColor || "") : "";
  //       break;
  //     case "VEHICLEODOMETER":
  //       v = dtTranMaster && dtTranMaster[0] ? (dtTranMaster[0].VehicleOdometer || "") : "";
  //       break;
  //     case "VEHICLEREMARKS":
  //       v = dtTranMaster && dtTranMaster[0] ? (dtTranMaster[0].VehicleRemarks || "") : "";
  //       break;
  //     case "BALANCE AMT PAYABLE":
  //       const srAmount = dtTranMaster && dtTranMaster[0] ? parseFloat(dtTranMaster[0].SRAmount || 0) : 0;
  //       v = (grantTotal - srAmount).toString();
  //       break;
  //     case "PRIVILAGECARDBALANCE":
  //       v = loyaltyCardNo.trim() === "" ? "0" : getLoyaltyCardBalance(loyaltyCardNo).toString();
  //       break;
  //     // Cheque printing fields
  //     case "CHEQUE_CHEQUEDATE":
  //       v = chequeDate;
  //       break;
  //     case "CHEQUE_PAYTOACCOUNTNAME":
  //       v = chequePaytoAccountName;
  //       break;
  //     case "CHEQUE_AMOUNT":
  //       v = `***${parseFloat(chequeAmount).toFixed(2)}/-***`;
  //       break;
  //     case "CHEQUE_REMARKS":
  //       v = chequeRemarks;
  //       break;
  //     case "CHEQUE_AMOUNTINWORDSLINE1":
  //       const chequeWordsLine1 = `***${getAmountInWords(parseFloat(chequeAmount))}***`;
  //       setChequeAmountInWords(chequeWordsLine1);
  //       len = parseInt(fldLength || "0");
  //       if (chequeWordsLine1.length > len) {
  //         v = chequeWordsLine1.substring(0, len);
  //       } else {
  //         v = chequeWordsLine1;
  //       }
  //       break;
  //     case "CHEQUE_AMOUNTINWORDSLINE2":
  //       if (!chequeAmountInWords) {
  //         setChequeAmountInWords(`***${getAmountInWords(parseFloat(chequeAmount))}***`);
  //       }
  //       len = parseInt(fldLength || "0");
  //       if (chequeAmountInWords.length > len) {
  //         v = chequeAmountInWords.substring(len);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "CHEQUE_AMOUNTINWORDSLINE3":
  //       if (!chequeAmountInWords) {
  //         setChequeAmountInWords(`***${getAmountInWords(parseFloat(chequeAmount))}***`);
  //       }
  //       len = parseInt(fldLength || "0");
  //       if (chequeAmountInWords.length > len * 2) {
  //         v = chequeAmountInWords.substring(len * 2);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "PREVIOUSBALANCE":
  //       if (voucherType === "CP" || voucherType === "BP") {
  //         if (!isCashInHandLedger(partyLedgerID)) {
  //           setOpeningBalance(getLedgerBalance(partyLedgerID, transDate));
  //           const adjustedBalance = openingBalance - cashPaidOrRcvd;
  //           v = adjustedBalance.toString();
  //         }
  //       } else if (voucherType === "CR" || voucherType === "BR") {
  //         if (!isCashInHandLedger(partyLedgerID)) {
  //           setOpeningBalance(getLedgerBalance(partyLedgerID, transDate));
  //           const adjustedBalance = openingBalance + cashPaidOrRcvd;
  //           v = adjustedBalance.toString();
  //         }
  //       } else {
  //         if (!isCashInHandLedger(partyLedgerID)) {
  //           if (voucherType === "SR") {
  //             setOpeningBalance(getLedgerBalance(partyLedgerID, transDate));
  //             const adjustedBalance = openingBalance + (grantTotal + cashReturned);
  //             v = adjustedBalance.toString();
  //           } else {
  //             setOpeningBalance(getLedgerBalance(partyLedgerID, transDate));
  //             const adjustedBalance = openingBalance - (grantTotal - cashReceived);
  //             v = adjustedBalance.toString();
  //           }
  //         }
  //       }
  //       break;
  //     case "CLOSINGBALANCE":
  //       if (!isCashInHandLedger(partyLedgerID)) {
  //         setOpeningBalance(getLedgerBalance(partyLedgerID, transDate));
  //         v = openingBalance.toString();
  //       }
  //       break;
  //     case "INVOICE STATUS":
  //       const oldInvTrID = dtTranMaster && dtTranMaster[0] ? parseFloat(dtTranMaster[0].OldInvTransactionID || 0) : 0;
  //       v = oldInvTrID === 0 ? "NEW" : "EDITED";
  //       break;
  //     case "NETAMOUNT":
  //       v = (grantTotal + billDiscount).toString();
  //       break;
  //     case "GRANTTOTAL":
  //       if (getIsAppGlobal() && getBusinessType() === "Restaurant") {
  //         v = posRoundAmount(grantTotal).toString();
  //       } else {
  //         v = grantTotal.toString();
  //       }
  //       break;
  //     case "TOTALSALESVALUE":
  //       v = stockTransferTotalSalesValue.toString();
  //       break;
  //     case "PAGETOTALBARCODE":
  //       v = pageTotalBarcode;
  //       break;
  //     case "JVTOTALDEBIT":
  //       v = jvTotalDebit.toString();
  //       break;
  //     case "JVTOTALCREDIT":
  //       v = jvTotalCredit.toString();
  //       break;
  //     case "INVOICENUMBERANDPAGETOTALBARCODE":
  //       v = invoiceNumberAndPageTotalBarcode;
  //       break;
  //     case "WIDTH":
  //       v = pWidth;
  //       break;
  //     case "HEIGHT":
  //       v = pHeight;
  //       break;
  //     case "NON HEIGHT AND WIDTH UNIT":
  //       v = nonHeightWidth;
  //       break;
  //     case "PRINTCOUNT":
  //       v = printCount;
  //       break;
  //     case "SPECIAL LEDGER BALANCE":
  //       if (fileExistsSync("SpecialLedgerID.txt")) {
  //         const specialLedgerID = readFileSync("SpecialLedgerID.txt");
  //         if (specialLedgerID) {
  //           const ledgerBal = getLedgerBalance(parseInt(specialLedgerID));
  //           v = ledgerBal.toString();
  //         }
  //       }
  //       break;
  //     case "SPECIAL LEDGER BALANCE 2":
  //       if (fileExistsSync("SpecialLedgerID2.txt")) {
  //         const specialLedgerID = readFileSync("SpecialLedgerID2.txt");
  //         if (specialLedgerID) {
  //           const ledgerBal = getLedgerBalance(parseInt(specialLedgerID));
  //           v = ledgerBal.toString();
  //         }
  //       }
  //       break;
  //     case "LOGGED USERNAME":
  //       v = getLoggedUsername();
  //       break;
  //     // Kitchen message fields
  //     case "KM_KITCHENREMARKS":
  //       v = kmKitchenRemarks;
  //       break;
  //     case "KM_WAITER":
  //       v = kmWaiter;
  //       break;
  //     case "KM_ORDERNUMBER":
  //       v = kmOrderNumber;
  //       break;
  //     case "KM_TABLENO":
  //       v = kmTableNo;
  //       break;
  //     case "KM_SEATNO":
  //       v = kmSeatNo;
  //       break;
  //     case "KM_TOKENNUMBER":
  //       v = kmTokenNumber;
  //       break;
  //     case "KM_SERVETYPE":
  //       v = kmServeType;
  //       break;
  //     case "KM_KITCHENREMARKS1":
  //       len = parseInt(fldLength || "0");
  //       if (kmKitchenRemarks.length > len) {
  //         v = kmKitchenRemarks.substring(len);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "KM_KITCHENREMARKS2":
  //       len = parseInt(fldLength || "0");
  //       if (kmKitchenRemarks.length > len * 2) {
  //         v = kmKitchenRemarks.substring(len * 2);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "KM_KITCHENREMARKS3":
  //       len = parseInt(fldLength || "0");
  //       if (kmKitchenRemarks.length > len * 3) {
  //         v = kmKitchenRemarks.substring(len * 3);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "KM_KITCHENREMARKS4":
  //       len = parseInt(fldLength || "0");
  //       if (kmKitchenRemarks.length > len * 4) {
  //         v = kmKitchenRemarks.substring(len * 4);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "NARRATION2":
  //       len = parseInt(fldLength || "0");
  //       if (narration.length > len) {
  //         v = narration.substring(len);
  //       } else {
  //         v = "";
  //       }
  //       break;
  //     case "TOTALBILLQTY":
  //       v = totalBillQty.toString();
  //       break;
  //     case "TOTALBILLITEMNOS":
  //       v = totalBillItemNos.toString();
  //       break;
  //     case "BANKCARDNAME":
  //       v = bankCardName;
  //       break;
  //     // Service items
  //     case "SERVICEITEMONE":
  //       v = serviceItems.length > 0 ? serviceItems[0] : "";
  //       break;
  //     case "SERVICEITEMTWO":
  //       v = serviceItems.length > 1 ? serviceItems[1] : "";
  //       break;
  //     case "SERVICEITEMTHREE":
  //       v = serviceItems.length > 2 ? serviceItems[2] : "";
  //       break;
  //     case "SERVICEITEMONEAMT":
  //       v = serviceItemsAMT.length > 0 ? serviceItemsAMT[0] : "";
  //       break;
  //     case "SERVICEITEMTWOAMT":
  //       v = serviceItemsAMT.length > 1 ? serviceItemsAMT[1] : "";
  //       break;
  //     case "SERVICEITEMTHREEAMT":
  //       v = serviceItemsAMT.length > 2 ? serviceItemsAMT[2] : "";
  //       break;
  //     case "GRANDTOTAL-RETRUN":
  //       const grandTot = grantTotal;
  //       const srAmt = dtTranMaster && dtTranMaster[0] ? parseFloat(dtTranMaster[0].SRAmount || 0) : 0;
  //       v = (grandTot - srAmt).toString();
  //       break;
  //     // Gate pass fields
  //     case "PRODUCTSGATEPASS":
  //       setGt(true);
  //       if (productNameGatePass && gatePass) {
  //         v = productNameGatePass;
  //       }
  //       break;
  //     case "QTYGATEPASS":
  //       if (qtyGatePass > 0 && gatePass) {
  //         v = qtyGatePass.toString();
  //       }
  //       break;
  //     case "TRANSACTIONTIMEDATEWITHTIME_GATE":
  //       if (gatePass) {
  //         v = transactionTimeGate.toLocaleTimeString();
  //       }
  //       break;
  //     case "PRINTDATE_GATE":
  //       if (gatePass) {
  //         v = new Date().toLocaleDateString();
  //       }
  //       break;
  //     case "TOTALITEMS_GATE":
  //       if (gatePass) {
  //         v = totalItemsGate.toString();
  //       }
  //       break;
  //     case "VOUCHERNUMBER_GATE":
  //       if (gatePass) {
  //         v = tokenBarcodeGate;
  //       }
  //       break;
  //     case "TOKEN_GATE":
  //       if (gatePass) {
  //         v = "PLEASE KEEP YOUR TOKEN";
  //       }
  //       break;
  //     case "VOUCGER_NO_GATE":
  //       if (gatePass) {
  //         v = "*** VOUCHER NO ***";
  //       }
  //       break;
  //     case "NAME_GATE":
  //       if (gatePass) {
  //         v = "GATEPASS";
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  //   return v;
  // }, [
  //   // Include all dependencies
  //   grantTotal, fldLength, totReturnAmount, roundAmt, adjustmentAmount,
  //   mannualBarcode, autoBarcode, billNumberBarcode, transactionBarcode,
  //   deliveryAddress3, billNumberPrefBarcode, tokenBarcode, voucherNumberBarcode,
  //   lastGroupName, transactionTime, printInCopy, salesBillNumbers,
  //   salesRetBillNumbers, billAmounts, retBillAmounts, totalItems, totalQty,
  //   totalPageQty, totalFree, totalQtyFree, pageTotFree, sumOfCGST, sumOfSGST,
  //   sumOfIGST, sumOfCessAmt, sumOfAddCessAmt, sumOfGST, sumGST, zeroTaxable,
  //   zeroSGSTAmt, zeroCGSTAmt, zeroIGSTAmt, zeroTotal, threeTaxable, threeSGST,
  //   threeCGST, threeIGST, threeTotal, fiveTaxable, fiveSGSTAmt, fiveCGSTAmt,
  //   fiveIGSTAmt, fiveTotal, twelveTaxable, twelveSGSTAmt, twelveCGSTAmt,
  //   twelveIGSTAmt, twelveTotal, eighteenTaxable, eighteenSGSTAmt, eighteenCGSTAmt,
  //   eighteenIGSTAmt, eighteenTotal, twentyEightTaxable, twentyEightSGSTAmt,
  //   twentyEightCGSTAmt, twentyEightIGSTAmt, twentyEightTotal, mrpTotal,
  //   mrpDifference, qrPay, bankCard, sumOfGross, sumOfGrossfc, sumOfDisc,
  //   sumOfTax, sumOfNetAmt, sumOfVAT, sumOfTotDisc, sumOfCST, sumOfNetValue,
  //   sumOfMRP, sumOfNosQty, sumOfMRPRate, sumOfSchemDisc, sumOfNetWeight,
  //   stateName, stateCode, totalSavedAmt, totalNetAmount, billDiscount,
  //   pageTotalofGross, pageTotalofDisc, pageTotalofTax, pageTotalofNetAmt,
  //   pageTotalofSchmeDisc, pageTotalofVAT, pageTotalofTotDisc, pageTotalofCST,
  //   pageTotalofNetValue, pageTotalofNosQty, pageNo, noOfPages, pageTotDebit,
  //   pageTotAmount, freeString, currentRow, productUnitRemarksOrProductName,
  //   partyName, prodName, prodDescription, productCode, modelNoKOT, productBatchID,
  //   invQty, dtTranMaster, inOut, partyLedgerID, cashReceived, cashReturned,
  //   bankAmt, total5PerctaxableValue, total5PercTaxValue, total15PerctaxableValue,
  //   total15PercTaxValue, zeroPercentTaxableValue, zeroPercentTaxValue,
  //   invTransactionMasterID, openingBalance, transDate, sumOfGrossfc, cashPaidOrRcvd,
  //   qtyWithUnit, unitNetValue, loyaltyCardNo, chequeDate, chequePaytoAccountName,
  //   chequeAmount, chequeRemarks, chequeAmountInWords, voucherType, stockTransferTotalSalesValue,
  //   pageTotalBarcode, jvTotalDebit, jvTotalCredit, invoiceNumberAndPageTotalBarcode,
  //   pWidth, pHeight, nonHeightWidth, printCount, kmKitchenRemarks, kmWaiter,
  //   kmOrderNumber, kmTableNo, kmSeatNo, kmTokenNumber, kmServeType, narration,
  //   totalBillQty, totalBillItemNos, bankCardName, serviceItems, serviceItemsAMT,
  //   productNameGatePass, qtyGatePass, gatePass, transactionTimeGate, totalItemsGate,
  //   tokenBarcodeGate, gt
  // ]);

  // // Format field values based on format specification
  // const getFormatedValues = useCallback((value, format) => {
  //   let t = "";
  //   const ws = " ".repeat(200);

  //   if (isQRCodeFont(fldFont)) return value;

  //   if (format && format.includes("#") && !format.includes("**")) {
  //     t = parseFloat(value || 0).toLocaleString(undefined, {
  //       minimumFractionDigits: format.includes(".") ? 2 : 0,
  //       maximumFractionDigits: format.includes(".") ? 2 : 0
  //     });
  //   } else if (format && format.toUpperCase() === "QTY") {
  //     t = Math.round(parseFloat(value || 0)).toString();
  //   } else if (format && format.toUpperCase() === "QTY1") {
  //     const t1 = parseFloat(value || 0);
  //     const t2 = Math.round(t1);
  //     t = t1 !== t2 ? t1.toFixed(1) : t2.toString();
  //   } else if (format && format.toUpperCase() === "QTY2") {
  //     const t1 = parseFloat(value || 0);
  //     const t2 = Math.round(t1);
  //     t = t1 !== t2 ? t1.toFixed(2) : t2.toString();
  //   } else if (format && format.toUpperCase() === "QTY3") {
  //     const t1 = parseFloat(value || 0);
  //     const t2 = Math.round(t1);
  //     t = t1 !== t2 ? t1.toFixed(3) : t2.toString();
  //   } else if (format && format.toUpperCase() === "AR_NUM") {
  //     t = Math.round(parseFloat(value || 0)).toString();
  //     t = getArabicNumber(t);
  //   } else if (format && format.toUpperCase() === "SHRINK") {
  //     t = value;
  //   } else if (format && format.toUpperCase() === "AR_DIG2") {
  //     t = parseFloat(value || 0).toFixed(2);
  //     t = getArabicNumber(t);
  //   } else if (format && format.toUpperCase() === "AR_DATE") {
  //     t = transDate.toLocaleDateString('en-GB');
  //     t = getArabicDateNumber(t);
  //   } else if (format && format.toUpperCase() === "AR_DIG3") {
  //     t = parseFloat(value || 0).toFixed(3);
  //     t = getArabicNumber(t);
  //   } else if (format && (format.includes("d") || format.includes("M") || format.includes("y"))) {
  //     t = new Date(value).toLocaleDateString();
  //   } else if (format && (format.includes("H") || format.includes("h") || format.includes("m") || format.includes("s"))) {
  //     t = new Date(value).toLocaleTimeString();
  //   } else if (format && format.toUpperCase() === "NONE") {
  //     t = value;
  //   } else if (format && format.toUpperCase() === "BIZ") {
  //     const num = parseFloat(value || 0);
  //     t = num === 0 ? "" : num.toFixed(2);
  //   } else {
  //     t = value;
  //   }

  //   // Apply alignment
  //   // const fieldLen = parseInt(fldLength || t.length);

  //   // if (fldAlign === "Left") {
  //   //   t = (t + ws).substring(0, fieldLen);
  //   // } else if (fldAlign === "Right" || fldAlign === "Right Justify") {
  //   //   t = (ws + t).slice(-fieldLen);
  //   // } else if (fldAlign === "Center") {
  //   //   const totalPad = fieldLen - t.length;
  //   //   const leftPad = Math.floor(totalPad / 2);
  //   //   const rightPad = totalPad - leftPad;
  //   //   t = " ".repeat(leftPad) + t + " ".repeat(rightPad);
  //   //   t = t.substring(0, fieldLen);
  //   // } else {
  //   //   try {
  //   //     t = (t + ws).substring(0, fieldLen);
  //   //   } catch (error) {
  //   //     // Handle error
  //   //   }
  //   // }

  //   return t;
  // }, [fldFont, fldAlign, fldLength, transDate]);

  // // Detail printing functions

  // const printSalesViewDetails = useCallback(async () => {
  //   console.log("Printing Sales View Details");
  //   if (!dtTranMaster || !dtTranMaster[0]) return;

  //   setGrantTotal(parseFloat(dtTranMaster[0].GrandTotal || 0));
  //   setTotReturnAmount(parseFloat(dtTranMaster[0].ReturnAmount || 0));
  //   setRoundAmt(parseFloat(dtTranMaster[0].RoundAmount || 0));
  //   setTotDiscAmt(parseFloat(dtTranMaster[0].BillDiscount || 0));
  //   setBalancePaid(parseFloat(dtTranMaster[0].CashReturned || 0));

  //   // Process sales view details if available
  //   if (dtTransDetails) {
  //     for (let i = 0; i < dtTransDetails.length; i++) {
  //       setCurrentRow(i + 1);
  //       // Process each sales view detail row
  //     }
  //   }
  // }, [dtTranMaster, dtTransDetails]);


  // // Insert print details function
  // const insertInvPrintDetails = useCallback(async (invTrMasterID, accTrMasterID, printTime, voucherType, voucherForm = "", voucherPrefix = "") => {
  //   try {
  //     const params = {
  //       branchID: getBranchID(),
  //       invTransactionMasterID: invTrMasterID,
  //       accTransactionMasterID: accTrMasterID,
  //       printTime: new Date(),
  //       systemName: window.navigator.userAgent,
  //       userID: 1, // Mock user ID
  //       voucherType: voucherType,
  //       voucherForm: voucherForm,
  //       financialYearID: 1, // Mock financial year
  //       voucherPrefix: voucherPrefix
  //     };

  //     await executeStoredProcedure("InsertInvPrintDetails", params);
  //   } catch (error) {
  //     console.error("Error inserting print details:", error);
  //   }
  // }, []);

  // Return the hook interface
  return {
  };
};

export default usePrintTrans;