
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import { APIClient } from "../../helpers/api-client";
import { RootState } from "../../redux/store";
import { Countries } from "../../redux/slices/user-session/reducer";

const api = new APIClient();
export const useNumberFormat = (): UseNumberFormatResult => {
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const softwareDate = useAppSelector(
    (state: RootState) => state.ClientSession.softwareDate
  );
  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const clientSession = useAppSelector(
    (state: RootState) => state.ClientSession
  );
  function getNumericFormat(): string {
    const decimalPoint = applicationSettings.mainSettings?.decimalPoints;
  
    switch (decimalPoint) {
      case 0:
        return '#,#0';
      case 1:
        return '#,#0.0';
      case 2:
        return '#,#0.00';
      case 3:
        return '#,#0.000';
      case 4:
        return '#,#0.0000';
      case 5:
        return '#,#0.00000';
      case 6:
        return '#,#0.000000';
      default:
        return '#,#0.00';
    }
  }
  function formatNumber(value: number, format: string): string {
    // Simple implementation - you might want to use a library like numeral.js for more complex formatting
    const parts = format.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    let result = value.toFixed(decimalPart ? decimalPart.length : 0);
    
    // Add thousands separators if format includes them
    if (integerPart.includes(',')) {
        const [intPart, decPart] = result.split('.');
        const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        result = decPart ? `${formattedInt}.${decPart}` : formattedInt;
    }
    
    return result;
}

  
  function roundTo(val: number, decimalPlaces: number): number {
    return parseFloat(val.toFixed(decimalPlaces));
  }
  function getFormattedValueIgnoreRoundingToNumber(val: number): number {
    const cleaned = getFormattedValueIgnoreRounding(val).replace(/,/g, '');
    return parseFloat(cleaned);
  }
  function getFormattedValueIgnoreRounding(val: number): string {
    let decimalPoint: number;
    let formattedVal: number = 0;
    let formattedText: string = "";
    
    val = round(val,6); // Round to 6 decimal places
    decimalPoint = applicationSettings.mainSettings.decimalPoints;
    formattedText = formatNumber(val, getNumericFormat());
    
    if (round(val, 2) === val && decimalPoint === 2) {
        formattedVal = round(val, 2);
        formattedText = formatNumber(formattedVal, "#,#0.00");
    }
    else if (round(val, 3) === val) {
        formattedVal = round(val, 3);
        formattedText = formatNumber(formattedVal, "#,#0.000");
    }
    else if (round(val, 4) === val) {
        formattedVal = round(val, 4);
        formattedText = formatNumber(formattedVal, "#,#0.0000");
    }
    else if (round(val, 5) === val) {
        formattedVal = round(val, 5);
        formattedText = formatNumber(formattedVal, "#,#0.00000");
    }
    else if (round(val, 6) === val) {
        formattedVal = round(val, 6);
        formattedText = formatNumber(formattedVal, "#,#0.000000");
    }
    else {
        if (decimalPoint === 3) {
            formattedVal = round(val, 3);
            formattedText = formatNumber(formattedVal, "#,#0.000");
        }
        else {
            formattedVal = round(val, 2);
            formattedText = formatNumber(formattedVal, "#,#0.00");
        }
    }
    
    return formattedText;
}
  function getFormattedValueToNumber(val: number, ignoreNullOrZero: boolean = false, decimalPoint: number|undefined = undefined, cuttingPoint: number = 0,
  numberOfZero: number = 0): number {
    const cleaned = getFormattedValue(val,ignoreNullOrZero,decimalPoint,cuttingPoint,numberOfZero).replace(/,/g, '');
    return parseFloat(cleaned);
  }
  function getFormattedValue(val: number, ignoreNullOrZero: boolean = false, decimalPoint: number|undefined = undefined, cuttingPoint: number = 0,
  numberOfZero: number = 0): string {
    
    if(cuttingPoint > 0) {
      
    
    }
    
    if(ignoreNullOrZero && (val == undefined || val == null || val == 0 ))
    {
      return '';
    }
    const _decimalPoint = decimalPoint != undefined ? decimalPoint: applicationSettings.mainSettings?.decimalPoints;
    console.log(`_decimalPoint${_decimalPoint}`);
    
    let formattedText: string = val?.toLocaleString(undefined, {
      minimumFractionDigits: _decimalPoint,
      maximumFractionDigits: _decimalPoint,
    });
    if(cuttingPoint > 0) {
       formattedText =  formatDecimal(formattedText, cuttingPoint, numberOfZero);
    }
    return formattedText;
  }
  function formatDecimal(
  input: string,
  cuttingPoint: number,
  numberOfZero: number
): string {
  const [integerPart, decimalPart = ""] = input.split(".");
  
  const cutDecimal = decimalPart.slice(0, cuttingPoint);
  const zeros = "0".repeat(numberOfZero);
  
  const formattedDecimal = (cutDecimal + zeros).padEnd(cuttingPoint + numberOfZero, "0");
  
  return `${integerPart}.${formattedDecimal}`;
}
  const belowTwenty: string[] = [
    "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  
  const tens: string[] = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  
  const scales: string[] = [
    "", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion"
  ];
  
  const indianScales: string[] = [
    "", "Thousand", "Lakh", "Crore", "Arab", "Kharab", "Neel", "Padma"
  ];
  
  /**
   * Converts a number below 1000 to words.
   */
  function convertBelowThousand(num: number): string {
    if (num < 20) return belowTwenty[num];
    if (num < 100) {
      const tensPart = tens[Math.floor(num / 10)];
      const onesPart = num % 10 ? ` ${belowTwenty[num % 10]}` : "";
      return `${tensPart}${onesPart}`;
    }
    const hundredsPart = belowTwenty[Math.floor(num / 100)] + " Hundred";
    const remainder = num % 100;
    const remainderPart = remainder ? ` ${convertBelowThousand(remainder)}` : "";
    return `${hundredsPart}${remainderPart}`;
  }
  
  /**
   * Converts a large number into words using scales (thousands, millions, etc.).
   */
  function convertLargeNumber(num: number, useIndianSystem: boolean = false): string {
    if (num === 0) return belowTwenty[0];
  
    let words = "";
    let scaleIndex = 0;
    const selectedScales = useIndianSystem ? indianScales : scales;
  
    while (num > 0) {
      const chunk = num % (useIndianSystem && scaleIndex === 2 ? 100 : 1000); // For Lakh, use 100 instead of 1000
      if (chunk !== 0) {
        const chunkWords = convertBelowThousand(chunk);
        const scale = selectedScales[scaleIndex];
        words = `${chunkWords} ${scale} ${words}`.trim();
      }
      num = Math.floor(num / (useIndianSystem && scaleIndex === 2 ? 100 : 1000)); // For Lakh, divide by 100 instead of 1000
      scaleIndex++;
    }
  
    return words.trim();
  }
  
  /**
   * Converts an amount (including decimals) into words.
   */
  function convertAmountToWords(amount: string): string {
    const [wholePart, decimalPart] = amount.split(".");
  
    const wholePartWords = convertLargeNumber(parseInt(wholePart || "0"), applicationSettings.mainSettings?.showNumberFormat == "Lakhs");
    let result = `${wholePartWords} ${userSession.currency?.currencyName}`;
  
    if (decimalPart) {
      const decimalValue = parseInt(decimalPart.padEnd(applicationSettings.mainSettings?.decimalPoints, "0"));
      const decimalWords = convertBelowThousand(decimalValue);
      result += ` and ${decimalWords} ${userSession.currency?.subUnit}`;
    }
  
    return `${result} Only`;
  }
  function round(value: number, decimalPoints: number | undefined = undefined,taxFormatted?: boolean): number {

    const decimals = decimalPoints != undefined ? decimalPoints : applicationSettings.mainSettings?.decimalPoints;
    taxFormatted = taxFormatted?? false;
    if(taxFormatted && applicationSettings.branchSettings.countryName == Countries.Saudi) {
      return parseFloat(value.toFixed(decimalPoints != undefined ? decimalPoints : 2));  
    } 
     return  Math.round((value + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
  function getAmountInWords(amount: number): string {
    
    return convertAmountToWords(amount.toString());
  }
  function getTaxFormat(val: number): string {
    let decimalPoint: number;
    decimalPoint = applicationSettings.mainSettings.decimalPoints;

    if(applicationSettings.branchSettings.countryName == Countries.Saudi) {
      return "#0.00";
    }
     switch (decimalPoint)
 {
     case 0:
         return "##0";

     case 1:
         return "##0.0";

     case 2:
         return "#0.00";

     case 3:
         return "##0.000";

     case 4:
         return "##0.0000";

     case 5:
         return "##0.00000";

     case 6:
         return "##0.000000";

     default:
         return "##0.00";

 }
}
  const posRoundAmount = (amt: number) => {
  let r: number = 0;
  
  let rMethod: string = "";
  const decimals: number = applicationSettings.mainSettings.decimalPoints;
  rMethod = applicationSettings.mainSettings.pOSRoundingMethod;
  
  if (rMethod === "Not Set") {
    rMethod = applicationSettings.mainSettings.roundingMethod;
  }
  
  if (rMethod === "Ceiling") {
    r = Math.ceil(round(amt, decimals));
  } else if (rMethod === "Floor") {
    r = Math.floor(round(amt, decimals));
  } else if (rMethod === "Normal") {
    r = round(amt, 0);
  } else if (rMethod === "Round to 0.25") {
    const fAmt: number = Math.floor(round(amt, 2));
    const decAmt: number = amt - fAmt;
    let addAmt: number = 0;
    
    if (decAmt >= 0.125 && decAmt < 0.375) {
      addAmt = 0.250;
    } else if (decAmt >= 0.375 && decAmt < 0.625) {
      addAmt = 0.50;
    } else if (decAmt >= 0.625 && decAmt < 0.875) {
      addAmt = 0.75;
    } else if (decAmt >= 0.875) {
      addAmt = 1;
    }
    
    r = round(fAmt + addAmt, 2);
  } else if (rMethod === "Floor Round to 0.25") {
    const fAmt: number = Math.floor(round(amt, 2));
    const decAmt: number = amt - fAmt;
    let addAmt: number = 0;
    
    if (decAmt >= 0.750) {
      addAmt = 0.750;
    } else if (decAmt >= 0.50) {
      addAmt = 0.50;
    } else if (decAmt >= 0.25) {
      addAmt = 0.25;
    } else {
      addAmt = 0;
    }
    
    r = round(fAmt + addAmt, 2);
  } else if (rMethod === "Round to 0.50") {
    const fAmt: number = Math.floor(round(amt, 2));
    const decAmt: number = amt - fAmt;
    let addAmt: number = 0;
    
    if (decAmt >= 0.25 && decAmt < 0.75) {
      addAmt = 0.50;
    } else if (decAmt >= 0.75) {
      addAmt = 1;
    }
    
    r = round(fAmt + addAmt, decimals);
  } else if (rMethod === "Floor Round to 0.50") {
    const fAmt: number = Math.floor(round(amt, 2));
    const decAmt: number = amt - fAmt;
    let addAmt: number = 0;
    
    if (decAmt >= 0.50) {
      addAmt = 0.50;
    } else {
      addAmt = 0;
    }
    
    r = round(fAmt + addAmt, decimals);
  } else if (rMethod === "Round to 0.10") {
    r = round(amt, 1);
  } else if (rMethod === "Floor Round to 0.10") {
    const diff: number = round(amt, 1) - round(amt, 2);
    
    if (diff > 0) {
      r = round(amt - diff, 1);
    } else {
      r = round(amt, 1);
    }
  } else if (rMethod === "Round to 0.005") {
    // This section was commented out in original C# code
    // Implementation would need to be completed based on requirements
    r = amt; // Fallback for now
  } else if (rMethod === "Round to 0.010") {
    const fAmt: number = Math.floor(round(amt, 3));
    const decAmt: number = fAmt - Math.floor(round(amt, 2));
    const addAmt: number = -1 * decAmt;
    r = round(fAmt + addAmt, 2);
  } else {
    r = amt;
  }
  
  return r;
}

  return { getNumericFormat, getFormattedValue, getTaxFormat, getFormattedValueToNumber, getAmountInWords, round, getFormattedValueIgnoreRoundingToNumber, getFormattedValueIgnoreRounding, posRoundAmount }
};
export interface UseNumberFormatResult {
  getNumericFormat: () => string;
  getFormattedValue: (
    val: number,
    ignoreNullOrZero?: boolean,
    decimalPoint?: number,
    cuttingPoint?: number,
    numberOfZero?: number
  ) => string;
  getFormattedValueToNumber: (
    val: number,
    ignoreNullOrZero?: boolean,
    decimalPoint?: number,
    cuttingPoint?: number,
    numberOfZero?: number
  ) => number;
  getAmountInWords: (amount: number) => string;
  round: (value: number, decimalPoints?: number,taxFormatted?: boolean) => number;
  getFormattedValueIgnoreRoundingToNumber: (val: number) => number;
  getFormattedValueIgnoreRounding: (val: number) => string;
  getTaxFormat: (val: number) => string;
  posRoundAmount: (amt: number) => number;
}