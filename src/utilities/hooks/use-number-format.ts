
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import { APIClient } from "../../helpers/api-client";
import { RootState } from "../../redux/store";

const api = new APIClient();
export const useNumberFormat = () => {
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const softwareDate = useAppSelector(
    (state: RootState) => state.AppState.softwareDate
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
  
  function roundTo(val: number, decimalPlaces: number): number {
    return parseFloat(val.toFixed(decimalPlaces));
  }
  
  function getFormattedValue(val: number, ignoreNullOrZero: boolean = false): string {
    
    
    if(ignoreNullOrZero && (val == undefined || val == null || val == 0 ))
    {
      return '';
    }
    const decimalPoint = applicationSettings.mainSettings?.decimalPoints;
    let formattedText: string = val.toLocaleString(undefined, {
      minimumFractionDigits: decimalPoint,
      maximumFractionDigits: decimalPoint,
    });
  
    return formattedText;
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
  function convertLargeNumber(num: number): string {
    if (num === 0) return belowTwenty[0];

    let words = "";
    let scaleIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        const chunkWords = convertBelowThousand(chunk);
        const scale = scales[scaleIndex];
        words = `${chunkWords} ${scale} ${words}`.trim();
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return words.trim();
  }

  /**
   * Converts an amount (including decimals) into words.
   */
  function convertAmountToWords(amount: string): string {
    const [wholePart, decimalPart] = amount.split(".");

    const wholePartWords = convertLargeNumber(parseInt(wholePart || "0"));
    let result = `${wholePartWords} ${userSession.currency?.currencyName}`;

    if (decimalPart) {
      const decimalValue = parseInt(decimalPart.padEnd(applicationSettings.mainSettings?.decimalPoints, "0"));
      const decimalWords = convertBelowThousand(decimalValue);
      result += ` and ${decimalWords} ${userSession.currency?.subUnit}`;
    }

    return `${result} Only`;
  }
  function getAmountInWords(amount: number): string {
    
    return convertAmountToWords(amount.toString());
  }
  
  return { getNumericFormat, getFormattedValue, getAmountInWords }
};
