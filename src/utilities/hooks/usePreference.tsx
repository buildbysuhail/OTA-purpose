import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAction } from "../../redux/actions/AppActions";

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
  const dispatch = useDispatch();

  useEffect(() => {
    endPointUrl && dispatch(getAction(endPointUrl));
  }, [endPointUrl]);

  return useSelector((state: any) => (preferenceType ? state[`Get${preferenceType}`]?.data?.results[0] : null));
};

export default usePreferenceData;
