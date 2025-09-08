// import { useSelector } from "react-redux";
// import { Currencies,  useNumberToWords } from "./number-to-words";
// import { isNullOrUndefinedOrEmpty } from "./Utils";
// import { useNumberFormat } from "./hooks/use-number-format";
// import { RootState } from "../redux/store";
// import { UserModel } from "../redux/slices/user-session/reducer";
// import { PrintCustomFields } from "../pages/use-print";

// ==================== COUNTRY ID TO CURRENCY MAPPING ====================

// const COUNTRY_ID_TO_CURRENCY: Record<number, Currencies> = {
//   1: Currencies.SAUDI_ARABIA, // Saudi Arabia
//   124: Currencies.QATAR, // Qatar
//   120: Currencies.UAE, // UAE
//   122: Currencies.BAHRAIN, // Bahrain
//   104: Currencies.OMAN, // Oman
//   118: Currencies.KUWAIT, // Kuwait
// } as const;

// // ==================== UTILITY FUNCTIONS ====================

// export const formatNumericValue = (value: number): string => {
//   return value.toFixed(2);
// };

// export const formatCurrencyValue = (value: number): string => {
//   return value.toLocaleString("en-US", {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
// };

// export const roundAmount = (amount: number): number => {
//   return Math.round(amount * 100) / 100;
// };

// export const parseAddress = (address: string): string[] => {
//   const separators = [", "];
//   return address.split(separators[0]).map((part) => part.trim());
// };

// export const formatDate = (date: Date): string => {
//   return date.toLocaleDateString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// };

// export const formatTime = (date: Date): string => {
//   return date.toLocaleTimeString("en-US");
// };

// export const getPrintCopyStatus = (copyNumber: number): string => {
//   switch (copyNumber) {
//     case 1:
//       return "Original";
//     case 2:
//       return "Duplicate";
//     case 3:
//       return "Triplicate";
//     case 4:
//       return "Quadriplicate";
//     default:
//       return `${copyNumber} Th Copy`;
//   }
// };

// export const getPrintCopyStatus2 = (copyNumber: number): string => {
//   switch (copyNumber) {
//     case 1:
//       return "Customers Copy";
//     case 2:
//       return "Office Copy";
//     case 3:
//       return "Store Copy";
//     case 4:
//       return "Sales man Copy";
//     default:
//       return `${copyNumber} Th Copy`;
//   }
// };

// export const getInOutArabic = (inOut: string): string => {
//   switch (inOut) {
//     case "DINE IN":
//       return "محلي";
//     case "TAKE AWAY":
//       return "سفري";
//     case "PARCEL":
//       return "قطعة";
//     case "DELIVERY":
//       return "توصيل";
//     default:
//       return inOut;
//   }
// };

// export const getModeOfPayment = (
//   grandTotal: number,
//   cashReceived: number,
//   cashReturned: number,
//   bankAmt: number,
//   partyLedgerID: number,
//   isCashInHandLedger: boolean,
//   isLedgerUnderBank: boolean
// ): string => {
//   if (isCashInHandLedger) {
//     if (grandTotal === cashReceived) return "CASH";
//     if (grandTotal === cashReturned) return "CASH";
//     if (grandTotal === bankAmt) return "BANK";
//     return "CASH/BANK";
//   }

//   if (isLedgerUnderBank) return "BANK";

//   if (grandTotal === cashReceived) return "CASH";
//   if (grandTotal === cashReturned) return "CASH";
//   if (grandTotal === bankAmt) return "BANK";
//   if (grandTotal === cashReceived + bankAmt) return "CASH+BANK";

//   return "CREDIT";
// };

// export const getModeOfPaymentArabic = (
//   grandTotal: number,
//   cashReceived: number,
//   cashReturned: number,
//   bankAmt: number,
//   partyLedgerID: number,
//   isCashInHandLedger: boolean,
//   isLedgerUnderBank: boolean
// ): string => {
//   if (isCashInHandLedger) {
//     if (grandTotal === cashReceived) return "نقدي";
//     if (grandTotal === cashReturned) return "نقدي";
//     if (grandTotal === bankAmt) return "شبكة";
//     return "نقدي/شبكة";
//   }

//   if (isLedgerUnderBank) return "شبكة";

//   if (grandTotal === cashReceived) return "نقدي";
//   if (grandTotal === cashReturned) return "نقدي";
//   if (grandTotal === bankAmt) return "شبكة";
//   if (grandTotal === cashReceived + bankAmt) return "نقدي+شبكة";

//   return "آجل";
// };



  // export const getCommonValues = (
  //   fieldName: any,
  //   master: any,
  //   details: any[],
  //   detail: any,
  //   copyCount: number,
  //   userSession: any,
  //   convertAmountToEnglish: (amount: number, currency?: any | undefined) => string,
  //   convertAmountToArabic: (amount: number, currency?: any | undefined) => string,
  //   options?: {
  //     fieldLength?: number;
  //     isCashInHandLedger?: boolean;
  //     isLedgerUnderBank?: boolean;
  //   }
  // ):string => {
  //   return "";
    
  // };

