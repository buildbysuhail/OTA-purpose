
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
  
  function getFormattedValue(val: number, ignoreNullOrZero: boolean = false): string {
    
    
    if(ignoreNullOrZero && (val == undefined || val == null || val == 0 ))
    {
      return '';
    }
    const decimalPoint = applicationSettings.mainSettings.decimalPoints;
    let formattedText: string = val.toLocaleString(undefined, {
      minimumFractionDigits: decimalPoint,
      maximumFractionDigits: decimalPoint,
    });
  
    return formattedText;
  }
  
  return { getNumericFormat, getFormattedValue }
};
