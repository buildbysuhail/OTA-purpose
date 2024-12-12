
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
    const decimalPoint = applicationSettings.mainSettings.decimalPoints;
  
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
  
  function getFormattedValue(val: number, ignoreNullOrZero: boolean = true): string {
    if(ignoreNullOrZero && (val == undefined || val == null || val == 0 ))
    {
      return '';
    }
    const decimalPoint = applicationSettings.mainSettings.decimalPoints;
    val = roundTo(val, 6);
  
    let formattedText: string = val.toLocaleString(undefined, {
      minimumFractionDigits: decimalPoint,
      maximumFractionDigits: decimalPoint,
    });
  
    if (roundTo(val, 2) === val && decimalPoint === 2) {
      formattedText = roundTo(val, 2).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else if (roundTo(val, 3) === val) {
      formattedText = roundTo(val, 3).toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
    } else if (roundTo(val, 4) === val) {
      formattedText = roundTo(val, 4).toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      });
    } else if (roundTo(val, 5) === val) {
      formattedText = roundTo(val, 5).toLocaleString(undefined, {
        minimumFractionDigits: 5,
        maximumFractionDigits: 5,
      });
    } else if (roundTo(val, 6) === val) {
      formattedText = roundTo(val, 6).toLocaleString(undefined, {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      });
    } else {
      if (decimalPoint === 3) {
        formattedText = roundTo(val, 3).toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        });
      } else {
        formattedText = roundTo(val, 2).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
    }
  
    return formattedText;
  }
  
  return { getNumericFormat, getFormattedValue }
};
