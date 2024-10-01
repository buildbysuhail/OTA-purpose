import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./useAppDispatch";
import { getAction } from "../../redux/slices/app-thunks";

export type PreferenceType =
  | "GeneralPreference"
  | "InvoicePreference"
  | "SalesOrderPreference"
  | "ItemPreference"
  | "ExpensePreference"
  | "DeliveryNotePreference"
  | "PackingSlipPreference"
  | "SalesOrderPreference"
  | "PreferencesCreditNote";

const usePreferenceData = (preferenceType: PreferenceType, endPointUrl?: string) => {
  const appDispatch = useAppDispatch();

  useEffect(() => {
    endPointUrl && appDispatch(getAction({apiUrl: endPointUrl}));
  }, [endPointUrl]);

  return useSelector((state: any) => (preferenceType ? state[`Get${preferenceType}`]?.data?.results[0] : null));
};

export default usePreferenceData;
